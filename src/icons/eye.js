import React, { memo, useCallback, useEffect, useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import Svg, { Path, Circle } from 'react-native-svg';
import styled from 'styled-components';
import { colors, flexDisplay, pixel } from '../styles/basecss';
////////////////////////////////////////////////
export const EyeView = styled.View`
    width: ${pixel(20)};
    height: ${pixel(20)};
    margin: 0 ${pixel(4)};
    margin-top: auto;
    min-width: ${pixel(20)};
    overflow: hidden;
    background: ${(props) => props.isDark ? colors["clr1"] : colors["back1"]};
    position: relative;
    ${flexDisplay}
`;
////////////////////////////////////////////////
const Eye = ({ seen = false, isDark, ...props }) => {
    const [mask, setMask] = useState("M-7 -7-7 0C-2 -4 2 -4 7 0L7 -7z");
    const [eyelid, setEyelid] = useState("M-7 0C-2 -4 2 -4 7 0");
    //////////////////////////////////////////////
    const eyeOn = useCallback(() => {
        setMask("M-7 -7-7 0C-2 -4 2 -4 7 0L7 -7z");
        setEyelid("M-7 0C-2 -4 2 -4 7 0")
    }, []);
    //////////////////////////////////////////////
    const eyeOff = useCallback(() => {
        setMask("M-7 -7-7 0C-2 4 2 4 7 0L7 -7z");
        setEyelid("M-7 0C-2 4 2 4 7 0")
    }, []);
    /////////////////////////////////////////////
    useEffect(() => {
        if (seen) eyeOn();
        else eyeOff();
    }, [seen]);
    /////////////////////////////////////////////mask
    return (<EyeView isDark={isDark} {...props}>
        <Svg viewBox="-10 -10 20 20"
            width={moderateScale(20)}
            height={moderateScale(20)}>
            <Circle r="2.5" stroke={colors[isDark ? "back1" : "clr1"]}
                fill={colors[isDark ? "back1" : "clr1"]} strokeWidth="1" />
            <Path stroke="none" fill={colors[isDark ? "clr1" : "back1"]} d={mask} />
            <Path stroke={colors[isDark ? "back1" : "clr1"]} strokeWidth="1.4" fill="none" d={eyelid} />
        </Svg>
    </EyeView>)
}

export default memo(Eye);