import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { colors, pixel } from '../../styles/basecss';
import { UIActivityIndicator } from 'react-native-indicators';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { UserInfoModalTouch } from '../home/sliderroom/helperroomcss';
import { OuterMainOneChat, RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { RenderChatElement, RefChatElement } from './helper';
import { OnePadgePost } from '../posts/posts/post/helperpostcss';
import { ProcessTextWithLink } from '../../main/processtext/processtext';
import Actions from '../../reducer/actions';
import { Animated, PanResponder } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderMeetoorOneChat = ({ message, date, msgid,
    refMsg, userImg, userName, userid, stillSend }) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    ////////////////////////////////////////////
    const [dataMessage, setDataMessage] = useState(message);
    const { text, file, target } = dataMessage;
    const isMe = (userid === User.userid);
    const isRecord = text?.startsWith("$record$");
    const isDelete = text?.startsWith("$delete$");
    const pan = React.useRef(new Animated.ValueXY()).current;
    //////////////////////////////////////////////
    const onReply = useCallback(() => {
        if (isDelete) return;
        dispatch(Actions.type("setReplyWin", {
            html: <OuterUserName isRTL={isRTL}
                css={css`width: auto;margin-bottom: ${pixel(2)};padding: 0px;`}>
                <RefChatElement text={text} file={file} />
            </OuterUserName>,
            obj: { text, file },
            refId: msgid
        }));
    }, [text, msgid, file, isDelete]);
    //////////////////////////////////////////////
    const panResponder = React.useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderTerminationRequest: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            if (isDelete || (isMe && gestureState.dx > 0)
            || (!isMe && gestureState.dx < 0)) return false;
            return Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: Animated.event([null,
            { dx: pan.x }
        ], { useNativeDriver: false }),
        onPanResponderEnd: () => {
            Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
            if (Math.abs(parseInt(pan.x._value)) > 60) onReply()
        }
    })).current;
    //////////////////////////////////////////////
    useEffect(() => {
        setDataMessage(message);
    }, [message]);
    const setColorBack = useMemo(() => {
        if (isRecord || file) return "trans"
        if (isMe) {
            return "clr3";
        } else {
            return "back3";
        }
    }, [isMe, isDark, isRecord, file]);
    const setColorText = useMemo(() => {
        if (isRecord || file) return isDark ? "back2" : "clr3";
        if (isMe) {
            return "back3";
        } else {
            return "clr3";
        }
    }, [isMe, isDark, isRecord, file]);
    ////////////////////////////////////////////
    const process = useMemo(() => ProcessTextWithLink(text, {
        isDark, size: 14,
        width: "auto",
        textColor: setColorText
    }), [text, isDark, setColorText, isMe, isRecord, file]);
    const { content } = process.text;
    ////////////////////////////////////////////
    const OpenMoreModal = useCallback(() => {
        if (isDelete) return;
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "msgteammore", isMe, file, text, msgid, date
        }))
    }, [isMe, file, text, msgid, date, isDelete])
    ////////////////////////////////////////////
    return (<Animated.View style={{
        transform: [{ translateX: pan.x }]
    }} {...panResponder.panHandlers}>
        <OuterMainOneChat isRTL={isMe} activeOpacity={1}
            css={css`justify-content: flex-start;
                align-items: flex-end;margin-bottom: ${pixel(4)};`}>
            <UserInfoModalTouch isRTL={isMe} activeOpacity={0.8}
                css={css`width: auto;max-width: ${pixel(280)};align-items: flex-end;`}
                delayLongPress={200} onPress={OpenMoreModal}>
                {!isMe ? <RenderAnyUserPhoto userPhoto={userImg}
                    size={pixel(30)} css={css`margin: 0 ${pixel(2)};`} /> : null}
                <OuterUserName isRTL={isMe}
                    css={css`width: auto;margin: 0 ${pixel(2)};padding: 0;`}>
                    {refMsg && !isDelete ? <OuterUserName isRTL={isMe} back="clr2"
                        css={css`width: auto;border-radius: ${pixel(10)};opacity: 0.65;
                            margin: ${pixel(6)} ${pixel(2)};margin-bottom: ${pixel(2)};
                            padding: ${pixel(4)} ${pixel(8)};`}>
                        <RefChatElement {...refMsg} />
                    </OuterUserName> : null}
                    {!isMe ? <AnyText color={isDark ? "back2" : "clr2"}
                        css={css`opacity: 0.8;margin-top: ${pixel(4)};`} lower
                        size={moderateScale(11)} lineH={pixel(14)}>
                        {userName}
                    </AnyText> : null}
                    <OuterUserName isRTL={isMe} back={setColorBack}
                        css={css`width: auto;border-radius: ${pixel(10)};
                            padding: ${pixel(4)} ${pixel(8)};min-width: ${pixel(30)};`}>
                        <RenderChatElement text={content} isRecord={isRecord}
                            isDelete={isDelete} file={file} />
                    </OuterUserName>
                </OuterUserName>
            </UserInfoModalTouch>
            {stillSend ? <OnePadgePost>
                <UIActivityIndicator color={colors["clr2"]} size={18} />
            </OnePadgePost> : null}
        </OuterMainOneChat>
    </Animated.View>)
}

export default memo(RenderMeetoorOneChat);