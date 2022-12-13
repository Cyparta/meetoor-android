import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { AnyText } from '../../home/helperprefernce';
import { OuterItemColumnModal, OuterItemRowModal } from '../createpost/helpercreatepostcss';
import { CopySvg, DeleteSvg, EditPenSvg, EyeSvg, PinControlSvg, RequestSvg, SavedSvg, ShareSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { ToastAndroid } from 'react-native';
import { copyToClipboard, shareTo } from '../../../reducer/helper';
import Axios from '../../../main/Axios';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../../styles/basecss';
////////////////////////////////////////////
const ChoosePostMoreModal = ({
    isMe = true, isPin = false, posterUsername,
    isSaved = false, secure, postText, keyArray,
    postId, background, fromVideo }) => {
    const dispatch = useDispatch();
    const { messages, popmoreData, buttons } = useSelector(state => state.sign.langData);
    const { editpost, delpost, hidepost, savepost, reportpost,
        copylink, unsavepost, unPinPost, pinnedPost, shareWithOther
    } = popmoreData;
    const token = useSelector(state => state.sign.token);
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    const listUpdate = useMemo(() => new Set(["timeLine/", "mainPosts/", keyArray]), [keyArray]);
    ////////////////////////////////////////
    const onSave = useCallback(() => {
        mainSocket.emit("onSavePost", {
            postid: postId
        });
        const updatePosts = (target) => {
            target.isSaved = !target?.isSaved;
        }

        dispatch(Actions.type("setOtherPosts", {
            type: 'update',
            data: {
                key: postId,
                call: updatePosts
            }
        }));
        dispatch(Actions.type("setPosts", {
            type: 'updatesWithCall',
            data: {
                keysArray: listUpdate,
                target: postId,
                key: "postId",
                call: updatePosts
            }
        }));

        ToastAndroid.show(messages.savedPost, ToastAndroid.LONG);
    }, [postId, isSaved, listUpdate]);
    ////////////////////////////////////////
    const onEditPost = useCallback(() => {
        dispatch(Actions.type("setPostState", secure));
        dispatch(Actions.type("setBackgroundPost", background));
        navigate("editpost", { postid: postId, target: keyArray, text: postText });
        modalizeWithNav.close();
    }, [modalizeWithNav, secure, postText, keyArray, postId, background]);
    ////////////////////////////////////////
    const onPinPost = useCallback(async () => {
        mainSocket.emit("onPinPost", {
            postid: postId
        });
        const updatePosts = (target) => {
            target.isPin = !target?.isPin;
        }

        dispatch(Actions.type("setOtherPosts", {
            type: 'update',
            data: {
                key: postId,
                call: updatePosts
            }
        }));
        dispatch(Actions.type("setPosts", {
            type: 'updatesWithCall',
            data: {
                keysArray: listUpdate,
                target: postId,
                key: "postId",
                call: updatePosts
            }
        }));
        modalizeWithNav.close();
        try {
            const response = await Axios.get(`pinPost/?username=${posterUsername}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setPosts", {
                type: 'set',
                data: {
                    key: `pin_${posterUsername}`,
                    val: response.data[0]
                }
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
        ToastAndroid.show(isPin ? popmoreData.unPinPost : messages.pinPost, ToastAndroid.LONG);
    }, [modalizeWithNav, postId, isPin, listUpdate, posterUsername]);
    ////////////////////////////////////////
    const onRemovePost = useCallback(() => {
        mainSocket.emit("onRemovePost", {
            postid: postId
        });
        dispatch(Actions.type("setPosts", {
            type: 'deletesOne',
            data: {
                keysArray: listUpdate,
                target: postId,
                key: "postId",
            }
        }));
        ToastAndroid.show(messages.deleted, ToastAndroid.LONG);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId, listUpdate]);
    ////////////////////////////////////////
    const onReportPost = useCallback(() => {
        mainSocket.emit("reportPost", {
            postid: postId
        });
        ToastAndroid.show(buttons.hasSent, ToastAndroid.LONG);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId]);
    ////////////////////////////////////////
    const onHidePost = useCallback(() => {
        mainSocket.emit("onHidePost", {
            postid: postId
        });
        dispatch(Actions.type("setPosts", {
            type: 'deletesOne',
            data: {
                keysArray: listUpdate,
                target: postId,
                key: "postId",
            }
        }));
        ToastAndroid.show(messages.hidden, ToastAndroid.LONG);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId, keyArray]);
    ////////////////////////////////////////
    const onCopyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home#postview_id=${postId}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId, listUpdate, messages]);
    ////////////////////////////////////////////
    const shareWithOtherApps = useCallback(() => {
        shareTo(`https://meetoor.com/home#postview_id=${postId}`, messages.copied, dispatch);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId, listUpdate, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {isMe ? <>
            {fromVideo ? null : <>
                <OuterItemColumnModal noMargin onPress={onEditPost}>
                    <OuterItemRowModal isRTL={isRTL}>
                        <EditPenSvg color="clr2" size={moderateScale(18)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)}
                            autoMargin={pixel(6)} color="clr1">
                            {editpost.head}
                        </AnyText>
                    </OuterItemRowModal>
                    <OuterItemRowModal isRTL={isRTL}>
                        <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="clr2">
                            {editpost.sub}
                        </AnyText>
                    </OuterItemRowModal>
                </OuterItemColumnModal>

                <OuterItemColumnModal onPress={onPinPost}>
                    <OuterItemRowModal isRTL={isRTL}>
                        <PinControlSvg color="clr2" size={moderateScale(18)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)}
                            autoMargin={pixel(6)} color="clr1">
                            {isPin ? unPinPost : pinnedPost.head}
                        </AnyText>
                    </OuterItemRowModal>
                    {isPin ? null : <OuterItemRowModal isRTL={isRTL}>
                        <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="clr2">
                            {pinnedPost.sub}
                        </AnyText>
                    </OuterItemRowModal>}
                </OuterItemColumnModal>
            </>}

            <OuterItemColumnModal noMargin={fromVideo} onPress={onRemovePost}>
                <OuterItemRowModal isRTL={isRTL}>
                    <DeleteSvg size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="clr1">
                        {delpost.head}
                    </AnyText>
                </OuterItemRowModal>
                <OuterItemRowModal isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="red2">
                        {delpost.sub}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal>
        </> :
            <OuterItemColumnModal noMargin onPress={onHidePost}>
                <OuterItemRowModal isRTL={isRTL}>
                    <EyeSvg color="clr2" type={false} size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="clr1">
                        {hidepost.head}
                    </AnyText>
                </OuterItemRowModal>
                <OuterItemRowModal isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="clr2">
                        {hidepost.sub}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal>}

        <OuterItemColumnModal onPress={onSave}>
            <OuterItemRowModal isRTL={isRTL}>
                <SavedSvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {isSaved ? unsavepost : savepost.head}
                </AnyText>
            </OuterItemRowModal>
            {isSaved ? null : <OuterItemRowModal isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="clr2">
                    {savepost.sub}
                </AnyText>
            </OuterItemRowModal>}
        </OuterItemColumnModal>

        <OuterItemColumnModal onPress={onReportPost}>
            <OuterItemRowModal isRTL={isRTL}>
                <RequestSvg color="red2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="red2">
                    {reportpost}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>

        <OuterItemColumnModal onPress={onCopyLink}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {copylink}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>

        <OuterItemColumnModal onPress={shareWithOtherApps}>
            <OuterItemRowModal isRTL={isRTL}>
                <ShareSvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {shareWithOther}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
    </RenderBodyModal>)
}

export default memo(ChoosePostMoreModal);