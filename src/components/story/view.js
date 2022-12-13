import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OneStoryMeetoor from "./onestory";
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { moderateScale } from 'react-native-size-matters';
import { WaveIndicator } from 'react-native-indicators';
import { OuterLazy } from '../home/helperhome';
import { View } from 'react-native';
import Axios from '../../main/Axios';
////////////////////////////////////////////
const StoryOneViewer = ({ username }) => {
    console.log("StoryOneViewer ~ username", username)
    const dispatch = useDispatch();
    const User = useSelector(state => state.main.user);
    const token = useSelector(state => state.sign.token);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { goBack } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const [loading, setLoading] = useState(true);
    const [story, setStory] = useState({});
    ////////////////////////////////////////
    const getStory = useCallback(async () => {
        try {
            const response = await Axios.get(`getStory/?username=${username}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log("getStory ~ response", response?.data)
            if (response?.data?.length) {
                setLoading(false);
                setStory(response?.data[0]);
            } else {
                setLoading(false);
                goBack();
            }
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    ////////////////////////////////////////
    useEffect(() => {
        getStory();
        dispatch(Actions.type("setStatusBarDark", true));
        return () => dispatch(Actions.type("setStatusBarDark", false));
    }, []);
    ////////////////////////////////////////
    return (loading ?
        <OuterLazy background={colors[isDark ? "clr1" : "back1"]} height={pixel(300)}>
            <WaveIndicator size={moderateScale(140)} color={colors[isDark ? "back3" : "clr1"]} />
        </OuterLazy> :
        <View style={{
            flex: 1, width: '100%', height: "100%",
            backgroundColor: colors[isDark ? "clr1" : "back1"]
        }}>
            <OneStoryMeetoor active={true} {...story} owen={username === User.username} />
        </View>);
}

export default memo(StoryOneViewer);