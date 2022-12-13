import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { AnyText } from '../helperprefernce';
import StatusBodyMeetoor from './bodystatus';
import { RoomHeaderOuter, UserImageRoom } from '../sliderroom/helperroomcss';
import { StatusContentWithoutTouch, StatusContentOuter } from './helperstatuscss';
import { css } from 'styled-components';
import { useCallback } from 'react';
import { colors, pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const OtherStatusMeetoor = ({ story, index = 0 }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const GoToStatus = useCallback(() => {
        navigate("viewstatus", { activeIdx: index });
    }, [navigate, story, index]);
    ////////////////////////////////////////
    return (<>{story.temp ? <StatusContentWithoutTouch
        width={pixel(60)} height={pixel(105)} isDark={isDark}>
        <UserImageRoom source={{ uri: null }} sizeImage={pixel(60)}
            css={css`border-radius: ${pixel(60)};border-width: ${pixel(2.5)};
                border-color: ${colors["clr2"]};opacity: 0.5;`} />
        <RoomHeaderOuter height={pixel(45)} noBack>
            <AnyText lower isRTL={isRTL} numberOfLines={1} ellipsizeMode="tail"
                color="clr2" size={moderateScale(13)} lineH={pixel(20)}
                css={css`opacity: 0.5;`}>
                {"----------"}
            </AnyText>
        </RoomHeaderOuter>
    </StatusContentWithoutTouch> :
        <StatusContentOuter width={pixel(70)} height={pixel(105)}
            activeOpacity={0.9} isDark={isDark}
            onPress={GoToStatus}>
            {story && <>
                <StatusBodyMeetoor {...story} />
                <RoomHeaderOuter height={pixel(45)} noBack>
                    <AnyText lower isRTL={isRTL} numberOfLines={1} ellipsizeMode="tail"
                        color={isDark ? "back2" : "clr3"} size={moderateScale(12.5)} lineH={pixel(20)}>
                        {story?.storyName?.split(' ')?.[0] || ""}
                    </AnyText>
                </RoomHeaderOuter>
            </>}
        </StatusContentOuter>}
    </>)
}

export default memo(OtherStatusMeetoor)
