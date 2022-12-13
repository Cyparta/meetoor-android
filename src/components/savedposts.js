import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from 'react-native';
import { colors, pixel } from '../styles/basecss';
import { AnyText, FlatScroll } from './home/helperprefernce';
import OnePostMain from './posts/posts/post/post';
import OnePostLoader from './posts/posts/post/postloader';
import Axios from '../main/Axios';
import { OuterOneView } from './home/helpernotification/heplernotifycss';
import { css } from 'styled-components';
import Actions from '../reducer/actions';
import { OuterLazy } from './home/helperhome';
///////////////////////////////////////////////
const RenderSavedPosts = () => {
    const dispatch = useDispatch();
    const { tabsData, messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const posts = useSelector(state => state.posts.posts);
    const postsLastId = useSelector(state => state.posts.postsLastId);
    /////////////////////////////////////////////
    const keyArray = `savedPosts/`;
    const IdLt = postsLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const DATA_RENDER = posts[keyArray];
    //////////////////////////////////////////////
    const getPosts = useCallback(async (first = false, callback) => {
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
            console.log("getPosts ~ response", response.data)
            if (response?.data?.length === 0 || response?.data?.noMore) {
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
            let lastId = response?.data[(response?.data?.length - 1) || 0];
            dispatch(Actions.type("setPostsLastId", {
                key: keyArray,
                val: lastId.postId
            }));
            dispatch(Actions.type("setPosts", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: response.data
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [keyArray, isLoadMore, IdLt, isGetMore]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPosts(true, () => setRefreshing(false));
    }, []);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (DATA_RENDER === undefined);
        if (checker) getPosts(true);
    }, []);
    ////////////////////////////////////////////
    const OnePostMainMemo = useMemo(() => ({ item }) => {
        return (<OnePostMain {...item} keyArray={keyArray} />);
    }, []);
    const keyExtractor = useCallback(item => item.postId + "_post", []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const ListHeaderComponent = useCallback(() => <>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: 8px;flex-direction: column;
                margin-bottom: 4px;border-radius: 10px;`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: center;
                    background: transparent;`}>
                <AnyText color={isDark ? "back2" : "clr1"} size="20" lower>
                    {tabsData.savedPosts}
                </AnyText>
            </OuterOneView>
        </OuterOneView>
    </>, [isDark, isRTL]);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <OnePostLoader key="post_load-1" /> : null}
    </>, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => DATA_RENDER === undefined ?
        <OnePostLoader key="post_load-1" /> :
        <OuterLazy background="transparent" height={pixel(200)}>
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.nopostyet}
            </AnyText>
        </OuterLazy>, [DATA_RENDER, isDark]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd="4px"
        renderItem={OnePostMainMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getPosts();
        }}
        keyExtractor={keyExtractor}
        horizontal={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={RefreshControlMemo}
        ListFooterComponent={ListFooterComponent}
    />);
}
export default memo(RenderSavedPosts);