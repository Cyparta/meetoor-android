import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import Actions from '../../reducer/actions';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { pixel } from '../../styles/basecss';
import ImagePicker from 'react-native-image-crop-picker';
import { PhotoSvg } from '../../icons/all';
import { ButtonCirculer } from '../home/sliderroom/helperroomcss';
///////////////////////////////////////////////////
const EditImgElement = memo(({ setFileBack }) => {
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////////////
    const onFileChange = useCallback((response) => {
        if (response.clear) {
            return;
        }
        const { uri, filename } = response;
        response.success();
        ImagePicker.openCropper({
            path: uri,
            width: 500,
            height: 500
        }).then(({ path, mime }) => {
            setFileBack({ uri: path, name: filename, type: mime });
        });
    }, []);
    ///////////////////////////////////////////
    return (<ButtonCirculer backrgba="clr1" activeOpacity={0.8}
        css={css`position: absolute;left: ${pixel(-7)};`}
        size={pixel(35)}
        onPress={() => navigate("cameraroll", {
            onFileChange, limit: 1, typeFiles: "Photos"
        })}>
        <PhotoSvg color="back3" />
    </ButtonCirculer>);
});
///////////////////////////////////////////////////
const RenderTeamPhoto = ({
    teamid,
    teamPhoto,
    teamName,
    isAdmin,
    setFileBack,
    fileBack,
    noViewer
}) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const PhotoSize = pixel(230);
    ///////////////////////////////////////////////
    useEffect(() => {
        if (fileBack && isAdmin) dispatch(Actions.type("setCurrentModalWithNav", {
            key: "uploadimg-team",
            file: fileBack,
            teamPhoto,
            teamName,
            teamid
        }))
    }, [fileBack, isAdmin]);
    ////////////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL}
        back={isDark ? "clr1" : "back1"}
        css={css`justify-content: center;margin: 0;
        margin-bottom: ${pixel(4)};border-radius: 5px;flex-direction: column;`}>
        <OuterOneView isRTL={isRTL} activeOpacity={1}
            css={css`width: auto;padding: 0;margin: ${pixel(7)} 0;justify-content: center;`}>
            <OuterOneView activeOpacity={0.8} css={css`width: auto;`}
                onPress={() => {
                    if (noViewer) return;
                    dispatch(Actions.type("setPopupImage", {
                        open: true,
                        index: 0,
                        imageUrls: [{ url: teamPhoto }],
                        userPhoto: teamPhoto,
                        userName: teamName,
                        isSecure: false,
                        isOwner: false,
                        noDownload: true
                    }))
                }}>
                <RenderAnyUserPhoto userPhoto={teamPhoto} size={PhotoSize} />
            </OuterOneView>
            {isAdmin ? <EditImgElement setFileBack={setFileBack} /> : null}
        </OuterOneView>
    </OuterOneView>)
}

export default memo(RenderTeamPhoto);