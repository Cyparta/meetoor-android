import React, { useState, memo } from 'react';
import { useSelector } from "react-redux";
import styled from 'styled-components';
import { EyeSvg } from '../../icons/all';
import Validation from './validation';
import {
    colors, flexDisplay,
    fontLit, font, Rgba, ChangeColor, pixel
} from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////////
export const OverInput = styled.View`
    width: 100%;
    position: relative;
    ${() => flexDisplay({ dir: "column", align: "flex-start" })};
    margin-bottom: ${props => props.mainMargin || moderateScale(20)}px;
`;
////////////////////////////////////////////////
const FiledInput = styled.TextInput`
    width: 100%;
    min-height: ${pixel(40)};
    height: ${props => props.height || pixel(40)};
    ${() => flexDisplay({ justify: "flex-start" })};
    ${(props) => fontLit({ size: pixel(13), line: pixel(25), isAr: props.isRTL })};
    z-index: 1;
    background: ${(props) => props.draker ? ChangeColor(colors[props.back || "back3"], props.darkDeg || -10) :
        !props.noBack ? "transparent" : colors[props.back ? props.back : props.isDrak ? "clr1" : "back1"]};
    color: ${(props) => colors[props.color ? props.color : props.isDrak ? "back2" : "clr1"]};
    ${(props) => props.noBorder ? null : `
        border-bottom-width: ${pixel(1)};
        border-bottom-color : ${Rgba(colors["clr1"], 0.5)};
    `};
    ${(props) => props.radius ? `border-radius: ${pixel(4)};` : null};
    ${(props) => props.noAuto ? null : "text-align: auto;"};
    ${(props) => props.css || null};
`;
////////////////////////////////////////////////
export const LabelText = styled.Text`
    width: 100%;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row" : "row-reverse",
    justify: "flex-start"
})};
    ${(props) => fontLit({ size: pixel(13), line: pixel(21), isAr: props.isRTL })};
    text-transform: capitalize;
    color: ${(props) => colors[props.isDrak ? "back2" : "clr1"]};
    margin-bottom: ${pixel(4)};
    ${(props) => props.css || null};
`;
////////////////////////////////////////////////
const Error = styled(LabelText)`
    width: auto;
    border-radius: ${pixel(4)};
    position: absolute;
    overflow: hidden;
   ${(props) => font({ size: pixel(12), line: pixel(18), isAr: props.isRTL })};
    text-transform: lowercase;
    color: ${colors["red2"]};
    bottom: ${pixel(0)};
    height: ${pixel(21)};
    z-index: 3;
    ${(props) => props.isRTL ? "right: 2px" : "left: 2px"};
`;
////////////////////////////////////////////////
export const Input = memo(({ placeholder, label = false, value, error = false,
    type = "default", onChange, onBlur, mainMargin, innerRef = null, ...props }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDrak = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////////
    return (<OverInput isDrak={isDrak} isRTL={isRTL} mainMargin={mainMargin}>
        {label ? <LabelText isDrak={isDrak} isRTL={isRTL}>
            {label}
        </LabelText> : null}
        <FiledInput value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType={type}
            isDrak={isDrak} isRTL={isRTL}
            placeholder={placeholder}
            ref={innerRef}
            {...props} />
        <Error isDrak={isDrak} isRTL={isRTL}>
            {error}
        </Error>
    </OverInput>);
});
////////////////////////////////////////////////
const ButtonEye = styled.TouchableOpacity`
    ${flexDisplay};
    position: absolute;
    height: ${pixel(35)};
    width: ${pixel(35)};
    bottom: 0px;
    ${(props) => props.isRTL ? "left: 0px" : "right: 0px"};
    z-index: 5;
    overflow: hidden;
`;
////////////////////////////////////////////////
export const Password = memo(({ placeholder, label = false,
    onChange, value, error, mainMargin, ...props }) => {
    const [passState, showPass] = useState(true);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDrak = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////////
    return (<OverInput isDrak={isDrak} isRTL={isRTL} mainMargin={mainMargin}>
        {label ? <LabelText isDrak={isDrak} isRTL={isRTL}>
            {label}
        </LabelText> : null}
        <FiledInput keyboardType={"default"}
            placeholder={placeholder}
            onChangeText={onChange}
            isDrak={isDrak} isRTL={isRTL}
            secureTextEntry={passState}
            value={value}
            autoCompleteType="password"
            noAuto {...props} />

        <ButtonEye onPress={() => showPass(!passState)} isRTL={isRTL} >
            <EyeSvg size={moderateScale(18)} type={!passState} color="clr1" />
        </ButtonEye>
        <Error isDrak={isDrak} isRTL={isRTL}>
            {error}
        </Error>
    </OverInput>)
});
/////////////////////////////////////////////////
export const PasswordValidation = memo(({ placeholder, label = false,
    onChange, value, error, mainMargin, ...props }) => {
    const [passState, showPass] = useState(true);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDrak = useSelector(state => state.sign.isDark);
    /////////////////////////////////////////////
    const [validate, setValidate] = useState({
        oneUpper: false,
        oneLower: false,
        oneNumber: false,
        oneSpecial: false,
        eightCharacters: false
    });
    const [isFocus, setInputFocus] = useState(false);
    const [passStrong, setPassStrong] = useState(4);
    /////////////////////////////////////////////
    const checkElem = (value) => {
        let matchUpper = value.match(/[A-Z]/g);
        let matchLower = value.match(/[a-z]/g);
        let matchNumber = value.match(/[0-9]/g);
        let matchSpecial = value.match(/[@$!%*#?&]/g);
        ///////////////////////////////////////////
        let oneUpper = matchUpper ? true : false;
        let oneLower = matchLower ? true : false;
        let oneNumber = matchNumber ? true : false;
        let oneSpecial = matchSpecial ? true : false;
        let eightCharacters = value.length >= 8 ? true : false;
        ///////////////////////////////////////////
        setValidate({
            oneUpper,
            oneLower,
            oneNumber,
            oneSpecial,
            eightCharacters
        });
        ///////////////////////////////////////////
        if (value.length > 1) {
            if (matchLower?.length >= 6 && matchNumber?.length >= 1 &&
                matchUpper?.length >= 1 && eightCharacters) {
                setPassStrong(1);
            } else setPassStrong(0);

            if (matchLower?.length >= 6 && matchNumber?.length >= 2 &&
                matchUpper?.length >= 2 && matchSpecial?.length >= 2 && eightCharacters) {
                setPassStrong(2);
            }

            if (matchLower?.length >= 7 && matchNumber?.length >= 3 &&
                matchUpper?.length >= 3 && matchSpecial?.length >= 3 && eightCharacters) {
                setPassStrong(3);
            }
        } else {
            setPassStrong(4);
        }
    }
    ////////////////////////////////////////////
    return (<>
        <Validation validate={validate}
            isFocus={isFocus} passStrong={passStrong} />
        <OverInput isDrak={isDrak} isRTL={isRTL} mainMargin={mainMargin}>
            {label ? <LabelText isDrak={isDrak} isRTL={isRTL}>
                {label}
            </LabelText> : null}
            <FiledInput keyboardType={"default"}
                placeholder={placeholder}
                isDrak={isDrak} isRTL={isRTL}
                onFocus={() => setInputFocus(true)}
                secureTextEntry={passState}
                autoCompleteType="password"
                value={value}
                onChangeText={(e) => {
                    onChange(e);
                    checkElem(e);
                }}
                noAuto {...props}
            />

            <ButtonEye onPress={() => showPass(!passState)} isRTL={isRTL} >
                <EyeSvg size={moderateScale(18)} type={!passState} color="clr1" />
            </ButtonEye>
            <Error isDrak={isDrak} isRTL={isRTL}>
                {error}
            </Error>
        </OverInput>
    </>)
});

