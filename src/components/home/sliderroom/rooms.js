import React, { memo, useMemo } from 'react';
import { FlatList } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import CreateRoomMeetoor from './createroom';
import RenderRoomComponnet from './otherroom';
/////////////////////////////////////////////////
const RoomSliderMeetoor = () => {
    const { UserPhoto } = useSelector(state => state.main.user);
    const currentRooms = useSelector(state => state.main.currentRooms);
    /////////////////////////////////////////////
    const refullRooms = currentRooms?.length < 2 ? [...currentRooms,
    { temp: true }, { temp: true }, { temp: true }] : currentRooms;
    ////////////////////////////////////////////
    const OneRoomMemo = useMemo(() => ({ item }) => {
        return (<RenderRoomComponnet  {...item}
            temp={item.temp ? true : false} />);
    }, []);
    /////////////////////////////////////////////
    return <FlatList data={refullRooms}
        style={{ paddingLeft: moderateScale(4) }}
        renderItem={OneRoomMemo}
        keyExtractor={(room, i) => room.roomid + "room" + i}
        removeClippedSubviews
        legacyImplementation={false}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={<CreateRoomMeetoor userPhoto={UserPhoto} />}
        ListEmptyComponent={<>
            <RenderRoomComponnet temp={true} />
            <RenderRoomComponnet temp={true} />
            <RenderRoomComponnet temp={true} />
        </>} />
}

export default memo(RoomSliderMeetoor)
