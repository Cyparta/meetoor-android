import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { AskFriendSvg, CloseSvg, DeleteSvg, FollowersSvg, SecureSvg, StarSvg } from '../icons/all';
import { RefreshControl } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
const RenderOneSuggest = memo(({ username, userid, followState,
    userPhoto, isSecure, isOwner, fullName, infos, isfriend = false }) => {
    const dispatch = useDispatch();
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { buttons, badges } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const [placehold] = useState(<OuterLazy height={pixel(17)}
        css={css`min-width: ${pixel(60)};max-width: ${pixel(70)};`}>
        <DotIndicator size={moderateScale(3)} count={7} color={colors["blu"]} />
    </OuterLazy>);
    ///////////////////////////////////////////////////////
    const addFollow = useCallback(() => {
        mainSocket.emit("onFollow", { username });
        dispatch(Actions.type("setSuggestFollowers", {
            type: 'update', data: {
                target: userid,
                key: 'userid',
                call: (target) => {
                    target.followState = placehold
                }
            }
        }));
    }, [username, userid]);
    ///////////////////////////////////////////////////////
    const addFriend = useCallback(() => {
        mainSocket.emit("friendRequest", { username });
        dispatch(Actions.type("setSuggestFollowers", {
            type: 'update', data: {
                target: userid,
                key: 'userid',
                call: (target) => {
                    target.isfriend = "propa";
                }
            }
        }));
    }, [username, userid]);
    ////////////////////////////////////////////
    return (<OuterOneView activeOpacity={0.9} isRTL={isRTL}
        onPress={() => navigate("profile", { username })}>
        <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(70)}
            renderBadge={isSecure ? <ViewOuterCirculer size={pixel(25)} back="clr1"
                css={css`position: absolute;left: ${pixel(3)};bottom:${pixel(3)};`}>
                {isOwner ? <StarSvg color="back3" size={moderateScale(16)} /> :
                    <SecureSvg color="back3" size={moderateScale(16)} />}
            </ViewOuterCirculer> : null} />
        <OuterOneContent isRTL={isRTL} width="100%">
            <AnyText size={moderateScale(13)} lower color={isDark ? "back2" : "clr1"} lineH={pixel(14)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 90%;`}>{fullName}</AnyText>
            <AnyText size={moderateScale(11)} lower color="clr2" lineH={pixel(12)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 90%;`}>
                {infos?.followers + " " + badges.followers}
            </AnyText>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back="clr2" borderColor="clr1"
                    css={css`margin: 0px;padding: ${pixel(4)};`}
                    onPress={addFollow}>
                    {followState ? followState : <>
                        <AskFriendSvg color="back3" size={moderateScale(16)} />
                        <AnyText lower color="back3"
                            isRTL={isRTL} lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                            {buttons.follow}
                        </AnyText>
                    </>}
                </ButtonNormal>
                <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1"
                    css={css`padding: ${pixel(4)};`}
                    onPress={addFriend}>
                    {isfriend === "sent" ? <>
                        <CloseSvg size={moderateScale(14)} />
                        <AnyText lower color="red2"
                            isRTL={isRTL} lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                            {buttons.cancel}
                        </AnyText>
                    </> :
                        isfriend === false ? <>
                            <AskFriendSvg size={moderateScale(16)} />
                            <AnyText lower color={isDark ? "back2" : "clr3"}
                                isRTL={isRTL} lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                                {buttons.addFriend}
                            </AnyText>
                        </> : isfriend === "propa" ? placehold :
                            isfriend === true ? <>
                                <DeleteSvg size={moderateScale(16)} />
                                <AnyText lower color="red2"
                                    isRTL={isRTL} lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                                    {buttons.delete}
                                </AnyText>
                            </> : null}
                </ButtonNormal>
            </OuterOneView>
        </OuterOneContent>
    </OuterOneView>)
});
///////////////////////////////////////////////
const RenderMeetoorSuggestsFriend = ({ apiType }) => {
    const dispatch = useDispatch();
    const { messages, buttons, badges, tabsData } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const User = useSelector(state => state.main.user);
    const DATA_RENDER = useSelector(state => state.main.suggestFollowers);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    /////////////////////////////////////////////
    const [keyArray, setKeyArray] = useState(apiType);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    //////////////////////////////////////////////
    const getSuggsets = useCallback(async (callback) => {
        try {
            if (isLoadMore) return;
            setLoadMore(true);
            const response = await Axios.get(keyArray,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData?.error) {
                setLoadMore(false);
                callback && callback();
                setKeyArray(key => key === "myContacts/" ? "suggestFollow/" : key);
                dispatch(Actions.type("setSuggestFollowers", {
                    type: 'set',
                    data: []
                }));
                return;
            }
            dispatch(Actions.type("setSuggestFollowers", {
                type: 'set',
                data: responseData.sort(() => Math.random() - 0.5)
            }));
            ////////////////////////////////////////////////////////
            callback && callback();
            setLoadMore(false);
        } catch (e) {
            setLoadMore(false);
            callback && callback();
            dispatch(Actions.type("setSuggestFollowers", {
                type: 'set',
                data: []
            }));
            console.log("Dashbord -> error.data", e)
        }
    }, [keyArray, isLoadMore]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getSuggsets(() => setRefreshing(false));
    }, [keyArray]);
    ////////////////////////////////////////////
    useEffect(() => {
        onRefresh();
    }, [keyArray]);
    /////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "replayFriendRequest":
                dispatch(Actions.type("setSuggestFollowers", {
                    type: 'update', data: {
                        target: data.userid,
                        key: 'userid',
                        call: (target) => {
                            target.isfriend = "sent";
                        }
                    }
                }));
                break;

            case "cancelFriendRequest":
                dispatch(Actions.type("setSuggestFollowers", {
                    type: 'update', data: {
                        target: data.userid,
                        key: 'userid',
                        call: (target) => {
                            target.isfriend = false
                        }
                    }
                }));
                break;

            case "onFollow":
                if (data.username === User.username) {
                    dispatch(Actions.type("setSuggestFollowers", {
                        type: 'update', data: {
                            target: data.another,
                            key: 'username',
                            call: (target) => {
                                let followers = target.infos.followers;
                                if (data.type) {
                                    ++followers
                                    target.followState = <>
                                        <FollowersSvg color="back3" size={moderateScale(16)} />
                                        <AnyText lower color="back3" isRTL={isRTL} autoMargin={pixel(5)}
                                            lineH={pixel(16)} size={moderateScale(13)}>
                                            {buttons.following}
                                        </AnyText>
                                    </>
                                    target.infos.followers = followers;

                                }
                                else {
                                    --followers
                                    target.followState = undefined;
                                    target.infos.followers = followers;
                                }
                            }
                        }
                    }));
                }
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneSuggestMainMemo = useMemo(() => ({ item }) => {
        return (<RenderOneSuggest {...item} />);
    }, []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const keyExtractor = useCallback(item => item.userid + "_ban" + item.username, []);
    const ListEmptyComponent = useCallback(() => <OuterLazy
        background="transparent" height={pixel(200)}>
        {DATA_RENDER === undefined ? <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} /> :
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.noFriends}
            </AnyText>}
    </OuterLazy>, [DATA_RENDER, isDark]);
    const ListHeaderComponent = useCallback(() => <>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: ${pixel(6)};flex-direction: column;
            margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: center;
                background: transparent;`}>
                <AnyText color={isDark ? "back2" : "clr3"} lower align="center">
                    {keyArray === "myContacts/" ? badges.yourContacts : tabsData.friendSuggest}
                </AnyText>
            </OuterOneView>
        </OuterOneView>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: ${pixel(6)};flex-direction: column;
            margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: center;
                background: transparent;`}>
                <AnyText color="clr2" size={moderateScale(12)} lower lineH={pixel(15)} align="center">
                    {messages.followPopup.one}
                </AnyText>
            </OuterOneView>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: center;
                background: transparent;`}>
                <AnyText color="clr2" size={moderateScale(12)} lower lineH={pixel(15)} align="center">
                    {messages.followPopup.two}
                </AnyText>
            </OuterOneView>
        </OuterOneView>
    </>, [isDark, isRTL, keyArray, messages.followPopup]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd={pixel(4)}
        renderItem={OneSuggestMainMemo}
        refreshControl={RefreshControlMemo}
        keyExtractor={keyExtractor}
        horizontal={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
    />);
}
export default memo(RenderMeetoorSuggestsFriend);