import React, { memo, useCallback, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colors, pixel } from '../../styles/basecss';
import { UIActivityIndicator } from 'react-native-indicators';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import Eye from "../../icons/eye";
import { ButtonCirculer, UserInfoModalTouch } from '../home/sliderroom/helperroomcss';
import { OuterMainOneChat, RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { RenderChatElement, RenderCallElement, RefChatElement } from './helper';
import { OnePadgePost } from '../posts/posts/post/helperpostcss';
import { ProcessTextWithLink } from '../../main/processtext/processtext';
import Actions from '../../reducer/actions';
import { Animated, PanResponder } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////storyMsg
const RenderMeetoorOneChat = ({ message, date, msgid, seen, isLast,
    refMsg, userImg, userid, stillSend, showAvatar, name }) => {
    const dispatch = useDispatch();
    const { messages: { storyMsg } } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    ////////////////////////////////////////////
    const { text, file, target, call = null } = message;
    const isMe = (userid == User.userid);
    const isCall = call !== null;
    const isRecord = text?.startsWith("$record$");
    const isDelete = text?.startsWith("$delete$");
    const isStory = text?.startsWith("$story$");
    const textFix = text?.replace("$file$", "").replace("$story$", "");
    const pan = React.useRef(new Animated.ValueXY()).current;
    const [panResponder] = useState(PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderTerminationRequest: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            if (isCall || isDelete || (isMe && gestureState.dx > 0)
                || (!isMe && gestureState.dx < 0)) return false;
            return Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x }], { useNativeDriver: false }),
        onPanResponderEnd: () => {
            Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
            if (Math.abs(parseInt(pan.x._value)) > 60) onReply()
        }
    }));
    //////////////////////////////////////////////
    const onReply = useCallback(() => {
        if (isDelete || isCall) return;
        dispatch(Actions.type("setReplyWin", {
            html: <OuterUserName isRTL={isRTL}
                css={css`width: auto;margin-bottom: ${pixel(2)};padding: 0px;`}>
                <RefChatElement text={text} file={file} />
            </OuterUserName>,
            obj: { text, file },
            refId: msgid
        }));
    }, [text, msgid, file, isDelete, isCall, isMe]);
    //////////////////////////////////////////////
    const setColorBack = useMemo(() => {
        if (isCall || isRecord || file) return "trans"
        if (isMe) {
            return "clr3";
        } else {
            return "back3";
        }
    }, [isMe, isDark, isCall, isRecord, file]);
    const setColorText = useMemo(() => {
        if (isCall || isRecord || file) return isDark ? "back2" : "clr3";
        if (isMe) {
            return "back3";
        } else {
            return "clr3";
        }
    }, [isMe, isDark, isCall, isRecord, file]);
    ////////////////////////////////////////////
    const process = useMemo(() => ProcessTextWithLink(textFix, {
        isDark, size: 14,
        width: "auto",
        textColor: setColorText
    }), [textFix, isDark, setColorText, isMe, isRecord, file]);
    const { content } = process.text;
    ////////////////////////////////////////////
    const OpenMoreModal = useCallback(() => {
        if (isDelete || isCall) return;
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "messagemore", isMe, file, text: textFix, msgid, date, isLast
        }))
    }, [isMe, file, textFix, msgid, date, isLast, isDelete, isCall])
    ////////////////////////////////////////////
    return (<Animated.View style={{
        transform: [{ translateX: pan.x }]
    }} {...panResponder.panHandlers}>
        {isStory ? <OuterMainOneChat css={css`margin-top: ${pixel(5)};border-radius: 10px;
            background-color: ${colors[isDark ? "clr4" : "clr2"]};justify-content: center;`}>
            <AnyText css={css`padding: ${pixel(4)};`} align="center"
                numberOfLines={1} size={moderateScale(13)}
                ellipsizeMode="tail" width={"100%"} isRTL={true}>
                {isMe ? null : name?.split(' ')[0] + " ➡ "}{storyMsg[isMe ? "you" : "other"]}
            </AnyText>
        </OuterMainOneChat> : null}
        <OuterMainOneChat isRTL={isMe} activeOpacity={1}
            css={css`justify-content: flex-start;align-items: flex-end;margin-bottom: ${pixel(4)};`}>
            <UserInfoModalTouch isRTL={isMe} activeOpacity={0.8}
                css={css`width: auto;max-width: ${pixel(280)};align-items: flex-end;`}
                // onLongPress={OpenMoreModal}
                delayLongPress={200} onPress={OpenMoreModal}>
                {!isMe && showAvatar ? <RenderAnyUserPhoto userPhoto={userImg}
                    size={pixel(30)} css={css`margin: 0 ${pixel(2)};`} /> : null}
                <OuterUserName isRTL={isMe}
                    css={css`width: auto;margin: 0 ${pixel(2)};padding: 0;`}>
                    {refMsg && !isDelete ? <OuterUserName isRTL={isMe} back="clr2"
                        css={css`width: auto;border-radius: ${pixel(10)};opacity: 0.65;
                        margin: ${pixel(6)} ${pixel(2)};margin-bottom: ${pixel(2)};
                        padding: ${pixel(4)} ${pixel(8)};`}>
                        <RefChatElement {...refMsg} />
                    </OuterUserName> : null}
                    <OuterUserName isRTL={isMe} back={setColorBack}
                        css={css`width: auto;border-radius: ${pixel(10)};
                        padding: ${pixel(4)} ${pixel(8)};min-width: ${pixel(30)};`}>
                        {isCall ? <RenderCallElement call={call}
                            color={setColorText} isMe={isMe} name={name} /> :
                            <RenderChatElement text={content} isRecord={isRecord}
                                isDelete={isDelete} file={file} />}
                    </OuterUserName>
                </OuterUserName>
            </UserInfoModalTouch>
            {stillSend ? <OnePadgePost>
                <UIActivityIndicator color={colors["clr2"]} size={18} />
            </OnePadgePost> :
                isLast && isMe && !isDelete ? <ButtonCirculer
                    size={pixel(32)} activeOpacity={0.8}
                    onPress={() => dispatch(Actions.
                        type("setCurrentModalWithNav", {
                            key: "messagemore",
                            date: seen?.date,
                            justSeen: true
                        }))}
                    css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
                    <Eye seen={seen?.isSeen} isDark={isDark} />
                </ButtonCirculer> : null}
        </OuterMainOneChat>
    </Animated.View>)
}

export default memo(RenderMeetoorOneChat);