import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from 'react-native';
import { colors, pixel } from '../styles/basecss';
import { AnyText, FlatScroll } from './home/helperprefernce';
import Axios from '../main/Axios';
import { OuterOneContent, OuterOneView } from './home/helpernotification/heplernotifycss';
import { css } from 'styled-components';
import Actions from '../reducer/actions';
import { OuterLazy, RenderAnyUserPhoto } from './home/helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { ButtonNormal, ViewOuterCirculer } from './home/sliderroom/helperroomcss';
import { LeaveSvg, TeamsSvg } from '../icons/all';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
const RenderOneTeam = memo(({ TeamCoporation, TeamLogo, TeamName, teamid }) => {
    const dispatch = useDispatch();
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { buttons } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    ////////////////////////////////////////////
    const [holder, setHolder] = useState(false);
    ////////////////////////////////////////////
    const leaveThisTeam = useCallback(() => dispatch(Actions.type("setCurrentModalWithNav", {
        key: "alert",
        YesFunc: () => {
            setHolder(<ButtonNormal
                isRTL={isRTL} radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1"
                css={css`margin: 0px;height: ${pixel(30)};min-width: ${pixel(60)};`}>
                <DotIndicator size={moderateScale(3)} count={7} color={colors["clr2"]} />
            </ButtonNormal>);
            mainSocket.emit("leaveTeam", { teamid });
            setTimeout(() => {
                dispatch(Actions.type("setTeamsJoin", {
                    type: 'delete', data: {
                        target: teamid,
                        key: 'teamid'
                    }
                }));
            }, 1500);
        }
    })), [teamid])
    ////////////////////////////////////////////
    return (<OuterOneView activeOpacity={0.9} isRTL={isRTL}
        onPress={() => navigate("team", { teamid })}>
        <RenderAnyUserPhoto userPhoto={TeamLogo} size={pixel(70)}
            renderBadge={<ViewOuterCirculer
                size={pixel(25)} back="clr1" css={css`position: absolute;left: ${pixel(3)};bottom:${pixel(3)};`}>
                <TeamsSvg color="back3" size={moderateScale(16)} />
            </ViewOuterCirculer>} />
        <OuterOneContent isRTL={isRTL} width="100%">
            <AnyText size={moderateScale(13)} lower color={isDark ? "back2" : "clr1"} lineH={pixel(14)}
                numberOfLines={1} width={"100%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 95%;`}>{TeamName}</AnyText>
            <AnyText size={moderateScale(11)} lower color="clr2" lineH={pixel(12)}
                numberOfLines={1} width={"100%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 95%;`}>{TeamCoporation}</AnyText>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                {holder ? holder : <ButtonNormal isRTL={isRTL} radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1"
                    css={css`margin: 0px;padding: ${pixel(4)};`}
                    onPress={leaveThisTeam}>
                    <LeaveSvg color="red2" size={moderateScale(16)} />
                    <AnyText lower color="red2"
                        isRTL={isRTL} lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.leaveTeam}
                    </AnyText>
                </ButtonNormal>}
            </OuterOneView>
        </OuterOneContent>
    </OuterOneView>)
});
///////////////////////////////////////////////
const RenderMeetoorTeamsInside = () => {
    const dispatch = useDispatch();
    const { tabsData, messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const DATA_RENDER = useSelector(state => state.team.teamsJoin);
    const usersLastId = useSelector(state => state.sign.usersLastId);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    /////////////////////////////////////////////
    const keyArray = `joinTeams/`;
    const IdLt = usersLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getTeamsInside = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`${keyArray}?idLt=${first ? 0 : IdLt}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            if (responseData?.length === 0 || responseData?.noMore) {
                setGetMore(false);
                setLoadMore(false);
                callback && callback();
                first && dispatch(Actions.type("setTeamsJoin", {
                    type: 'set',
                    data: []
                }));
                return;
            }
            let lastId = responseData[(responseData?.length - 1) || 0];
            dispatch(Actions.type("setUsersLastId", {
                key: keyArray,
                val: lastId.idlt
            }));
            dispatch(Actions.type("setTeamsJoin", {
                type: first ? 'set' : "push",
                data: response.data
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [keyArray, isLoadMore, IdLt, isGetMore]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getTeamsInside(true, () => setRefreshing(false));
    }, []);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (DATA_RENDER === undefined);
        if (checker) getTeamsInside(true);
    }, []);
    /////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "leaveTeam":
                dispatch(Actions.type("setTeamsJoin", {
                    type: 'delete', data: {
                        target: data.teamid,
                        key: 'teamid'
                    }
                }));
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneTeamMainMemo = useMemo(() => ({ item }) => {
        return (<RenderOneTeam {...item} />);
    }, []);
    const keyExtractor = useCallback(item => item.teamid + "_inside_team" + item.TeamName, []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const ListHeaderComponent = useCallback(() => <>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: ${pixel(6)};flex-direction: column;
                margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: space-between;
                    background: transparent;`}>
                <AnyText color={isDark ? "back2" : "clr1"} lower>
                    {tabsData.joinTeams}
                </AnyText>
            </OuterOneView>
        </OuterOneView>
    </>, [isDark, isRTL]);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null}
    </>, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => <OuterLazy
        background="transparent" height={pixel(200)}>
        {DATA_RENDER === undefined ? <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} /> :
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.noResult}
            </AnyText>}
    </OuterLazy>, [DATA_RENDER, isDark]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd={pixel(4)}
        renderItem={OneTeamMainMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getTeamsInside();
        }}
        keyExtractor={keyExtractor}
        horizontal={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={RefreshControlMemo}
        ListFooterComponent={ListFooterComponent}
    />);
}
export default memo(RenderMeetoorTeamsInside);