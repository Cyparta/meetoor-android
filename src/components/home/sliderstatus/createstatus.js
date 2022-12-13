import React, { memo } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux'
import { css } from 'styled-components';
import { PlusSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { colors, pixel } from '../../../styles/basecss';
import { AnyText } from '../helperprefernce';
import { RoomBadgeCreate, RoomHeaderOuter, UserImageRoom } from '../sliderroom/helperroomcss';
import { StatusContentOuter } from './helperstatuscss';
////////////////////////////////////////////
const CreateStatusMeetoor = ({ name, userPhoto }) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    return (<StatusContentOuter width={pixel(60)} height={pixel(105)} activeOpacity={0.9}
        onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "createstatus" }))}>
        <UserImageRoom source={{ uri: userPhoto }} sizeImage={pixel(60)}
            css={css`border-radius: ${pixel(60)};border-width: ${pixel(2.5)};
                border-color: ${colors["clr2"]};`} />
        <RoomHeaderOuter height={pixel(45)} noBack>
            <AnyText lower isRTL={isRTL} numberOfLines={1} ellipsizeMode="tail"
                color={isDark ? "back2" : "clr3"} size={moderateScale(13)} lineH={pixel(20)}>
                {name}
            </AnyText>
            <RoomBadgeCreate isDark={isDark} top={pixel(-18)}>
                <PlusSvg size={moderateScale(16)} />
            </RoomBadgeCreate>
        </RoomHeaderOuter>
    </StatusContentOuter>)
}

export default memo(CreateStatusMeetoor)
