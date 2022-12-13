import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { FlatList } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../../../main/Axios';
import Actions from '../../../reducer/actions';
import { colors } from '../../../styles/basecss';
import CreateStatusMeetoor from './createstatus';
import MyStatusMeetoor from './mystatus';
import OtherStatusMeetoor from './otherstatus';
/////////////////////////////////////////////////
const StatusSliderMeetoor = () => {
    const dispatch = useDispatch();
    const { UserPhoto, first_name } = useSelector(state => state.main.user);
    const token = useSelector(state => state.sign.token);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const story = useSelector(state => state.main.myStory);
    const currentStories = useSelector(state => state.main.currentStories);
    //////////////////////////////////////////
    const refullStories = currentStories?.length <= 3 ? [...currentStories,
    { temp: true }, { temp: true }, { temp: true }] : currentStories;
    //////////////////////////////////////////
    const getMyStory = useCallback(async () => {
        try {
            const response = await Axios.get(`myStory/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setMyStory", { type: "set", data: response.data[0] }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    //////////////////////////////////////////
    const getStories = useCallback(async () => {
        try {
            const response = await Axios.get(`currentStories/?idLt=0`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setCurrentStories", { type: "set", data: response.data }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    ///////////////////////////////////////////
    useEffect(() => {
        getMyStory();
        getStories();
        let storySetter = setInterval(getStories, 120 * 1000);
        ///////////////////////////////////////
        return () => clearInterval(storySetter);
    }, [token]);
    ////////////////////////////////////////////
    const OneStatusMemo = useMemo(() => ({ item, index }) => {
        return (<OtherStatusMeetoor story={item} index={index} />);
    }, []);
    ///////////////////////////////////////////
    return <FlatList inverted={isRTL}
        style={{
            paddingTop: moderateScale(10),
            // marginBottom: moderateScale(8),
            backgroundColor: colors[isDark ? "clr1" : "back1"]
        }}
        data={refullStories.slice(0, 10)}
        renderItem={OneStatusMemo}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(story, i) => story.storyId + "story" + i}
        removeClippedSubviews
        legacyImplementation={false}
        horizontal={true}
        ListHeaderComponent={story ? <MyStatusMeetoor story={story} />
            : <CreateStatusMeetoor userPhoto={UserPhoto} name={first_name} />}
        ListEmptyComponent={<>
            <OtherStatusMeetoor temp={true} />
            <OtherStatusMeetoor temp={true} />
            <OtherStatusMeetoor temp={true} />
            <OtherStatusMeetoor temp={true} />
            <OtherStatusMeetoor temp={true} />
            <OtherStatusMeetoor temp={true} />
        </>} />
}

export default memo(StatusSliderMeetoor)
