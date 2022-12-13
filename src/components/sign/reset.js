import React, { memo, useState } from 'react';
import { Formik } from 'formik';
import { ToastAndroid } from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import * as Yup from 'yup';
import Axios from "../../main/Axios";
import { useSelector } from 'react-redux';
import { colors } from '../../styles/basecss';
import { Label, SignUpSubmit } from './helpersigncss';
import { PasswordValidation } from "./helperinput";
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////
const ResetPasswordMeetoor = ({ token }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { resetpassData, errors, buttons, schema, placeholder } = useSelector(state => state.sign.langData);
    const { navigate } = useSelector(state => state.modal.navigation);
    const [sending, setSending] = useState(false);
    const [isSent, setSent] = useState(false);
    /////////////////////////////////////////////
    const reset = async ({ password }) => {
        try {
            setSending(true);
            const response = await Axios.post("reset_password/", {
                password,
                token
            });
            ///////////////////////////////////////////
            if (response.data.error) {
                ToastAndroid.show(errors.tokenReset, ToastAndroid.LONG);
                setSending(false);
            }
            ///////////////////////////////////////////
            else {
                ToastAndroid.show(resetpassData.done, ToastAndroid.LONG);
                setSending(false);
            }
            setSent(true);
        } catch {
            ToastAndroid.show(errors.mainError, ToastAndroid.LONG);
        }
    }
    /////////////////////////////////////////////
    return (<>
        <Label isRTL={isRTL}>
            {resetpassData.head}
        </Label>
        <Formik initialValues={{ password: "" }}
            validationSchema={Yup.object({
                password: Yup.string()
                    .required(schema.valid.password)
                    .min(8, schema.valid.char8)
                    .max(40, schema.valid.char40)
            })}
            onSubmit={(values, { setSubmitting }) => {
                reset(values);
                setSubmitting(false);
            }}>
            {({ values, handleChange, handleSubmit, errors, touched }) => <>
                {!isSent && <PasswordValidation
                    placeholder={placeholder.password}
                    error={errors.password && touched.password ? errors.password : false}
                    onChange={handleChange("password")}
                    value={values.password} color="clr1" />}

                {isSent ?
                    <SignUpSubmit onPress={() => navigate("signin")}>
                        <Label isRTL={isRTL} button>
                            {buttons.signin}
                        </Label>
                    </SignUpSubmit> :
                    <SignUpSubmit onPress={handleSubmit}>
                        {sending ? <DotIndicator size={moderateScale(5)}
                            count={7} color={colors["back3"]} /> :
                            <Label isRTL={isRTL} button>
                                {buttons.reset}
                            </Label>}
                    </SignUpSubmit>}
            </>}
        </Formik>
    </>)
}

export default memo(ResetPasswordMeetoor);