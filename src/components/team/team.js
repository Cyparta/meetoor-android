import React, {
    memo, useState, useEffect,
    useCallback, useMemo
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from 'react-native';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { colors, pixel } from '../../styles/basecss';
import Axios from '../../main/Axios';
import useGoBack from "../../main/goback";
import Actions from '../../reducer/actions';
import { AnyText, FlatScroll } from '../home/helperprefernce';
import { OuterLazy, TabBarBottom, TabOuterButton } from '../home/helperhome';
import RenderTopProfile from './renderteamphoto';
import OneMemberMain from './renderonemember';
import RenderControlTeam from './renderteamctr';
import RenderTeamMore from './renderteammore';
import { ChatSvg, PostSvg } from '../../icons/all';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////////
const RenderMeetoorTeam = ({ teamid = 8 }) => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const { buttons } = useSelector(state => state.sign.langData);
    const usersLastId = useSelector(state => state.sign.usersLastId);
    const socketLive = useSelector(state => state.socket.live);
    const mainSocket = useSelector(state => state.main.socket);
    const When = useSelector(state => state.main.when);
    const User = useSelector(state => state.main.user);
    const teamsMember = useSelector(state => state.team.teamsMember);
    const teams = useSelector(state => state.team.teams);
    const handleBack = useGoBack();
    /////////////////////////////////////////////
    let teaminfo = `teaminfo-${teamid}`;
    const team = teams[teaminfo] || {};
    const teamName = team?.teamName;
    const isAdmin = team?.type === "admin";
    const isMember = team?.type === "admin" || team?.type === "member";
    /////////////////////////////////////////////
    const keyArray = `teamMembers/?teamid=${teamid}&`;
    const IdLt = usersLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const [fileBack, setFileBack] = useState(null);
    const DATA_RENDER = teamsMember[keyArray] || undefined;
    /////////////////////////////////////////////
    const getTeamMembers = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`${keyArray}idLt=${first ? 0 : IdLt}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            console.log("getTeamMembers ~ responseData", responseData[0])
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setTeamsMember", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = responseData[responseData?.length - 1 || 0];
            dispatch(Actions.type("setUsersLastId", {
                key: keyArray,
                val: lastId.idlt
            }));
            dispatch(Actions.type("setTeamsMember", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: responseData
                }
            }));
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.post", e)
        }
    }, [keyArray, isLoadMore, IdLt, isGetMore]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        mainSocket.emit("team", { teamid });
        getTeamMembers(true, () => setRefreshing(false));
    }, [isLoadMore, IdLt, isGetMore, teamid]);
    ////////////////////////////////////////////
    useEffect(() => {
        mainSocket.emit("team", { teamid });
    }, [teamid]);
    ////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "team":
                if (data.error || data.teamid.toString() !== teamid.toString()) handleBack();
                else {
                    dispatch(Actions.type("setTeams", {
                        type: 'add',
                        data: {
                            key: teaminfo,
                            val: data
                        }
                    }));
                    console.log("useEffect ~ data", data.type)
                    if (data.type === "admin" || data.type === "member") {
                        (DATA_RENDER === undefined) && getTeamMembers(true);
                    } else {
                        console.log("useEffect ~ data else", data.type)
                        dispatch(Actions.type("setTeamsMember", {
                            type: 'set',
                            data: {
                                key: keyArray,
                                val: []
                            }
                        }));
                    }
                }
                break;

            case "replayTeamRequest":
                if (data.TeamName === teamName)
                    dispatch(Actions.type("setTeams", {
                        type: 'update',
                        data: {
                            key: teaminfo,
                            call: (obj) => {
                                obj.type = data.type
                            }
                        }
                    }));
                break;

            case "replayAskTeam":
                if (data.team.TeamName === teamName)
                    mainSocket.emit("openTeam", { teamid });

            case "updateMembers":
                if (data.teamName === teamName)
                    dispatch(Actions.type("setTeamsMember", {
                        type: 'update',
                        data: {
                            key: keyArray,
                            val: data.member
                        }
                    }));
                break;


            case "editTeam":
                if (data.editTeam === teamName || !isAdmin)
                    mainSocket.emit("openTeam", { teamid });
                break;

            case "updateTeamStatus":
                if (data.teamName === teamName)
                    dispatch(Actions.type("setTeamsMember", {
                        type: 'updateWithCall',
                        data: {
                            keyArray,
                            key: "userid",
                            target: data.userid,
                            call: (target) => {
                                target.teamStatus = data.teamStatus
                            }
                        }
                    }));
                break;

            case "leaveTeam":
            case "removeMember":
                if (data.teamName === teamName) {
                    dispatch(Actions.type("setTeamsMember", {
                        type: "deleteOne",
                        data: {
                            key: keyArray,
                            data: {
                                key: "userid",
                                target: data.userid
                            }
                        }
                    }));
                    if (data.userid === User.userid) {
                        dispatch(Actions.type("setTeams", {
                            type: 'delete',
                            data: {
                                keyArray: teaminfo,
                            }
                        }));
                        handleBack();
                    }
                }
                break;

            case "removeTeam":
                console.log("line 198 ~ useEffect ~ removeTeam", removeTeam)
                if (data.more.teamname === teamName) {
                    dispatch(Actions.type("setTeams", {
                        type: 'delete',
                        data: {
                            keyArray: teaminfo,
                        }
                    }));
                    handleBack();
                }
                break;

            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const keyExtractor = useCallback(item => item.userid + "_member", []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]} refreshing={refreshing}
        onRefresh={onRefresh} />, [refreshing]);
    const OneMemberMainMemo = useCallback(({ item }) => {
        return (<OneMemberMain {...item} teamName={teamName} isAdmin={isAdmin} />);
    }, [teamName, isAdmin]);
    const ListHeaderComponent = useCallback(() => <>
        <RenderTopProfile {...team} isAdmin={isAdmin} setFileBack={setFileBack} fileBack={fileBack} />
        <RenderControlTeam {...team} isAdmin={isAdmin} />
        <RenderTeamMore {...team} />
    </>, [isDark, isRTL, teamName, team, isAdmin, fileBack]);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["back3"]} /> : null}
    </>, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => DATA_RENDER === undefined ?
        <OuterLazy background="transparent" height={pixel(200)}>
            <WaveIndicator size={moderateScale(140)} color={colors["back3"]} />
        </OuterLazy> : null, [DATA_RENDER]);
    ////////////////////////////////////////////
    return (<>
        <FlatScroll isDark={isDark} keyboardShouldPersistTaps='handled'
            data={DATA_RENDER} padd={pixel(4)} renderItem={OneMemberMainMemo}
            onScrollBeginDrag={() => setScrollBegin(true)}
            onEndReached={() => {
                scrollBegin && getTeamMembers();
            }}
            keyExtractor={keyExtractor} horizontal={false} // getItemLayout={LayoutItems}
            ListHeaderComponent={ListHeaderComponent} ListEmptyComponent={ListEmptyComponent}
            refreshControl={RefreshControlMemo} ListFooterComponent={ListFooterComponent} />
        {isMember ? <TabBarBottom isDark={isDark}>
            <TabOuterButton activeOpacity={0.8} isRTL={isRTL}
                onPress={() => navigate("teamchat", {
                    teamName, teamPhoto: team?.teamPhoto,
                    teamid: team?.teamPhoto
                })}>
                <ChatSvg size={moderateScale(18)} />
                <AnyText lower color={isDark ? "back3" : "clr3"}
                    isRTL={isRTL} lineH={pixel(16)} autoMargin={pixel(5)}>
                    {buttons.chat}
                </AnyText>
            </TabOuterButton>
            <TabOuterButton activeOpacity={0.8} isRTL={isRTL}
                onPress={() => navigate("teamposts", { teamName, isAdmin, teamid })}>
                <PostSvg size={moderateScale(16)} />
                <AnyText lower color={isDark ? "back3" : "clr3"}
                    isRTL={isRTL} lineH={pixel(18)} autoMargin={pixel(5)}>
                    {buttons.posts}
                </AnyText>
            </TabOuterButton>
        </TabBarBottom> : null}
    </>);
}

export default memo(RenderMeetoorTeam);