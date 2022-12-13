import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { CloseSvg } from '../../../icons/all';
import { RenderAnyUserPhoto } from '../../home/helperhome';
import Axios from '../../../main/Axios';
import { AnyText, OuterUserName, ScrollBar } from '../../home/helperprefernce';
import {
    ButtonCirculer, OuterButtonControl, UserInfoModal
} from '../../home/sliderroom/helperroomcss';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import { TopNavigateOuter } from './helpercreatepostcss';
import RenderCTRPost from './renderctrpost';
import PostTextArea from './posttextarea';
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import OneOuterAonoyChat from '../../home/helperchat/oneanonychat';
import Actions from '../../../reducer/actions';
////////////////////////////////////////////
const WriteAnonyChatMeetoor = ({ username, msgId = false }) => {
    const dispatch = useDispatch();
    const { badges, buttons, liveData, contactus } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const { goBack } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    const [currentText, setCurrentText] = useState("");
    const maxContent = 220;
    const [miunsMax, setMiunsMax] = useState(maxContent);
    const [publicAnony, setPublicAnony] = useState([]);
    ////////////////////////////////////////
    const detectMax = useCallback((textLength) => {
        setMiunsMax(maxContent - textLength);
    }, [maxContent]);
    ////////////////////////////////////////
    const sendAnonyChat = useCallback(async () => {
        let parseText = replaceMentionValues(currentText, ({name}) => `@${name}`);
        if (mainSocket.connect) {
            mainSocket.emit("onAnonyChat", { username, message: parseText });
        } else {
            let res = await Axios.post("anonyMessage/", { username, message: parseText });
            ToastAndroid.show(res.error ? liveData.room.errorUser : contactus.msg2, ToastAndroid.LONG);
        }
        setTimeout(() => {
            goBack();
        }, 1000);
    }, [username, mainSocket, currentText, goBack]);
    ////////////////////////////////////////
    const sendAnonyReply = useCallback(async () => {
        let parseText = replaceMentionValues(currentText, ({name}) => `@${name}`);
        mainSocket.emit("onAnonyReplay", { msgid: msgId, message: parseText });
        dispatch(Actions.type("setAnonyChats", {
            type: 'update',
            data: {
                target: msgId,
                key: "msgid",
                call: (target) => {
                    target.reply = { text: parseText };
                }
            }
        }));
        setTimeout(() => {
            goBack();
        }, 1000);
    }, [msgId, mainSocket, currentText, goBack]);
    ////////////////////////////////////////
    const getAnonychats = useCallback(async () => {
        try {
            const response = await Axios.get(`anonyPublicChat/?username=${username}&idLt=0`);
            let responseData = response?.data;
            setPublicAnony(responseData);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [username]);
    ////////////////////////////////////////
    useEffect(() => {
        detectMax(currentText.length);
        !msgId && getAnonychats();
    }, []);
    ////////////////////////////////////////
    return (<>
        <TopNavigateOuter isDark={isDark}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color={isDark ? "back3" : "clr2"}>{User.fullName}</AnyText>
                    <AnyText isRTL={isRTL}
                        color={isDark ? "back2" : "clr2"}
                        lower target lineH={pixel(15)}>
                        {badges.anonyMsg}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8}
                    isRTL={isRTL} isDark={isDark}
                    onPress={goBack} close>
                    <CloseSvg size={moderateScale(17)} />
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <ScrollBar back={colors[isDark ? "clr1" : "back1"]}
            padd={`0 ${pixel(4)}`}
            keyboardShouldPersistTaps='handled'
            stickyHeaderIndices={[0]}>
            <RenderCTRPost
                miunsMax={miunsMax}
                isBack={false}
                // isAnony={true}
                isClone={true}
                setFilesBack={null}
                limit={1}
                titlePost={buttons.send}
                createPost={msgId ? sendAnonyReply : sendAnonyChat}
                restoreText={() => {
                    setCurrentText("");
                    detectMax(0);
                }} />
            <PostTextArea maxContent={maxContent}
                detectMax={detectMax} background={0}
                setCurrentText={setCurrentText}
                currentText={currentText} />
            {msgId ? null : publicAnony?.map((item) => (<OneOuterAonoyChat
                key={item.msgid} {...item} asView={true} inverted />))}
        </ScrollBar>
    </>)
}

export default memo(WriteAnonyChatMeetoor);
