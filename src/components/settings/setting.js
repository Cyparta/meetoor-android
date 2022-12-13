import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { SettingsSvg } from '../../icons/all';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { LabelText } from '../sign/helperinput';
import { AnyText, ScrollBar } from '../home/helperprefernce';
import RenderSoundSystem from './soundsystem';
import Actions from '../../reducer/actions';
import { colors, pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////
const RenderSettingsMeetoor = () => {
    const dispatch = useDispatch();
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const mainSocket = useSelector(state => state.main.socket);
    const { tabsData, settings, buttons } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const user = useSelector(state => state.main.user);
    const settingsMeetoor = useSelector(state => state.profile.settings);
    ////////////////////////////////////////
    const openModalTextInput = (data) => {
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "inputtextmodal", ...data
        }))
    }
    ////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "cancelDeleteAccount":
                dispatch(Actions.type("setSettings", {
                    ...settingsMeetoor, isDeleting: true
                }));
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////
    return (<ScrollBar stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps='handled' padd={pixel(4)}
        back={colors[isDark ? "clr1" : "back1"]}>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};`}>
            <SettingsSvg size={moderateScale(20)} />
            <AnyText isRTL={isRTL} autoMargin={pixel(6)} size={moderateScale(19)}
                color={isDark ? "back2" : "clr1"} lineH={pixel(20)}>
                {tabsData.settings}
            </AnyText>
        </OuterOneView>
        <RenderSoundSystem />
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <LabelText isDrak={isDark} isRTL={isRTL}>
                {settings.changeUname}
            </LabelText>
            <OuterOneView activeOpacity={0.8} isRTL={isRTL}
                back={isDark ? "clr1" : "back1"}
                onPress={() => openModalTextInput({
                    href: "changeUsername",
                    senderVal: "username",
                    placeholder: settings.newUname,
                    header: settings.changeUname,
                    orgVal: user.username,
                })}
                css={css`margin: 0;padding: ${pixel(7)};border-radius: ${pixel(4)};`}>
                <AnyText lower color={isDark ? "back2" : "clr1"}>{user.username}</AnyText>
            </OuterOneView>
        </OuterOneView>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <LabelText isDrak={isDark} isRTL={isRTL}>
                {settings.changeEmail}
            </LabelText>
            <OuterOneView activeOpacity={0.8} isRTL={isRTL}
                back={isDark ? "clr1" : "back1"}
                onPress={() => openModalTextInput({
                    href: "changeEmail",
                    senderVal: "email",
                    placeholder: settings.newEmail,
                    header: settings.changeEmail,
                    orgVal: user.email,
                })}
                css={css`margin: 0;padding: ${pixel(7)};border-radius: ${pixel(4)};`}>
                <AnyText lower color={isDark ? "back2" : "clr1"}>{user.email}</AnyText>
            </OuterOneView>
        </OuterOneView>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <LabelText isDrak={isDark} isRTL={isRTL}>
                {settings.changePass}
            </LabelText>
            <OuterOneView activeOpacity={0.8} isRTL={isRTL}
                back={isDark ? "clr1" : "back1"}
                onPress={() => openModalTextInput({
                    href: "changePassword",
                    senderVal: "newPassword",
                    placeholder: settings.newPass,
                    header: settings.changePass,
                    orgVal: ""
                })}
                css={css`margin: 0;padding: ${pixel(7)};border-radius: ${pixel(4)};justify-content: center;`}>
                <AnyText lower color={isDark ? "back2" : "clr1"}>{buttons.change}</AnyText>
            </OuterOneView>
        </OuterOneView>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`justify-content: center;margin: 0;padding: ${pixel(7)};
                margin-bottom: ${pixel(4)};border-radius: ${pixel(4)};flex-direction: column;`}>
            <LabelText isDrak={isDark} isRTL={isRTL}>
                {settings.deleteAcc}
            </LabelText>
            {settingsMeetoor?.isDeleting ?
                <OuterOneView activeOpacity={0.8} isRTL={isRTL} back="red2"
                    onPress={() => {
                        mainSocket.emit("cancelDeleteAccount", { noDelete: true })
                    }}
                    css={css`margin: 0;padding: ${pixel(7)};border-radius: ${pixel(4)};justify-content: center;`}>
                    <AnyText color="back3">{buttons.cancelDelete}</AnyText>
                </OuterOneView> :
                <OuterOneView activeOpacity={0.8} isRTL={isRTL} back="red2"
                    onPress={() => openModalTextInput({
                        href: "delAccount",
                        placeholder: settings.yourPass,
                        header: settings.deleteAcc,
                        orgVal: "",
                        del: true,
                    })}
                    css={css`margin: 0;padding: ${pixel(7)};border-radius: ${pixel(4)};justify-content: center;`}>
                    <AnyText color="back3">{buttons.delete}</AnyText>
                </OuterOneView>}
        </OuterOneView>
    </ScrollBar>)
}

export default memo(RenderSettingsMeetoor);

