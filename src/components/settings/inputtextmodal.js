import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { WaveIndicator } from 'react-native-indicators';
import { Input, Password, PasswordValidation } from '../sign/helperinput';
import AsyncStorage from '@react-native-community/async-storage';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { CorrectSvg } from '../../icons/all';
import {
    ButtonCirculer, OuterButtonControl,
    RenderBodyModal, TopModalOuter,
    UserInfoModal
} from '../home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { css } from 'styled-components';
import Axios from '../../main/Axios';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const InputTextChangeModal = ({ href, header = "",
    orgVal, placeholder, senderVal, del = false }) => {
    const dispatch = useDispatch();
    const { settings, schema, errors, buttons } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    /////////////////////////////////////////////////
    const [save, setSaved] = useState(true);
    const [currnetChange, setCurrnetChange] = useState(orgVal);
    const [oldPassword, setOldPassword] = useState("");
    ////////////////////////////////////////
    const ValidUsername = (currnet) => {
        let access = true;
        if (currnet.length < 3) {
            ToastAndroid.show(schema.valid.char3, ToastAndroid.LONG);
            access = false;
        } else if (currnet.length > 40) {
            ToastAndroid.show(schema.valid.char40, ToastAndroid.LONG);
            access = false;
        } else if (/\s/g.test(currnet)) {
            ToastAndroid.show(schema.valid.space, ToastAndroid.LONG);
            access = false;
        } else if ((/[.^%$#!~@,-]/g.test(currnet))) {
            ToastAndroid.show(schema.valid.special, ToastAndroid.LONG);
            access = false;
        }
        return access;
    }
    const ValidEmail = (currnet) => {
        let access = true;
        if (!/@/g.test(currnet) && !/\./g.test(currnet)) {
            ToastAndroid.show(schema.valid.email, ToastAndroid.LONG);
            access = false;
        } else if (/\s/g.test(currnet)) {
            ToastAndroid.show(schema.valid.space, ToastAndroid.LONG);
            access = false;
        }
        return access;
    }
    const ValidPassword = (currnet) => {
        let access = true;
        if (currnet.length < 7) {
            ToastAndroid.show(schema.valid.char7, ToastAndroid.LONG);
            access = false;
        } else if (currnet.length > 40) {
            ToastAndroid.show(schema.valid.char40, ToastAndroid.LONG);
            access = false;
        }
        return access;
    }
    ////////////////////////////////////////
    const sendToServer = useCallback(async () => {
        try {
            let response = senderVal === "username" ? ValidUsername(currnetChange) :
                senderVal === "email" ? ValidEmail(currnetChange) :
                    senderVal === "newPassword" ? ValidPassword(currnetChange) : true;
            if (!response) return;
            setSaved(false);
            ///////////////////////////////////////////
            let data = new FormData();
            !del && data.append(senderVal, currnetChange);
            data.append("password", oldPassword);
            ////////////////////////////////////////////
            try {
                const response = await Axios.post(`${href}/`, data, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                if (response.data.error) {
                    ToastAndroid.show(response.data.error, ToastAndroid.LONG);
                    setSaved(true);
                }
                else {
                    if (del) {
                        await AsyncStorage.removeItem("@token");
                        dispatch(Actions.type("logout"));
                    }
                    else {
                        dispatch(Actions.type("setUser", {
                            type: 'update',
                            data: {
                                key: senderVal,
                                val: currnetChange
                            }

                        }));
                        setSaved(true);
                        ToastAndroid.show(buttons.saved, ToastAndroid.LONG);
                    }
                    modalizeWithNav.close();
                }
            } catch (err) {
                console.log("sendToServer ~ isVaild", err)
            }
        } catch (err) {
            ToastAndroid.show(err.ValidationError, ToastAndroid.LONG);
            return;
        }
    }, [modalizeWithNav, senderVal, currnetChange, del]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <TopModalOuter marginBottom={pixel(6)}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color="clr2">{User.fullName}</AnyText>
                    <AnyText isRTL={isRTL} color={del ? "red2" : "clr1"}
                        target lower lineH={pixel(15)}>
                        {header}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8} close={del}
                    isRTL={isRTL} onPress={sendToServer}>
                    {save ? <CorrectSvg color={del ? "red2" : "clr2"} size={moderateScale(18)} /> :
                        <WaveIndicator size={moderateScale(32)} color={colors["clr2"]} />}
                </ButtonCirculer>
            </OuterButtonControl>
        </TopModalOuter>

        {del ? <AnyText isRTL={isRTL} size={moderateScale(14)}
            lineH={pixel(20)} color="red2"
            css={css`margin: ${pixel(8)} 0;`}>
            {errors.deleteAccount}
        </AnyText> : senderVal === "newPassword" ?
            <PasswordValidation
                placeholder={placeholder}
                mainMargin={moderateScale(6)}
                onChange={(currnet) => setCurrnetChange(currnet)}
                value={currnetChange}
                radius noBorder noBack
                isDrak={false}
                css={css`padding: 0 ${pixel(4)};`} /> :
            <Input placeholder={placeholder}
                mainMargin={moderateScale(6)}
                type={senderVal === "username" ? "default" : "email-address"}
                onChange={(currnet) => setCurrnetChange(currnet)}
                value={currnetChange}
                radius noBorder noBack
                isDrak={false}
                css={css`padding: 0 ${pixel(4)};`} />}

        <Password placeholder={del ? placeholder : settings.oldPass}
            mainMargin={moderateScale(0.1)}
            onChange={(pass) => setOldPassword(pass)}
            value={oldPassword}
            radius noBorder noBack
            isDrak={false}
            autoFocus={true}
            css={css`padding: 0 ${pixel(4)};`} />
    </RenderBodyModal>)
}

export default memo(InputTextChangeModal);
