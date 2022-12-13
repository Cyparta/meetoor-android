import { moderateScale } from 'react-native-size-matters';
import styled, { css } from 'styled-components';
import {
    colors, Rgba, flexDisplay, font,
    GetColorToStatus, GetColorToBacks, pixel
} from '../../styles/basecss';
//////////////////////////////////////////////////
export const ScrollBar = styled.ScrollView`
    width: 100%;
    height: ${props => props.height || "100%"};
    flex: 1;
    flex-direction: column;
    background: ${(props) => props.back ? props.back : colors["clr1"]};
    position: relative;
    ${(props) => {
        let style = ``
        if (props.isDark !== undefined) style += `
            background: ${colors[props.isDark ? "clr3" : "back3"]}
        `
        if (props.padd) style += `
            padding: ${props.padd}
        `
        return style;
    }}
    ${props => props.css || null}
`;
const sharedListCss = css`
    width: 100%;
    height: ${props => props.height ? (props.height + "px") : "100%"};
    flex: 1;
    flex-direction: column;
    background: ${(props) => props.back ? props.back : colors["clr1"]};
    position: relative;
    ${(props) => {
        let style = ``
        if (props.isDark !== undefined) style += `
            background: ${colors[props.isDark ? "clr3" : "back3"]}
        `
        if (props.padd) style += `
            padding: ${props.padd}
        `
        return style;
    }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const FlatScroll = styled.FlatList`
    ${sharedListCss}
`;
//////////////////////////////////////////////////
export const SectionScroll = styled.SectionList`
    ${sharedListCss}
`;
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: 100%;
    height: auto;
    margin: ${pixel(16)} 0px;
    padding: 0px ${pixel(16)};
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
`;
//////////////////////////////////////////////////
export const OuterProfileUser = styled.TouchableOpacity`
   ${OuterSharedCss}
   margin: ${pixel(8)} 0px;
   ${(props) => props.css || null}
`;
export const OuterGlobalUser = styled.View`
    ${OuterSharedCss}
    margin: 0px;
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterNameStatus = styled.View`
    padding: ${pixel(8)};
    width: ${(props) => parseInt(props.width - moderateScale(75))}px;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
`;
//////////////////////////////////////////////////
export const OuterUserName = styled.View`
    padding: ${pixel(8)};
    width: auto;
    ${(props) => flexDisplay({
    dir: "column",
    // align: "flex-start",
    align: props.isRTL ? "flex-end" : "flex-start"
})}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterUserStatus = styled.View`
    width: 100%;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
`;
//////////////////////////////////////////////////
export const CircleStatus = styled.View`
    width: ${pixel(8)};
    height: ${pixel(8)};
    ${flexDisplay}
    border-radius: ${pixel(5)};
    background: ${(props) => colors[props.color]};
    margin: 0 ${pixel(5)};
`;
/////////////////////////////////////////////////
export const AnyText = styled.Text`
    width: ${(props) => props.width || "auto"};
    height: auto;
    position: relative;
    ${(props) => props.noFlex ? null : flexDisplay({ justify: "flex-start" })};
    ${(props) => font({ size: (props.size || moderateScale(16)) + "px", line: pixel(25), isAr: props.isRTL || false })};
    text-transform: capitalize;
    color: ${colors["back3"]};
    ${(props) => {
        let style = ``
        if (props.small) style += `
            font-size: ${pixel(12)};
            line-height: ${pixel(18)};
            color: ${Rgba(colors["back3"], 0.6)};
        `
        if (props.target) style += `
            font-size: ${pixel(12)};
            line-height: ${pixel(18)};
            color: ${Rgba(colors["back1"], 0.9)};
        `
        if (props.lower) style += `
            text-transform: none;
        `
        if (props.autoMargin) style += `
            ${props.isRTL ? `margin-right: ${props.autoMargin}` : `margin-left: ${props.autoMargin}`}
        `
        if (props.color) style += `
            color: ${colors[props.color]};
        `
        if (props.dir) style += `
            color: ${colors["online"]};
            flex-direction: ${props.isRTL ? "row-reverse" : "row"};
        `
        if (props.align !== undefined) style += `
            text-align: ${props.align};
        `
        if (props.lineH !== undefined) style += `
            line-height: ${props.lineH};
        `
        if (props.colorStatus) style += `
            color: ${GetColorToStatus(props.colorStatus)};
        `
        if (props.colorPosts) style += `
            color: ${GetColorToBacks(props.colorPosts)};
        `
        return style;
    }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const PlaceholdView = styled.View`
    width: 100%;
    height: ${(props) => props.height || "auto"};
    ${flexDisplay}
    opacity: ${props => props.alpha || 0.35};
    ${props => props.css || null}
`;