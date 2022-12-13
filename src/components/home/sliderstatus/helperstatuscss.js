import styled, { css } from 'styled-components';
import { colors, flexDisplay, pixel } from '../../../styles/basecss';
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: auto;
    border-radius: ${pixel(7)};
    position: relative;
    margin: 0 ${pixel(8)};
    ${() => flexDisplay({ dir: "column", justify: "flex-start" })}
    overflow: hidden;
`;
// border-width: ${pixel(1)};
// border-color: ${(props) => Rgba(colors[props.isDark ? "clr2" : "clr1"], props.isDark ? 0.3 : 0.12)};
// margin-right: ${pixel(3)};
//////////////////////////////////////////////////
export const StatusContentOuter = styled.TouchableOpacity`
    ${OuterSharedCss}
    max-width: ${(props) => props.width};
    min-width: ${(props) => props.width};
    height: ${(props) => props.height};
    ${(props) => props.css ? props.css : null};
`;
//////////////////////////////////////////////////
export const StatusContentWithoutTouch = styled.View`
    ${OuterSharedCss}
    max-width: ${(props) => props.width};
    min-width: ${(props) => props.width};
    height: ${(props) => props.height};
    ${(props) => props.css ? props.css : null};
`;
//////////////////////////////////////////////////
export const StatusFitImageOuter = styled.View`
    width: 100%;
    height: 100%;
    position: relative;
    ${flexDisplay}
    background: ${(props) => props.back ? colors[props.back] : "transparent"};
    ${(props) => {
        let style = ``
        if (props.isRTL) style += `
            justify-content: ${props.isRTL ? "flex-end" : "flex-start"};
        `
        return style;
    }};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const StatusHeaderOuter = styled.View`
    width: 100%;
    height: ${(props) => pixel(props.height || 40)};
    position: absolute;
    left: 0;
    bottom: 0;
    ${() => flexDisplay({ justify: "space-between" })};
    ${props => props.css || null}
`;
