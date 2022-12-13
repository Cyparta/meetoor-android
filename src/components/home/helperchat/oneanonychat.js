import React, { memo, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AnyText, OuterUserName } from '../helperprefernce';
import {
    OuterOneContent,
    OuterNameContent
} from '../helpernotification/heplernotifycss';
import { ProcessTextWithLink } from '../../../main/processtext/processtext';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { ButtonNormal, UserInfoModalTouch } from '../sliderroom/helperroomcss';
import { BadgeNumer, RenderAnyUserPhoto } from '../helperhome';
import { OuterPostTop } from '../../posts/posts/post/helperpostcss';
import { LockSvg, PublickSvg, ReplySvg, RequestSvg } from '../../../icons/all';
///////////////////////////////////////////////////
const OneOuterAnonyChat = ({
    message,
    time = "a minute ago",
    isNew,
    msgid,
    reply = false,
    isPublic,
    iaAnony,
    asView = false,
    inverted = false,
    fullName,
    userPhoto,
    isSent = false
}) => {
    console.log("🚀 ~ file: oneanonychat.js ~ line 30 ~ reply", reply)
    const lang = useSelector(state => state.sign.lang);
    const { badges } = useSelector(state => state.sign.langData);
    const Time = useSelector(state => state.main.time);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    ///////////////////////////////////////////////////////
    const localTime = Time.setDate(time, lang);
    const [anonyPublic, setPublic] = useState(isPublic);
    //////////////////////////////////////////////
    const process = useMemo(() => ProcessTextWithLink(message, {
        isDark, size: 14,
    }), [message, isDark]);
    const { content } = process.text;
    //////////////////////////////////////////////
    const processReply = useMemo(() =>
        ProcessTextWithLink(reply?.text || "", {
            isDark, size: 14,
            textColor: "clr2"
        }), [reply, isDark]).text;
    const ColorBack = isDark ? inverted ? "clr3" : "clr1" : inverted ? "back3" : "back1";
    ///////////////////////////////////////////////////////
    return (<OuterOneContent isRTL={false} width="100%"
        css={css`background: ${colors[ColorBack]};
            padding: 0 ${pixel(4)};margin-bottom: ${pixel(8)};
            border-radius: ${pixel(8)};`}>
        <OuterPostTop isRTL={isRTL}
            css={css`border-bottom-width: ${pixel(1)};
                border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};`}
            back={colors[ColorBack]}>
            <UserInfoModalTouch isRTL={isRTL}
                activeOpacity={0.8} css={css`width: 100%;flex: 1;`}>
                {isSent ? <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(40)} /> : <RequestSvg size={moderateScale(27)} />}
                <OuterUserName isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(12)} lower lineH={pixel(16)}
                        color={isDark ? "back3" : "clr1"}>{isSent ? fullName : badges.anonyMsg}</AnyText>
                    <OuterNameContent isRTL={isRTL}>
                        <AnyText isRTL={isRTL} size={moderateScale(10)}
                            color="clr2" lineH={pixel(12)} lower>
                            {localTime.toNow}
                        </AnyText>
                    </OuterNameContent>
                </OuterUserName>
            </UserInfoModalTouch>
            {!asView ? <>
                {iaAnony ? null : <ButtonNormal isRTL={isRTL} size={pixel(28)}
                    activeOpacity={reply ? 0.2 : 0.8}
                    onPress={() => !reply && navigate("writeanonychat", { msgId: msgid })}
                    css={css`${reply ? "opacity: 0.2" : ""};background: transparent;border-width: 0px;`}>
                    <ReplySvg size={moderateScale(18)} />
                </ButtonNormal>}
                <ButtonNormal isRTL={isRTL} size={pixel(28)} activeOpacity={0.8}
                    css={css`background: transparent;border-width: 0px;`}
                    onPress={() => {
                        setPublic(pub => {
                            mainSocket.emit("onAnonyPublic", { msgid, type: !pub });
                            return !pub;
                        });
                    }}>
                    {anonyPublic ? <PublickSvg size={moderateScale(18)} /> : <LockSvg size={moderateScale(18)} />}
                </ButtonNormal>
            </> : null}
            {isNew ? <BadgeNumer isRTL={isRTL}
                css={css`top: ${pixel(2)};padding: 0;width: ${pixel(10)};min-width: ${pixel(10)};
                    top: ${pixel(7)};right: ${pixel(3)};height: ${pixel(10)};`} /> : null}
        </OuterPostTop>
        <OuterNameContent isRTL={isRTL} width={"100%"}
            css={css`padding: ${pixel(2)};flex-direction: column;`}>
            {content}
        </OuterNameContent>
        {reply && (!asView || isSent) ? <OuterNameContent isRTL={isRTL} width={"100%"}
            css={css`padding: ${pixel(2)} ${pixel(15)};flex-direction: column;
                border-top-width: ${pixel(1)};border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};`}>
            {processReply.content}
        </OuterNameContent> : null}
    </OuterOneContent>)
}

export default memo(OneOuterAnonyChat);