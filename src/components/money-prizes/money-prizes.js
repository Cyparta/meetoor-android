import React, {
    memo, useCallback,
    useEffect, useMemo,
    useRef, useState
} from 'react';
import { useSelector } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { AnyText, ScrollBar } from '../home/helperprefernce';
import { colors, pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { RefreshControl, ScrollView, View } from 'react-native';
import { OuterAnyView, OuterLazy, RenderAnyUserPhoto } from '../home/helperhome';
import Axios from '../../main/Axios';
import RenderSingleFile from '../../main/renderfile/rendersinglefile';
import { WaveIndicator } from 'react-native-indicators';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import BuildPayPal from './buildpaypal';
/////////////////////////////////////////////
const CountUpRender = memo(({ num }) => {
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const Scroll = useRef(null);
    const [layout, setLayout] = useState({ height: 0, width: 0 });
    /////////////////////////////////////////
    useEffect(() => {
        Scroll.current && Scroll.current?.scrollTo({ y: num * layout.height });
    }, [num, Scroll, layout.height]);
    //////////////////////////////////////////
    const onLayout = useCallback(({ nativeEvent: { layout } }) => {
        setLayout({
            width: layout.width,
            height: layout.height
        });
    }, []);
    //////////////////////////////////////////
    return (<View style={{
        width: 35, height: 50,
        marginHorizontal: moderateScale(4),
        borderRadius: moderateScale(4), overflow: "hidden"
    }}>
        <ScrollView ref={Scroll}
            pagingEnabled
            scrollEnabled={false}
            initialIndex={num}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            windowSize={3}
            onLayout={onLayout}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center"
            }}>
            {nums.map((d, i) => <View key={`_${i}`} style={{
                width: 35, height: layout.height, alignItems: "center",
                backgroundColor: colors["clr2"], justifyContent: "center",
            }}>
                <AnyText lineH={pixel(50)} size={moderateScale(40)} color="back3">{d}</AnyText>
            </View>)}
        </ScrollView>
    </View>)
});
let clearTimer = 0;
const MoneyPrizesMeetoor = () => {
    const token = useSelector(state => state.sign.token);
    const { messages, prize } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const lang = useSelector(state => state.sign.lang);
    const Time = useSelector(state => state.main.time);
    const { navigate } = useSelector(state => state.modal.navigation);
    const [countUpNums, setCountUpNums] = useState([]);
    const [isLoad, setLoad] = useState(true);
    const [currentVal, setCurrentVal] = useState({});
    const [isEnd, setIsEnd] = useState(false);
    const [noPrizes, setNoPrizes] = useState(true);
    const [winnerInfo, setWinnerInfo] = useState(false);
    const [prizeInfo, setPrizeInfo] = useState(false);
    const [running, setRunning] = useState(false);
    const [stopRequest, setStopRequest] = useState(false);
    const localTime = Time.setDate(prizeInfo?.resultDate, lang);
    /////////////////////////////////////////////
    const [refreshing, setRefreshing] = useState(false);
    ////////////////////////////////////////////
    const getPrizes = useCallback(async () => {
        try {
            const response = await Axios.get(`getPrizes/`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            setLoad(false);
            let responseData = response?.data;
            if (responseData.length === 0) {
                setNoPrizes(true);
                return;
            }
            setNoPrizes(false);
            responseData = responseData[0];
            console.log("getPrizes ~ responseData", responseData)
            if (responseData.isEnd) {
                setIsEnd(true);
                setRunning(false);
                setWinnerInfo(responseData.winnerInfo);
                responseData.winnerInfo && setStopRequest(true);
            }
            setPrizeInfo(responseData);
            setCurrentVal({
                prizeCurrent: responseData.prizeCurrent,
                winner: responseData.winnerInfo
            });
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    const getPrizeCurrent = useCallback(async () => {
        try {
            if (stopRequest) return;
            const response = await Axios.get(`getPrizeCurrent/?prizeid=${prizeInfo.prizeid}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            let responseData = response?.data;
            setCurrentVal(responseData);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token, prizeInfo, stopRequest]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPrizes();
        setRefreshing(false);
    }, [token]);
    ////////////////////////////////////////////
    const getTicketId = useCallback((tecket) => {
        if (!prizeInfo) return tecket;
        let numLength = prizeInfo.prizeTarget.length;
        return tecket.toString().padStart(numLength, "0");
    }, [prizeInfo]);
    ////////////////////////////////////////////
    useEffect(() => {
        let interval = 0;
        if (prizeInfo) {
            let numLength = prizeInfo.prizeTarget.length;
            if (currentVal?.winner) {
                setIsEnd(true);
                setRunning(true);
                setStopRequest(true);
                interval = setInterval(() => {
                    let target = (1 + parseInt(prizeInfo.prizeTarget));
                    let rand = Math.floor(Math.random() * target);
                    setCountUpNums(rand.toString().padStart(numLength, "0").split(''))
                }, 200);
                setTimeout(() => {
                    clearInterval(interval);
                    setCountUpNums((currentVal.winner.ticketid).padStart(numLength, "0").split(''));
                    setTimeout(() => {
                        setRunning(false);
                        setWinnerInfo(currentVal.winner);
                    }, 2000);
                }, 5000);
            } else {
                setRunning(false);
                setCountUpNums((currentVal.prizeCurrent || "0").padStart(numLength, "0").split(''))
            }
        }
        return () => clearInterval(interval);
    }, [prizeInfo, currentVal]);
    ////////////////////////////////////////////
    useEffect(() => {
        if (noPrizes || stopRequest) {
            clearInterval(clearTimer);
        } else {
            clearTimer = setInterval(() => {
                getPrizeCurrent();
            }, 10 * 1000);
        }
        return () => clearInterval(clearTimer);
    }, [noPrizes, prizeInfo, token, stopRequest]);
    ///////////////////////////////////////////
    useEffect(() => {
        getPrizes();
    }, []);
    ////////////////////////////////////////
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]} refreshing={refreshing}
        onRefresh={onRefresh} />, [refreshing]);
    ////////////////////////////////////////
    return (<ScrollBar padd={pixel(4)}
        back={colors[isDark ? "clr1" : "back1"]}
        refreshControl={RefreshControlMemo}>
        {!isLoad ? noPrizes ?
            <OuterLazy background="transparent" height={pixel(300)}>
                <AnyText color={isDark ? "back2" : "clr1"}>{messages.noResult}</AnyText>
            </OuterLazy>
            : isEnd ? winnerInfo ?
                <OuterOneView activeOpacity={0.8} isRTL={isRTL}
                    back={isDark ? "clr3" : "back3"}
                    onPress={() => navigate("profile", { username: winnerInfo.username })}
                    css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                        margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
                    <AnyText color={isDark ? "back2" : "clr1"}>{prize.winner}</AnyText>
                    <AnyText color="clr2" size={moderateScale(18)}>{prize.ticketid + getTicketId(winnerInfo.ticketid)}</AnyText>
                    <AnyText color={isDark ? "back2" : "clr1"}
                        css={css`margin-bottom: ${pixel(6)};`}
                        size={moderateScale(20)}>{winnerInfo.fullName}</AnyText>
                    <RenderAnyUserPhoto userPhoto={winnerInfo.userPhoto} size={pixel(200)} />
                </OuterOneView> : running ?
                    <OuterOneView activeOpacity={1} isRTL={isRTL}
                        back={isDark ? "clr3" : "back3"}
                        css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                            margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
                        <AnyText color={isDark ? "back2" : "clr1"}
                            css={css`margin-bottom: ${pixel(5)};`}>
                            {prize.running}
                        </AnyText>
                        <OuterAnyView css={css`width: auto;height: auto;justify-content: center;`}>
                            {countUpNums.map((one, i) => {
                                return (<CountUpRender key={i} num={one} />)
                            })}
                        </OuterAnyView>
                    </OuterOneView> :
                    <OuterOneView activeOpacity={1} isRTL={isRTL}
                        back={isDark ? "clr3" : "back3"}
                        css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                        margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
                        <AnyText color={isDark ? "back2" : "clr1"}>{prize.ending}</AnyText>
                        <AnyText color={isDark ? "back2" : "clr1"}>{localTime.fullDate}</AnyText>
                        {prizeInfo.ticketid ? <AnyText color="clr2"
                            size={moderateScale(20)}>
                            {prize.ticketid + getTicketId(prizeInfo.ticketid)}
                        </AnyText> : null}
                    </OuterOneView>
                :
                <>
                    <OuterOneView activeOpacity={1} isRTL={isRTL}
                        back={isDark ? "clr3" : "back3"}
                        css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                            margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
                        {prizeInfo.ticketid ? <AnyText color="clr2" size={moderateScale(18)}>
                            {prize.ticketid + getTicketId(prizeInfo.ticketid)}
                        </AnyText> : <BuildPayPal prizeInfo={prizeInfo} callback={getPrizes} />}
                    </OuterOneView>
                    <OuterOneView activeOpacity={1} isRTL={isRTL}
                        back={isDark ? "clr3" : "back3"}
                        css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                            margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
                        <OuterAnyView css={css`width: auto;height: auto;justify-content: center;`}>
                            {countUpNums.map((one, i) => {
                                return (<CountUpRender key={i} num={one} />)
                            })}
                        </OuterAnyView>
                    </OuterOneView>
                </> :
            <OuterLazy background="transparent" height={pixel(300)}>
                <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} />
            </OuterLazy>}
        {noPrizes ? null : <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <AnyText color={isDark ? "back2" : "clr1"}
                css={css`margin-bottom: ${pixel(2)};`}>
                {prizeInfo.prizeName}
            </AnyText>
            <AnyText color={isDark ? "back2" : "clr1"}
                align="center"
                css={css`margin-bottom: ${pixel(6)};`}>
                {prizeInfo.prizeInfo}
            </AnyText>
            <RenderSingleFile dataFile={{
                base: prizeInfo?.prizeFile,
                name: prizeInfo?.prizeFile?.split("/")?.pop()
            }} noHeader={true}
                height={moderateScale(300)}
                width={moderateScale(300)} />
        </OuterOneView>}
    </ScrollBar>)
}

export default memo(MoneyPrizesMeetoor);

