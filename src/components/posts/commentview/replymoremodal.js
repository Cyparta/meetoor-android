import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { AnyText } from '../../home/helperprefernce';
import { OuterItemColumnModal, OuterItemRowModal } from '../createpost/helpercreatepostcss';
import { CopySvg, DeleteSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { ToastAndroid } from 'react-native';
import { copyToClipboard } from '../../../reducer/helper';
import { pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const ChooseReplyMoreModal = ({
    isMe = true,
    commentid,
    postId,
    keyArray,
    replayid }) => {
    const dispatch = useDispatch();
    const { messages, popmoreData } = useSelector(state => state.sign.langData);
    const { delComment, copylink } = popmoreData;
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const onRemovePost = useCallback(() => {
        mainSocket.emit("onRemoveReplay", {
            replayid
        });
        //////////////////////////////////////
        dispatch(Actions.type("setReplys", {
            type: 'deleteOne',
            data: {
                keyArray,
                target: replayid,
                key: "replayid",
            }
        }));
        ToastAndroid.show(messages.deleted, ToastAndroid.LONG);
        modalizeWithNav.close();
    }, [modalizeWithNav, replayid, keyArray]);
    ////////////////////////////////////////
    const onCopyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home#commentview_id=${postId}_idComment=${commentid}_go=${replayid}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, postId, commentid, replayid, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {isMe ?
            <OuterItemColumnModal onPress={onRemovePost}>
                <OuterItemRowModal isRTL={isRTL}>
                    <DeleteSvg size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="clr1">
                        {delComment.head}
                    </AnyText>
                </OuterItemRowModal>
                <OuterItemRowModal isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(11)} lineH={pixel(12)} autoMargin={pixel(6)} color="red2">
                        {delComment.sub}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal> : null}

        <OuterItemColumnModal noMargin={(!isMe)} onPress={onCopyLink}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {copylink}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
    </RenderBodyModal>)
}

export default memo(ChooseReplyMoreModal);