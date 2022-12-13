import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { EditPenSvg, MoreSvg, SettingsSvg } from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { pixel } from '../../../styles/basecss';
import { OuterOneView } from '../../home/helpernotification/heplernotifycss';
import { AnyText } from '../../home/helperprefernce';
import { ButtonNormal } from '../../home/sliderroom/helperroomcss';
///////////////////////////////////////////////////
const OwenControlProfile = () => {
    const dispatch = useDispatch();
    const { tabsData, badges } = useSelector(state => state.sign.langData);
    const { infos, username } = useSelector(state => state.main.user);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    ///////////////////////////////////////
    const openProfileMore = useCallback(() => {
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "profilemore",
            isMe: true,
            username,
            isFriend: false
        }));
    }, [username]);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        css={css`justify-content: center;margin: 0;margin-top: 8px;
        background: transparent;flex-direction: column;`}>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            css={css`justify-content: center;margin: 0;background: transparent;`}>
            <ButtonNormal radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1" onPress={openProfileMore}
                css={css`margin-right: ${isRTL ? 0 : pixel(8)};max-width: ${pixel(20)};height: ${pixel(36)};`}>
                <MoreSvg size={moderateScale(18)} rot={90} />
            </ButtonNormal>
            <ButtonNormal isRTL={isRTL} radius="7px" activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1"
                onPress={() => navigate("editprofile")}>
                <EditPenSvg size={moderateScale(18)} />
            </ButtonNormal>
            <ButtonNormal isRTL={isRTL} radius="7px" activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1"
                onPress={() => navigate("settings")}>
                <SettingsSvg size={moderateScale(18)} />
                <AnyText lower color={isDark ? "back3" : "clr3"} isRTL={isRTL}
                    lineH={pixel(16)} size={moderateScale(13)} autoMargin={pixel(5)}>
                    {tabsData.settings}
                </AnyText>
            </ButtonNormal>
        </OuterOneView>
        <OuterOneView isRTL={isRTL} activeOpacity={0.8}
            onPress={() => navigate("following")}
            css={css`margin: 0;margin-top: ${pixel(10)};justify-content: center;`}>
            <AnyText lower color="clr2"
                lineH={pixel(16)} size={moderateScale(13)}>
                {infos?.following || 0}
            </AnyText>
            <AnyText lower color="clr2"
                lineH={pixel(16)} size={moderateScale(13)}>
                {" "}
            </AnyText>
            <AnyText lower color="clr2"
                lineH={pixel(16)} size={moderateScale(13)}>
                {badges.following}
            </AnyText>
        </OuterOneView>
    </OuterOneView>)
}

export default memo(OwenControlProfile);