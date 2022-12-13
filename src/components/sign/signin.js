import React, { memo, useState } from 'react';
import { ToastAndroid } from 'react-native';
// import { NativeModules } from "react-native";
import { Formik } from 'formik';
import { DotIndicator } from 'react-native-indicators';
import * as Yup from 'yup';
import Axios from "../../main/Axios";
import AsyncStorage from '@react-native-community/async-storage';
import SwitchButton from '../../main/switchbutton/switch';
import Actions from "../../reducer/actions";
import { useDispatch, useSelector } from 'react-redux';
import { colors, pixel } from '../../styles/basecss';
import { Label, SignUpSubmit, SignRoute, LinkToSign, OverOuterSwitch } from './helpersigncss';
import { Input, Password } from "./helperinput";
import { HeaderAccounts } from "./accounts";
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
/////////////////////////////////////////////
export const setAccounts = async (opj, dispatch, del) => {
    const accounts = await AsyncStorage.getItem("@accounts");
    const data = accounts ? JSON.parse(accounts) : [];
    if (typeof del === "number") data.splice(del, 1);
    if (opj) data.push(opj);
    await AsyncStorage.setItem("@accounts", JSON.stringify(data));
    dispatch(Actions.type("setAccounts", data));
}
/////////////////////////////////////////////
export const signin = async ({ username, callback,
    password, remember, dispatch, errors, setLoad }) => {
    remember = remember === "true";
    setLoad(true);
    try {
        const response = await Axios.post("login/", {
            username: username,
            password: password
        });
        ///////////////////////////////////////////
        if (response.data.error) {
            ToastAndroid.show(errors.login, ToastAndroid.LONG);
            setLoad(false);
        }
        ///////////////////////////////////////////
        else {
            await remember && setAccounts({ username, password }, dispatch);
            await AsyncStorage.setItem("@token", response.data.token);
            dispatch(Actions.type("login", response.data.token));
        }
        callback && callback();
    } catch (e) {
        console.log("~ e", e)
        ToastAndroid.show(errors.mainError, ToastAndroid.LONG);
        setLoad(false);
    }
}
/////////////////////////////////////////////////
const SignInMeetoor = () => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { signinData, errors, buttons, schema, placeholder } = useSelector(state => state.sign.langData);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    /////////////////////////////////////////////
    return (<>
        <Label isRTL={isRTL}>
            {signinData.head}
        </Label>

        <Formik
            initialValues={{
                username: '',
                password: '',
                remember: false
            }}
            validationSchema={Yup.object({
                username: Yup.string()
                    .min(3, schema.valid.char3)
                    .max(40, schema.valid.char40)
                    .required(schema.required),
                password: Yup.string()
                    .min(8, schema.valid.char8)
                    .max(40, schema.valid.char40)
                    .required(schema.required),
            })}
            onSubmit={(values, { setSubmitting }) => {
                signin({ ...values, dispatch: dispatch, errors, setLoad });
                setSubmitting(false);
            }}>
            {({ values, handleChange, handleSubmit, errors, touched }) => <>
                <Input placeholder={placeholder.emailOrUser}
                    onChange={handleChange("username")}
                    error={errors.username && touched.username ? errors.username : false}
                    value={values.username} color="clr1" />

                <Password
                    placeholder={placeholder.password}
                    error={errors.password && touched.password ? errors.password : false}
                    onChange={handleChange("password")}
                    value={values.password} color="clr1" />


                <SignUpSubmit onPress={handleSubmit}>
                    {!load ? <Label isRTL={isRTL} button>
                        {buttons.signin}
                    </Label> :
                        <DotIndicator size={moderateScale(4)} count={7} color={colors["back3"]} />}
                </SignUpSubmit>

                <OverOuterSwitch isRTL={isRTL}>
                    <SwitchButton
                        value={isRemember}
                        noEffect={true}
                        onChange={(bool, string) => {
                            setIsRemember(bool);
                            handleChange("remember")(string);
                        }}
                        fontSize={pixel(12)}
                        text={signinData.save}
                        csstext={css`color: ${colors["clr3"]};`}
                    />
                    <LinkToSign color="clr2"
                        onPress={() => navigate("forget")}>
                        {signinData.forget}
                    </LinkToSign>
                </OverOuterSwitch>
            </>}
        </Formik>
        <HeaderAccounts isRTL={isRTL}
            onPress={() => dispatch(Actions.type("setCurrentModalOutside", { key: "accounts", reload: false }))}>
            {signinData.yourAcc}
        </HeaderAccounts>
        <SignRoute>
            {signinData.noAccYet}
            <LinkToSign onPress={() => navigate("signup")}>
                {buttons.signup}
            </LinkToSign>
        </SignRoute>
    </>)
}

export default memo(SignInMeetoor);