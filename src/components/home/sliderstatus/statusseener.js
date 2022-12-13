import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnyText, FlatScroll, PlaceholdView } from '../helperprefernce';
import RenderOneLike from '../../likes/onelike';
import { useState } from 'react';
import { useEffect } from 'react';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import Axios from '../../../main/Axios';
import Actions from '../../../reducer/actions';
import { css } from 'styled-components';
import { colors, pixel } from '../../../styles/basecss';
import { EyeSvg } from '../../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { RefreshControl } from 'react-native';
////////////////////////////////////////////
const StatusSeenerModal = ({ storyId = 0 }) => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    const currentSeener = useSelector(state => state.main.currentSeener);
    ////////////////////////////////////////
    const [IdLt, setIdLt] = useState(0);
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    /////////////////////////////////////////////
    const getSeenerStory = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`storySeener/?idLt=${first ? 0 : IdLt}&storyid=${storyId}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.data.noMore) {
                console.log("getLikesApi ~ response more", false)
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setCurrentSeener", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = response?.data[response?.data?.length - 1 || 0];
            setIdLt(lastId?.seenid);

            dispatch(Actions.type("setCurrentSeener", {
                type: first ? 'set' : "addGroup",
                data: response.data
            }));
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e);
            setLoadMore(false);
        }
    }, [currentSeener, isLoadMore, isGetMore, IdLt, storyId]);
    ///////////////////////////////////////
    useEffect(() => {
        currentSeener === undefined && getSeenerStory(true);
    }, []);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getSeenerStory(true, () => setRefreshing(false));
    }, []);
    ////////////////////////////////////////////
    const OneStatusSeenMemo = useMemo(() => ({ item }) => {
        return (<RenderOneLike {...item} userPhoto={item.UserPhoto} status={true} key={item.username + "_like-status"} />);
    }, []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    ////////////////////////////////////////
    return (<FlatScroll data={currentSeener}
        back={colors[isDark ? "clr1" : "back1"]}
        renderItem={OneStatusSeenMemo}
        refreshControl={RefreshControlMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getSeenerStory();
        }}
        ListHeaderComponent={<>
            <AnyText color={isDark ? "back3" : "clr1"} align="center" lineH={pixel(40)}
                css={css`background: ${colors[isDark ? "clr3" : "back3"]};`}>
                {badges.statusView}
            </AnyText>
        </>}
        ListEmptyComponent={currentSeener === undefined ?
            <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
            currentSeener.length ? null : <PlaceholdView height={pixel(200)}>
                <EyeSvg color="clr2" size={moderateScale(100)} />
            </PlaceholdView>}
        ListFooterComponent={<>
            {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null}
        </>}
    />)
}

export default memo(StatusSeenerModal)
