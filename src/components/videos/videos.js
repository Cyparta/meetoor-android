import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl, View } from 'react-native';
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { FlatScroll } from '../home/helperprefernce';
import { moderateScale } from 'react-native-size-matters';
import Axios from '../../main/Axios';
import VideoPlayerMain from '../../main/video/mainplayer';
import { OuterLazy } from '../home/helperhome';
import { WaveIndicator } from 'react-native-indicators';
////////////////////////////////////////////
const VideoViewerMeetoor = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const posts = useSelector(state => state.posts.posts);
    const postsLastId = useSelector(state => state.posts.postsLastId);
    /////////////////////////////////////////////
    const keyArray = "videos/";
    const IdLt = postsLastId[keyArray] || 0;
    const [layout, setLayout] = useState({ height: 0, width: 0 });
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const DATA_RENDER = posts[keyArray];
    ////////////////////////////////////////
    const [activePage, setActivePage] = useState(0);
    const indexRef = useRef(activePage);
    indexRef.current = activePage;
    ////////////////////////////////////////////
    const getVideos = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`${keyArray}?idLt=${first ? 0 : IdLt}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setPosts", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = responseData[responseData?.length - 1 || 0];
            dispatch(Actions.type("setPostsLastId", {
                key: keyArray,
                val: lastId.idlt
            }));
            dispatch(Actions.type("setPosts", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: responseData.sort(() => Math.random() - 0.5)
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [keyArray, IdLt, token, isGetMore, isLoadMore]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getVideos(true, () => {
            setRefreshing(false)
        });
    }, [keyArray, IdLt, token, isGetMore, isLoadMore]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (DATA_RENDER === undefined);
        if (checker) getVideos(true);
        dispatch(Actions.type("setStatusBarDark", true));
        return () => dispatch(Actions.type("setStatusBarDark", false));
    }, []);
    const OnePostMainMemo = useMemo(() => ({ item, index }) => {
        return (<View style={{ flex: 1, width: '100%', height: layout.height, backgroundColor: "green" }}>
            <VideoPlayerMain postData={item} poster={item.poster} statusDark={false} keyArray={keyArray}
                uri={item.url} pausedPlayer={activePage !== index} single={false} />
        </View>);
    }, [activePage, keyArray, layout]);
    const keyExtractor = useCallback((item) => item.postId + "_video", []);
    const onScrollEnd = useCallback(({ nativeEvent }) => {
        const slideSize = nativeEvent.layoutMeasurement.height;
        const index = nativeEvent.contentOffset.y / slideSize;
        const roundIndex = Math.round(index);
        const distance = Math.abs(roundIndex - index);
        const isNoMansLand = 0.4 < distance;
        //&& !isNoMansLand
        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setActivePage(roundIndex);
            if (roundIndex >= (DATA_RENDER.length - 1)) {
                getVideos(false);
            }
            console.log("VideoViewerMeetoor ~ activePage", roundIndex)
        }
    }, [DATA_RENDER, keyArray, IdLt, token, isGetMore, isLoadMore]);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const onLayout = useCallback(({ nativeEvent: { layout } }) => {
        setLayout({
            width: layout.width,
            height: layout.height
        });
    }, []);
    const getItemLayout = useCallback((_, index) => ({ length: layout.height, offset: layout.height * index, index }), [layout]);
    ////////////////////////////////////////
    return (<FlatScroll pagingEnabled
        back={colors["clr1"]}
        data={DATA_RENDER}
        bounces={false}
        renderItem={OnePostMainMemo}
        ListEmptyComponent={<OuterLazy
            back={"clr1"} height={pixel(300)}>
            <WaveIndicator size={moderateScale(140)}
                color={colors["back3"]} />
        </OuterLazy>}
        legacyImplementation={false}
        onLayout={onLayout}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        // onScrollEndDrag={onScrollEnd}
        keyExtractor={keyExtractor}
        refreshControl={RefreshControlMemo}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        onScroll={onScrollEnd}
        // removeClippedSubviews={true}
        scrollEventThrottle={16}
    />)
}

export default memo(VideoViewerMeetoor);