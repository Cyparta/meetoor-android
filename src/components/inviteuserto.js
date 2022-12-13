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
import { PlusSvg, SecureSvg, StarSvg } from '../icons/all';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
const RenderOneFriend = memo(({ username, userPhoto,
    isSecure = true, isOwner = true, fullName, teamid }) => {
    const { navigate } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const { buttons, contactus, messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    ////////////////////////////////////////////
    const [holder, setHolder] = useState(false);
    ////////////////////////////////////////////
    const inviteUser = useCallback(() => {
        let text = `${messages.inviteTeam}\nhttps://meetoor.com/home/team/?t=${teamid}`;
        mainSocket.emit("onChat", { text, to: username });
        setHolder(<ButtonNormal isRTL={isRTL}
            radius={pixel(5)} activeOpacity={1} borderAlpha={0.2}
            back={isDark ? "clr3" : "back1"} borderColor="clr1"
            css={css`margin: 0;padding: ${pixel(4)};`}>
            <AnyText lower color={isDark ? "back3" : "clr3"}
                isRTL={isRTL} lineH={pixel(16)}
                size={moderateScale(13)} autoMargin={pixel(5)}>
                {contactus.msg2}
            </AnyText>
        </ButtonNormal>);
    }, [teamid, username, messages, mainSocket]);
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
                css={css`flex: 1;max-width: 90%;`}>{"@"}{username}</AnyText>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                {holder ? holder : <ButtonNormal isRTL={isRTL}
                    radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1"
                    css={css`margin: 0;padding: ${pixel(4)};`}
                    onPress={inviteUser}>
                    <PlusSvg size={moderateScale(16)} />
                    <AnyText lower color={isDark ? "back3" : "clr3"}
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.invite}
                    </AnyText>
                </ButtonNormal>}
            </OuterOneView>
        </OuterOneContent>
    </OuterOneView>)
});
///////////////////////////////////////////////
const RenderMeetoorInvites = ({ teamid }) => {
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const DATA_RENDER = useSelector(state => state.main.inviteUsers);
    const usersLastId = useSelector(state => state.sign.usersLastId);
    /////////////////////////////////////////////
    const keyArray = `getInviteTeam/?teamid=${teamid}`;
    const IdLt = usersLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getFriends = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`${keyArray}&idLt=${first ? 0 : IdLt}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            if (responseData?.length === 0 || responseData?.noMore) {
                callback && callback();
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setInviteUsers", {
                    type: 'set',
                    data: []
                }));
                return;
            }
            let lastId = responseData[(responseData?.length - 1) || 0];
            console.log("getFriends ~ lastId", lastId)
            dispatch(Actions.type("setUsersLastId", {
                key: keyArray,
                val: lastId.friendid
            }));
            dispatch(Actions.type("setInviteUsers", {
                type: first ? 'set' : "push",
                data: response.data
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
        if (checker) getFriends(true);
    }, []);
    ////////////////////////////////////////////
    const OneFriendMainMemo = useMemo(() => ({ item }) => {
        return (<RenderOneFriend {...item} teamid={teamid} />);
    }, [teamid]);
    const keyExtractor = useCallback(item => item.userid + "_friend" + item.friendid, []);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null}
    </>, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => <OuterLazy
        background="transparent" height={pixel(200)}>
        {DATA_RENDER === undefined ? <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} /> :
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.noFriendsYet}
            </AnyText>}
    </OuterLazy>, [DATA_RENDER, isDark]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd={pixel(4)}
        renderItem={OneFriendMainMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getFriends();
        }}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
    />);
}
export default memo(RenderMeetoorInvites);