import React, {
    memo, useState,
    useCallback
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { AnyText, CircleStatus } from '../home/helperprefernce';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { css } from 'styled-components';
import { DeleteSvg, StarSvg } from '../../icons/all';
import { moderateScale } from 'react-native-size-matters';
import { ButtonNormal, ViewOuterCirculer } from '../home/sliderroom/helperroomcss';
import { OuterOneContent, OuterOneView } from '../home/helpernotification/heplernotifycss';
import { DotIndicator } from 'react-native-indicators';
////////////////////////////////////////////////
const OneMemberMain = ({ username, userPhoto, isleader, teamStatus, fullName, isAdmin, teamName }) => {
    const dispatch = useDispatch();
    const mainSocket = useSelector(state => state.main.socket);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { buttons } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const [holder, setHolder] = useState(false);
    ////////////////////////////////////////////
    const kickoutMember = useCallback(() => dispatch(Actions.type("setCurrentModalWithNav", {
        key: "alert",
        YesFunc: () => {
            setHolder(<ButtonNormal
                isRTL={isRTL} radius={pixel(5)} activeOpacity={0.8} borderAlpha={0.2}
                back={isDark ? "clr3" : "back1"} borderColor="clr1"
                css={css`margin: 0px;height: ${pixel(30)};min-width: ${pixel(60)};`}>
                <DotIndicator size={moderateScale(3)} count={7} color={colors["clr2"]} />
            </ButtonNormal>);
            mainSocket.emit("removeMember", { username, teamName });
        }
    })), [username, teamName]);
    ////////////////////////////////////////////
    return (<OuterOneView activeOpacity={0.9} isRTL={isRTL}
        onPress={() => navigate("profile", { username })}>
        <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(55)}
            renderBadge={<>
                {isleader ? <ViewOuterCirculer size={pixel(22)} back="clr1"
                    css={css`position: absolute;left: ${pixel(3)};bottom:${pixel(3)};`}>
                    <StarSvg forceDark size={moderateScale(15)} />
                </ViewOuterCirculer> : null}
                <ViewOuterCirculer size={pixel(16)} back="clr1"
                    css={css`position: absolute;left: ${pixel(45)};bottom:${pixel(3)};`}>
                    <CircleStatus color={teamStatus ? "online" : "offline"} />
                </ViewOuterCirculer>
            </>} />
        <OuterOneContent isRTL={isRTL} width="100%"
            css={css`justify-content: center;`}>
            <AnyText size={moderateScale(13)} lower
                color={isDark ? "back2" : "clr1"} lineH={pixel(14)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`max-width: 90%;`}>
                {fullName}
                <AnyText size={moderateScale(11)} lower color="clr2" lineH={pixel(12)}
                    numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                    css={css`max-width: 90%;`}>{" - @"}{username}</AnyText>
            </AnyText>
            {isleader ? <AnyText size={moderateScale(12)} lower color="clr2" lineH={pixel(16)}
                numberOfLines={1} width={"95%"} isRTL={isRTL} ellipsizeMode="tail"
                css={css`max-width: 90%;`}>{buttons.admin + " " + buttons.thisteam}</AnyText> :
                isAdmin ? <OuterOneView activeOpacity={1} isRTL={isRTL}
                    css={css`margin: 0;padding: 0px;margin-top: ${pixel(4)};width: auto;
                    justify-content: space-between;background: transparent;`}>
                    {holder ? holder : <ButtonNormal isRTL={isRTL} radius={pixel(5)}
                        activeOpacity={0.8} borderAlpha={0.2}
                        back={isDark ? "clr3" : "back1"} borderColor="clr1"
                        css={css`padding: 0 ${pixel(4)};margin: 0px;`}
                        onPress={kickoutMember}>
                        <DeleteSvg size={moderateScale(16)} />
                        <AnyText lower color="red2" isRTL={isRTL}
                            size={moderateScale(13)} autoMargin={pixel(5)}>
                            {buttons.delete}
                        </AnyText>
                    </ButtonNormal>}
                </OuterOneView> : null}
        </OuterOneContent>
    </OuterOneView>)
};

export default memo(OneMemberMain);