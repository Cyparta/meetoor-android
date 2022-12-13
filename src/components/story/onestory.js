import React, { memo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { ProcessTextWithLink } from '../../main/processtext/processtext';
import { StatusFitImageOuter } from '../home/sliderstatus/helperstatuscss';
import { OuterFitImage } from '../home/createstatus/helpercreatestatuscss';
import StatusPlayerMain from '../../main/video/statusplayer';
import BottomSectionChatView from '../chatmessage/chatbottom';
import {
    ButtonCirculer, CssOuterModal,
    TopModalOuter,
    UserInfoModalTouch, ViewOuterCirculer
} from '../home/sliderroom/helperroomcss';
import styled, { css } from 'styled-components';
import { OuterAnyView, RenderAnyUserPhoto } from '../home/helperhome';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { DownloadSvg, MoreSvg, ReplySvg, SecureSvg, StarSvg } from '../../icons/all';
import ReactionRender from '../../icons/reaction';
import { colors, pixel, Rgba } from '../../styles/basecss';
import { downloadFile } from '../../main/downloadfile';
import { moderateScale } from 'react-native-size-matters';
import FitFastImage from '../../main/renderfile/fit-fast-image';
import Actions from '../../reducer/actions';
import { BackHandler } from 'react-native';
////////////////////////////////////////////
export const TopModalWithGradient = styled(LinearGradient)`
    ${CssOuterModal}
    width: 100%;
    ${(props) => props.css || null}
`;
////////////////////////////////////////////
const OneStoryMeetoor = ({ background, frame, isVideo, date, active,
    isSecure, likeType, storyFile, storyText, owen, isOwner,
    storyUserphoto, storyName, storyUsername, storyId, isFriend }) => {
    const dispatch = useDispatch();
    const Time = useSelector(state => state.main.time);
    const lang = useSelector(state => state.sign.lang);
    const isRTL = useSelector(state => state.sign.isRTL);
    const windowSize = useSelector(state => state.sign.windowSize);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    const { navigate } = useSelector(state => state.modal.navigation);
    const mainSocket = useSelector(state => state.main.socket);
    ////////////////////////////////////////
    const GoToProfile = useCallback(() => {
        navigate("profile", { username: storyUsername });
    }, [navigate, storyUsername]);
    ////////////////////////////////////////
    const [LikeType, setLikeType] = useState(likeType ? likeType : null);
    const [openReply, setOpenReply] = useState(false);
    /////////////////////////////////////////
    const { content } = ProcessTextWithLink(storyText, {
        isDark, size: 20,
        center: true,
        colorStatus: background,
        isPadding: true,
        line: pixel(28)
    }).text;
    const isMe = (storyUsername === User.username);
    /////////////////////////////////////////
    const localTime = Time.setDate(date, lang);
    /////////////////////////////////////////
    const setReactLike = useCallback((like = "heart") => {
        setLikeType((prevLike) => {
            let currntLike = "";
            if (prevLike === like) {
                mainSocket.emit("onStoryLike", {
                    "storyid": storyId,
                    "likeType": like,
                });
                // setIsLiked(false);
                currntLike = null;
            } else {
                // setIsLiked(true);
                mainSocket.emit("onStoryLike", {
                    "storyid": storyId,
                    "likeType": like,
                    "action": true
                });
                currntLike = like;
            }
            return currntLike;
        });
    }, [storyId]);
    ///////////////////////////////////////////////
    useEffect(() => {
        setLikeType(likeType ? likeType : null);
    }, [likeType]);
    /////////////////////////////////////////
    useEffect(() => {
        active && !owen && mainSocket.emit("onStorySeen", { storyid: parseInt(storyId) });
    }, [active, storyId, owen]);
    useEffect(() => {
        const backAction = () => {
            if (!openReply) return false;
            setOpenReply(false);
            backHandler.remove();
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [openReply]);
    /////////////////////////////////////////
    return (<>
        <TopModalWithGradient css={css`position: absolute;z-index: 2;padding-bottom: ${pixel(2)};top: 0px;`}
            colors={[Rgba(colors["clr1"], 1), Rgba(colors["clr1"], 0.6), Rgba(colors["clr1"], 0.2)]}>
            <UserInfoModalTouch
                onPress={GoToProfile}
                activeOpacity={0.8}>
                <RenderAnyUserPhoto
                    userPhoto={storyUserphoto} size={pixel(42)}
                    renderBadge={isSecure ? <ViewOuterCirculer size={pixel(22)} back="clr1"
                        css={css`position: absolute;left: 0px;bottom: 0px;`}>
                        {isOwner ? <StarSvg color="back3" size={moderateScale(14)} /> :
                            <SecureSvg color="back3" size={moderateScale(14)} />}
                    </ViewOuterCirculer> : null} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color="back3">{storyName}</AnyText>
                    <AnyText isRTL={isRTL}
                        color="back3" target lineH={pixel(15)} lower>
                        {localTime.ago}
                    </AnyText>
                </OuterUserName>
            </UserInfoModalTouch>
            <OuterAnyView css={css`width: auto;`}>
                {isFriend && !isMe ? <ButtonCirculer size={pixel(40)} back="clr3" css={css`margin: 0px;`}
                    // onPress={() => navigate("storyreply", { username: storyUsername, isFriend })}
                    onPress={() => setOpenReply(back => !back)}
                    activeOpacity={0.8}>
                    <ReplySvg color="back2" size={moderateScale(18)} />
                </ButtonCirculer> : null}
                {background ? null : <ButtonCirculer isRTL={isRTL} size={pixel(40)} back="clr3"
                    onPress={() => downloadFile(storyFile)} activeOpacity={0.8}>
                    <DownloadSvg color="back2" size={moderateScale(18)} />
                </ButtonCirculer>}
                <ButtonCirculer size={pixel(20)} activeOpacity={0.8} back="clr3" isRTL={isRTL}
                    onPress={() => dispatch(Actions.type("setCurrentModalWithNav",
                        { key: "storymore", username: storyUsername }))}
                    css={css`height: ${pixel(38)};`}>
                    <MoreSvg forceDark={true} size={moderateScale(18)} rot={90} />
                </ButtonCirculer>
            </OuterAnyView>
        </TopModalWithGradient>
        {openReply ? <TopModalOuter css={css`position: absolute;z-index: 2;padding: 0;padding-bottom: ${pixel(2)};top: ${pixel(50)};`}>
            <BottomSectionChatView fromStatus={true} callback={() => setOpenReply(false)} username={storyUsername} isFriend={isFriend} />
        </TopModalOuter> : null}
        <StatusFitImageOuter back="clr1">
            <OuterFitImage enabled={false}>
                {background ? <FitFastImage
                    width={windowSize.width - 30}
                    height={windowSize.height - 120}
                    inner100={true}
                    uri={`https://cdn.meetoor.com/frontend/img/statusback/st_${background}.jpeg`}>
                    {content}
                </FitFastImage> : isVideo ? <StatusPlayerMain
                    uri={storyFile} pausedPlayer={!active} poster={frame} /> :
                    <FitFastImage
                        width={windowSize.width - 30}
                        height={windowSize.height - 120}
                        type="contain"
                        uri={storyFile} />}
            </OuterFitImage>
        </StatusFitImageOuter>
        <TopModalWithGradient colors={[Rgba(colors["clr1"], 0.2), Rgba(colors["clr1"], 0.6), Rgba(colors["clr1"], 1)]}
            css={css`position: absolute;z-index: 2;padding: 0;padding-bottom: ${pixel(2)};bottom: -1px;flex-direction: row-reverse;`}>
            {isMe ? null : active ? <ReactionRender onLike={setReactLike}
                backhander={false} opensound={false} active={LikeType}
                animRepeat={1} css={css`z-index: 10;`} /> : null}
        </TopModalWithGradient>
    </>)
}

export default memo(OneStoryMeetoor);