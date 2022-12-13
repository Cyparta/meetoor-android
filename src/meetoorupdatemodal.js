import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
import { css } from 'styled-components';
import { AnyText } from './components/home/helperprefernce';
import { ButtonNormal, RenderBodyModal, TopModalOuter } from './components/home/sliderroom/helperroomcss';
import { MainLogoSvg } from './icons/logo';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from './styles/basecss';
import { downloadFile } from './main/downloadfile';
////////////////////////////////////////////
const UpdateMeetoorModal = ({ info }) => {
    console.log("UpdateMeetoorModal ~ info", info)
    const { buttons, messages, badges } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const HandlePress = useCallback((action) => {
        action && Linking.openURL("https://play.google.com/store/apps/details?id=com.meetoor");
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <TopModalOuter>
            <AnyText isRTL={isRTL} color="clr1"
                lower align="center"
                style={{ width: "100%" }}>
                {messages.updateApp}
            </AnyText>
        </TopModalOuter>
        <TopModalOuter borderBotWidth="0px"
            css={css`width: 100%;padding: 0 ${pixel(3)};height: auto;`}>
            <AnyText isRTL={isRTL} size={moderateScale(14)} lower
                lineH={pixel(20)} color="clr2" width="100%">
                {info}
            </AnyText>
        </TopModalOuter>
        <MainLogoSvg forceColor="clr1"
            width={moderateScale(260)}
            height={moderateScale(80)} />
        <TopModalOuter isRTL={isRTL}
            borderBotWidth="0px"
            css={css`margin-top: ${pixel(15)};padding-bottom: 0px;
                justify-content: space-around;`}>
            <ButtonNormal radius={pixel(4)} back="clr2"
                onPress={() => HandlePress(true)}>
                <AnyText isRTL={isRTL} color="back3" lineH={pixel(18)}
                    lower align="center" size={moderateScale(14)}>
                    {badges.update}
                </AnyText>
            </ButtonNormal>
            <ButtonNormal radius="5px" close
                onPress={() => HandlePress(false)}>
                <AnyText isRTL={isRTL} color="red2" lineH={pixel(18)}
                    lower align="center" size={moderateScale(14)}>
                    {buttons.close}
                </AnyText>
            </ButtonNormal>
        </TopModalOuter>
        <TopModalOuter borderBotWidth="0px"
            css={css`width: 100%;margin-top: ${pixel(10)};
                padding: 0 ${pixel(3)};height: auto;`}>
            <AnyText isRTL={isRTL} color="clr1"
                lower align="center" style={{ width: "100%" }}>
                {messages.notGoogle}
            </AnyText>
        </TopModalOuter>
        <TopModalOuter isRTL={isRTL} borderBotWidth="0px"
            css={css`padding-bottom: 0px;justify-content: space-around;`}>
            <ButtonNormal radius={pixel(4)} back="clr2"
                onPress={() => downloadFile("https://cdn.meetoor.com/media/media/Apps/meetoor.apk")}>
                <AnyText isRTL={isRTL} color="back3" lineH={pixel(18)}
                    lower align="center" size={moderateScale(14)}>
                    {buttons.pressHere}
                </AnyText>
            </ButtonNormal>
        </TopModalOuter>
    </RenderBodyModal>)
}

export default memo(UpdateMeetoorModal)
