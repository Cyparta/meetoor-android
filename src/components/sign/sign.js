import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import { colors, flexDisplay, pixel, Rgba } from '../../styles/basecss';
import { MinLogoSvg, MainLogoSvg } from "../../icons/logo";
import { BackSvg, LanguageSvg } from '../../icons/all';
import Actions from "../../reducer/actions";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import useGoBack from "../../main/goback";
import { moderateScale } from "react-native-size-matters";
////////////////////////////////////////////////
const MeetoorForm = styled.View`
    width: 100%;
    height: 100%;
    position: relative;
    background: ${colors["back1"]};
    ${flexDisplay};
    ${(props) => {
        let style = "";
        if (props.isRTL) style += `
        `
        if (props.isDrak) style += `
            background-color: ${colors["clr2"]};
        `
        return style;
    }}
`;
////////////////////////////////////////////////
const FormSign = styled.View`
    width: 100%;
    height: 100%;
    position: relative;
    ${flexDisplay};
    flex-direction: column;
    align-items: flex-start;
`;
////////////////////////////////////////////////
const BackLogo = styled(FormSign)`
    position: absolute;
    z-index: 0;
    align-items: center;
    transform: rotate(-20deg) scale(2);
    opacity: 0.025;
`;
////////////////////////////////////////////////
const ScrollBar = styled.ScrollView`
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 0 ${pixel(14)};
`;
/////////////////////////////////////////////////
const MeetoorLogo = styled.View`
    width: 100%;
    padding: ${pixel(14)};
    ${(props) => flexDisplay({
    justify: "space-between",
    dir: props.isRTL ? "row-reverse" : "row"
})};
`;
////////////////////////////////////////////////
const OuterButtons = styled.View`
    ${(props) => flexDisplay({
    justify: "space-between",
    dir: props.isRTL ? "row-reverse" : "row"
})};
`;
////////////////////////////////////////////////
const ButtonLink = styled.TouchableOpacity`
    ${flexDisplay};
    margin: ${pixel(14)} 0;
`;
/////////////////////////////////////////////////
const ButtonBack = styled(ButtonLink)`
    width: ${pixel(30)};
    height: ${pixel(30)};
    background: ${colors["back3"]};
    padding: ${pixel(4)};
    border-radius: ${pixel(4)};
    border-width: ${pixel(1)};
    border-color : ${() => Rgba(colors["clr1"], 0.1)};
`;
/////////////////////////////////////////////////
const ButtonLang = styled(ButtonBack)`
    background: ${colors["clr2"]};
    margin: 0 ${pixel(14)};
    border-width: 0px;
`;
/////////////////////////////////////////////////
const MainSignRouter = ({ children }) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDrak = useSelector(state => state.sign.isDrak);
    const handleBack = useGoBack();
    /////////////////////////////////////////////
    return (<MeetoorForm isDrak={isDrak} isRTL={isRTL}>
        <FormSign>
            <BackLogo>
                <MinLogoSvg forceColor="clr1" size={moderateScale(280)} />
            </BackLogo>

            <MeetoorLogo isRTL={isRTL}>
                <ButtonLink activeOpacity={1}>
                    <MainLogoSvg forceColor="clr1" />
                </ButtonLink>

                <OuterButtons isRTL={isRTL}>
                    <ButtonLang onPress={() => dispatch(Actions.type("setCurrentModalOutside", { key: "language" }))}>
                        <LanguageSvg color="back3" />
                    </ButtonLang>
                    <ButtonBack onPress={() => handleBack()}>
                        <BackSvg color="clr1" />
                    </ButtonBack>
                </OuterButtons>
            </MeetoorLogo>
            <ScrollBar keyboardShouldPersistTaps='handled'>
                {children}
                <KeyboardSpacer />
            </ScrollBar>
        </FormSign>
        {/* <KeyboardSpacer /> */}
    </MeetoorForm>);
}

export default memo(MainSignRouter);