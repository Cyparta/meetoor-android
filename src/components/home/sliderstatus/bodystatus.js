import React, { memo } from 'react';
import { useSelector } from 'react-redux'
import { PlayControlSvg } from '../../../icons/all';
import { OuterFitImage } from '../createstatus/helpercreatestatuscss';
import { ProcessTextWithLink } from '../../../main/processtext/processtext';
import { StatusFitImageOuter } from './helperstatuscss';
import { ViewOuterCirculer } from '../sliderroom/helperroomcss';
import { moderateScale } from 'react-native-size-matters';
import FitFastImage from '../../../main/renderfile/fit-fast-image';
import { colors, pixel } from '../../../styles/basecss';
import { css } from 'styled-components';
////////////////////////////////////////////
const StatusBodyMeetoor = ({ background, frame, isVideo, storyFile, storyText }) => {
    const isDark = useSelector(state => state.sign.isDark);
    /////////////////////////////////////////
    const { content } = ProcessTextWithLink(storyText, {
        isDark, size: moderateScale(10),
        center: true, opacity: true,
        colorStatus: background
    }).text;
    /////////////////////////////////////////
    return (<StatusFitImageOuter back="trans"
        css={css`width: ${pixel(60)};height: ${pixel(60)};border-radius: ${pixel(60)};
            overflow: hidden;border-width: ${pixel(2.5)};border-color: ${colors["clr2"]};`}>
        <OuterFitImage enabled={false}>
            {background ?
                <FitFastImage width={moderateScale(60)} height={moderateScale(60)}
                    uri={`https://cdn.meetoor.com/frontend/img/statusback/st_${background}.jpeg`}>
                    {content}
                </FitFastImage>
                :
                <FitFastImage height={moderateScale(120)} height={moderateScale(60)}
                    uri={isVideo ? frame : storyFile}>
                    {isVideo ? <ViewOuterCirculer back="clr2" 
                    style={{opacity: 0.75}} size={pixel(30)}>
                        <PlayControlSvg color="back3" size={moderateScale(14)} />
                    </ViewOuterCirculer> : null}
                </FitFastImage>}
        </OuterFitImage>
    </StatusFitImageOuter>)
}

export default memo(StatusBodyMeetoor);
