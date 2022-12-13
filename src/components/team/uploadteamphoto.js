import React, { useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { OuterAnyView, RenderAnyUserPhoto } from '../home/helperhome';
import { TopNavigateOuter } from '../posts/createpost/helpercreatepostcss';
import { ButtonCirculer, OuterButtonControl, UserInfoModal } from '../home/sliderroom/helperroomcss';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { CorrectSvg } from '../../icons/all';
import { css } from 'styled-components';
import Actions from '../../reducer/actions';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import Axios from '../../main/Axios';
/////////////////////////////////////////////////////////
const RenderTeamPhotoUploader = memo(({ file, teamPhoto, teamName, teamid }) => {
    const dispatch = useDispatch();
    const { placeholder } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isRTL = useSelector(state => state.sign.isRTL);
    const mainSocket = useSelector(state => state.main.socket);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    //////////////////////////////////////////
    const uploadTeamPhoto = useCallback(async () => {
        try {
            let data = new FormData();
            data.append("TeamLogo", file);
            ToastAndroid.show(placeholder.posting, ToastAndroid.LONG);
            const response = await Axios.post(`teamInfo/?teamname=${teamName}`, data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setTeams", {
                type: 'update',
                data: {
                    key: `teaminfo-${teamid}`,
                    call: (target) => {
                        target.teamPhoto = response.data.teamPhoto;
                    }
                }
            }));
            modalizeWithNav.close();
            mainSocket.emit("editTeam", { ...response.data, editTeam: teamName });
            ToastAndroid.show(placeholder.posted, ToastAndroid.LONG);
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [file, modalizeWithNav]);
    ///////////////////////////////////////////
    return (<OuterAnyView css={css`flex-direction: column;`}>
        <TopNavigateOuter css={css`padding: 0px;margin-bottom: ${pixel(6)};`}
            isDark={false}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={teamPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color={"clr3"}>{teamName}</AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8} isRTL={isRTL}
                    isDark={false} onPress={uploadTeamPhoto}>
                    <CorrectSvg color="clr2" size={moderateScale(18)} />
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <RenderAnyUserPhoto userPhoto={file.uri} sizeImage={pixel(260)} />
    </OuterAnyView>)
});

export default RenderTeamPhotoUploader;