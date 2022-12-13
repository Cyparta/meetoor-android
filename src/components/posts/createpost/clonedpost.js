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
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import Axios from '../../../main/Axios';
////////////////////////////////////////////
export const ClonePostAsunc = async ({ refId, currentText = "",
    token, mainSocket, keyArray, copied, dispatch }) => {
    try {
        console.log("🚀 ~ file: clonedpost.js ~ line 21 ~ refId", refId)
        let data = new FormData();
        data.append('refId', refId);
        data.append('postText', currentText);
        const response = await Axios.post("clonePost/", data, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        //////////////////////////////////////////
        response.data.postId && mainSocket.emit("onNewPost", {
            postId: response.data.postId,
            target: keyArray,
            isClone: true
        });
        dispatch(Actions.type("setPosts", {
            type: 'updateWithCall',
            data: {
                keyArray: keyArray,
                target: refId,
                key: "postId",
                call: (post) => {
                    post.clones += 1;
                    post.isCopy = true;
                }
            }
        }));
        dispatch(Actions.type("setOtherPosts", {
            type: 'update',
            data: {
                key: refId,
                call: (post) => {
                    post.clones += 1;
                    post.isCopy = true;
                }
            }
        }));
        dispatch(Actions.type("setPosts", {
            type: 'updates',
            data: {
                keysArray: [`userPosts/?username=${response.data.posterUsername}&`],
                val: response.data
            }
        }));
        ToastAndroid.show(copied, ToastAndroid.LONG);
    } catch (e) {
        console.log("signin -> catch", e)
    }
};
////////////////////////////////////////////
const ClonePostMeetoor = ({ keyArray, refId }) => {
    const dispatch = useDispatch();
    const { badges, messages } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const User = useSelector(state => state.main.user);
    const { goBack } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const postState = useSelector(state => state.sign.postState);
    ////////////////////////////////////////
    const [currentText, setCurrentText] = useState("");
    const maxContent = 220;
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
        setMiunsMax(220 - textLength);
    }, []);
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
                        {badges.clonepost}
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
                isBack={false}
                isClone={true}
                isEditable={false}
                setFilesBack={null}
                createPost={() => {
                    ClonePostAsunc({
                        mainSocket, keyArray, refId, token, dispatch, copied: messages.copiedPost,
                        currentText: replaceMentionValues(currentText, ({ name }) => `@${name}`),
                    });
                    goBack();
                }}
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

export default memo(ClonePostMeetoor);
