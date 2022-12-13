import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WaveIndicator } from 'react-native-indicators';
import { css } from 'styled-components';
import { colors, pixel } from '../../styles/basecss';
import { EyeSvg } from '../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { AnyText, FlatScroll, PlaceholdView } from '../home/helperprefernce';
import { OuterOneContent, OuterOneImg, OuterOneView } from '../home/helpernotification/heplernotifycss';
import { RenderAnyUserPhoto } from '../home/helperhome';
////////////////////////////////////////////
const RenderOneChatTeamSeen = memo(({ fullname, username, userphoto }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const GoToPage = useCallback(() => {
        navigate("profile", { username });
    }, [navigate, username]);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} onPress={GoToPage}
        activeOpacity={0.8} isRTL={isRTL}>
        <OuterOneImg size={moderateScale(40)}>
            <RenderAnyUserPhoto userPhoto={userphoto} size={pixel(40)} />
        </OuterOneImg>
        <OuterOneContent isRTL={isRTL} css={css`max-width: ${pixel(240)};`}>
            <AnyText lower color="clr2" size={moderateScale(14)}
                ellipsizeMode="tail" >{fullname}</AnyText>
            <AnyText lower color="clr2" size={moderateScale(11)} lineH={pixel(13)}
                ellipsizeMode="tail">{"@" + username}</AnyText>
        </OuterOneContent>
    </OuterOneView>)
});
////////////////////////////////////////////
const ChatTeamSeenerModal = ({ currentSeener }) => {
    const { badges } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////////
    const OneChatSeenMemo = useMemo(() => ({ item }) => {
        return (<RenderOneChatTeamSeen {...item} key={item.username + "_chat_team_seen"} />);
    }, []);
    ////////////////////////////////////////
    return (<FlatScroll isDark={isDark} data={currentSeener}
        renderItem={OneChatSeenMemo}
        ListHeaderComponent={<>
            <AnyText color={isDark ? "back3" : "clr1"} align="center" lineH={pixel(40)}
                css={css`background: ${colors[isDark ? "clr3" : "back3"]};`}>
                {badges.seener}
            </AnyText>
        </>}
        ListEmptyComponent={currentSeener === undefined ?
            <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
            currentSeener.length ? null : <PlaceholdView height={pixel(200)}>
                <EyeSvg color="clr2" size={moderateScale(100)} />
            </PlaceholdView>}
    />)
}

export default memo(ChatTeamSeenerModal)
