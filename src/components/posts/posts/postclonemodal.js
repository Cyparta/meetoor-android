import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal } from '../../home/sliderroom/helperroomcss';
import { AnyText } from '../../home/helperprefernce';
import { OuterItemColumnModal, OuterItemRowModal } from '../createpost/helpercreatepostcss';
import { CopySvg, EditPenSvg } from '../../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../../styles/basecss';
import { ClonePostAsunc } from '../createpost/clonedpost';
import { css } from 'styled-components';
////////////////////////////////////////////
const ChoosePostCloneModal = ({ refId, keyArray, isCopy }) => {
    console.log("ChoosePostCloneModal ~ keyArray", keyArray)
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const onClonePostDirect = useCallback(() => {
        ClonePostAsunc({
            mainSocket,
            keyArray, refId,
            token, dispatch,
            copied: messages.copiedPost
        });
        modalizeWithNav.close();
    }, [navigate, modalizeWithNav, refId, keyArray, token, messages]);
    ////////////////////////////////////////
    const onClonePost = useCallback(() => {
        navigate("clonepost", { keyArray, refId });
        modalizeWithNav.close();
    }, [navigate, modalizeWithNav, refId, keyArray]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {isCopy ? <AnyText isRTL={isRTL} size={moderateScale(13)}
            css={css`margin-bottom: ${pixel(8)};`}
            autoMargin={pixel(6)} color="clr2">
            {messages.clonedBefore}
        </AnyText> : null}
        <OuterItemColumnModal noMargin onPress={onClonePostDirect}>
            <OuterItemRowModal isRTL={isRTL}>
                <CopySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {messages.cloneDirect}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>

        <OuterItemColumnModal onPress={onClonePost}>
            <OuterItemRowModal isRTL={isRTL}>
                <EditPenSvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)}
                    autoMargin={pixel(6)} color="clr1">
                    {messages.cloneWithText}
                </AnyText>
            </OuterItemRowModal>
        </OuterItemColumnModal>
    </RenderBodyModal>)
}

export default memo(ChoosePostCloneModal);