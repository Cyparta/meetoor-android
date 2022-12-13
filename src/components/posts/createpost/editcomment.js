import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CloseSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { RenderAnyUserPhoto } from '../../home/helperhome';
import { AnyText, OuterUserName, ScrollBar } from '../../home/helperprefernce';
import {
    ButtonCirculer, OuterButtonControl, UserInfoModal
} from '../../home/sliderroom/helperroomcss';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import { TopNavigateOuter } from './helpercreatepostcss';
import RenderCTRPost from './renderctrpost';
import PostTextArea from './posttextarea';
import { ToastAndroid } from 'react-native';
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const EditCommentMeetoor = ({ keyArray, text = "", commentid }) => {
    const dispatch = useDispatch();
    const { badges, schema } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const { goBack } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    const [currentText, setCurrentText] = useState(text);
    const maxContent = 3000;
    const [miunsMax, setMiunsMax] = useState(maxContent);
    ////////////////////////////////////////
    const detectMax = useCallback((textLength) => {
        setMiunsMax(3000 - textLength);
    }, []);
    /////////////////////////////////////////////////
    const editComment = async () => {
        try {
            if (currentText.length < 2) {
                ToastAndroid.show(`${placeholder.someThing}\n${schema.valid.char2}`, ToastAndroid.LONG);
                return;
            }
            let parseText = replaceMentionValues(currentText, ({name}) => `@${name}`);
            //////////////////////////////////////////
            mainSocket.emit("editComment", {
                commentid,
                commentText: parseText
            });
            dispatch(Actions.type("setPopupMain", false));
            dispatch(Actions.type("setComments", {
                type: 'updateWithCall',
                data: {
                    keyArray,
                    target: commentid,
                    key: "commentid",
                    call: (target) => {
                        target.isEdit = true;
                        target.commentText = parseText;
                    }
                }
            }));

            ToastAndroid.show(badges.modified, ToastAndroid.LONG);
            goBack();
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }
    ////////////////////////////////////////
    useEffect(() => {
        detectMax(currentText.length);
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
                        {badges.editcomment}
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
        <ScrollBar back={colors[isDark ? "clr1" : "back1"]} padd={`0 ${pixel(4)}`}
            keyboardShouldPersistTaps='handled'
            stickyHeaderIndices={[0]}>
            <RenderCTRPost
                miunsMax={miunsMax}
                isBack={false}
                isClone={true}
                isEditable={false}
                setFilesBack={null}
                createPost={editComment}
                restoreText={() => {
                    setCurrentText("");
                    detectMax(0);
                }} />
            <PostTextArea maxContent={maxContent}
                detectMax={detectMax} background={0}
                setCurrentText={setCurrentText}
                currentText={currentText} />
        </ScrollBar>
    </>)
}

export default memo(EditCommentMeetoor);
