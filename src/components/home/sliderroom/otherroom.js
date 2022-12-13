import React, { memo, useMemo } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux'
import { ProfileSvg } from '../../../icons/all';
import { HandelNumber } from '../../../reducer/helper';
import { pixel } from '../../../styles/basecss';
import { AnyText } from '../helperprefernce';
import {
    RoomContentOuter,
    RoomBadgeCount, RoomContentOuterOps,
    RoomHeaderOuter, OuterUserSpeaker
} from './helperroomcss';
////////////////////////////////////////////
const RenderRoomComponnet = ({ speakers = [], header, count, roomid, temp }) => {
    const mainSocket = useSelector(state => state.main.socket);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    ///////////////////////////////////////////
    const RoomCount = useMemo(() => HandelNumber(count, 0, true), [count]);
    ///////////////////////////////////////////
    return (<>{temp ? <RoomContentOuterOps>
        <RoomHeaderOuter dir="column"
            height={pixel(60)} justify="flex-start" noBack>
            <OuterUserSpeaker />
            <OuterUserSpeaker />
            <OuterUserSpeaker />
        </RoomHeaderOuter>

        <RoomHeaderOuter height={pixel(50)} >
            <RoomBadgeCount />
        </RoomHeaderOuter>
    </RoomContentOuterOps> :
        <RoomContentOuter width={pixel(170)}
            onPress={() => {
                mainSocket.emit("joinAudioRoom", {
                    roomId: roomid,
                });
            }}>
            <RoomHeaderOuter dir="column"
                height={pixel(60)} justify="flex-start" noBack>
                {speakers.slice(0, 4)
                    .map(({ fullName }) => (<OuterUserSpeaker key={fullName} isRTL={isRTL}>
                        <ProfileSvg color="back3" size={moderateScale(15)} />
                        <AnyText autoMargin={pixel(8)}
                            isRTL={isRTL} color="back3"
                            lower size={moderateScale(13)}>
                            {fullName}
                        </AnyText>
                    </OuterUserSpeaker>))}
            </RoomHeaderOuter>
            <RoomHeaderOuter height={pixel(50)} isDark={isDark}
                dir="column" style={{ padding: moderateScale(10) }}>
                <AnyText lower isRTL={isRTL}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    color="clr2" size={moderateScale(13)}
                    lineH={pixel(18)}>
                    {header}
                </AnyText>
                <RoomBadgeCount isRTL={isRTL}>
                    <AnyText isRTL={isRTL}
                        size={moderateScale(13)}
                        lower color="clr2">
                        {RoomCount}
                    </AnyText>
                </RoomBadgeCount>
            </RoomHeaderOuter>
        </RoomContentOuter>
    }</>)
}

export default memo(RenderRoomComponnet)
