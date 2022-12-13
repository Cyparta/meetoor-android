import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { colors, pixel } from '../styles/basecss';
import { AnyText, FlatScroll } from './home/helperprefernce';
import Axios from '../main/Axios';
import { OuterOneContent, OuterOneView } from './home/helpernotification/heplernotifycss';
import { css } from 'styled-components';
import Actions from '../reducer/actions';
import { OuterLazy, RenderAnyUserPhoto } from './home/helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { ButtonNormal, ViewOuterCirculer } from './home/sliderroom/helperroomcss';
import { JoinedSvg, TeamsSvg } from '../icons/all';
import { RefreshControl } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
const RenderOneTeamSuggest = memo(({ TeamDescription, TeamLogo, TeamName, teamid }) => {
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { buttons } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const [holder, setHolder] = useState(false);
    ////////////////////////////////////////////
    const joinTeam = useCallback(() => {
        setHolder(<ButtonNormal
            isRTL={isRTL} radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
            back={isDark ? "clr3" : "back1"} borderColor="clr1"
            css={css`margin: 0px;height: ${pixel(30)};min-width: ${pixel(60)};`}>
            <DotIndicator size={moderateScale(3)} count={7} color={colors["clr2"]} />
        </ButtonNormal>);
        mainSocket.emit("teamRequest", { teamid });
    }, [teamid])
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
                ellipsizeMode="tail" width={"95%"} isRTL={isRTL}
                css={css`flex: 1;max-width: 90%;`} numberOfLines={1}
                lineH="25px">{TeamName}</AnyText>
            <AnyText size={moderateScale(11)} lower color="clr2" lineH={pixel(12)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`flex: 1;max-width: 90%;`}>{TeamDescription}</AnyText>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                {holder ? holder : <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1"
                    css={css`padding: ${pixel(4)};margin: 0px;`}
                    onPress={joinTeam}>
                    <JoinedSvg size={moderateScale(16)} />
                    <AnyText lower color={isDark ? "back2" : "clr3"}
                        isRTL={isRTL} size={16} autoMargin={pixel(5)}
                        lineH={pixel(16)} size={moderateScale(13)}>
                        {buttons.joinTeam}
                    </AnyText>
                </ButtonNormal>}
            </OuterOneView>
        </OuterOneContent>
    </OuterOneView>)
});
///////////////////////////////////////////////
const RenderMeetoorBans = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const DATA_RENDER = useSelector(state => state.team.suggestTeams);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    /////////////////////////////////////////////
    const keyArray = `suggestTeams/`;
    const [refreshing, setRefreshing] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    //////////////////////////////////////////////
    const getTeamsSuggest = useCallback(async (callback) => {
        try {
            if (isLoadMore) return;
            setLoadMore(true);
            const response = await Axios.get(keyArray,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData?.error) {
                setLoadMore(false);
                callback && callback();
                dispatch(Actions.type("setSuggestTeams", {
                    type: 'set',
                    data: []
                }));
                return;
            }
            dispatch(Actions.type("setSuggestTeams", {
                type: 'set',
                data: responseData.sort(() => Math.random() - 0.5)
            }));
            ////////////////////////////////////////////////////////
            callback && callback();
            setLoadMore(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [keyArray, isLoadMore]);
    ////////////////////////////////////////////
    useEffect(() => {
        onRefresh();
    }, []);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getTeamsSuggest(() => setRefreshing(false));
    }, []);
    /////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "replayTeamRequest":
                if (data.type === 'anony') return;
                dispatch(Actions.type("setSuggestTeams", {
                    type: "delete",
                    data: {
                        target: data.teamid,
                        key: "teamid"
                    }
                }));
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneTeamSuggestMainMemo = useMemo(() => ({ item }) => {
        return (<RenderOneTeamSuggest {...item} />);
    }, []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]}
        refreshing={refreshing}
        onRefresh={onRefresh}
    />, [refreshing]);
    const keyExtractor = useCallback(item => item.teamid + "_team" + item.TeamName, []);
    const ListEmptyComponent = useCallback(() => <OuterLazy
        background="transparent" height={pixel(200)}>
        {DATA_RENDER === undefined ? <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} /> :
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.noTeams}
            </AnyText>}
    </OuterLazy>, [DATA_RENDER, isDark]);
    ////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER} padd={pixel(4)}
        renderItem={OneTeamSuggestMainMemo}
        refreshControl={RefreshControlMemo}
        keyExtractor={keyExtractor}
        horizontal={false}
        ListEmptyComponent={ListEmptyComponent}
    />);
}
export default memo(RenderMeetoorBans);