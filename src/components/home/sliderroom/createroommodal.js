import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { Formik } from 'formik';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import * as Yup from 'yup';
import { Input } from '../../sign/helperinput';
import SwitchButton from "../../../main/switchbutton/switch";
import {
    AnyText, OuterGlobalUser,
    OuterNameStatus, OuterUserName,
} from '../helperprefernce';
import { RenderAnyUserPhoto } from '../helperhome';
import {
    RenderBodyModal, TopModalOuter,
    OuterButtonControl,
    UserInfoModal,
    ButtonCirculer
} from './helperroomcss';
import Actions from '../../../reducer/actions';
import { colors, pixel } from '../../../styles/basecss';
import { CorrectSvg } from '../../../icons/all';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const CreateRoomMeetoorModal = ({ isPrivate, privateRoom = false }) => {
    const { liveData, schema } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    /////////////////////////////////////////////////
    const [Loaded, setLoaded] = useState(false);
    const dispatch = useDispatch();
    const { create } = liveData;
    /////////////////////////////////////////////////
    const createRoom = useCallback((room) => {
        mainSocket.emit("createAudioRoom", {
            roomId: Math.random().toString(36).substr(2, 36),
            header: room.header,
            private: room.private === "true" ? true : false,
        });
        dispatch(Actions.type("setPopupMain", false));
    }, [User, mainSocket]);
    ////////////////////////////////////////
    return (<Formik
        initialValues={{
            private: isPrivate ? true : privateRoom,
            header: ""
        }}
        validationSchema={Yup.object({
            header: Yup.string()
                .min(3, schema.valid.char3)
                .max(250, schema.valid.char250)
                .required(schema.required)
        })}
        onSubmit={(values, { setSubmitting }) => {
            createRoom(values);
            setSubmitting(false);
        }}>
        {({ values, handleChange, handleSubmit, errors, touched }) => <RenderBodyModal>
            <TopModalOuter marginBottom={pixel(8)}>
                <UserInfoModal>
                    <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                    <OuterUserName>
                        <AnyText isRTL={isRTL} size={moderateScale(14)} color="clr2">{User.fullName}</AnyText>
                        <AnyText isRTL={isRTL} color="clr1" lower target lineH={pixel(16)}>
                            {create.info1}
                        </AnyText>
                    </OuterUserName>
                </UserInfoModal>
                <OuterButtonControl>
                    <ButtonCirculer activeOpacity={0.8}
                        isRTL={isRTL} onPress={handleSubmit}>
                        {Loaded ? <WaveIndicator size={moderateScale(36)} color={colors["clr2"]} /> :
                            <CorrectSvg color="clr2" size={moderateScale(20)} />}
                    </ButtonCirculer>
                </OuterButtonControl>
            </TopModalOuter>
            <OuterGlobalUser isRTL={isRTL}>
                <SwitchButton
                    value={values.private}
                    noEffect={true}
                    onChange={(bool, string) => handleChange("private")(string)}
                    text={create.private}
                />
            </OuterGlobalUser>

            <OuterGlobalUser isRTL={isRTL}>
                <Input label={create.header}
                    onChange={handleChange("header")}
                    error={errors.header && touched.header ? errors.header : false}
                    value={values.header}
                    noBorder draker radius height={"auto"}
                    multiline numberOfLines={2} />
            </OuterGlobalUser>
        </RenderBodyModal>}
    </Formik>)
}

export default memo(CreateRoomMeetoorModal)
