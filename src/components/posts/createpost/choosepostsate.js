import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { AnyText } from '../../home/helperprefernce';
import { OuterItemModal } from './helpercreatepostcss';
import { FriendsSvg, PublickSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../../styles/basecss';
////////////////////////////////////////////
const ChoosePostSatetModal = () => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const setPostState = useCallback((state) => {
        dispatch(Actions.type("setPostState", state));
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterItemModal isRTL={isRTL} noMargin
            onPress={() => setPostState(1)}>
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

export default memo(ChoosePostSatetModal)
