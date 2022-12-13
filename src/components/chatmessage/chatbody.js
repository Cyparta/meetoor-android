import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { AnyText, PlaceholdView, SectionScroll } from '../home/helperprefernce';
import Axios from '../../main/Axios';
import { ChatSvg } from '../../icons/all';
import useSortChat from './usesortchat';
import RenderMeetoorOneChat from './renderonechat';
import { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderMeetoorChatBody = ({ username, name }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const lang = useSelector(state => state.sign.lang);
    const chats = useSelector(state => state.posts.chats);
    const Time = useSelector(state => state.main.time);
    const User = useSelector(state => state.main.user);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    /////////////////////////////////////////////
    const keyArray = `chat_user_${username}`;
    const CHATS_DATA = chats[keyArray];
    /////////////////////////////////////////////
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [lastMessage, setLastMessage] = useState(null);
    const [DATA_RENDER, setDATA_RENDER] = useState([]);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getChatsApi = useCallback(async (first = false, callback) => {
        try {
            let IdLt = CHATS_DATA ? CHATS_DATA[0]?.msgid : undefined;
            console.log("line 41 ~ getChatsApi ~ IdLt", IdLt)
            if (!first && IdLt === undefined) return;
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`chat/?username=${username}&idLt=${IdLt || 0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData?.length === 0 || responseData?.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setChats", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            // responseData = responseData//.reverse();
            console.log("responseData", responseData[0]);
            dispatch(Actions.type("setChats", {
                type: first ? 'set' : "pushGroup",
                data: {
                    key: keyArray,
                    val: responseData
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [CHATS_DATA, keyArray, username, isGetMore, isLoadMore]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (CHATS_DATA === undefined);
        if (checker) getChatsApi(true);
    }, []);
    ////////////////////////////////////////////
    useEffect(() => {
        setDATA_RENDER(useSortChat(CHATS_DATA ? CHATS_DATA : [], Time, User.userid, lang));
    }, [CHATS_DATA]);
    ////////////////////////////////////////
    useEffect(() => {
        let hrefID = username?.toLowerCase();
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case 'onChatSeen':
                if (data.username.toLowerCase() === hrefID)
                    setLastMessage({ isSeen: true, when: data.whenSeen });
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneChatMemo = useMemo(() => ({ item }) => {
        return (<RenderMeetoorOneChat {...item} lastMessage={lastMessage} name={name} />);
    }, [lastMessage, name]);
    const keyExtractor = useCallback(item => item.msgid + "_chat_" + item.userid, []);
    const ListEmptyComponent = useCallback(() => CHATS_DATA === undefined ?
        <WaveIndicator size={moderateScale(140)}
            color={colors[isDark ? "back3" : "clr2"]} /> :
        CHATS_DATA.length ? null : <PlaceholdView height={pixel(200)}>
            <ChatSvg color="clr2" rot={180} size={moderateScale(100)} />
        </PlaceholdView>, [CHATS_DATA, isDark]);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <DotIndicator size={moderateScale(5)}
            count={7} color={colors["clr2"]} /> : null}
    </>, [isLoadMore]);
    const renderSectionFooter = useCallback(({ section: { data } }) =>
    (<AnyText color={isDark ? "back2" : "clr4"}
        css={css`opacity: 0.75;margin: ${pixel(4)} 0;`}
        width="100%" align="center" size={moderateScale(11)}>
        {Time.setDate(data[0].date, lang).toDay}
    </AnyText>), [isDark, Time, lang]);
    const onEndReached = useCallback(() => scrollBegin && getChatsApi()
        , [scrollBegin, CHATS_DATA, keyArray, username, isGetMore, isLoadMore]);
    ///////////////////////////////////////////////
    return (<SectionScroll  back={colors[isDark ? "clr1" : "back1"]}
        keyboardShouldPersistTaps='handled'
        sections={DATA_RENDER} padd={pixel(4)}
        renderItem={OneChatMemo} inverted
        renderSectionFooter={renderSectionFooter}
        keyExtractor={keyExtractor}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={onEndReached}
        windowSize={15}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
    />)
}

export default memo(RenderMeetoorChatBody);