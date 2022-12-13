import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { AnyText } from '../../home/helperprefernce';
import { OuterItemColumnModal, OuterItemRowModal } from '../createpost/helpercreatepostcss';
import { CopySvg, DeleteSvg, EditPenSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { ToastAndroid } from 'react-native';
import { copyToClipboard } from '../../../reducer/helper';
import { pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const ChooseCommentMoreModal = ({
    isMe = true,
    isMyPost,
    postId,
    commentText,
    keyArray,
    commentid }) => {
    const dispatch = useDispatch();
    const { messages, popmoreData } = useSelector(state => state.sign.langData);
    const { copylink, editComment, delComment } = popmoreData;
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const onEditPost = useCallback(() => {
        navigate("editcomment", { keyArray, text: commentText, commentid });
        modalizeWithNav.close();
    }, [modalizeWithNav, commentText, keyArray, commentid]);
    ////////////////////////////////////////
    const onRemovePost = useCallback(() => {
        mainSocket.emit("onRemoveComment", { commentid });
        /////////////////////////////////////
        dispatch(Actions.type("setComments", {
            type: 'deleteOne',
            data: {
                keyArray: keyArray,
                target: commentid,
                key: "commentid",
            }
        }));
        ToastAndroid.show(messages.deleted, ToastAndroid.LONG);
        modalizeWithNav.close();
    }, [modalizeWithNav, commentid, keyArray]);
    ////////////////////////////////////////
    const onCopyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home#postview_id=${postId}_go=${commentid}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, commentid, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {isMe ? <OuterItemColumnModal noMargin onPress={onEditPost}>
            <OuterItemRowModal isRTL={isRTL}>
                <EditPenSvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {editComment.head}
                </AnyText>
            </OuterItemRowModal>
            <OuterItemRowModal isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(11)}
                    autoMargin={pixel(6)} color="clr2" lineH={pixel(12)}>
                    {editComment.sub}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal> : null}
        {(isMe || isMyPost) ?
            <OuterItemColumnModal onPress={onRemovePost}>
                <OuterItemRowModal isRTL={isRTL}>
                    <DeleteSvg size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="clr1">
                        {delComment.head}
                    </AnyText>
                </OuterItemRowModal>
                <OuterItemRowModal isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(11)} autoMargin={pixel(6)} lineH={pixel(12)} color="red2">
                        {delComment.sub}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal> : null}

        <OuterItemColumnModal noMargin={(!isMe && !isMyPost)} onPress={onCopyLink}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(14)}
                    autoMargin={pixel(8)} color="clr1">
                    {copylink}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
    </RenderBodyModal>)
}

export default memo(ChooseCommentMoreModal);