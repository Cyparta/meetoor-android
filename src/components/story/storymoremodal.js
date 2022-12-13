import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CopySvg, ShareSvg } from '../../icons/all';
import { copyToClipboard, shareTo } from '../../reducer/helper';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../styles/basecss';
import { RenderBodyModal } from '../home/sliderroom/helperroomcss';
import { AnyText } from '../home/helperprefernce';
import { OuterItemColumnModal, OuterItemRowModal } from '../posts/createpost/helpercreatepostcss';
////////////////////////////////////////////
const ChooseStoryMoreModal = ({ username }) => {
    const dispatch = useDispatch();
    const { messages, popmoreData } = useSelector(state => state.sign.langData);
    const { copylink, shareWithOther } = popmoreData;
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const onCopyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home/story/?id=${username}`, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, username, messages]);
    ////////////////////////////////////////////
    const shareWithOtherApps = useCallback(() => {
        shareTo(`https://meetoor.com/home/story/?id=${username}`, messages.copied, dispatch);
        modalizeWithNav.close();
    }, [modalizeWithNav, username, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
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

export default memo(ChooseStoryMoreModal);