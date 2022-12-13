import React, { memo } from 'react';
// import { Animated } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors, flexDisplay, font, backrgba, pixel } from '../../styles/basecss';
/////////////////////////////////////////////////
const ValidationPassworMeetoor = styled.View`
    width: 100%;
    height: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    overflow: hidden;
    ${() => flexDisplay({ dir: "column" })};
    ${(props) => props.isFocus ? `
        height: 170px;
        margin-bottom: 16px;
    ` : null};
`;
///////////////////////////////////////////////////////
const ValidationPassword = styled.View`
    width: 100%;
    height: ${pixel(120)};
    overflow: hidden;
    ${flexDisplay};
`;
/////////////////////////////////////////////////////
const BarValidation = styled.View`
    width: 100%;
    height: ${pixel(2)};
    border-radius: ${pixel(4)};
    ${() => backrgba(colors["clr2"], 0.5)}
    ${() => flexDisplay({ justify: "space-evenly" })};
`;
/////////////////////////////////////////////////////
const CircleValidation = styled.View`
    width: ${pixel(5)};
    height: ${pixel(5)};
    border-radius: ${pixel(12)};
    background: ${colors["red2"]};
    ${() => flexDisplay({ align: "flex-start" })};
    ${(props) => {
        let style = '';
        if (props.reverse) style += `align-items: flex-end;`;
        if (props.mid) style += `background: ${colors["yel"]};`;
        if (props.active) style += `background: ${colors["clr2"]};`;
        return style;
    }}
`;
/////////////////////////////////////////////////////
const OuterMsgValidation = styled(Animatable.View)`
    width: auto;
    min-width: ${pixel(120)};
    height: ${pixel(50)};
    position: relative;
    ${() => flexDisplay({ align: "flex-end" })};
    ${(props) => {
        let style = '';
        if (props.reverse) style += `align-items: flex-start;`;
        if (props.active) style += `height: ${pixel(40)};`;
        return style;
    }}
`;
/////////////////////////////////////////////////////
const BarinValidation = styled.View`
    position: absolute;
    width: ${pixel(1)};
    height: 100%;
    background: ${colors["red2"]};
    ${(props) => {
        let style = '';
        if (props.mid) style += `background: ${colors["yel"]};`;
        if (props.active) style += `background: ${colors["clr2"]};`;
        return style;
    }}
`;
/////////////////////////////////////////////////////
const MsgValidation = styled.Text`
    ${flexDisplay};
    position: relative;
    border-radius: ${pixel(4)};
    width: auto;
    height: auto;
    padding: ${pixel(4)};
    color: ${colors["back1"]};
    background: ${colors["red2"]};
    ${(props) => font({ size: pixel(12.5), isAr: props.isRTL })};
    ${(props) => {
        let style = '';
        if (props.mid) style += `
            background: ${colors["yel"]};
            color: ${colors["clr2"]};
        `;
        if (props.active) style += `
            background: ${colors["clr2"]};
            color: ${colors["back1"]};
        `;
        return style;
    }}
`;
//width: ${width - 100};
//////////////////////////////////////////////////////
const CheckPowerPassword = styled(ValidationPassword)`
    height: ${pixel(21)};
    margin-top: ${pixel(14)};
    justify-content: space-evenly;
`;
//////////////////////////////////////////////////////
const BarPowervalidate = styled(ValidationPassword)`
    height: ${pixel(5)};
    border-radius: ${pixel(4)};
    background: ${colors["back3"]};
    position: relative;
    flex: 1;
`;
//////////////////////////////////////////////////////
const MaskBar = styled(LinearGradient)`
    width: 100%;
    overflow: hidden;
    ${flexDisplay};
    border-radius: ${pixel(4)};
    background: ${colors["back3"]};
    position: relative;
    top: 0px;
    left: 0px;
    height: 100%;
    z-index: 1;
`;
//////////////////////////////////////////////////////
const MaskBarFake = styled(Animatable.View)`
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    ${() => backrgba(colors["back3"], 0.8)};
    z-index: 2;
    ${(props) => {
        switch (props.power) {
            case "none":
                return "width: 100%";
            case "weak":
                return "width: 80%";
            case "medium":
                return "width: 50%";
            case "strong":
                return "width: 20%";
            case "very strong":
                return "width: 0%";
            default:
                break;
        }
    }}
`;
//////////////////////////////////////////////////////
const BarPowerMsg = styled.Text`
    width: 80px;
    min-width: 80px;
    height: ${pixel(21)};
    position: relative;
    background-color: ${colors["clr2"]};
    border-radius: 5px;
    color: ${colors["back1"]};
    margin-left: 16px;
    ${flexDisplay};
    ${(props) => font({ size: pixel(13), line: pixel(19), isAr: props.isRTL, align: "center" })};
    ${(props) => {
        switch (props.power) {
            case "weak":
                return backrgba(colors["clr2"], 0.75);
            case "medium":
                return `background-color: ${colors["yel"]}`;
            case "strong":
                return backrgba(colors["red2"], 0.75);
            case "very strong":
                return `background-color: ${colors["red2"]}`;
            default:
                break;
        }
    }}
`;
//////////////////////////////////////////////////////
const MainValidation = ({ validate, isFocus, passStrong }) => {
    const { validation } = useSelector(state => state.sign.langData.signupData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const Levels = [
        "weak",
        "medium",
        "strong",
        "very strong",
        "none"
    ];
    const dataStore = validation.level;
    ////////////////////////////////////////////////////
    return (<ValidationPassworMeetoor isFocus={isFocus}>
        <ValidationPassword>
            <BarValidation >
                <CircleValidation reverse mid active={validate.oneUpper}>
                    <OuterMsgValidation reverse active={validate.oneUpper} transition="height">
                        <BarinValidation mid active={validate.oneUpper} />
                        <MsgValidation mid active={validate.oneUpper} isRTL={isRTL}>
                            {validation.uppercase}
                        </MsgValidation>
                    </OuterMsgValidation>
                </CircleValidation>

                <CircleValidation mid active={validate.oneLower}>
                    <OuterMsgValidation active={validate.oneLower} transition="height">
                        <BarinValidation mid active={validate.oneLower} />
                        <MsgValidation mid active={validate.oneLower} isRTL={isRTL}>
                            {validation.lowercase}
                        </MsgValidation>
                    </OuterMsgValidation>
                </CircleValidation>

                <CircleValidation reverse mid active={validate.oneNumber}>
                    <OuterMsgValidation reverse active={validate.oneNumber} transition="height">
                        <BarinValidation mid active={validate.oneNumber} />
                        <MsgValidation mid active={validate.oneNumber} isRTL={isRTL}>
                            {validation.number}
                        </MsgValidation>
                    </OuterMsgValidation>
                </CircleValidation>

                <CircleValidation active={validate.eightCharacters}>
                    <OuterMsgValidation active={validate.eightCharacters} transition="height">
                        <BarinValidation active={validate.eightCharacters} />
                        <MsgValidation active={validate.eightCharacters} isRTL={isRTL}>
                            {validation.char8}
                        </MsgValidation>
                    </OuterMsgValidation>
                </CircleValidation>
            </BarValidation>
        </ValidationPassword>
        <CheckPowerPassword>
            <BarPowervalidate>
                <MaskBar colors={[
                    "#267b77", "#bdbc24", "#e0c10b",
                    "#dfa900", "#e7482c", "#e43232"
                ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }} />

                <MaskBarFake power={Levels[passStrong]} transition="width" />
            </BarPowervalidate>
            <BarPowerMsg power={Levels[passStrong]} isRTL={isRTL}>
                {passStrong === 4 ? validation.none : dataStore[passStrong]}
            </BarPowerMsg>
        </CheckPowerPassword>
    </ValidationPassworMeetoor >);
}

export default memo(MainValidation);