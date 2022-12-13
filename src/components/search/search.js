import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { DeleteSvg } from '../../icons/all';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { AnyText, ScrollBar } from '../home/helperprefernce';
import { Input } from '../sign/helperinput';
import SwitchButton from '../../main/switchbutton/switch';
import { Modal } from 'react-native';
import { ItemResult, RoomResult, TrendResult } from './results';
import { ButtonCirculer } from '../home/sliderroom/helperroomcss';
import { colors, pixel } from '../../styles/basecss';
import { MaterialIndicator } from 'react-native-indicators';
import { moderateScale } from 'react-native-size-matters';
import OnePostMain from '../posts/posts/post/post';
import Axios from '../../main/Axios';
///////////////////////////////////////////////
const RenderSearchMeetoor = () => {
    const { navigate } = useSelector(state => state.modal.navigation);
    const { placeholder, messages, buttons } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const mainSocket = useSelector(state => state.main.socket);
    const When = useSelector(state => state.main.when);
    const Info = useSelector(state => state.main.info);
    ////////////////////////////////////////////
    const [waitResult, setWaitResult] = useState(false);
    const [filterTeam, setFilterTeam] = useState(true);
    const [filterUser, setFilterUser] = useState(true);
    const [filterPost, setFilterPost] = useState(false);
    const [results, setResults] = useState(null);
    /////////////////////////////////////////////
    const waitType = useRef(0);
    const inputRef = useRef();
    const [openModal, setOpenModal] = useState(false);
    /////////////////////////////////////////////
    const getSearchPosts = useCallback(async (search) => {
        try {
            const response = await Axios.get(`searchInPosts/?idLt=${0}&search=${search}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            console.log("responseData", responseData)
            if (responseData?.length === 0 || responseData.noMore) {
                setWaitResult(false);
                return;
            }
            setResults({ posts: responseData });
            ////////////////////////////////////////////////////////
            setWaitResult(false);
        } catch (e) {
            setWaitResult(false);
            console.log("Dashbord -> error.data", e)
        }
    }, []);
    /////////////////////////////////////////////
    const onSearch = useCallback((value) => {
        if (value.trim().startsWith(">")) {
            if (value.trim() === ">info") {
                setOpenModal(true);
            }
        } else {
            let search = value.toLowerCase();
            setWaitResult(true);
            if (filterPost) {
                getSearchPosts(search);
            } else {
                mainSocket.emit("onSearch", { search });
            }
        }
    }, [filterPost]);
    /////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "onSearch":
                setResults(data);
                setWaitResult(false);
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////
    return (<>
        <ScrollBar back={colors[isDark ? "clr1" : "back1"]}
            keyboardShouldPersistTaps='handled'
            stickyHeaderIndices={[0]} padd={pixel(4)}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                back={isDark ? "clr3" : "back3"}
                css={css`margin: 0;padding: ${pixel(3)};flex-direction: column;
                margin-bottom: ${pixel(3)};border-radius: ${pixel(8)};`}>
                <OuterOneView activeOpacity={1} isRTL={isRTL}
                    css={css`margin: 0;padding: 0px;justify-content: center;
                    background: transparent;`}>
                    <Input placeholder={placeholder.search}
                        onChange={(value) => {
                            if (value.trim().length >= 2) {
                                clearTimeout(waitType.current || 0);
                                if(waitResult) return;
                                waitType.current = setTimeout(() => {
                                    onSearch(value);
                                }, 500);
                            }
                        }}
                        innerRef={inputRef}
                        radius noBack noBorder
                        isDrak={isDark} mainMargin={moderateScale(3)}
                        autoFocus={true}
                        css={css`padding: 0 ${pixel(3)};border-radius: ${pixel(8)};
                        ${isRTL ? `padding-right: ${pixel(27)};` : `padding-left: ${pixel(27)};`}`} />
                    <ButtonCirculer size={pixel(28)} back={isDark ? "clr3" : "back3"}
                        css={css`position: absolute;left: ${pixel(-6)};margin: 0;
                        border-radius: ${pixel(10)};z-index: 3;border: 0;top: ${pixel(4)};`}
                        onPress={() => {
                            inputRef.current.clear();
                            setResults(null);
                        }}>
                        {waitResult ? <MaterialIndicator size={moderateScale(24)} color={colors["clr2"]} /> :
                            <DeleteSvg color={isDark ? "back2" : "red2"} size={moderateScale(18)} />}
                    </ButtonCirculer>
                </OuterOneView>
                <OuterOneView activeOpacity={1} isRTL={isRTL}
                    back={isDark ? "clr3" : "back3"}
                    css={css`margin: 0;padding: ${pixel(3)};justify-content: flex-start;`}>
                    <SwitchButton value={filterUser}
                        onChange={async (bool) => {
                            setFilterUser(bool);
                        }}
                        fontSize={pixel(13)} margin={0}
                        text={buttons.enablePepole}
                        css={css`margin-right: ${pixel(10)};`}
                    />
                    <SwitchButton value={filterTeam}
                        onChange={async (bool) => {
                            setFilterTeam(bool);
                        }}
                        fontSize={pixel(13)} margin={0}
                        text={buttons.enableTeam}
                    />
                </OuterOneView>
                <OuterOneView activeOpacity={1} isRTL={isRTL}
                    back={isDark ? "clr3" : "back3"}
                    css={css`margin: 0;padding: ${pixel(3)};justify-content: space-between;`}>
                    <SwitchButton value={filterPost}
                        onChange={async (bool) => {
                            setFilterPost(bool);
                            setFilterTeam(!bool);
                            setFilterUser(!bool);
                        }}
                        fontSize={pixel(13)} margin={0}
                        text={buttons.enablePosts}
                    />
                </OuterOneView>
            </OuterOneView>
            {(results?.rooms?.length) ? results.rooms.map((data, i) => {
                return (<RoomResult key={i + data.roomid} {...data} />)
            }) : null}
            {(results?.teams?.length && filterTeam) ? results.teams.map((data, i) => {
                return (<ItemResult key={data.teamid + i} src={data.teamPhoto} teamid={data.teamid}
                    name={data.teamName} username={data.teamName} href={'team'} />)
            }) : null}
            {(results?.users?.length && filterUser) ? results.users.map((data, i) => {
                return (<ItemResult key={data.userid + i} src={data.UserPhoto}
                    isOwner={data.isOwner} isSecure={data.isSecure}
                    name={data.fullName} username={data.username} href={'profile'} />)
            }) : null}
            {(results?.trends?.length) ? results.trends.map((data, i) => {
                return (<TrendResult key={data.hashtag + data.userid + i} {...data} />)
            }) : null}
            {(results?.posts?.length) ? results.posts.map((data, i) => {
                return (<OnePostMain key={data.postId + "searchInPosts/"} {...data} keyArray="mainPosts/" />)
            }) : null}
            {(results?.noResult) ? <OuterOneView activeOpacity={1} isRTL={isRTL}
                back={isDark ? "clr3" : "back3"}
                css={css`margin: 0;padding: ${pixel(3)};justify-content: center;`}>
                <AnyText color={isDark ? "back2" : "clr1"} lower>
                    {messages.noResult}
                </AnyText>
            </OuterOneView> : null}
        </ScrollBar>
        <Modal animationType="fade" transparent={true}
            onRequestClose={() => setOpenModal(false)}
            visible={openModal}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: ${pixel(3)};justify-content: center;
                background: transparent;height: 100%;`}>
                <OuterOneView activeOpacity={0.8} isRTL={isRTL} back="clr3"
                    css={css`margin: 0;padding: ${pixel(3)};flex-direction: column;
                    margin-bottom: ${pixel(3)};border-radius: ${pixel(8)};width: ${pixel(300)};`}
                    onPress={() => {
                        setOpenModal(false);
                        navigate("profile", { username: Info.href })
                    }}>
                    <AnyText color="back2">{Info.head}</AnyText>
                    <AnyText color="blu">{Info.name}</AnyText>
                    <AnyText color="back2">{Info.ver}</AnyText>
                </OuterOneView>
            </OuterOneView>
        </Modal>
    </>)
}

export default memo(RenderSearchMeetoor);

