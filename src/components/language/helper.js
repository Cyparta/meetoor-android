
import React from 'react';
import { DotIndicator } from 'react-native-indicators';
import { moderateScale } from 'react-native-size-matters';
import styled from 'styled-components';
import { colors, flexDisplay, font, pixel, Rgba } from '../../styles/basecss';
////////////////////////////////////////////////
export const MeetoorLang = styled.View`
    width: 100%;
    position: relative;
    border-radius: ${pixel(4)};
    ${() => flexDisplay({ dir: "column" })};
`;
export const MeetoorAccounts = styled(MeetoorLang)`
    background: transparent;
    padding: 0;
`;
// content start //
export const MeetoorOuterLangs = styled.View`
    width: 100%;
    height: auto;
    ${() => flexDisplay({ dir: "column", align: "flex-start" })};
    flex-wrap: wrap;
    flex-flow: column wrap;
`;
const ButtonLang = styled.TouchableOpacity`
    width: 100%;
    height: ${pixel(40)};
    border-radius: ${pixel(4)};
    ${flexDisplay};
    background: ${colors["back3"]};
    color: ${colors["clr1"]};
    padding: ${pixel(6)};
    margin-bottom: ${(props) => pixel(props.margin)};
    border-width: ${pixel(1)};
    border-color : ${() => Rgba(colors["clr1"], 0.1)};
    ${(props) => props.active ? `
        background: ${colors["clr2"]};
        border-width: 0px;
    ` : null};
`;
export const TextLang = styled.Text`
    ${(props) => font({ size: pixel(14), isAr: props.isRTL })};
    color: ${colors["clr1"]};
    ${(props) => props.active ? `
        color: ${colors["back3"]};
    ` : null};
    margin-bottom: 0px;
`;
//////////////////////////////////////////////
export const BuildLangComponnet = ({ nameLang,
    keyLang, current, setSelected, loaded, isLast }) => {
    console.log("🚀 ~ file: helper.js ~ line 53 ~ isLast", isLast)
    ///////////////////////////////////////////
    return (<ButtonLang active={current === keyLang}
        onPress={() => setSelected(keyLang)} margin={isLast ? 0 : 6}>
        {(loaded && current === keyLang) ?
            <DotIndicator size={moderateScale(5)} count={7}
                color={colors[current === keyLang ? "back3" : "clr2"]} /> :
            <TextLang active={current === keyLang}>{nameLang}</TextLang>}
    </ButtonLang>)
}