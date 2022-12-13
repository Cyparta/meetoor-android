import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
///////////////////////////////////////////////////
import {
    OuterOneButton, OuterOneContent,
    OuterOneImg, OuterOneType, OuterOneView
} from '../home/helpernotification/heplernotifycss';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { GetIconNotice } from '../home/helpernotification/converter';
import { AnyText } from '../home/helperprefernce';
import { AskFriendSvg, CloseSvg } from '../../icons/all';
import { css } from 'styled-components';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderOneComment = ({
    username,
    userPhoto,
    fullName,
    isFriend,
    likeid,
    userid,
    status,
    isLiked,
    likeType = "heart"
}) => {
    console.log("username", username);
    const mainSocket = useSelector(state => state.main.socket);
    const { buttons } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const GoToPage = useCallback(() => {
        navigate("profile", { username });
        console.log("GoToPage ~ username", username)
    }, [navigate, username]);
    ////////////////////////////////////////
    const HandleFriend = useCallback(() => {
        mainSocket.emit("friendRequest", { username });
    }, [mainSocket, username]);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1}
        isRTL={isRTL} css={css`justify-content: space-between;`}>
        <OuterOneView isRTL={isRTL} onPress={GoToPage} activeOpacity={0.8}
            css={css`width: auto;padding: 0;margin: 0;`}>
            <OuterOneImg size={moderateScale(40)}>
                <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(40)} />
                {status ? isLiked ?
                    <OuterOneType isRTL={isRTL}>
                        {GetIconNotice(likeType)}
                    </OuterOneType> : null :
                    <OuterOneType isRTL={isRTL}>
                        {GetIconNotice(likeType)}
                    </OuterOneType>}
            </OuterOneImg>
            <OuterOneContent isRTL={isRTL} css={css`max-width: ${pixel(240)};`}>
                <AnyText lower color={isDark ? "back2" : "clr3"} size={moderateScale(14)}
                    ellipsizeMode="tail" >{fullName}</AnyText>
                <AnyText lower color="clr2" size={moderateScale(11)} lineH={pixel(13)}
                    ellipsizeMode="tail">{"@" + username}</AnyText>
            </OuterOneContent>
        </OuterOneView>
        {status ? null : isFriend === "sent" ?
            <OuterOneButton isRTL={isRTL} dis
                css={css`padding: 0 ${pixel(6)};`}
                onPress={HandleFriend}>
                <CloseSvg size={moderateScale(14)} />
                <AnyText lower color="red2" isRTL={isRTL}
                    size={moderateScale(13)} autoMargin={pixel(6)}>{buttons.cancel}</AnyText>
            </OuterOneButton> : isFriend === false ?
                <OuterOneButton isRTL={isRTL}
                    onPress={HandleFriend}
                    css={css`padding: 0 ${pixel(6)};`} acc>
                    <AskFriendSvg color="back3" size={moderateScale(18)} />
                    <AnyText lower color="back3" isRTL={isRTL}
                        size={moderateScale(13)} autoMargin={pixel(6)}>{buttons.add}</AnyText>
                </OuterOneButton> : null}
    </OuterOneView>)
}

export default memo(RenderOneComment);