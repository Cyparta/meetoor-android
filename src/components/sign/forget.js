import React, { memo, useState } from 'react';
import { Formik } from 'formik';
import { ToastAndroid } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import * as Yup from 'yup';
import Axios from "../../main/Axios";
import { useSelector } from 'react-redux';
import { colors } from '../../styles/basecss';
import { Label, SignUpSubmit } from './helpersigncss';
import { Input } from "./helperinput";
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////
const ForgotMeetoor = () => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { forgetData, errors, buttons, schema, placeholder } = useSelector(state => state.sign.langData);
    const [sending, setSending] = useState(false);
    const [isSent, setSent] = useState(false);
    /////////////////////////////////////////////
    const forget = async ({ email }) => {
        try {
            setSending(true);
            const response = await Axios.post("forgetPassword/", {
                email,
            });
            ///////////////////////////////////////////
            if (response.data.error) {
                ToastAndroid.show(response.data.error, ToastAndroid.LONG);
                setSending(false);
            }
            ///////////////////////////////////////////
            else {
                ToastAndroid.show(forgetData.done, ToastAndroid.LONG);
                setSending(false);
                setSent(true);
            }
        } catch {
            ToastAndroid.show(errors.mainError, ToastAndroid.LONG);
        }
    }
    /////////////////////////////////////////////
    return (<>
        <Label isRTL={isRTL}>
            {forgetData.head}
        </Label>
        <Label isRTL={isRTL} small>
            {isSent ? forgetData.done : forgetData.info}
        </Label>
        <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
                email: Yup.string().email(schema.valid.email)
                    .required(schema.required)
                    .min(7, schema.valid.char7)
                    .max(40, schema.valid.char40),
            })}
            onSubmit={(values, { setSubmitting }) => {
                forget(values);
                setSubmitting(false);
            }}>
            {({ values, handleChange, handleSubmit, errors, touched }) => <>
                <Input placeholder="meetoor@gmail.com"
                    Label={placeholder.email}
                    onChange={handleChange("email")}
                    error={errors.email && touched.email ? errors.email : false}
                    value={values.email} color="clr1" />

                {isSent ? <SignUpSubmit onPress={() => setSent(false)}>
                    <Label isRTL={isRTL} button>
                        {buttons.resend}
                    </Label>
                </SignUpSubmit> :
                    <SignUpSubmit onPress={handleSubmit}>
                        {sending ? <DotIndicator size={moderateScale(5)} count={7} color={colors["back3"]} /> :
                            <Label isRTL={isRTL} button>
                                {buttons.send}
                            </Label>}
                    </SignUpSubmit>}
            </>}
        </Formik>
    </>)
}

export default memo(ForgotMeetoor);