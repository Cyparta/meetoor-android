import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HumberSvg } from '../../icons/all';
import { MinLogoSvg } from '../../icons/logo';
import {
    RenderUserPhoto,
    OuterLogo,
    RenderUserNotify,
    RenderUserChats,
    TabBarBottom,
    TabOuterButton,
    BadgeNumer
} from './helperhome';
import { ReactionIconAnim } from '../../icons/reaction';
import { colors, pixel, Rgba } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
import Actions from '../../reducer/actions';
import Axios from '../../main/Axios';
import AsyncStorage from '@react-native-community/async-storage';
///////////////////////////////////////////////////
const RenderTabBarBottom = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate, current, getCurrentRoute } = useSelector(state => state.modal.navigation);
    const [currentRoute, setCurrentRoute] = useState("home");
    const [newTrendsFlag, setNewTrendsFlag] = useState(false);
    const [hide, setHide] = useState(false);
    ///////////////////////////////////////////////
    useEffect(() => {
        let getCurrentStateRoute = null;
        if (current) {
            getCurrentStateRoute = () => {
                let route = getCurrentRoute()?.name || "home";
                switch (route) {
                    case "home":
                    case "profile":
                    case "prefernce":
                    case "tabsmenu":
                    case "chats":
                    case "notifications":
                    case "teamposts":
                    case "search":
                    case "trends":
                    case "friends":
                    case "anonychats":
                        setHide(false);
                        break;
                    default:
                        setHide(true);
                        break;
                }
                setCurrentRoute(route);
            }
            current?.addListener('state', getCurrentStateRoute);
        }
        return () => current?.removeListener('state', getCurrentStateRoute);
    }, [current]);
    ////////////////////////////////////////////////
    const getTrends = () => async (dispatch, getState) => {
        try {
            let trends = getState().posts.trends;
            const response = await Axios.get(`getTrends/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setTrends", response.data));
            let dataLength = response?.data?.length;
            if (dataLength) {
                trends = trends.slice(0, 3);
                let data = response?.data.slice(0, 3);
                if (trends.length) {
                    let newTrends = false;
                    for (let index = 0; index < 3; index++) {
                        console.log("getTrends ~ index", index)
                        if (!trends[index]) continue;
                        if (data[index].hastag !== trends[index].hastag) {
                            newTrends = true;
                            break;
                        }
                    }
                    newTrends && setNewTrendsFlag(true);
                }
                await AsyncStorage.setItem(`@trends_${token}`, JSON.stringify(data));
            }
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    };
    useEffect(() => {
        dispatch(getTrends());
    }, []);
    useEffect(() => {
        let cleanTrendsInterval = 0;
        if (!(currentRoute === "tabsmenu" || hide)) {
            cleanTrendsInterval = setInterval(() => dispatch(getTrends()), 150 * 1000);
        }
        /////////////////////////////////////////
        return () => clearInterval(cleanTrendsInterval);
    }, [currentRoute, hide]);
    /////////////////////////////////////////////////
    return (<TabBarBottom isRTL={isRTL} isDark={isDark} hide={hide}
        css={css`border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};`}>
        <TabOuterButton activeOpacity={0.8}
            onPress={() => navigate("prefernce")}>
            <ReactionIconAnim duration={750}
                animation={currentRoute === "prefernce" ? "pulse" : null}
                easing="linear" iterationCount={1} iterationDelay={1}>
                <RenderUserPhoto size={pixel(35)} />
            </ReactionIconAnim>
        </TabOuterButton>

        <TabOuterButton activeOpacity={0.8}
            onPress={() => navigate("chats")}>
            <RenderUserChats active={currentRoute === "chats"} />
        </TabOuterButton>
        <TabOuterButton activeOpacity={0.8}
            onPress={() => navigate("home")}
            delayLongPress={200}
            onLongPress={() => {
                console.log("RenderTabBarBottom ~ onLongPress")
                dispatch(Actions.type("setGoToTop", {
                    nav: currentRoute,
                    up: Math.floor(Math.random() * 100) + 1
                }));
            }}>
            <OuterLogo isDark={isDark} style={{
                shadowColor: colors["clr3"], elevation: 30,
                shadowOpacity: 0.1, shadowRadius: 0,
            }}>
                <ReactionIconAnim animation={"bounce"}
                    easing="linear" iterationCount={1} duration={1200}>
                    <MinLogoSvg size={moderateScale(40)} />
                </ReactionIconAnim>
            </OuterLogo>
        </TabOuterButton>

        <TabOuterButton activeOpacity={0.8}
            onPress={() => navigate("notifications")}>
            <RenderUserNotify active={currentRoute === "notifications"} />
        </TabOuterButton>

        <TabOuterButton activeOpacity={0.8}
            onPress={() => {
                setNewTrendsFlag(false);
                navigate("tabsmenu");
            }}>
            <ReactionIconAnim
                animation={currentRoute === "tabsmenu" ? "pulse" : null}
                easing="linear" iterationCount={1} duration={750}>
                <HumberSvg size={moderateScale(26)} />
            </ReactionIconAnim>
            {newTrendsFlag ? <BadgeNumer isRTL={true} css={css`height: ${pixel(20)};
                transform: scale(0.75);top: ${pixel(0)};right: ${pixel(5)};opacity: 0.95;`} /> : null}
        </TabOuterButton>
    </TabBarBottom>)
};

export default memo(RenderTabBarBottom);