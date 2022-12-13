import React, {
    memo, useState,
    useCallback,
    useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { OuterLazy } from './helperhome';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import OneOuterAonoyChat from './helperchat/oneanonychat';
import { AnyText, FlatScroll } from './helperprefernce';
import { RefreshControl } from 'react-native';
import { ButtonNormal, OuterButtonControl } from './sliderroom/helperroomcss';
import { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';
import { ReplySvg } from '../../icons/all';
////////////////////////////////////////////////
const RenderAnonyChats = () => {
    const dispatch = useDispatch();
    const { messages, badges } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const token = useSelector(state => state.sign.token);
    const mainSocket = useSelector(state => state.main.socket);
    const Anonychats = useSelector(state => state.main.anonychats);
    const myAnonychats = useSelector(state => state.main.myAnonychats);
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const [currentAnony, setCurrentAnony] = useState("recived");
    const isSent = currentAnony === "sent";
    const DATA_RENDER = isSent ? myAnonychats : Anonychats;
    const isOneLeast = [...myAnonychats, ...Anonychats];
    ////////////////////////////////////////////
    const getAnonychats = useCallback(async (set = false) => {
        try {
            if (isLoadMore || !isGetMore) return;
            let idLt = Anonychats ? Anonychats[Anonychats?.length - 1 || 0]?.msgid : 0;
            setLoadMore(true);
            const response = await Axios.get(`anonyChats/?idLt=${set ? 0 : (idLt || 0)}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            console.log("getAnonychats ~ responseData", responseData[0])
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                return;
            }
            dispatch(Actions.type("setAnonyChats", {
                type: set ? "set" : "push",
                data: responseData
            }));
            setLoadMore(false);
            setScrollBegin(false);
        } catch (e) {
            setLoadMore(false);
            setScrollBegin(false);
            console.log("Dashbord -> error.data", e)
        }
    }, [Anonychats, isLoadMore, isGetMore, token]);
    const getMyAnonychats = useCallback(async (set = false) => {
        try {
            if (isLoadMore || !isGetMore) return;
            let idLt = myAnonychats ? myAnonychats[myAnonychats?.length - 1 || 0]?.msgid : 0;
            setLoadMore(true);
            const response = await Axios.get(`myAnonyChats/?idLt=${set ? 0 : (idLt || 0)}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            console.log("getMyAnonychats ~ responseData", responseData[0]?.fullName)
            if (responseData.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                return;
            }
            dispatch(Actions.type("setMyAnonychats", {
                type: set ? "set" : "push",
                data: responseData
            }));
            setLoadMore(false);
            setScrollBegin(false);
        } catch (e) {
            setLoadMore(false);
            setScrollBegin(false);
            console.log("Dashbord -> error.data", e)
        }
    }, [myAnonychats, isLoadMore, isGetMore, token]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await (isSent ? getMyAnonychats(true) : getAnonychats(true));
            setRefreshing(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [isSent]);
    useEffect(() => {
        mainSocket.emit("anonyChatNum", { zero: 0 });
    }, [])
    ////////////////////////////////////////////
    const ListHeaderComponent = useCallback(() =>
        isOneLeast ? (isOneLeast.length < 1) ?
            <OuterLazy background="transparent" height={pixel(300)}>
                <AnyText color={isDark ? "back2" : "clr1"}>
                    {messages.nochatyet}
                </AnyText>
            </OuterLazy> : <>
                <OuterButtonControl back={isDark ? "clr3" : "back3"} isRTL={isRTL}
                    css={css`width: 100%;max-width: 100%;margin-bottom: ${pixel(4)};`}>
                    <ButtonNormal size={pixel(22)} isRTL={isRTL}
                        back={isDark ? "clr1" : "back1"}
                        css={css`border: 0;flex: 1;margin: 0 ${pixel(1)};
                            border-radius: ${pixel(5)};`} activeOpacity={0.8}
                        onPress={() => {
                            setGetMore(true);
                            setCurrentAnony("recived");
                            getAnonychats(true);
                        }}>
                        <ReplySvg color={currentAnony === "recived" ? "clr2" : false} size={moderateScale(18)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                            color={currentAnony === "recived" ? "clr2" : isDark ? "back3" : "clr3"}
                            autoMargin={pixel(6)}>{badges.recived}</AnyText>
                    </ButtonNormal>
                    <ButtonNormal size={pixel(22)} isRTL={isRTL}
                        back={isDark ? "clr1" : "back1"}
                        css={css`border: 0;flex: 1;margin: 0 ${pixel(1)};
                            border-radius: ${pixel(5)};`} activeOpacity={0.8}
                        onPress={() => {
                            setGetMore(true);
                            setCurrentAnony("sent");
                            getMyAnonychats(true)
                        }}>
                        <ReplySvg color={isSent ? "clr2" : false}
                            rot={180} size={moderateScale(18)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                            color={isSent ? "clr2" : isDark ? "back3" : "clr3"}
                            autoMargin={pixel(6)}>{badges.sent}</AnyText>
                    </ButtonNormal>
                </OuterButtonControl>
            </> : null
        , [isOneLeast, isDark, isRTL, currentAnony, myAnonychats, Anonychats, isSent, badges]);
    //////////////////////////////////////////////////////
    return (<FlatScroll isDark={isDark} stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={ListHeaderComponent} padd={pixel(4)}
        ListEmptyComponent={(DATA_RENDER) ? null :
            <OuterLazy background="transparent" height={pixel(300)}>
                <WaveIndicator size={moderateScale(140)} color={colors[isDark ? "back3" : "clr3"]} />
            </OuterLazy>} data={DATA_RENDER}
        renderItem={({ item }) => (<OneOuterAonoyChat  {...item}
            asView={isSent} isSent={isSent} />)}
        keyExtractor={(item, i) => item.msgId + "_anony_chat" + i}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && isSent ? getMyAnonychats() : getAnonychats();
        }}
        refreshControl={<RefreshControl
            colors={[colors["clr2"]]}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />}
        ListFooterComponent={<>
            {isLoadMore ? <DotIndicator size={moderateScale(5)}
                count={7} color={colors[isDark ? "back3" : "clr1"]} /> : null}
        </>}
    />);
}

export default memo(RenderAnonyChats);