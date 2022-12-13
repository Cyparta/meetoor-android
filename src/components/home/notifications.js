import React, {
    memo, useEffect, useRef,
    useCallback, useState, useMemo
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { OuterLazy } from './helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import Converter from './helpernotification/converter';
import { AnyText, FlatScroll } from './helperprefernce';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { moderateScale } from 'react-native-size-matters';
import { ButtonNormal, OuterButtonControl } from './sliderroom/helperroomcss';
import { AskFriendSvg, CommentSvg, FollowersSvg, PostSvg, ReplySvg } from '../../icons/all';
import { css } from 'styled-components';
import { HeartSvg } from '../../icons/reacts';
//////////////////////////////////////////////////
const RenderFilter = memo(({ setActive, active }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    //////////////////////////////////////////////
    return (<OuterButtonControl back={isDark ? "clr1" : "back1"}
        css={css`width: 100%;max-width: 100%;padding: ${pixel(4)} 0px;`}>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0;`}
            onPress={() => {
                setActive(back => back === 0 ? null : 0);
            }} activeOpacity={0.8}>
            <PostSvg color={active === 0 ? "clr2" : false}
                size={moderateScale(18)} />
        </ButtonNormal>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0px;`}
            onPress={() => {
                setActive(back => back === 1 ? null : 1);
            }} activeOpacity={0.8}>
            <HeartSvg color={active === 1 ? "clr2" : isDark ? "back2" : "clr3"}
                size={moderateScale(18)} />
        </ButtonNormal>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0px;`}
            onPress={() => {
                setActive(back => back === 2 ? null : 2);
            }} activeOpacity={0.8}>
            <CommentSvg color={active === 2 ? "clr2" : false}
                size={moderateScale(18)} />
        </ButtonNormal>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0px;`}
            onPress={() => {
                setActive(back => back === 3 ? null : 3);
            }} activeOpacity={0.8}>
            <ReplySvg color={active === 3 ? "clr2" : false}
                size={moderateScale(18)} />
        </ButtonNormal>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0px;`}
            onPress={() => {
                setActive(back => back === 4 ? null : 4);
            }} activeOpacity={0.8}>
            <AskFriendSvg color={active === 4 ? "clr2" : false}
                size={moderateScale(18)} />
        </ButtonNormal>
        <ButtonNormal size={pixel(22)} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"} css={css`border: 0px;`}
            onPress={() => {
                setActive(back => back === 5 ? null : 5);
            }} activeOpacity={0.8}>
            <FollowersSvg color={active === 5 ? "clr2" : false}
                size={moderateScale(18)} />
        </ButtonNormal>
    </OuterButtonControl>)
})
//////////////////////////////////////////////////
const RenderNotifications = () => {
    const dispatch = useDispatch();
    const { notifyData } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    const Notification = useSelector(state => state.notify.notification);
    const mainSocket = useSelector(state => state.main.socket);
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const [active, setActive] = useState(null);
    const goToTop = useSelector(state => state.sign.goToTop);
    const Scroll = useRef(null);
    /////////////////////////////////////////////
    const getNotification = useCallback(async () => {
        try {
            if (!isGetMore || isLoadMore) return;
            let idLt = Notification ? Notification[Notification?.length - 1 || 0]?.notifyId : 0;
            setLoadMore(true);
            const response = await Axios.get(`notification/?idLt=${idLt || 0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                return;
            }
            dispatch(Actions.type("setNotification", {
                type: "push",
                data: responseData
            }));
            setLoadMore(false);
            setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Notification, isLoadMore, isGetMore, token]);
    /////////////////////////////////////////////
    useEffect(() => {
        mainSocket.emit("newNotifyNum", {});
        return () => mainSocket.emit("newNotifyNum", {});
    }, []);
    /////////////////////////////////////////////
    useEffect(() => {
        const GetNotify = async () => {
            try {
                if (!Notification) {
                    const notifications = await AsyncStorage.getItem(`@notifications_${token}`);
                    if (notifications && notifications?.length) dispatch(Actions.type("setNotification", {
                        type: "set",
                        data: JSON.parse(notifications)
                    }));
                }
            }
            catch (e) {
                console.log("R => ", e)
            }
        }
        GetNotify();
    }, [token]);
    ////////////////////////////////////////////
    useEffect(() => {
        if (goToTop && goToTop?.nav === "notifications") Scroll.current.scrollToOffset(0);
    }, [goToTop, Scroll]);
    /////////////////////////////////////////////
    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await getNotification(true);
            setRefreshing(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, []);
    // const ListHeaderComponent = useCallback(() =>
    //     Notification ? (Notification.length < 1) ? null :
    //         <RenderFilter setActive={setActive} active={active} /> : null
    //     , [Notification, active]);
    /////////////////////////////////////////////
    const DATA_RENDER = useMemo(() => {
        let filter = [];
        switch (active) {
            case 0:
                filter = ['new-post', 'clone-post'];
                break;
            case 1:
                filter = ['like', 'story-like', 'like-comment'];
                break;
            case 2:
                filter = ['comment'];
                break;
            case 3:
                filter = ['reply'];
                break;
            case 4:
                filter = ['act-friend', 'ask-friend', 'ask-team', 'act-team'];
                break;
            case 5:
                filter = ['on-follow'];
                break;
            default:
                break;
        }
        return active === null ? Notification :
            Notification.filter(({ type }) => {
                for (let idx = 0; idx < filter.length; idx++) {
                    if (type === filter[idx]) return true;
                }
                return false;
            })
    }, [active, Notification]);
    ///////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        onScrollBeginDrag={() => setScrollBegin(true)}
        // ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={(DATA_RENDER && DATA_RENDER.length < 1) ?
            <OuterLazy background="transparent" height={pixel(300)}>
                <AnyText color={isDark ? "back2" : "clr1"}>{notifyData.noyet}</AnyText>
            </OuterLazy> : <OuterLazy background="transparent" height={pixel(300)}>
                <WaveIndicator size={moderateScale(150)}
                    color={colors[isDark ? "back3" : "clr1"]} />
            </OuterLazy>} data={DATA_RENDER}
        renderItem={({ item }) => (<Converter  {...item} />)}
        keyExtractor={(item, i) => item.username + "_convert" + i}
        onEndReached={() => {
            scrollBegin && getNotification();
        }} refreshControl={<RefreshControl
            colors={[colors["clr2"]]}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />} ref={Scroll}
        ListFooterComponent={isLoadMore ?
            <DotIndicator size={moderateScale(5)}
                count={7} color={colors[isDark ? "back3" : "clr1"]} /> : null}
    />);
}

export default memo(RenderNotifications);

