import styled, { css } from 'styled-components';
import * as Animatable from 'react-native-animatable';
import {
    ChangeColor, colors,
    flexDisplay, font, pixel
} from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: 100%;
    height: auto;
    margin: ${pixel(8)} 0px;
    padding: 0px ${pixel(8)};
    border-radius: ${pixel(5)};
    position: relative;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
`;
//////////////////////////////////////////////////
export const OuterOneView = styled.TouchableOpacity`
   ${OuterSharedCss}
   background: ${props => props.draker ?
        ChangeColor(colors[props.back || "back3"], -10) :
        props.back ? colors[props.back] : "transparent"};
   ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterOneImg = styled.View`
    width: ${(props) => props.size || moderateScale(45)}px;
    height: ${(props) => props.size || moderateScale(45)}px;
    border-radius: ${pixel(25)};
    padding: ${pixel(2)};
    position: relative;
    ${flexDisplay}
    border-width: ${pixel(1)};
    border-color: ${colors["clr2"]};
`;
//////////////////////////////////////////////////
export const OuterOneContent = styled.View`
    width: ${(props) => props.width || "auto"};
    height: auto;
    border-radius: ${pixel(25)};
    padding: 0 ${pixel(8)};
    position: relative;
    ${(props) => flexDisplay({
    dir: "column",
    align: props.isRTL ? "flex-end" : "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterNameContent = styled.View`
    width: ${(props) => props.width || "auto"};
    height: auto;
    position: relative;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterMessageContent = styled.View`
    width: ${(props) => props.width || "auto"};
    height: auto; position: relative;
    margin: ${pixel(2.5)} 0;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${(props) => {
        let style = ``;
        if (props.call !== undefined) style += `
            border-radius: ${pixel(5)};
            padding: ${pixel(2)} ${pixel(4)};
            background: ${colors[props.call ? "clr2" : "red2"]};
        `
        return style;
    }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterOneType = styled.View`
    width: ${pixel(25)};
    height: ${pixel(25)};
    border-radius: ${pixel(20)};
    padding: ${pixel(4)};
    position: absolute;
    ${flexDisplay}
    bottom: ${pixel(-8)};
    background: ${colors["clr1"]};
    ${(props) => props.isRTL ? "right: 0px;" : "left: 0px;"}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterOneBadges = styled(Animatable.View)`
    width: ${pixel(32)};
    height: ${pixel(21)};
    border-radius: ${pixel(5)};
    position: absolute;
    ${flexDisplay}
    padding: 0 ${pixel(2)};
    text-transform: uppercase;
    top: 40%;
    background: ${colors["back1"]};
    left: ${pixel(-100)};
    ${(props) => {
        let style = ``;
        if (!props.isRead) style += `
            left: ${props.width - moderateScale(40)}px;
        `
        if (!props.isDark) style += `
            background: ${colors[props.isDark ? "back1" : "clr1"]};
        `
        return style;
    }}
`;
//////////////////////////////////////////////////
export const FriendBlock = styled.View`
    padding: ${pixel(2)};
    position: relative;
    ${flexDisplay}
    justify-content: flex-start;
    padding: ${pixel(5)} 0;
`;
//////////////////////////////////////////////////
export const OuterOneButton = styled.TouchableOpacity`
    background: ${colors["back3"]};
    padding: 0 ${pixel(12)};
    height: ${pixel(32)};
    margin: 0 ${pixel(4)};
    width: auto;
    border-radius: ${pixel(5)};
    ${flexDisplay}
    ${(props) => {
        let style = ``
        if (props.acc) style += `
        background: ${colors["clr2"]};
        `
        if (props.dis) style += `
        background: ${colors["back3"]};
        `
        if (props.visit) style += `
        background: ${colors["back1"]};
        `
        if (props.isRTL) style += `
        flex-direction: ${props.isRTL ? "row-reverse" : "row"};
        `
        return style;
    }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const ReplyToMessage = styled(OuterOneButton)`
    padding: ${pixel(3)};
    height: auto;
`;
//////////////////////////////////////////////////
export const ButtonText = styled.Text`
    width: auto;
    height: auto;
    position: relative;
    ${flexDisplay};
    ${(props) => font({ size: "15px", line: "25px", isAr: props.isRTL })};
    text-transform: uppercase;
    color: ${colors["clr1"]};
    ${(props) => {
        let style = ``;
        if (props.acc) style += `
        color: ${colors["back1"]};
        `
        if (props.dis) style += `
        color: ${colors["red2"]};
        `
        return style;
    }}
`;