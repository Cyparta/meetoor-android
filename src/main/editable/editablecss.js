import styled, { css } from 'styled-components';
import * as Animatable from 'react-native-animatable';
import { MentionInput } from 'react-native-controlled-mentions';
import { colors, Rgba, flexDisplay, font, fontLit, pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: 100%;
    height: auto;
    position: relative;
    border-radius: ${pixel(24)};
    /* overflow: hidden; */
    ${() => flexDisplay({})}
    align-items: flex-end;
`;
//////////////////////////////////////////////////
export const OuterInputEditable = styled.View`
    ${OuterSharedCss}
    justify-content: flex-end;
    min-height: ${pixel(42)};
    border-width: ${pixel(2)};
    border-color: ${() => Rgba(colors["clr2"], 0.2)};
    padding: ${pixel(4)} 0;
    position: relative;
    border-radius: ${props => moderateScale(props.multi ? 5 : 24)}px;
    ${(props) => props.back ? `background: ${colors[props.back]}` : null};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterInputTextArea = styled(Animatable.View)`
    ${OuterSharedCss}
    justify-content: flex-end;
    /* width: 100%; */
    width: ${props => props.width};
    border-radius: ${props => moderateScale(props.multi ? 5 : 24)}px;
`;
//////////////////////////////////////////////////
export const OuterTextArea = styled.View`
    ${OuterSharedCss}
    padding: 0;
    width: 100%;
    background: ${(props) => props.isDark ? colors["clr3"] : colors["back3"]};
    border-radius: ${props => moderateScale(props.multi ? 5 : 24)}px;
    flex: 1;
`;
//////////////////////////////////////////////////
export const OuterOtherControl = styled.View`
    ${OuterSharedCss}
    padding: 0;
    width: auto;
    position: absolute;
    bottom: ${pixel(4)};
    left: ${pixel(2)};
    flex: 1;
`;
//////////////////////////////////////////////////
export const FiledInputEditable = styled(MentionInput)`
    width: 100%;
    height: ${(props) => props.height || "35px"};
    min-height: 35px;
    max-height: 120px;
    ${() => flexDisplay({ justify: "flex-start" })};
    ${() => fontLit({ size: pixel(13), line: pixel(20), isAr: true, align: "auto" })};
    z-index: 1;
    padding: ${pixel(6)};
    background: ${(props) => props.back ? colors[props.back] : "transparent"};
    color: ${(props) => props.isDark ? colors["back2"] : colors["clr3"]};
    ${(props) => props.align ? `align-items: ${props.align};` : null};
`;
//////////////////////////////////////////////////
export const OuterButtonIcon = styled.TouchableOpacity`
    width: ${(props) => props.size || pixel(30)};
    height: ${(props) => props.size || pixel(30)};
    min-width: ${(props) => props.size || pixel(30)};
    min-height: ${(props) => props.size || pixel(30)};
    border-radius: ${(props) => props.size ? (parseInt(parseInt(props.size) / 2) + "px") : pixel(16)};
    margin: 0 ${pixel(2)};
    ${flexDisplay}
    opacity: 1;
    ${(props) => props.back ? `background: ${props.isDark ? colors["clr3"] : colors["back3"]}` : null};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterBarRecord = styled.View`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    overflow: hidden;
    ${() => flexDisplay({ justify: "flex-start" })};
    background: ${colors["clr2"]};
    border-radius: ${pixel(20)};
    z-index: 2;
`;
//////////////////////////////////////////////////
const ButtonBarSharedCss = css`
    width: auto;
    height: ${pixel(26)};
    max-width: ${pixel(40)};
    color: ${colors["clr2"]};
    padding: 4px;
    ${() => font({ size: pixel(12), line: pixel(18), isAr: false, align: "center" })};
    border-radius: ${pixel(14)};
    background: ${colors["back1"]};
    border-width: ${pixel(2)};
    border-color: ${() => Rgba(colors["clr3"], 0.1)};
    position: absolute;
    right: ${pixel(4)};
    ${flexDisplay};
    z-index: 3;
`
export const ProgressInfo = styled.Text`
    ${ButtonBarSharedCss}
`;
export const ButtonDeleteRecord = styled.TouchableOpacity`
    width: ${pixel(26)};
    ${ButtonBarSharedCss}
`;
/////////////////////////////////////////////////////
export const RecordTimeInfo = styled.Text`
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    color: ${colors["back3"]};
    ${() => font({ size: pixel(12), line: pixel(32), isAr: false, align: "center" })};
    background-color: transparent;
    ${flexDisplay};
`;
// //////////////////////////////////////////////////
export const ProgressBar = styled(OuterBarRecord)`
    width: ${props => props.progress || 0}%;
    border-radius: 0px;
    background: ${() => Rgba(colors["clr1"], 0.25)};
    z-index: 1;
`;
//////////////////////////////////////////////////
export const PartFilesLoad = styled.View`
    ${OuterSharedCss}
    position: relative;
    border-radius: ${pixel(4)};
    margin-bottom: ${pixel(4)};
    padding: ${pixel(4)};
    border-width: ${pixel(2)};
    min-height: ${pixel(40)};
    border-color: ${() => Rgba(colors["clr2"], 0.2)};
    background: ${(props) => props.isDark ? colors["clr1"] : colors["back1"]};
`;
//////////////////////////////////////////////////
export const OuterButtonClose = styled.TouchableOpacity`
    width: ${pixel(25)};
    height: ${pixel(25)};
    min-width: ${pixel(25)};
    min-height: ${pixel(25)};
    border-radius: ${pixel(15)};
    top: ${pixel(8)}; left: ${pixel(8)};
    ${() => flexDisplay({})}
    position: absolute;
    border-width: ${pixel(2)};
    padding: ${pixel(4)};
    border-color: ${() => Rgba(colors["clr2"], 0.2)};
    background: ${(props) => Rgba(colors[props.back || "back3"], props.rgba ? 0.75 : 1)};

`;