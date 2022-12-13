import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import AsyncStorage from '@react-native-community/async-storage';
import Contacts from 'react-native-contacts';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Axios from "../../main/Axios";
import Actions from "../../reducer/actions";
import { Input, PasswordValidation } from "./helperinput";
import { Label, SignUpSubmit, SignRoute, LinkToSign } from './helpersigncss';
import { colors } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////
const SiginUpMeetoor = () => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { signupData,
        errors,
        buttons,
        schema,
        placeholder
    } = useSelector(state => state.sign.langData);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);
    /////////////////////////////////////////////
    const signup = async ({
        f_name,
        l_name,
        email,
        password
    }) => {
        setLoad(true);
        try {
            let username = email.trim().split("@")[0]
                .replace(/\s/g, "")
                .replace(/[._^%$#!~@,-]/g, "");
            let first_name = f_name;
            let last_name = l_name;
            const response = await Axios.post("signup/", {
                first_name,
                last_name,
                username,
                email,
                password
            });
            ///////////////////////////////////////////
            if (response.data.error) {
                ToastAndroid.show(response.data.error, ToastAndroid.LONG);
                setLoad(false);
            }
            ///////////////////////////////////////////
            else {
                let token = response.data.token;
                await AsyncStorage.setItem("@token", token);
                let isAcceptContact = null;
                try {
                    isAcceptContact = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
                    let granted = "";
                    if (!isAcceptContact) {
                        granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
                    }
                    if (granted === PermissionsAndroid.RESULTS.GRANTED || isAcceptContact) {
                        const List = [];
                        try {
                            const contacts = await Contacts.getAll();
                            contacts.forEach((contact) => {
                                List.push({
                                    number: contact.phoneNumbers[0]?.number || "",
                                    displayName: contact.displayName
                                });
                            });
                            await Axios.post("setMyContacts/",
                                { "contactsFile": JSON.stringify(List) }, {
                                headers: {
                                    'Authorization': `Token ${token}`
                                }
                            });
                        } catch (e) {
                            console.log("loginFCM ~ e", e)
                        }
                        isAcceptContact = true;
                    }
                } catch (err) {
                    console.log(err);
                }
                setLoad(false);
                dispatch(Actions.type("signup", { token, isAcceptContact }));
            }
        } catch {
            ToastAndroid.show(errors.mainError, ToastAndroid.LONG);
            setLoad(false);
        }
    }
    /////////////////////////////////////////////
    return (<>
        <Label isRTL={isRTL}>
            {signupData.head}
        </Label>
        <Formik
            initialValues={{
                f_name: '',
                l_name: '',
                email: '',
                password: ''
            }}
            validationSchema={Yup.object({
                f_name: Yup.string()
                    .min(2, schema.valid.char7)
                    .max(40, schema.valid.char40)
                    .required(schema.required),
                l_name: Yup.string()
                    .min(2, schema.valid.char7)
                    .max(40, schema.valid.char40)
                    .required(schema.required),
                email: Yup.string().email()
                    .min(7, schema.valid.char7)
                    .max(40, schema.valid.char40)
                    .required(schema.required),
                password: Yup.string()
                    .required(schema.valid.password)
                    .min(8, schema.valid.char8)
                    .max(40, schema.valid.char40)
            })}
            onSubmit={(values, { setSubmitting }) => {
                signup(values);
                setSubmitting(false);
            }}>
            {({ values, handleChange, handleSubmit, errors, touched }) => <>
                <Input placeholder={placeholder.first}
                    onChange={handleChange("f_name")}
                    error={errors.f_name && touched.f_name ? errors.f_name : false}
                    value={values.f_name} color="clr1" />
                <Input placeholder={placeholder.last}
                    onChange={handleChange("l_name")}
                    error={errors.l_name && touched.l_name ? errors.l_name : false}
                    value={values.l_name} color="clr1" />

                <Input placeholder={placeholder.email}
                    type="email-address"
                    onChange={handleChange("email")}
                    error={errors.email && touched.email ? errors.email : false}
                    value={values.email} color="clr1" />

                <PasswordValidation
                    placeholder={placeholder.password}
                    error={errors.password && touched.password ? errors.password : false}
                    onChange={handleChange("password")}
                    value={values.password} color="clr1" />

                <SignUpSubmit onPress={handleSubmit}>
                    {!load ? <Label isRTL={isRTL} button>
                        {buttons.signup}
                    </Label> :
                        <DotIndicator size={moderateScale(4)} count={7} color={colors["back3"]} />}
                </SignUpSubmit>
            </>}
        </Formik>
        <SignRoute>
            {signupData.haveAcc}
            <LinkToSign onPress={() => navigate("signin")}>
                {buttons.signin}
            </LinkToSign>
        </SignRoute>
    </>)
}

export default memo(SiginUpMeetoor);


