import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    CloseSvg, DeleteSvg, EditPenSvg, FriendsSvg, PublickSvg
} from '../../../icons/all';
import Actions from '../../../reducer/actions';
import RenderCTRStatus, { PrivateCreateStatus } from './renderctrstatus';
import StatusTextArea from './statustextarea';
import { ToastAndroid } from 'react-native';
import { TopNavigateOuter } from '../../posts/createpost/helpercreatepostcss';
import { ButtonCirculer, OuterButtonControl, UserInfoModal } from '../sliderroom/helperroomcss';
import { RenderAnyUserPhoto } from '../helperhome';
import VideoPlayerLocal from '../../../main/video/player';
import { AnyText, OuterUserName, ScrollBar } from '../helperprefernce';
import { OuterFitImage, OuterViewerStatusEditor } from './helpercreatestatuscss';
import useGoBack from "../../../main/goback";
import { pixel } from '../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import ImagePicker from 'react-native-image-crop-picker';
import FitFastImage from '../../../main/renderfile/fit-fast-image';
////////////////////////////////////////////
const CreateStatusEditorMeetoor = ({ isMedia, openType }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const { badges, placeholder } = useSelector(state => state.sign.langData);
    const User = useSelector(state => state.main.user);
    const isRTL = useSelector(state => state.sign.isRTL);
    const backgroundStatus = useSelector(state => state.sign.backgroundStatus);
    const isDark = useSelector(state => state.sign.isDark);
    const postState = useSelector(state => state.sign.postState);
    const handleBack = useGoBack();
    ////////////////////////////////////////
    const maxContent = 250;
    const [currentText, setCurrentText] = useState("");
    const [fileBack, setFileBack] = useState(null);
    const [miunsMax, setMiunsMax] = useState(maxContent);
    ////////////////////////////////////////
    const currentStateIcon = useMemo(() => {
        switch (postState) {
            case 1:
                return <PublickSvg color="clr2" />;
            case 2:
                return <FriendsSvg color="clr2" />;
            default:
                return <PublickSvg color="clr2" />;
        }
    }, [postState]);
    ////////////////////////////////////////
    const detectMax = useCallback((textLength) => {
        setMiunsMax(maxContent - textLength);
    }, []);
    ////////////////////////////////////////
    useEffect(() => {
        detectMax(currentText.length);
    }, [backgroundStatus]);
    ////////////////////////////////////////
    useEffect(() => {
        console.log("useEffect ~ fileBack", fileBack)
    }, [fileBack]);
    ////////////////////////////////////////
    const createStatus = useCallback(async () => {
        try {
            handleBack();
            ToastAndroid.show(placeholder.posting, ToastAndroid.LONG);
            const response = await PrivateCreateStatus({
                File: fileBack, secure: postState, postText: currentText,
                background: isMedia ? 0 : backgroundStatus, token
            });

            ToastAndroid.show(placeholder.posted, ToastAndroid.LONG);

            dispatch(Actions.type("setMyStory", { type: "set", data: response }));

        } catch (e) {
            ToastAndroid.show(e, ToastAndroid.LONG);
            console.log("createStatus -> catch", e)
        }
    }, [fileBack, postState, backgroundStatus, currentText, token, isMedia]);
    ////////////////////////////////////////
    return (<>
        <TopNavigateOuter isDark={isDark}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color={isDark ? "back3" : "clr2"}>{User.fullName}</AnyText>
                    <AnyText isRTL={isRTL}
                        color={isDark ? "back2" : "clr2"}
                        lower target lineH={pixel(15)}>
                        {badges.addStatus}
                    </AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8} isRTL={isRTL} isDark={isDark}
                    onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "poststate" }))}>
                    {currentStateIcon}
                </ButtonCirculer>
                <ButtonCirculer activeOpacity={0.8}
                    isRTL={isRTL} isDark={isDark}
                    onPress={handleBack} close>
                    <CloseSvg size={moderateScale(14)} />
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <ScrollBar isDark={isDark} padd={`0 ${pixel(4)}`}
            keyboardShouldPersistTaps='handled'
            stickyHeaderIndices={[0]}>
            <RenderCTRStatus miunsMax={miunsMax} isBack={backgroundStatus !== 0}
                setFileBack={setFileBack} isMedia={isMedia} openType={openType}
                restoreText={() => {
                    setCurrentText("");
                    detectMax(0);
                }} createStatus={createStatus} />
            {isMedia ? <OuterViewerStatusEditor back="clr3">
                {fileBack ? <>
                    <ButtonCirculer activeOpacity={0.8} style={{
                        position: 'absolute', right: 0,
                        top: moderateScale(8), zIndex: 2
                    }} onPress={() => setFileBack(null)} close>
                        <DeleteSvg size="20" />
                    </ButtonCirculer>
                    {fileBack.typeFile === 'image' ?
                        <ButtonCirculer activeOpacity={0.8} style={{
                            position: 'absolute', right: moderateScale(48),
                            top: moderateScale(8), zIndex: 2
                        }} onPress={() => {
                            ImagePicker.openCropper({
                                path: fileBack.uri,
                                width: 300,
                                height: 600
                            }).then(({ path, mime, size }) => {
                                setFileBack((back) => ({
                                    ...back,
                                    name: path.split('/').pop(),
                                    uri: path, type: mime, size,
                                }));
                            });
                        }}>
                            <EditPenSvg size="20" />
                        </ButtonCirculer> : null}
                    {fileBack.typeFile === 'image' ?
                        <FitFastImage width={300} height={600} type="contain" uri={fileBack.uri} /> :
                        <VideoPlayerLocal uri={fileBack.uri} width={pixel(310)} height={pixel(600)} />}
                </> : null}
            </OuterViewerStatusEditor> :
                <OuterViewerStatusEditor back="clr3">
                    <OuterFitImage>
                        <StatusTextArea maxContent={maxContent}
                            detectMax={detectMax} background={backgroundStatus}
                            setCurrentText={setCurrentText} currentText={currentText} />
                    </OuterFitImage>
                </OuterViewerStatusEditor>}
        </ScrollBar>
    </>)
}

export default memo(CreateStatusEditorMeetoor);
