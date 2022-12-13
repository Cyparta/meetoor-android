import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
import { UserInfoModalTouch } from '../components/home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../components/home/helperhome';
import { colors, pixel } from '../styles/basecss';
import { AnyText, OuterUserName } from '../components/home/helperprefernce';
import Actions from '../reducer/actions';
import { CloseSvg } from '../icons/all';
////////////////////////////////////////////
export function RenderMentionsUint({ style }) {
    const dispatch = useDispatch();
    const windowSize = useSelector(state => state.sign.windowSize);
    const suggestionPress = useSelector(state => state.sign.suggestionPress);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const [results, setResults] = useState(null);
    ////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "onSearch":
                setResults(data);
                console.log("line 101 ~ useEffect ~ data", data)
                break;
            default:
                break;
        }
    }, [socketLive]);
    /////////////////////////////////////////
    useEffect(() => {
        return () => {
            console.log("return ~ onSuggestionPress", null);
            setResults(null);
            dispatch(Actions.type("onSuggestionPress", null));
        }
    }, [])
    /////////////////////////////////////////
    return ((results?.length && suggestionPress !== "close") ? <ScrollView horizontal={true}
        keyboardShouldPersistTaps='handled'
        style={{
            width: (windowSize?.width || 100), height: 50,
            maxHeight: 50, position: "absolute",
            left: moderateScale(0), overflow: "hidden",
            backgroundColor: colors[isDark ? "clr1" : "back1"],
            zIndex: 5, borderRadius: 50, ...style
        }}>
        <UserInfoModalTouch isRTL={true} onPress={() => {
            setResults(null);
        }} activeOpacity={0.8} back={isDark ? "clr3" : "back3"}
            css={css`margin-left: ${pixel(6)};padding: 0 4px;border-radius: 40px;top: ${pixel(8)};
                width: ${pixel(30)};height: ${pixel(30)};justify-content: center;`}>
            <CloseSvg size={moderateScale(14)} />
        </UserInfoModalTouch>
        {results?.sort(() => Math.random() - 0.5)?.map((data, i) => {
            return (<UserInfoModalTouch key={data.userid + "_suggest" + i} isRTL={true}
                onPress={() => {
                    suggestionPress({ id: data.userid, name: data.username });
                    setResults(null);
                }} activeOpacity={0.8} back={isDark ? "clr3" : "back3"}
                css={css`margin-left: ${pixel(6)};padding: 0 4px;border-radius: 7px;`}>
                <RenderAnyUserPhoto userPhoto={data.UserPhoto} size={pixel(36)} />
                <OuterUserName isRTL={true}>
                    <AnyText isRTL={true} size={moderateScale(13)} lower lineH={pixel(16)}
                        css={css`max-width: ${pixel(180)};`} numberOfLines={1} ellipsizeMode="tail"
                        color={isDark ? "back3" : "clr1"}>{data.fullName}</AnyText>
                    <AnyText isRTL={true} size={moderateScale(12)} lower lineH={pixel(16)}
                        css={css`max-width: ${pixel(180)};`} numberOfLines={1} ellipsizeMode="tail"
                        color={"clr2"}>{data.username}</AnyText>
                </OuterUserName>
            </UserInfoModalTouch>);
        })}
    </ScrollView> : null)
}