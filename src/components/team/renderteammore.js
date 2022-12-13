import React, { memo } from 'react';
import { useSelector } from 'react-redux';
/////////////////////////////////////////////
import { css } from 'styled-components';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { AnyText, OuterProfileUser } from '../home/helperprefernce';
import {
    BusinessSvg, JobSvg,
    SkillSvg, TeamsSvg
} from '../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../styles/basecss';
/////////////////////////////////////////////
const RenderTeamMore = ({ interset, members = 0, teamCoporation, teamDescription }) => {
    const { buttons } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        back={isDark ? "clr1" : "back1"}
        css={css`padding: ${pixel(4)};flex-direction: column;
            margin: 0;margin-bottom: ${pixel(4)};`}>
        <OuterProfileUser activeOpacity={1} isRTL={isRTL}
            css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
            <TeamsSvg size={moderateScale(17)} />
            <AnyText isRTL={isRTL} lower color={isDark ? "back3" : "clr3"}
                size={moderateScale(13)} autoMargin={pixel(6)}>
                {`${members} ${buttons.member}`}
            </AnyText>
        </OuterProfileUser>
        <OuterProfileUser activeOpacity={1} isRTL={isRTL}
            css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
            <SkillSvg size={moderateScale(17)} />
            <AnyText isRTL={isRTL} lower color={isDark ? "back3" : "clr3"}
                size={moderateScale(13)} autoMargin={pixel(6)}>
                {interset}
            </AnyText>
        </OuterProfileUser>
        <OuterProfileUser activeOpacity={1} isRTL={isRTL}
            css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
            <BusinessSvg size={moderateScale(20)} />
            <AnyText isRTL={isRTL} lower color={isDark ? "back3" : "clr3"}
                size={moderateScale(13)} autoMargin={pixel(6)}>
                {teamCoporation}
            </AnyText>
        </OuterProfileUser>
        <OuterProfileUser activeOpacity={1} isRTL={isRTL}
            css={css`margin: ${pixel(2)} 0px;padding: ${pixel(2)} ${pixel(4)};`}>
            <JobSvg size={moderateScale(17)} />
            <AnyText isRTL={isRTL} lower color={isDark ? "back3" : "clr3"}
                lineH={pixel(15)} size={moderateScale(13)} autoMargin={pixel(6)}>
                {teamDescription}
            </AnyText>
        </OuterProfileUser>
    </OuterOneView>)
}

export default memo(RenderTeamMore);