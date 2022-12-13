import React, { memo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { BirthdaySvg, CorrectSvg, CountrySvg, PublickSvg } from '../../../icons/all';
import { OuterOneView } from '../../home/helpernotification/heplernotifycss';
import { AnyText, OuterGlobalUser, OuterUserName, ScrollBar } from '../../home/helperprefernce';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input, LabelText } from '../../sign/helperinput';
import RenderTopProfile from '../profiletop';
import Axios from '../../../main/Axios';
import { TopNavigateOuter } from '../../posts/createpost/helpercreatepostcss';
import { ButtonCirculer, OuterButtonControl, UserInfoModal } from '../../home/sliderroom/helperroomcss';
import { OuterLazy, OuterSquarView, RenderAnyUserPhoto } from '../../home/helperhome';
import { colors, pixel } from '../../../styles/basecss';
import { WaveIndicator } from 'react-native-indicators';
import ChooseCountryPicker from './choosecountry';
import SwitchButton from '../../../main/switchbutton/switch';
import PhoneInput from "react-native-phone-number-input";
import splitPhoneNumber from '../../../main/countrycodes';
import Actions from '../../../reducer/actions';
import { ToastAndroid } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderEditProfile = () => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { buttons, placeholder, schema } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const user = useSelector(state => state.main.user);
    const infos = user.infos;
    const myControls = user.controlInfo;
    ////////////////////////////////////////////////
    const Scroll = useRef();
    const formRef = useRef();
    const phoneInput = useRef();
    ////////////////////////////////////////////////
    const [save, setSave] = useState(true);
    const [gender, setGander] = useState(infos.gender);
    const [openCountryPicker, setOpenCountryPicker] = useState(false);
    const [country, setCountry] = useState(infos.country);
    const [controls, setControls] = useState(myControls);
    ////////////////////////////////////////////////
    const [splitPhone] = useState(splitPhoneNumber(infos.Phone));
    const [defaultCode] = useState(splitPhone.country);
    const [phone, setPhone] = useState(splitPhone.phone);
    const [phoneValid, setPhoneValid] = useState(null);
    ////////////////////////////////////////////////
    const [startDate] = useState(new Date(infos.birthday.toString()));
    const [date, setDate] = useState(infos.birthday);
    ////////////////////////////////////////////////
    const getBirthdayFromPicker = (str) => {
        let months = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04",
            May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09",
            Oct: "10", Nov: "11", Dec: "12"
        }, date = str.toString().split(" ");
        return [date[3], months[date[1]], date[2]].join("-");
    };
    ///////////////////////////////////////////
    const editProfile = async ({
        firstname,
        lastname,
        address,
        job,
        bio,
        link,
        skill,
    }) => {
        let checkPhone = phoneInput.current.isValidNumber(phone);
        if (!checkPhone) {
            Scroll.current.scrollToEnd();
            setPhoneValid(false);
            return;
        }
        try {
            setSave(false);
            ///////////////////////////////////////////
            let data = new FormData();
            data.append("first_name", firstname);
            data.append("last_name", lastname);
            data.append("Job", job);
            data.append("Phone", phone);
            data.append("Your_Link", link);
            data.append("Birthday", date);
            data.append("gender", gender);
            data.append("Country", country);
            data.append("bio", bio);
            data.append("Skill", skill);
            data.append("Address", address);
            ////////////////////////////////////////////
            data.append("isPublicGender", controls.isGender);
            data.append("isPublicAddress", controls.isAddress);
            data.append("isPublicCountry", controls.isCountry);
            data.append("isPublicBirthday", controls.isBirthday);
            data.append("isPublicPhone", controls.isPhone);
            ////////////////////////////////////////////
            const response = await Axios.post("user/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setUser", {
                type: 'set',
                data: response.data.user
            }));
            dispatch(Actions.type("setProfiles", {
                type: 'update',
                data: {
                    key: response.data.user.username,
                    call: (target) => {
                        const { bio, infos } = response.data.user;
                        target.user.bio = bio;
                        target.user.infos = infos;
                    }
                }
            }));
            ToastAndroid.show(buttons.saved, ToastAndroid.LONG);
            setSave(true);
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }
    ////////////////////////////////////////
    return (<ScrollBar ref={Scroll}
        keyboardShouldPersistTaps='handled'
        back={colors[isDark ? "clr1" : "back1"]}
        stickyHeaderIndices={[0]} padd="4px">
        <TopNavigateOuter isDark={isDark}
            css={css`border-width: 0px;margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};`}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={user.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color={isDark ? "back3" : "clr1"}>{user.fullName}</AnyText>
                    <AnyText isRTL={isRTL}
                        color={isDark ? "back2" : "clr2"}
                        lower target lineH={pixel(15)}>
                        {buttons.editProfile}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8}
                    isRTL={isRTL} isDark={isDark}
                    onPress={() => formRef.current && formRef.current.handleSubmit()}>
                    {save ? <CorrectSvg color="clr2" size={moderateScale(17)} /> :
                        <WaveIndicator size={moderateScale(35)} color={colors["clr2"]} />}
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <RenderTopProfile isMe={true} isOwner={user.isOwner}
            isSecure={user.isSecure} fullName={user.fullName} />

        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(6)};
            margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <Formik innerRef={formRef}
                initialValues={{
                    firstname: user.first_name,
                    lastname: user.last_name,
                    address: infos.Address,
                    link: infos.yourlink,
                    bio: user.bio,
                    job: infos.job,
                    skill: infos.skill,
                }}
                validationSchema={Yup.object({
                    firstname: Yup.string()
                        .min(2, schema.valid.char2)
                        .required(schema.required),
                    lastname: Yup.string()
                        .min(2, schema.valid.char2)
                        .required(schema.required),
                    bio: Yup.string()
                        .min(2, schema.valid.char2)
                        .required(schema.required)
                })}
                onSubmit={(values, { setSubmitting }) => {
                    editProfile(values);
                    setSubmitting(false);
                }}>
                {({ values, handleChange, errors, touched }) => <>
                    <Input placeholder={placeholder.first}
                        label={placeholder.first}
                        onChange={handleChange("firstname")}
                        error={errors.firstname && touched.firstname ? errors.firstname : false}
                        value={values.firstname}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <Input placeholder={placeholder.last}
                        label={placeholder.last}
                        onChange={handleChange("lastname")}
                        error={errors.lastname && touched.lastname ? errors.lastname : false}
                        value={values.lastname}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <Input placeholder={placeholder.bio}
                        label={placeholder.bio}
                        onChange={handleChange("bio")}
                        error={errors.bio && touched.bio ? errors.bio : false}
                        value={values.bio}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <Input placeholder={placeholder.job}
                        label={placeholder.job}
                        onChange={handleChange("job")}
                        error={errors.job && touched.job ? errors.job : false}
                        value={values.job}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <Input placeholder={placeholder.skill}
                        label={placeholder.skill}
                        onChange={handleChange("skill")}
                        error={errors.skill && touched.skill ? errors.skill : false}
                        value={values.skill}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <Input placeholder={placeholder.link}
                        label={placeholder.link}
                        onChange={handleChange("link")}
                        error={errors.link && touched.link ? errors.link : false}
                        value={values.link}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />

                    <>
                        <LabelText isDrak={isDark} isRTL={isRTL}
                            css={css`margin: 0px;`}>
                            {placeholder.country}
                        </LabelText>
                        <OuterGlobalUser isRTL={isRTL}>
                            <SwitchButton
                                value={controls.isCountry}
                                onChange={(bool) => {
                                    setControls({ ...controls, isCountry: bool });
                                }}
                                fontSize={pixel(13)}
                                text={badges.shareToAll}
                                element={<PublickSvg size={moderateScale(20)} />}
                            />
                        </OuterGlobalUser>
                        <OuterOneView activeOpacity={1} isRTL={isRTL}
                            back={isDark ? "clr1" : "back1"}
                            onPress={() => setOpenCountryPicker(true)}
                            css={css`margin: 0;padding: ${pixel(6)};
                            margin-bottom: ${pixel(20)};border-radius: ${pixel(4)};`}>
                            <CountrySvg />
                            <AnyText isRTL={isRTL} autoMargin={pixel(6)}
                                size={moderateScale(13)}
                                color={isDark ? "back2" : "clr1"}>{country}</AnyText>
                        </OuterOneView>
                        {openCountryPicker ? <ChooseCountryPicker onSelect={({ name }) => {
                            setCountry(name);
                            setOpenCountryPicker(false)
                        }} /> : null}
                    </>
                    <>
                        <LabelText isDrak={isDark} isRTL={isRTL}
                            css={css`margin: 0px;`}>
                            {placeholder.address}
                        </LabelText>
                        <OuterGlobalUser isRTL={isRTL}>
                            <SwitchButton
                                value={controls.isAddress}
                                onChange={(bool) => {
                                    setControls({ ...controls, isAddress: bool });
                                }}
                                fontSize={pixel(13)}
                                text={badges.shareToAll}
                                element={<PublickSvg size={moderateScale(20)} />}
                            />
                        </OuterGlobalUser>
                        <Input placeholder={placeholder.address}
                            onChange={handleChange("address")}
                            error={errors.address && touched.address ? errors.address : false}
                            value={values.address}
                            radius noBack noBorder
                            isDrak={isDark}
                            css={css`padding: 0 ${pixel(4)};`} />
                    </>
                    <>
                        <LabelText isDrak={isDark} isRTL={isRTL}
                            css={css`margin: 0px;`}>
                            {placeholder.yourPhone}
                        </LabelText>
                        <OuterGlobalUser isRTL={isRTL}>
                            <SwitchButton
                                value={controls.isPhone}
                                onChange={(bool) => {
                                    setControls({ ...controls, isPhone: bool });
                                }}
                                fontSize={pixel(13)}
                                text={badges.shareToAll}
                                element={<PublickSvg size={moderateScale(20)} />}
                            />
                        </OuterGlobalUser>
                        <PhoneInput
                            ref={phoneInput}
                            defaultValue={phone}
                            defaultCode={defaultCode}
                            layout="second"
                            containerStyle={{
                                width: "100%",
                                height: moderateScale(40),
                                borderRadius: moderateScale(4),
                                overflow: "hidden",
                                marginBottom: phoneValid !== null ? 0 : 24,
                                backgroundColor: colors["clr2"],
                            }}
                            textContainerStyle={{
                                height: moderateScale(40),
                                backgroundColor: colors[isDark ? "clr1" : "back1"],
                            }}
                            codeTextStyle={{
                                height: moderateScale(40),
                                lineHeight: moderateScale(40),
                                fontSize: moderateScale(13),
                                color: colors["back3"]
                            }}
                            textInputStyle={{
                                height: moderateScale(40),
                                color: colors[isDark ? "back2" : "clr1"],
                                fontSize: moderateScale(14)
                            }}
                            onChangeFormattedText={(text) => {
                                setPhone(text);
                                setPhoneValid(phoneInput.current.isValidNumber(text));
                            }}
                            countryPickerProps={{
                                withFilter: false,
                                withCloseButton: false,
                                withAlphaFilter: true
                            }}
                        />
                        {phoneValid !== null ? <OuterOneView activeOpacity={1} isRTL={isRTL}
                            back={phoneValid ? "clr2" : "red2"}
                            css={css`margin: 0;margin-top: ${pixel(2)};padding: ${pixel(4)};
                            justify-content: center;border-radius: ${pixel(4)};margin-bottom: ${pixel(20)};`}>
                            <AnyText lineH={pixel(24)} size={moderateScale(13)}>
                                {phoneValid ? schema.validPhone : schema.invalidPhone}
                            </AnyText>
                        </OuterOneView> : null}
                    </>
                    <>
                        <LabelText isDrak={isDark} isRTL={isRTL}
                            css={css`margin: 0px;`}>
                            {placeholder.birthday}
                        </LabelText>
                        <OuterGlobalUser isRTL={isRTL}>
                            <SwitchButton
                                value={controls.isBirthday}
                                onChange={(bool) => {
                                    setControls({ ...controls, isBirthday: bool });
                                }}
                                fontSize={pixel(13)}
                                text={badges.shareToAll}
                                element={<PublickSvg size={moderateScale(20)} />}
                            />
                        </OuterGlobalUser>
                        <OuterOneView activeOpacity={1} isRTL={isRTL}
                            back={isDark ? "clr1" : "back1"}
                            onPress={() => dispatch(Actions
                                .type("setCurrentModalWithNav", {
                                    key: "datepicker",
                                    date: startDate,
                                    callback: (date) => setDate(getBirthdayFromPicker(date))
                                }))}
                            css={css`margin: 0;padding: ${pixel(6)};
                            margin-bottom: ${pixel(20)};border-radius: ${pixel(4)};`}>
                            <BirthdaySvg size={moderateScale(20)} />
                            <AnyText isRTL={isRTL} autoMargin={pixel(6)}
                                size={moderateScale(13)}
                                color={isDark ? "back2" : "clr1"}>{date}</AnyText>
                        </OuterOneView>
                    </>
                    <>
                        <LabelText isDrak={isDark} isRTL={isRTL}
                            css={css`margin: 0px;`}>
                            {placeholder.gender}
                        </LabelText>
                        <OuterGlobalUser isRTL={isRTL}>
                            <SwitchButton
                                value={controls.isGender}
                                onChange={(bool) => {
                                    setControls({ ...controls, isGender: bool });
                                }}
                                fontSize={pixel(13)}
                                text={badges.shareToAll}
                                element={<PublickSvg size={moderateScale(20)} />}
                            />
                        </OuterGlobalUser>
                        <OuterOneView activeOpacity={1} isRTL={isRTL}
                            css={css`margin: 0;padding: 0px;justify-content: space-evenly;
                            margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};background: transparent;`}>
                            <OuterOneView activeOpacity={1} isRTL={isRTL}
                                back={isDark ? "clr1" : "back1"}
                                css={css`margin: 0 ${pixel(4)};padding: ${pixel(6)};justify-content: center;
                                border-radius: ${pixel(4)};width: ${pixel(100)};`} onPress={() => setGander(true)}>
                                <OuterSquarView size={moderateScale(16)}>
                                    {gender ? <OuterLazy background={colors["clr2"]} radius={moderateScale(4)} /> : null}
                                </OuterSquarView>
                                <AnyText isRTL={isRTL} autoMargin={pixel(6)}
                                    size={moderateScale(13)}
                                    color={isDark ? "back2" : "clr1"}>
                                    {buttons.male}
                                </AnyText>
                            </OuterOneView>
                            <OuterOneView activeOpacity={1} isRTL={isRTL}
                                back={isDark ? "clr1" : "back1"}
                                css={css`margin: 0 ${pixel(4)};padding: ${pixel(6)};justify-content: center;
                                    border-radius: ${pixel(4)};width: ${pixel(100)};`} onPress={() => setGander(false)}>
                                <OuterSquarView size={moderateScale(16)}>
                                    {gender ? null : <OuterLazy background={colors["clr2"]} radius={moderateScale(4)} />}
                                </OuterSquarView>
                                <AnyText isRTL={isRTL} autoMargin={pixel(6)}
                                    size={moderateScale(13)}
                                    color={isDark ? "back2" : "clr1"}>
                                    {buttons.female}
                                </AnyText>
                            </OuterOneView>
                        </OuterOneView>
                    </>
                </>}
            </Formik>
        </OuterOneView>
        <KeyboardSpacer />
    </ScrollBar>)
}

export default memo(RenderEditProfile);