import React, { memo } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux'
import { CamSvg, PlusSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { pixel } from '../../../styles/basecss';
import { AnyText } from '../helperprefernce';
import {
    RoomBadgeCreate, RoomBadgeCreateIn,
    RoomContentOuter, RoomHeaderOuter,
    UserImageRoom
} from './helperroomcss';
////////////////////////////////////////////
const CreateRoomMeetoor = ({ userPhoto }) => {
    const dispatch = useDispatch();
    const { tabsData } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    return (<RoomContentOuter width={pixel(80)} activeOpacity={0.9}
    // onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "createroom" }))}
    >
        <UserImageRoom
            source={{ uri: userPhoto }}
            sizeImage={pixel(80)} />
        <RoomHeaderOuter isDark={isDark} height={pixel(30)}>
            <AnyText lower isRTL={isRTL} color="clr2"
                size={moderateScale(13)} lineH={pixel(20)}>
                {tabsData.createRoom}
            </AnyText>

            <RoomBadgeCreate isDark={isDark}>
                <CamSvg color="red2" size={moderateScale(24)} />
                <RoomBadgeCreateIn>
                    <PlusSvg color="clr1" size={moderateScale(15)} />
                </RoomBadgeCreateIn>
            </RoomBadgeCreate>
        </RoomHeaderOuter>
    </RoomContentOuter>)
}

export default memo(CreateRoomMeetoor)
