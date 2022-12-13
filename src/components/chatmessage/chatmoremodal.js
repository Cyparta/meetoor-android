import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { DeleteSvg } from '../../icons/all';
import Axios from '../../main/Axios';
import { pixel } from '../../styles/basecss';
import { AnyText } from '../home/helperprefernce';
import { RenderBodyModal } from '../home/sliderroom/helperroomcss';
import { OuterItemColumnModal, OuterItemRowModal } from '../posts/createpost/helpercreatepostcss';
////////////////////////////////////////////
const ChatMoreModal = ({ username, callbackDelete }) => {
    // const dispatch = useDispatch();
    const { popmoreData } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const deleteChat = useCallback(async () => {
        try {
            const response = await Axios.post(`onDeleteChat/`,
                { username }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.data.delete) {
                callbackDelete && callbackDelete();
            }
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
        modalizeWithNav.close();
    }, [modalizeWithNav, callbackDelete, username]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterItemColumnModal noMargin onPress={deleteChat}>
            <OuterItemRowModal isRTL={isRTL}>
                <DeleteSvg />
                <AnyText isRTL={isRTL} size={moderateScale(15)} autoMargin={pixel(8)} color="clr1">
                    {popmoreData.delchat.head}
                </AnyText>
            </OuterItemRowModal>
            <OuterItemRowModal isRTL={isRTL}>
                <AnyText isRTL={isRTL} size={moderateScale(15)} autoMargin={pixel(8)} color="red2">
                    {popmoreData.delchat.sub}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
    </RenderBodyModal>)
}

export default memo(ChatMoreModal);