import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { AnyText } from '../components/home/helperprefernce';
import { ButtonCirculer, RenderBodyModal, TopModalOuter } from '../components/home/sliderroom/helperroomcss';
////////////////////////////////////////////
const AlertMeetoorModal = ({ YesFunc, NoFunc }) => {
    const { buttons, messages } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const HandlePress = useCallback((callback) => {
        callback && callback();
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <TopModalOuter>
            <AnyText isRTL={isRTL} color="clr1"
                lower align="center"
                style={{ width: "100%" }}>
                {messages.sure}
            </AnyText>
        </TopModalOuter>

        <TopModalOuter isRTL={isRTL} borderBotWidth="0px"
            style={{ marginTop: moderateScale(6), paddingBottom: 0 }}>
            <ButtonCirculer onPress={() => HandlePress(YesFunc)}>
                <AnyText isRTL={isRTL} color="clr2"
                    lower align="center" size={moderateScale(14)}>
                    {buttons.yes}
                </AnyText>
            </ButtonCirculer>
            <ButtonCirculer close onPress={() => HandlePress(NoFunc)}>
                <AnyText isRTL={isRTL} color="red2"
                    lower align="center" size={moderateScale(14)}>
                    {buttons.no}
                </AnyText>
            </ButtonCirculer>
        </TopModalOuter>

    </RenderBodyModal>)
}

export default memo(AlertMeetoorModal)
