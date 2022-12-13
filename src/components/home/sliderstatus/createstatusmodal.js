import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RenderBodyModal, TopModalOuter, UserInfoModal } from '../sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../helperhome';
import { AnyText, OuterUserName } from '../helperprefernce';
import { CamSvg, EditPenSvg, PhotoSvg } from '../../../icons/all';
import { OuterItemModal } from '../../posts/createpost/helpercreatepostcss';
import { pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const CreateStatusModal = () => {
    const { placeholder, badges } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const GoToPage = useCallback(({ isMedia, openType }) => {
        navigate("createstatus", { isMedia, openType });
        modalizeWithNav.close();
    }, [navigate, modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <TopModalOuter>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} color="clr2">{User.fullName}</AnyText>
                    <AnyText isRTL={isRTL} color="clr1" lower target lineH={pixel(16)}>
                        {badges.addStatus}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
        </TopModalOuter>

        <OuterItemModal isRTL={isRTL}
            onPress={() => GoToPage({ isMedia: false })}>
            <EditPenSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(14)}
                autoMargin={pixel(8)} color="clr2">
                {placeholder.addText}
            </AnyText>
        </OuterItemModal>

        <OuterItemModal isRTL={isRTL}
            onPress={() => GoToPage({ isMedia: true, openType: "Photos" })}>
            <PhotoSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(14)}
                autoMargin={pixel(8)} color="clr2">
                {placeholder.addImg}
            </AnyText>
        </OuterItemModal>

        <OuterItemModal isRTL={isRTL}
            onPress={() => GoToPage({ isMedia: true, openType: "Videos" })}>
            <CamSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(14)}
                autoMargin={pixel(8)} color="clr2">
                {placeholder.addVideo}
            </AnyText>
        </OuterItemModal>

    </RenderBodyModal>)
}

export default memo(CreateStatusModal)
