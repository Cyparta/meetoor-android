import styled from 'styled-components';
import { colors, flexDisplay, Rgba, pixel } from '../../../styles/basecss';
//////////////////////////////////////////////////
export const OuterViewerStatusEditor = styled.View`
    width: ${pixel(300)};
    height: ${pixel(600)};
    ${flexDisplay}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    border-width: 1px;
    border-color: ${() => Rgba(colors["clr2"], 0.1)};
    border-radius: 5px;
    margin: auto;
    overflow: hidden;
`;
//////////////////////////////////////////////////
export const OuterFitImage = styled.View`
    width: 100%;
    height: auto;
    overflow: hidden;
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterFitImageTouch = styled.TouchableOpacity`
    width: 100%;
    height: auto;
    overflow: hidden;
    ${flexDisplay}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    ${props => props.css || null}
`;