import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DotIndicator } from 'react-native-indicators';
import { EyeSvg } from '../../../icons/all';
import { AnyText } from '../helperprefernce';
import { FriendBlock, OuterOneButton, ButtonText } from './heplernotifycss';
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
///////////////////////////////////////////////////
export const ForFriend = memo(({ userid, To }) => {
    const mainSocket = useSelector(state => state.main.socket);
    const isDark = useSelector(state => state.sign.isDark);
    // const { navigate } = useSelector(state => state.modal.navigation);
    const { notifyData, buttons } = useSelector(state => state.sign.langData);
    const [action, setAction] = useState(false);
    const [message, setMessage] = useState(null);
    ///////////////////////////////////////////////
    const handleRequest = (type) => {
        setMessage(<>
            <AnyText target lower
                color={isDark ? "back2" : "clr3"}>
                {notifyData.askfriend}
            </AnyText>
            <FriendBlock>
                <OuterOneButton dis css={css`min-width: ${pixel(65)};`}>
                    <DotIndicator size={moderateScale(4)} count={7} color={colors["clr2"]} />
                </OuterOneButton>
                <OuterOneButton activeOpacity={0.9} dis
                    onPress={() => setAction(false)}>
                    <ButtonText dis>{buttons.cancel}</ButtonText>
                </OuterOneButton>
            </FriendBlock>
        </>);
        setAction(true);
        mainSocket.emit("handleAskFriend", {
            action: type, userid
        });
    };
    /////////////////////////////////////////////////
    return (action ? message :
        <>
            <AnyText target lower
                color={isDark ? "back2" : "clr3"}>
                {notifyData.askfriend}
            </AnyText>
            <FriendBlock>
                <OuterOneButton acc onPress={() => handleRequest(1)}>
                    <ButtonText acc>{buttons.accept}</ButtonText>
                </OuterOneButton>
                <OuterOneButton dis onPress={() => handleRequest(0)}>
                    <ButtonText dis >{buttons.decline}</ButtonText>
                </OuterOneButton>
                <OuterOneButton acc onPress={To}>
                    <EyeSvg color="back3" size={moderateScale(20)} />
                </OuterOneButton>
            </FriendBlock>
        </>);
});
//////////////////////////////////////////////
export const ForLive = memo(({ extra, messMain, To }) => {
    const { buttons } = useSelector(state => state.sign.langData);
    const [action, setAction] = useState(false);
    const [message, setMessage] = useState(null);
    ///////////////////////////////////////////////
    const handleRequest = (type) => {
        setMessage(<>
            {messMain}
            <FriendBlock>
                <OuterOneButton dis css={css`min-width: ${pixel(65)};`}>
                    <DotIndicator size={moderateScale(4)} count={7} color={colors["clr2"]} />
                </OuterOneButton>
                <OuterOneButton dis onPress={() => setAction(false)}>
                    <ButtonText dis>{buttons.cancel}</ButtonText>
                </OuterOneButton>
            </FriendBlock>
        </>);
        setAction(true);
        if (type) { extra.accept(); }
        else {
            extra.reject();
        }
    };
    /////////////////////////////////////////////////
    return (action ? message :
        <>
            {messMain}
            <FriendBlock>
                <OuterOneButton acc onPress={() => handleRequest(true)}>
                    <ButtonText acc>{buttons.accept}</ButtonText>
                </OuterOneButton>
                <OuterOneButton dis onPress={() => handleRequest(false)}>
                    <ButtonText dis >{buttons.decline}</ButtonText>
                </OuterOneButton>
                <OuterOneButton acc onPress={To}>
                    <EyeSvg color="back3" size={moderateScale(20)} />
                </OuterOneButton>
            </FriendBlock>
        </>);
});
//////////////////////////////////////////////
export const ForTeam = memo(({ userid, targetid, target, To }) => {
    const mainSocket = useSelector(state => state.main.socket);
    const isDark = useSelector(state => state.sign.isDark);
    const { notifyData, buttons } = useSelector(state => state.sign.langData);
    const [action, setAction] = useState(false);
    ///////////////////////////////////////////////
    const handleRequest = (type) => {
        setAction(true);
        mainSocket.emit("handleAskTeam", {
            action: type, userid,
            teamid: targetid
        });
    };
    /////////////////////////////////////////////////
    return (<>
        <AnyText target lower
            color={isDark ? "back2" : "clr3"}>
            {notifyData.askteam} {target}
        </AnyText>
        {action ?
            <FriendBlock>
                <OuterOneButton dis css={css`min-width: ${pixel(65)};`}>
                    <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} />
                </OuterOneButton>
                <OuterOneButton dis onPress={() => setAction(false)}>
                    <ButtonText dis>{buttons.cancel}</ButtonText>
                </OuterOneButton>
            </FriendBlock>
            : <FriendBlock>
                <OuterOneButton acc onPress={() => handleRequest(1)}>
                    <ButtonText acc>{buttons.accept}</ButtonText>
                </OuterOneButton>
                <OuterOneButton dis onPress={() => handleRequest(0)}>
                    <ButtonText dis >{buttons.decline}</ButtonText>
                </OuterOneButton>
                <OuterOneButton acc onPress={To}>
                    <EyeSvg color="back3" size={moderateScale(20)} />
                </OuterOneButton>
            </FriendBlock>}
    </>);
})
//////////////////////////////////////////////
export const ForTeamLive = memo(({ target, notifyId, To }) => {
    const mainSocket = useSelector(state => state.main.socket);
    const isDark = useSelector(state => state.sign.isDark);
    const { notifyData, buttons } = useSelector(state => state.sign.langData);
    ///////////////////////////////////////////////
    const deleteNotification = () => {
        mainSocket.emit("deleteNotification", {
            notifyId
        });
    };
    /////////////////////////////////////////////////
    return (<>
        <AnyText target lower
            color={isDark ? "back2" : "clr3"}>
            {notifyData.forRoom} {target}
        </AnyText>
        <FriendBlock>
            <OuterOneButton acc onPress={deleteNotification}>
                <ButtonText acc>{buttons.join}</ButtonText>
            </OuterOneButton>
            <OuterOneButton onPress={() => {
                deleteNotification();
                // histroy.push(`/home/team/?t=${target}`);
                To();
            }}>
                <ButtonText>{buttons.openTeam}</ButtonText>
            </OuterOneButton>
        </FriendBlock>
    </>);
});