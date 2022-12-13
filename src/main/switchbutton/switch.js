import React, { memo } from "react";
import { useSelector } from "react-redux";
import styled from 'styled-components';
import { colors, flexDisplay, font, pixel, Rgba } from '../../styles/basecss';
import { Switch } from "react-native";
import { moderateScale } from "react-native-size-matters";
/////////////////////////////////////////////////
const LabelToggleButton = styled.View`
    width: auto;
    ${() => flexDisplay({ iustify: "flex-star" })};
    margin: ${props => props.margin !== undefined ? props.margin : moderateScale(10)}px 0;
    ${props => {
        let style = '';
        if (props.isRTL) style += "flex-direction: row-reverse;";
        if (props.disable) style += "opacity: 0.35;";
        return style;
    }};
    ${props => props.css || null};
`;
/////////////////////////////////////////////////
const OuterSvg = styled.View`
    ${flexDisplay};
    ${props => props.isRTL ? `margin-left: ${pixel(5)};` : `margin-right: ${pixel(5)};`};
`;
/////////////////////////////////////////////////
const LabelToggleText = styled.Text`
    color: ${colors["clr1"]};
    ${(props) => font({ size: props.fontSize, line: pixel(24), isAr: props.isRTL })};
    ${props => props.isRTL ? `padding-right: ${pixel(5)};` : `padding-left: ${pixel(5)};`};
    ${props => {
        if (props.isDark || props.forceDark) return `
            color: ${colors["back2"]};
        `
    }}
    ${props => props.csstext || null};
`;
////////////////////////////////////////////////
const SwitchButton = ({ text, value, forceDark, margin, csstext,
    disable = false, element, onChange, fontSize = "15px", css }) => {
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    ///////////////////////////////////////////
    return (<LabelToggleButton
        activeOpacity={1} margin={margin}
        isRTL={isRTL} isDark={isDark} css={css}>
        {element && <OuterSvg isRTL={isRTL}>
            {element}
        </OuterSvg>}
        <Switch disable={disable} value={value}
            trackColor={{ false: Rgba(colors["red2"], 0.5), true: Rgba(colors["clr2"], 0.5) }}
            thumbColor={colors[value ? "clr2" : "red2"]}
            onValueChange={(val) => onChange(val, val.toString())}
        />
        <LabelToggleText isRTL={isRTL}
            forceDark={forceDark}
            isDark={isDark} csstext={csstext}
            fontSize={fontSize}>
            {text}
        </LabelToggleText>
    </LabelToggleButton>)
}

export default memo(SwitchButton);
