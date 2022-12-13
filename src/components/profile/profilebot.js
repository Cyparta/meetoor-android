import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
/////////////////////////////////////////////
import { css } from 'styled-components';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { AnyText, OuterProfileUser } from '../home/helperprefernce';
import {
    AddressSvg, BirthdaySvg, CountrySvg,
    GanderSvg, JobSvg, JoinedSvg, LinkSvg, LockSvg,
    PhoneSvg, SkillSvg, TeamsSvg
} from '../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../styles/basecss';
/////////////////////////////////////////////
const RenderBotProfile = ({ isMe, username }) => {
    const { buttons, badges } = useSelector(state => state.sign.langData);
    const control = useSelector(state => state.main.user.controlInfo);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    const profiles = useSelector(state => state.profile.profiles);
    const infos = profiles[username]?.user?.infos;
    /////////////////////////////////////////
    const iconByKey = {
        "job": <JobSvg size={moderateScale(18)} />,
        "skill": <SkillSvg size={moderateScale(18)} />,
        "followers": <TeamsSvg size={moderateScale(18)} />,
        "Phone": <PhoneSvg color={isDark ? "back2" : "clr1"} size={moderateScale(18)} />,
        "Address": <AddressSvg size={moderateScale(18)} />,
        "country": <CountrySvg size={moderateScale(18)} />,
        "gender": <GanderSvg size={moderateScale(18)} />,
        "joinDate": <JoinedSvg size={moderateScale(18)} />,
        "birthday": <BirthdaySvg size={moderateScale(18)} />,
        "yourlink": <LinkSvg size={moderateScale(18)} />
    }
    /////////////////////////////////////////
    const isPuplic = {
        "job": true,
        "skill": true,
        "joinDate": true,
        "yourlink": true,
        "followers": true,
        "Phone": control?.isPhone,
        "Address": control?.isAddress,
        "country": control?.isCountry,
        "gender": control?.isGender,
        "birthday": control?.isBirthday
    }
    /////////////////////////////////////////
    const RenderInfo = useCallback(({ dataInfo }) => (Object.keys(iconByKey).map((key, i) => {
        let info = dataInfo[key];
        if (!info && info !== 0) return null;
        let icon = iconByKey[key];
        let lock = isPuplic[key];
        switch (key) {
            case "gender":
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
                    {icon}{!lock && isMe ? <>
                        <AnyText isRTL={isRTL} size={moderateScale(13)} autoMargin={pixel(6)} />
                        <LockSvg color="clr2" size={moderateScale(17)} />
                    </> : null}
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {buttons[info ? "male" : "female"]}
                    </AnyText>
                </OuterProfileUser>);
            case "joinDate":
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
                    {icon}
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {badges.joindAt}
                    </AnyText>
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {info}
                    </AnyText>
                </OuterProfileUser>);
            case "followers":
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={isMe ? 0.8 : 1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`} onPress={() => {
                        isMe && navigate("followers");
                    }}>
                    {icon}
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isMe ? "clr2" : isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {info}
                    </AnyText>
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isMe ? "clr2" : isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {badges.followers}
                    </AnyText>
                </OuterProfileUser>);
            case "birthday":
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
                    {icon}{!lock && isMe ? <>
                        <AnyText isRTL={isRTL} autoMargin={pixel(6)} size={moderateScale(13)} />
                        <LockSvg color="clr2" size={moderateScale(17)} />
                    </> : null}
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {badges.bornIn}
                    </AnyText>
                    <AnyText isRTL={isRTL} lower size={moderateScale(13)}
                        color={isDark ? "back3" : "clr3"} autoMargin={pixel(6)}>
                        {info}
                    </AnyText>
                </OuterProfileUser>);
            case "yourlink":
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`} onPress={() => {
                        Linking.openURL(info);
                    }}>
                    {icon}
                    <AnyText isRTL={isRTL} size={moderateScale(13)} lower numberOfLines={1} ellipsizeMode="tail"
                        width={"100%"} color="clr2" autoMargin={pixel(6)} css={css`flex: 1;`}>
                        {info}
                    </AnyText>
                </OuterProfileUser>);
            default:
                return (<OuterProfileUser key={key + "_info_" + i} activeOpacity={1} isRTL={isRTL}
                    css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
                    {icon}{!lock && isMe ? <>
                        <AnyText isRTL={isRTL} autoMargin={pixel(6)} size={moderateScale(13)} />
                        <LockSvg color="clr2" size={moderateScale(17)} />
                    </> : null}
                    <AnyText isRTL={isRTL} lower
                        color={isDark ? "back3" : "clr3"}
                        size={moderateScale(13)} autoMargin={pixel(6)}>
                        {info}
                    </AnyText>
                </OuterProfileUser>);
        }
    })), [iconByKey, isPuplic, isRTL, isDark]);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        back={isDark ? "clr1" : "back1"}
        css={css`padding: ${pixel(4)};flex-direction: column;margin: 0;
            ${isMe ? null : `margin-bottom: ${pixel(4)};`};`}>
        {infos ? <RenderInfo dataInfo={infos} /> : null}
    </OuterOneView>)
}

export default memo(RenderBotProfile);