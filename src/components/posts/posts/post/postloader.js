import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { OuterMainPost, OuterPostBodyContent, OuterPostTop } from './helperpostcss';
//////////////////////////////////////////////////////
import { ButtonCirculer, UserInfoModalTouch, ViewOuterCirculer } from '../../../home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../../../home/helperhome';
import { AnyText, OuterUserName } from '../../../home/helperprefernce';
import { OuterNameContent } from '../../../home/helpernotification/heplernotifycss';
import { MoreSvg } from '../../../../icons/all';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../../../styles/basecss';
import { ReactionIconAnim } from '../../../../icons/reaction';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////////
const OnePostLoader = () => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    //////////////////////////////////////////////////////////
    return (<OuterMainPost isDark={isDark}
        css={css`margin-bottom: ${pixel(8)};`}>
        <ReactionIconAnim
            animation="fadeIn"
            easing="ease-in-out"
            direction="alternate"
            iterationCount="infinite"
            duration={750}>
            <OuterPostTop isRTL={isRTL}
                css={css`border-bottom-width: ${pixel(1)};
                border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};`}>
                <UserInfoModalTouch isRTL={isRTL}
                    activeOpacity={0.8} css={css`width: 100%;flex: 1;`}>
                    <RenderAnyUserPhoto size={pixel(40)}
                        renderBadge={<ViewOuterCirculer
                            size={pixel(23)} back="clr1" css={css`position: absolute;
                                left: ${pixel(-2)};bottom: ${pixel(2)};`} />} />
                    <OuterUserName isRTL={isRTL}>
                        <AnyText isRTL={isRTL}
                            css={css`width: ${pixel(130)};height: ${pixel(16)};border-radius: ${pixel(5)};
                            background: ${colors[isDark ? "clr1" : "back1"]};margin-bottom: ${pixel(4)};`} />
                        <OuterNameContent isRTL={isRTL}>
                            <AnyText isRTL={isRTL}
                                css={css`width: ${pixel(140)};height: ${pixel(16)};border-radius: ${pixel(5)};
                                background: ${colors[isDark ? "clr1" : "back1"]};`} />
                        </OuterNameContent>
                    </OuterUserName>
                </UserInfoModalTouch>
                <ButtonCirculer isRTL={isRTL} size={pixel(28)} activeOpacity={1}
                    css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
                    <MoreSvg size={moderateScale(15)} rot={90} />
                </ButtonCirculer>
            </OuterPostTop>
            <OuterPostBodyContent
                css={css`margin: ${pixel(14)} 0px ${pixel(4)} 0px;min-height: ${pixel(140)};`} />
        </ReactionIconAnim>
    </OuterMainPost>)
}

export default memo(OnePostLoader);