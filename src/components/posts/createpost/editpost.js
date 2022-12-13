import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    CloseSvg, FriendsSvg, PublickSvg
} from '../../../icons/all';
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
import { moderateScale } from 'react-native-size-matters';
import { colors, pixel } from '../../../styles/basecss';
////////////////////////////////////////////
const EditPostMeetoor = ({ text = "", postid, target }) => {
    const dispatch = useDispatch();
    const { badges, placeholder, schema } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const { goBack } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const backgroundPost = useSelector(state => state.sign.backgroundPost);
    const isDark = useSelector(state => state.sign.isDark);
    const postState = useSelector(state => state.sign.postState);
    ////////////////////////////////////////
    const [currentText, setCurrentText] = useState(text);
    const orgMax = 10000;
    const maxContent = backgroundPost ? 220 : orgMax;
    const [miunsMax, setMiunsMax] = useState(maxContent);
    ////////////////////////////////////////
    const currentStateIcon = useMemo(() => {
        switch (postState) {
            case 1:
                return <PublickSvg color="clr2" />;
            case 2:
                return <FriendsSvg color="clr2" />;
            default:
                return <PublickSvg color="clr2" />;
        }
    }, [postState]);
    ////////////////////////////////////////
    const detectMax = useCallback((textLength) => {
        setMiunsMax((backgroundPost ? 220 : orgMax) - textLength);
    }, [backgroundPost]);
    ////////////////////////////////////////
    useEffect(() => {
        detectMax(currentText.length);
    }, [backgroundPost]);
    ////////////////////////////////////////
    const editPost = useCallback(async () => {
        try {
            if (currentText.length < 2) {
                ToastAndroid.show(`${placeholder.someThing}\n${schema.valid.char2}`, ToastAndroid.LONG);
                return;
            }
            let parseText = replaceMentionValues(currentText, ({name}) => `@${name}`);
            dispatch(Actions.type("setPosts", {
                type: 'updatesWithCall',
                data: {
                    keysArray: ["timeLine/", "mainPosts/", target],
                    target: postid,
                    key: "postId",
                    call: (post) => {
                        post.isEdit = true;
                        post.postText = parseText;
                        post.background = backgroundPost;
                        post.secure = postState;
                    }
                }
            }));

            mainSocket.emit("onEditPost", {
                postid, isClone: false,
                posttext: parseText,
                background: backgroundPost,
                secure: postState
            });

            ToastAndroid.show(badges.modified, ToastAndroid.LONG);
            goBack();
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [postid, target, postState, backgroundPost, currentText]);
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
                        {badges.editpost}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8} isRTL={isRTL} isDark={isDark}
                    onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "poststate" }))}>
                    {currentStateIcon}
                </ButtonCirculer>
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
                isBack={backgroundPost !== 0}
                isEditable={true}
                setFilesBack={null}
                createPost={editPost}
                restoreText={() => {
                    setCurrentText("");
                    detectMax(0);
                }} />
            <PostTextArea maxContent={maxContent}
                detectMax={detectMax} background={backgroundPost}
                setCurrentText={setCurrentText} currentText={currentText} />
        </ScrollBar>
    </>)
}

export default memo(EditPostMeetoor);
