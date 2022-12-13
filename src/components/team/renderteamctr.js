import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { pixel } from '../../styles/basecss';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { AnyText } from '../home/helperprefernce';
import { moderateScale } from 'react-native-size-matters';
import { ButtonNormal } from '../home/sliderroom/helperroomcss';
import { CloseSvg, CopySvg, DeleteSvg, EditPenSvg, JoinedSvg, LeaveSvg, PlusSvg } from '../../icons/all';
import { copyToClipboard } from '../../reducer/helper';
import Actions from '../../reducer/actions';
///////////////////////////////////////////////////
const RenderControlTeam = ({
    teamName,
    isAdmin,
    type,
    teamid,
    interset,
    teamCoporation,
    teamDescription
}) => {
    const dispatch = useDispatch();
    const { navigate, goBack } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    const { buttons } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    //////////////////////////////////////////////////////
    const copyLink = useCallback(() => {
        copyToClipboard(`https://meetoor.com/home/team/?t=${teamid}`);
    }, [teamid]);
    //////////////////////////////////////////////////////
    const BuildButton = useCallback(() => {
        switch (type) {
            case "admin":
                return (<ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"}
                    borderColor="clr1" onPress={() => {
                        dispatch(Actions.type("setCurrentModalWithNav", {
                            key: "alert",
                            YesFunc: async () => {
                                try {
                                    mainSocket.emit("removeTeam", { teamid });
                                    dispatch(Actions.type("setTeams", {
                                        type: 'delete',
                                        data: {
                                            keyArray: `teaminfo-${teamid}`,
                                        }
                                    }));
                                    goBack();
                                } catch (e) {
                                    console.log("Dashbord -> error.data", e)
                                }
                            }
                        }));
                    }}>
                    <DeleteSvg size={moderateScale(16)} />
                    <AnyText lower color={isDark ? "back3" : "clr3"}
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.delTeam}
                    </AnyText>
                </ButtonNormal>);
            case "member":
                return (<ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"}
                    borderColor="clr1" onPress={() => {
                        dispatch(Actions.type("setCurrentModalWithNav", {
                            key: "alert",
                            YesFunc: async () => {
                                try {
                                    mainSocket.emit("leaveTeam", { teamname: teamName });
                                    dispatch(Actions.type("setTeams", {
                                        type: 'delete',
                                        data: {
                                            keyArray: `teaminfo-${teamid}`,
                                        }
                                    }));
                                    goBack();
                                } catch (e) {
                                    console.log("Dashbord -> error.data", e)
                                }
                            }
                        }));
                    }}>
                    <LeaveSvg size={moderateScale(16)} color="red2" />
                    <AnyText lower color="red2"
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.leaveTeam}
                    </AnyText>
                </ButtonNormal>);
            case "sent":
                return (<ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"}
                    borderColor="clr1" onPress={() => {
                        mainSocket.emit("teamRequest", { teamname: teamName });
                    }}>
                    <CloseSvg size={moderateScale(13)} />
                    <AnyText lower color="red2"
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.cancelRequest}
                    </AnyText>
                </ButtonNormal>);

            default:
                return (<ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    back={isDark ? "clr3" : "back1"}
                    borderColor="clr1" onPress={() => {
                        mainSocket.emit("teamRequest", { teamid });
                    }}>
                    <JoinedSvg size={moderateScale(16)} />
                    <AnyText lower color={isDark ? "back3" : "clr3"}
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.joinToTeam}
                    </AnyText>
                </ButtonNormal>);
        }
    }, [type, teamid, teamName, isRTL, isDark]);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        back={isDark ? "clr1" : "back1"}
        css={css`justify-content: center;margin: 0;padding: 8px 0;
            margin-bottom: 4px;border-radius: 5px;flex-direction: column;`}>
        <OuterOneView isRTL={isRTL} activeOpacity={1}
            css={css`width: auto;padding: 0;margin: 0;
                margin-bottom: ${pixel(4)};justify-content: center;`}>
            <AnyText lower color={isDark ? "back3" : "clr3"}
                isRTL={isRTL} autoMargin={pixel(5)}>
                {teamName}
            </AnyText>
        </OuterOneView>
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            css={css`justify-content: center;margin: 0;margin-top: ${pixel(6)};
                background: transparent;flex-direction: column;`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`justify-content: center;margin: 0;background: transparent;`}>
                <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2} onPress={copyLink}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1">
                    <CopySvg size={moderateScale(16)} />
                </ButtonNormal>
                {isAdmin ? <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    onPress={() => navigate("editteam", {
                        teamName,
                        interset,
                        teamid,
                        discription: teamDescription,
                        corporation: teamCoporation
                    })}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1">
                    <EditPenSvg size={moderateScale(16)} />
                </ButtonNormal> : null}
                <BuildButton />
                <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                    activeOpacity={0.8} borderAlpha={0.2}
                    onPress={() => navigate("inviteuserto", { teamid })}
                    back={isDark ? "clr3" : "back1"} borderColor="clr1">
                    <PlusSvg size={moderateScale(16)} />
                    <AnyText lower color={isDark ? "back3" : "clr3"}
                        isRTL={isRTL} lineH={pixel(16)}
                        size={moderateScale(13)} autoMargin={pixel(5)}>
                        {buttons.invite}
                    </AnyText>
                </ButtonNormal>
            </OuterOneView>
        </OuterOneView>
    </OuterOneView>)
}

export default memo(RenderControlTeam);