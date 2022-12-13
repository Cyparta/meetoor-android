import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { BlockSvg, CopySvg, DeleteSvg } from '../../../icons/all';
import { copyToClipboard } from '../../../reducer/helper';
import { pixel } from '../../../styles/basecss';
import { AnyText } from '../../home/helperprefernce';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { OuterItemColumnModal, OuterItemRowModal } from '../../posts/createpost/helpercreatepostcss';
////////////////////////////////////////////
const ChooseProfileMoreModal = ({ username, isFriend, isMe = false }) => {
    const { popmoreData, messages } = useSelector(state => state.sign.langData);
    const { blockUser, deleteUser, profileLinks } = popmoreData;
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const onDeleteUser = useCallback(() => {
        mainSocket.emit("removeFriend", { username });
        modalizeWithNav.close();
    }, [modalizeWithNav, username]);
    ////////////////////////////////////////
    const onBlockUser = useCallback(() => {
        mainSocket.emit("onBlockUser", { username });
        modalizeWithNav.close();
    }, [modalizeWithNav, username]);
    ///////////////////////////////////////
    const onCopyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home/profile/?p=${username}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, username, messages]);
    ///////////////////////////////////////
    const onCopyLinkAnony = useCallback(() => {
        copyToClipboard(`https://meetoor.com/writeanonychat/?p=${username}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, username, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {isMe ? null : <>
            {isFriend ? <OuterItemColumnModal
                noMargin onPress={onDeleteUser}>
                <OuterItemRowModal isRTL={isRTL}>
                    <DeleteSvg color="red2" size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="red2">
                        {deleteUser}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal> : null}
            <OuterItemColumnModal noMargin={!isFriend} onPress={onBlockUser}>
                <OuterItemRowModal isRTL={isRTL}>
                    <BlockSvg color="red2" size={moderateScale(18)} />
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        autoMargin={pixel(6)} color="red2">
                        {blockUser}
                    </AnyText>
                </OuterItemRowModal>
            </OuterItemColumnModal>
        </>}
        <OuterItemColumnModal noMargin={!isMe} onPress={onCopyLink}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {profileLinks.profile}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
        {isMe ? <OuterItemColumnModal onPress={onCopyLinkAnony}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {profileLinks.anonychat}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal> : null}
    </RenderBodyModal>)
}

export default memo(ChooseProfileMoreModal);