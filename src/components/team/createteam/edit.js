import React, { memo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { CorrectSvg } from '../../../icons/all';
import { OuterOneView } from '../../home/helpernotification/heplernotifycss';
import { AnyText, OuterUserName, ScrollBar } from '../../home/helperprefernce';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../../sign/helperinput';
import Axios from '../../../main/Axios';
import { TopNavigateOuter } from '../../posts/createpost/helpercreatepostcss';
import { ButtonCirculer, OuterButtonControl, UserInfoModal } from '../../home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../../home/helperhome';
import { colors, pixel } from '../../../styles/basecss';
import { WaveIndicator } from 'react-native-indicators';
import useGoBack from "../../../main/goback";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { moderateScale } from 'react-native-size-matters';
import { ToastAndroid } from 'react-native';
import Actions from '../../../reducer/actions';
///////////////////////////////////////////////////
const RenderEditTeam = ({
    teamName = "",
    interset = "",
    discription = "",
    corporation = "",
    teamid
}) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { teamsData, schema } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const user = useSelector(state => state.main.user);
    const handleBack = useGoBack();
    ////////////////////////////////////////////////
    const Scroll = useRef();
    const formRef = useRef();
    ////////////////////////////////////////////////
    const [save, setSave] = useState(true);
    ///////////////////////////////////////////
    const handleTeam = async ({
        teamname,
        interset,
        discription,
        corporation
    }) => {
        try {
            setSave(false);
            ToastAndroid.show(teamsData.editteam, ToastAndroid.LONG);
            ///////////////////////////////////////////
            let data = new FormData();
            data.append('TeamName', teamname);
            data.append('TeamDescription', discription);
            data.append('interset', interset);
            data.append('Corporation', corporation);
            const response = await Axios.post(`teamInfo/?teamname=${teamName}`, data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setSave(true);
            dispatch(Actions.type("setTeams", {
                type: 'update',
                data: {
                    key: `teaminfo-${teamid}`,
                    call: (target) => {
                        target.teamName = teamname;
                        target.interset = interset;
                        target.teamCoporation = corporation;
                        target.teamDescription = discription;
                    }
                }
            }));
            mainSocket.emit("editTeam", { ...response.data, editTeam: teamname });
            handleBack();
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }
    ////////////////////////////////////////
    return (<ScrollBar isDark={isDark} ref={Scroll}
        keyboardShouldPersistTaps='handled'
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
                        {teamsData.editTeam}
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
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(6)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <Formik innerRef={formRef}
                initialValues={{
                    teamname: teamName,
                    interset,
                    discription,
                    corporation
                }}
                validationSchema={Yup.object({
                    teamname: Yup.string()
                        .required(schema.required)
                        .test(schema.valid.special,
                            schema.valid.special,
                            (val) => {
                                return !(/[._^%$#!~@,-]/g.test(val));
                            }).trim(),
                    interset: Yup.string()
                        .required(schema.required),
                    discription: Yup.string()
                        .required(schema.required),
                    corporation: Yup.string()
                        .required(schema.required),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    handleTeam(values);
                    setSubmitting(false);
                }}>
                {({ values, handleChange, errors, touched }) => <>
                    <Input placeholder={teamsData.teamName}
                        label={teamsData.teamName}
                        onChange={handleChange("teamname")}
                        error={errors.teamname && touched.teamname ? errors.teamname : false}
                        value={values.teamname}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />
                    <Input placeholder={teamsData.interest}
                        label={teamsData.interest}
                        onChange={handleChange("interset")}
                        error={errors.interset && touched.interset ? errors.interset : false}
                        value={values.interset}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />
                    <Input placeholder={teamsData.corporation}
                        label={teamsData.corporation}
                        onChange={handleChange("corporation")}
                        error={errors.corporation && touched.corporation ? errors.corporation : false}
                        value={values.corporation}
                        radius noBack noBorder
                        isDrak={isDark}
                        css={css`padding: 0 ${pixel(4)};`} />
                    <Input placeholder={teamsData.discription}
                        label={teamsData.discription}
                        onChange={handleChange("discription")}
                        error={errors.discription && touched.discription ? errors.discription : false}
                        value={values.discription}
                        radius noBack noBorder height={"auto"}
                        multiline numberOfLines={2}
                        isDrak={isDark} mainMargin={moderateScale(0.01)}
                        css={css`padding: 0 ${pixel(4)};`} />
                </>}
            </Formik>
        </OuterOneView>
        <KeyboardSpacer />
    </ScrollBar>)
}

export default memo(RenderEditTeam);