import AsyncStorage from '@react-native-community/async-storage';
import React, { memo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import { OuterTabs, TabText } from './tabs';
/////////////////////////////////////////////////////
const RenderTrends = ({ short, refreshing, setRefreshing }) => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { messages, buttons } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const trends = useSelector(state => state.posts.trends);
    //////////////////////////////////////////////
    const getTrends = useCallback(async () => {
        try {
            const response = await Axios.get(`getTrends/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log("response ~ trends", response.data.length);
            dispatch(Actions.type("setTrends", response.data));
            if (response?.data?.length) {
                await AsyncStorage.setItem(`@trends_${token}`, JSON.stringify(response?.data.slice(0, 3)));
            }
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, []);
    /////////////////////////////////////////////
    useEffect( () => {
        const GetSavedTrends = async () => {
            try {
                if (trends === undefined || trends?.length < 1) {
                    const trendsStorage = await AsyncStorage.getItem(`@trends_${token}`);
                    if (trendsStorage && trendsStorage?.length) dispatch(Actions.type("setTrends", JSON.parse(trendsStorage)));
                    getTrends();
                }
            }
            catch (e) {
                console.log("R => ", e)
            }
        }
        GetSavedTrends();
    }, []);
    useEffect(() => {
        const GetTrends = async () => {
            if (!refreshing) return;
            try {
                await getTrends();
                setRefreshing(false);
            } catch (e) {
                console.log("Dashbord -> error.data", e)
            }
        }
        GetTrends();
    }, [refreshing === true]);
    /////////////////////////////////////////////
    return (<>{trends.length ? (short ? trends.slice(0, 3) : trends)
        .map((trend, i) => (<OuterTabs isRTL={isRTL}
            isDark={isDark} activeOpacity={0.9}
            trends column key={trend.num + "hash_" + trend.hastag + i}
            onPress={() => navigate("trend", { hashtag: trend.hastag })}>
            <TabText isRTL={isRTL} isDark={isDark} trends>
                {"#"}{trend.hastag}
            </TabText>
            <TabText isRTL={isRTL} isDark={isDark} numberIn>
                {messages.cited} {trend.num} {buttons.posts}
            </TabText>
        </OuterTabs>)) : null}</>)
}

export default memo(RenderTrends);