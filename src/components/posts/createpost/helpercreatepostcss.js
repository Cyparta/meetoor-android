import styled, { css } from 'styled-components';
import { MentionInput } from 'react-native-controlled-mentions';
import {
    colors, flexDisplay, fontLit,
    GetColorToBacks, GetColorToStatus,
    pixel, Rgba
} from '../../../styles/basecss';
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: auto;
    border-radius: 10px;
    position: relative;
    ${flexDisplay}
    border-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr1"], 0.1)};
    background:  ${colors["back3"]};
    overflow: hidden;
`;
//////////////////////////////////////////////////
export const OuterItemColumnModal = styled.TouchableOpacity`
    ${OuterSharedCss}
    width: 100%;
    height: auto;
    margin: auto;
    margin-top: ${props => props.noMargin ? "0" : pixel(8)};
    padding: ${pixel(6)};
    ${() => flexDisplay({
    dir: "column",
    justify: "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterItemRowModal = styled.View`
    width: 100%;
    height: auto;
    margin: auto;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterItemModal = styled.TouchableOpacity`
    ${OuterSharedCss}
    width: 100%;
    height: ${pixel(45)};
    margin: auto;
    margin-top: ${props => props.noMargin ? "0" : pixel(6)};
    padding: 0 ${pixel(14)};
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const TopNavigateOuter = styled.View`
    width: 100%;
    height: ${pixel(55)};
    min-height: ${pixel(55)};
    padding: ${pixel(6)};
    position: relative;
    ${() => flexDisplay({ justify: "space-between" })}
    border-bottom-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr1"], 0.1)};
    background: ${(props) => colors[props.isDark ? "clr3" : "back3"]};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterControlPostSticky = styled.View`
    width: 100%;
    height: ${pixel(45)};
    min-height: ${pixel(45)};
    padding: ${pixel(6)};
    border-radius: ${pixel(30)};
    margin: ${pixel(4)} auto;
    ${() => flexDisplay({ justify: "space-evenly" })}
    background: ${colors["clr2"]};
`;
//////////////////////////////////////////////////
export const ButtonPostCTR = styled.TouchableOpacity`
    width: auto;
    min-width: ${pixel(30)};
    height: ${pixel(30)};
    margin: 0 ${pixel(4)};
    padding: 0 ${pixel(8)};
    border-radius: ${pixel(20)};
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
})}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterOneViewerCTR = styled.View`
    width: auto;
    height: auto;
    padding: ${pixel(2)};
    ${flexDisplay}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    border-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr2"], 0.1)};
    border-radius: ${pixel(5)};
`;
//////////////////////////////////////////////////
export const OuterBackgrounds = styled.View`
    width: 100%;
    height: auto;
    ${() => flexDisplay({
    dir: "column",
    justify: "space-evenly",
    align: "flex-start"
})}
    align-content: flex-start;
    flex-flow: row wrap;
`;
//////////////////////////////////////////////////
export const OuterOneBackground = styled.TouchableOpacity`
    width: auto;
    height: auto;
    overflow: hidden;
    border-radius: 15px;
    margin: ${pixel(4)} 0;
    border-width: ${pixel(1)};
    background: ${colors["clr1"]};
    border-color: ${() => Rgba(colors["clr2"], 0.1)};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const TextAreaInput = styled.TextInput`
    width: 100%;
    height: auto;
    overflow: hidden;
    z-index: 1;
    padding: ${pixel(8)};
    background: transparent;
    color: ${(props) => props.isDark ? colors["back1"] : colors["clr1"]};
    ${(props) => fontLit({
    size: props.size ? props.size : pixel(15),
    line: props.line ? props.line : pixel(24),
    isAr: true,
    align: props.align ? props.align : "auto"
})};
    ${props => props.colorBacks !== undefined ? `color: ${GetColorToBacks(props.colorBacks)};` : null}
    ${props => props.colorStatus !== undefined ? `color: ${GetColorToStatus(props.colorStatus)};` : null}
`;
//////////////////////////////////////////////////
export const TextAreaEditor = styled(MentionInput)`
    width: ${props => props?.width || "100%"};
    height: ${props => props?.height || "auto"};
    overflow: hidden;
    z-index: 1;
    padding: ${pixel(8)};
    color: ${(props) => props.isDark ? colors["back1"] : colors["clr1"]};
    ${(props) => fontLit({
    size: props.size ? props.size : pixel(15),
    line: props.line ? props.line : pixel(24),
    isAr: true,
    align: props.align ? props.align : "auto"
})};
    ${props => props.colorBacks !== undefined ? `color: ${GetColorToBacks(props.colorBacks)};` : null}
    ${props => props.colorStatus !== undefined ? `color: ${GetColorToStatus(props.colorStatus)};` : null}
    ${props => props.css || null}
`;