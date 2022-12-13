import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { colors, pixel } from '../styles/basecss';
import { AnyText, FlatScroll } from './home/helperprefernce';
import Axios from '../main/Axios';
import { OuterOneContent, OuterOneView } from './home/helpernotification/heplernotifycss';
import { css } from 'styled-components';
import Actions from '../reducer/actions';
import { OuterLazy, RenderAnyUserPhoto } from './home/helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { ButtonNormal, ViewOuterCirculer } from './home/sliderroom/helperroomcss';
import { DeleteSvg, SecureSvg, StarSvg } from '../icons/all';
import { RefreshControl } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
const RenderOneFollow = memo(({ username, userPhoto,
    isSecure, isOwner, FirstName, LastName }) => {
    const dispatch = useDispatch();
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { buttons } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const fullName = `${FirstName} ${LastName}`;
    const [holder, setHolder] = useState(false);
    ////////////////////////////////////////////
    const UnFollowUser = useCallback(() => dispatch(Actions.type("setCurrentModalWithNav", {
        key: "alert",
        YesFunc: () => {
            setHolder(<ButtonNormal
                isRTL={isRTL} radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1"
                css={css`margin: 0px;height: ${pixel(30)};min-width: ${pixel(60)};`}>
                <DotIndicator size={moderateScale(3)} count={7} color={colors["clr2"]} />
            </ButtonNormal>);
            mainSocket.emit("onFollow", { username })
        }
    })), [username])
    ////////////////////////////////////////////
    return (<OuterOneView activeOpacity={0.9} isRTL={isRTL}
        onPress={() => navigate("profile", { username })}>
        <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(70)}
            renderBadge={isSecure ? <ViewOuterCirculer
                size={pixel(25)} back="clr1" css={css`position: absolute;left: ${pixel(3)};bottom:${pixel(3)};`}>
                {isOwner ? <StarSvg color="back3" size={moderateScale(16)} /> :
                    <SecureSvg color="back3" size={moderateScale(16)} />}
            </ViewOuterCirculer> : null} />
        <OuterOneContent isRTL={isRTL} width="100%">
            <AnyText size={moderateScale(13)} lower color={isDark ? "back2" : "clr1"} lineH={pixel(14)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 90%;`}>{fullName}</AnyText>
            <AnyText size={moderateScale(11)} lower color="clr2" lineH={pixel(12)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 90%;`}>{"@"}{username}</AnyText>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                {holder ? holder : <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1"
                    css={css`padding: ${pixel(4)};margin: 0px;`}
                    onPress={UnFollowUser}>
                    <DeleteSvg size={moderateScale(18)} />
                    <AnyText lower color="red2" isRTL={isRTL}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.unFollow}
                    </AnyText>
                </ButtonNormal>}
            </OuterOneView>
        </OuterOneContent>
    </OuterOneView>)
});
///////////////////////////////////////////////
const RenderMeetoorFollowing = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const DATA_RENDER = useSelector(state => state.main.followings);
    const usersLastId = useSelector(state => state.sign.usersLastId);
    /////////////////////////////////////////////
    const keyArray = `following/`;
    const IdLt = usersLastId[keyArray] || 0;
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getFollowers = useCallback(async (first = false, callback) => {
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
            console.log("getBans ~ responseData", responseData)
            if (responseData.length === 0 || responseData?.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setFollowing", {
                    type: 'set',
                    data: []
                }));
                console.log("getBans ~ inner", responseData)
                return;
            }
            let lastId = responseData[(responseData?.length - 1) || 0];
            console.log("getBans ~ lastId", lastId)
            dispatch(Actions.type("setUsersLastId", {
                key: keyArray,
                val: lastId.followid
            }));
            dispatch(Actions.type("setFollowing", {
                type: first ? 'set' : "push",
                data: responseData
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
    useEffect(() => {
        const checker = (DATA_RENDER === undefined);
        if (checker) getFollowers(true);
    }, []);
    /////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "onFollow":
                if (!data.type) {
                    dispatch(Actions.type("setFollowing", {
                        type: "delete",
                        data: {
                            target: data.another,
                            key: "username"
                        }
                    }));
                }
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getFollowers(true, () => setRefreshing(false));
    }, []);
    ////////////////////////////////////////////
    const OnePanMainMemo = useMemo(() => ({ item }) => {
        return (<RenderOneFollow {...item} />);
    }, []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const keyExtractor = useCallback(item => "_follower" + item.username, []);
    const ListEmptyComponent = useCallback(() => <OuterLazy
        background="transparent" height={pixel(200)}>
        {DATA_RENDER === undefined ? <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} /> :
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.noResult}
            </AnyText>}
    </OuterLazy>, [DATA_RENDER, isDark]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd={pixel(4)}
        renderItem={OnePanMainMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getFollowers();
        }}
        refreshControl={RefreshControlMemo}
        keyExtractor={keyExtractor}
        horizontal={false}
        ListEmptyComponent={ListEmptyComponent}
    />);
}
export default memo(RenderMeetoorFollowing);