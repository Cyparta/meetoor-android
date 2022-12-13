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
import RenderCTRPost, { PrivateCreatePost } from './renderctrpost';
import ViewerSliderFiles from './filesviewer';
import PostTextArea from './posttextarea';
import { ToastAndroid } from 'react-native';
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const CreatePostMeetoor = ({ text = "", teamid, target }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
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
    const [filesBack, setFilesBack] = useState([]);
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
    const createPost = useCallback(async () => {
        try {
            if (currentText.length < 2 && !filesBack.length) {
                ToastAndroid.show(`${placeholder.someThing}\n${schema.valid.char2}`, ToastAndroid.LONG);
                return;
            }

            let parseText = replaceMentionValues(currentText, ({ name }) => `@${name}`);

            goBack();

            ToastAndroid.show(placeholder.posting, ToastAndroid.LONG);

            const response = await PrivateCreatePost({
                Files: filesBack, teamid, secure: postState,
                postText: parseText, background: backgroundPost, token,
            });

            ToastAndroid.show(placeholder.posted, ToastAndroid.LONG);

            if (response.postId) {
                console.log("🚀 ~ file: createpost.js ~ line 77 ~ createPost ~ response", response)
                dispatch(Actions.type("setPosts", {
                    type: 'updates',
                    data: {
                        keysArray: [target],
                        val: response
                    }
                }));

                mainSocket.emit("onNewPost", {
                    postId: response.postId,
                    target, isClone: false
                });
            }

        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [filesBack, teamid, target, postState, backgroundPost, currentText, token]);
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
                        {badges.createpost}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                {teamid !== undefined ? null :
                    <ButtonCirculer activeOpacity={0.8} isRTL={isRTL} isDark={isDark}
                        onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "poststate" }))}>
                        {currentStateIcon}
                    </ButtonCirculer>}
                <ButtonCirculer activeOpacity={0.8}
                    isRTL={isRTL} isDark={isDark}
                    onPress={goBack} close>
                    <CloseSvg size={moderateScale(16)} />
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <ScrollBar back={colors[isDark ? "clr1" : "back1"]}
            padd={`0 ${pixel(4)}`}
            keyboardShouldPersistTaps='handled'
            stickyHeaderIndices={[0]}>
            <RenderCTRPost
                miunsMax={miunsMax}
                isBack={backgroundPost !== 0}
                setFilesBack={setFilesBack}
                createPost={createPost}
                restoreText={() => {
                    setCurrentText("");
                    detectMax(0);
                }} />
            <PostTextArea maxContent={maxContent}
                detectMax={detectMax} background={backgroundPost}
                setCurrentText={setCurrentText} currentText={currentText} />
            {filesBack.length && backgroundPost === 0 ? <ViewerSliderFiles
                setFilesBack={setFilesBack}
                filesBack={filesBack} /> : null}
            {/* <KeyboardSpacer /> */}
        </ScrollBar>
    </>)
}

export default memo(CreatePostMeetoor);
