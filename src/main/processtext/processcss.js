import { moderateScale } from 'react-native-size-matters';
import styled from 'styled-components';
// import * as Animatable from 'react-native-animatable';
import { flexDisplay, font, colors, Rgba, pixel } from '../../styles/basecss';
//////////////////////////////////////////////////
export const CustomViewProcessBig = styled.View`
    width: ${props => props.width || "100%"};
    ${(props) => flexDisplay({
    justify: props.center ? "center" : props.isRTL ? "flex-end" : "flex-start"
})}
    margin: ${pixel(2)} 0;
    ${props => props.isPadding ? `padding: ${pixel(4)} ${pixel(20)};` : null}
`;
//////////////////////////////////////////////////
export const CustomViewProcess = styled.View`
    width: auto;
    margin: 0 ${pixel(4)};
    ${(props) => flexDisplay({ dir: props.isRTL ? "row-reverse" : "row", justify: "flex-start" })}
    min-height: ${pixel(20)};
    ${(props) => {
        let style = ``
        if (props.ops) style += `
            opacity: 0.5;
        `
        return style;
    }}
`;
//////////////////////////////////////////////////
export const LinkOuterUrl = styled.View`
    width: auto;
    margin: 0 ${pixel(4)};
    position: relative;
    ${flexDisplay}
`;
//////////////////////////////////////////////////
export const LinkInnerUrl = styled.TouchableOpacity`
    width: auto;
    position: relative;
    top: 10px;
    ${flexDisplay}
    background: ${colors['clr2']};
    padding: ${pixel(4)};
    border-radius: ${pixel(4)};
`;
//////////////////////////////////////////////////
export const CustomTextProcess = styled.Text`
    margin: 0 ${pixel(4)};
    ${(props) => font({ size: (props.size || moderateScale(12)) + "px", line: pixel(20), isAr: props.isRTL })};
    color: ${props => colors[props.color || "clr2"]};
    ${(props) => {
        let style = ``
        if (props.small) style += `
            font-size: ${pixel(12)};
            color: ${Rgba(colors["back3"], 0.6)};
        `
        return style;
    }}
`;