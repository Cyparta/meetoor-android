import React, {
    memo, useEffect, useState,
    useCallback, useRef
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { BadgeNumer, OuterLazy } from './helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import OneOuterChat from './helperchat/onechat';
import { AnyText, FlatScroll } from './helperprefernce';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { moderateScale } from 'react-native-size-matters';
import { SearchChatUser } from './helperchat/helper';
import { ButtonNormal, OuterButtonControl } from './sliderroom/helperroomcss';
import { ChatSvg, RequestSvg } from '../../icons/all';
import { css } from 'styled-components';
/////////////////////////////////////////////////////
const RenderChats = () => {
    const dispatch = useDispatch();
    const { messages } = useSelector(state => state.sign.langData);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const mainSocket = useSelector(state => state.main.socket);
    const Messages = useSelector(state => state.main.messages);
    const anonyChatNumber = useSelector(state => state.main.anonyChatNumber);
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [resultSearch, setResultSearch] = useState(undefined);
    const [scrollBegin, setScrollBegin] = useState(false);
    const goToTop = useSelector(state => state.sign.goToTop);
    const Scroll = useRef(null);
    ////////////////////////////////////////////////////
    const getMessage = useCallback(async () => {
        try {
            if (resultSearch) return;
            if (isLoadMore || !isGetMore) return;
            let idLt = Messages ? Messages[Messages?.length - 1 || 0]?.msgId : 0;
            setLoadMore(true);
            const response = await Axios.get(`messages/?idLt=${idLt || 0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                return;
            }
            dispatch(Actions.type("setMessages", {
                type: "push",
                data: responseData
            }));
            setLoadMore(false);
            setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Messages, isLoadMore, isGetMore, resultSearch, token]);
    /////////////////////////////////////////////
    useEffect(() => {
        mainSocket.emit("newChatNum", {});
        return () => mainSocket.emit("newChatNum", {});
    }, []);
    /////////////////////////////////////////////
    useEffect(() => {
        const GetMsg = async () => {
            try {
                if (!Messages) {
                    const MessagesStorage = await AsyncStorage.getItem(`@messages_${token}`);
                    if (MessagesStorage && MessagesStorage?.length) dispatch(Actions.type("setMessages", {
                        type: "set",
                        data: JSON.parse(MessagesStorage)
                    }));
                }
            }
            catch (e) {
                console.log("R => ", e)
            }
        }
        GetMsg();
    }, [token]);
    ////////////////////////////////////////////
    useEffect(() => {
        if (goToTop && goToTop?.nav === "chats") Scroll.current.scrollToOffset(0);
    }, [goToTop, Scroll]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await getMessage(true);
            setRefreshing(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, []);
    const ListHeaderComponent = useCallback(() => <>
        <OuterButtonControl back={isDark ? "clr1" : "back1"} isRTL={isRTL}
            css={css`width: 100%;max-width: 100%;margin-top: ${pixel(4)};padding: 0 ${pixel(4)};`}>
            <ButtonNormal size={pixel(22)} isRTL={isRTL}
                back={isDark ? "clr3" : "back3"}
                css={css`border: 0;flex: 1;margin: 0 ${pixel(1)};border-radius: ${pixel(5)};`}
                activeOpacity={0.8}>
                <ChatSvg color={"clr2"} size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color={"clr2"}
                    autoMargin={pixel(6)}>{messages.your_messages}</AnyText>
            </ButtonNormal>
            <ButtonNormal size={pixel(22)} isRTL={isRTL}
                back={isDark ? "clr3" : "back3"}
                css={css`border: 0;flex: 1;margin: 0 ${pixel(1)};
                            position: relative;border-radius: ${pixel(5)};`}
                onPress={() => {
                    navigate("anonychats");
                }} activeOpacity={0.8}>
                <RequestSvg size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color={isDark ? "back2" : "clr3"}
                    autoMargin={pixel(6)}>{messages.ignore_msg}</AnyText>
                {anonyChatNumber > 0 ? <BadgeNumer isRTL={isRTL}
                    css={css`top: ${pixel(8)};right: ${pixel(7)};`}>
                    {anonyChatNumber}
                </BadgeNumer> : null}
            </ButtonNormal>
        </OuterButtonControl>
        {Messages ? (Messages.length < 1) ?
            <OuterLazy background="transparent" height={pixel(300)}>
                <AnyText color={isDark ? "back2" : "clr1"}>{messages.nochatyet}</AnyText>
            </OuterLazy> : <SearchChatUser setResultSearch={setResultSearch} />
            : null}
    </>, [Messages, setResultSearch, isDark, isRTL, anonyChatNumber, navigate]);
    //////////////////////////////////////////////////////
    return (<FlatScroll stickyHeaderIndices={[0]}
        back={colors[isDark ? "clr1" : "back1"]}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={(Messages) ? null :
            <OuterLazy background="transparent" height={pixel(300)}>
                <WaveIndicator size={moderateScale(140)} color={colors[isDark ? "back3" : "clr1"]} />
            </OuterLazy>} data={(resultSearch || Messages)}
        renderItem={({ item }) => (<OneOuterChat  {...item} />)}
        keyExtractor={(item, i) => item.username + "_one-chat" + i}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getMessage();
        }}
        refreshControl={<RefreshControl
            colors={[colors["clr2"]]}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />} ref={Scroll}
        ListFooterComponent={<>
            {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7}
                color={colors[isDark ? "back3" : "clr1"]} /> : null}
            <KeyboardSpacer />
        </>}
    />);
}

export default memo(RenderChats);