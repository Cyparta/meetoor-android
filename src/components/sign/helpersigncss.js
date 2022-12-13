import styled from 'styled-components';
import { colors, flexDisplay, font, fontLit, pixel } from '../../styles/basecss';
/////////////////////////////////////////////////
export const Label = styled.Text`
    ${() => flexDisplay({ justify: "flex-start" })};
    ${(props) => font({ size: pixel(18), line: pixel(25), isAr: props.isRTL })};
    text-transform: capitalize;
    color: ${colors["clr1"]};
    margin: ${pixel(14)} 0px ${pixel(28)};
    ${(props) => {
        if (props.button) return `
            ${fontLit({ size: pixel(18), line: pixel(25), isAr: props.isRTL })};
            color: ${colors["back1"]};
            margin: auto;
        `
    }};
    ${(props) => {
        if (props.small) return `
            font-size: ${pixel(16)};
            color: ${colors["clr2"]};
        `
    }};
`;
/////////////////////////////////////////////////
export const SignUpSubmit = styled.TouchableOpacity`
    width: 100%;
    height: ${pixel(46)};
    max-width: ${pixel(270)};
    border-radius: 10px;
    background: ${colors["clr1"]};
    margin: auto;
   ${flexDisplay};
    text-transform: capitalize;
    margin-top: ${pixel(14)};
    overflow: hidden;
`;
/////////////////////////////////////////////////
export const SignRoute = styled.Text`
    ${(props) => fontLit({ size: pixel(12), line: pixel(24), isAr: props.isRTL })};
    text-transform: capitalize;
    color: ${colors["clr1"]};
    margin: auto;
    margin-top: ${pixel(14)};
    margin-bottom: ${pixel(14)};
`;
/////////////////////////////////////////////////
export const LinkToSign = styled.Text`
    ${(props) => font({ size: pixel(13), line: pixel(20), isAr: props.isRTL })};
    color: ${(props) => props.color ? colors[props.color] : colors["clr1"]};
    text-decoration: underline;
`;
////////////////////////////////////////////////
export const OverOuterSwitch =  styled.View`
    width: 100%;
    position: relative;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "space-evenly",
})};
    margin-top: ${pixel(14)};
    margin-bottom: ${pixel(14)};
    flex: 1;
`;
