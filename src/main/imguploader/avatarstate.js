import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import { AnyText } from '../../components/home/helperprefernce';
import { RenderBodyModal } from '../../components/home/sliderroom/helperroomcss';
import { OuterItemModal } from '../../components/posts/createpost/helpercreatepostcss';
import { FriendsSvg, PublickSvg, LockSvg } from '../../icons/all';
import Actions from '../../reducer/actions';
import { pixel } from '../../styles/basecss';
////////////////////////////////////////////
const ChooseAvatarStateModal = () => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeOutside = useSelector(state => state.modal.modalizeOutside);
    ////////////////////////////////////////
    const setAvatarState = useCallback((state) => {
        dispatch(Actions.type("setAvatarState", state));
        modalizeOutside.close();
    }, [modalizeOutside]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterItemModal isRTL={isRTL} noMargin
            onPress={() => setAvatarState(0)}>
            <LockSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(13)}
                autoMargin={pixel(7)} color="clr2">
                {badges.justMe}
            </AnyText>
        </OuterItemModal>

        <OuterItemModal isRTL={isRTL}
            onPress={() => setAvatarState(1)}>
            <PublickSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(13)}
                autoMargin={pixel(7)} color="clr2">
                {badges.public}
            </AnyText>
        </OuterItemModal>

        <OuterItemModal isRTL={isRTL}
            onPress={() => setPostState(2)}>
            <FriendsSvg color="clr2" size={moderateScale(18)} />
            <AnyText isRTL={isRTL} size={moderateScale(13)}
                autoMargin={pixel(7)} color="clr2">
                {badges.friends}
            </AnyText>
        </OuterItemModal>
    </RenderBodyModal>)
}

export default memo(ChooseAvatarStateModal)
