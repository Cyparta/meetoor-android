import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Video from 'react-native-video';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { colors, flexDisplay, backrgba, pixel } from '../../styles/basecss';
import * as Animatable from 'react-native-animatable';
import Slider from '@react-native-community/slider';
import OnePostTop from '../../components/posts/posts/post/posttop';
import OnePostBottom from '../../components/posts/posts/post/postbottom';
import { DownloadSvg, PlayControlSvg } from "../../icons/all";
import { MaterialIndicator } from "react-native-indicators";
import { AnyText } from "../../components/home/helperprefernce";
import { downloadFile } from "../downloadfile";
import { convertToTime } from "../../reducer/helper";
import { ButtonCirculer } from "../../components/home/sliderroom/helperroomcss";
import { OuterViewAnimation } from "../../icons/reaction";
import { moderateScale } from "react-native-size-matters";
import Actions from "../../reducer/actions";
//////////////////////////////////////////////////
export const VideoView = styled.TouchableOpacity`
    width: ${(props) => props.width || "100%"};
    height: ${(props) => props.height || "100%"};
    position: relative;
    overflow: hidden;
    ${() => flexDisplay({})}
    border-radius: 5px;
    margin: auto;
    background: ${colors["clr1"]};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const ViewOuterCirculerAnimation = styled(Animatable.View)`
    width: ${(props) => props.size || pixel(40)};
    height: ${(props) => props.size || pixel(40)};
    max-width: ${(props) => props.size || pixel(40)};
    margin-left: 8px;
    border-radius: ${(props) => props.size ? pixel(parseInt(props.size) / 2) : pixel(30)};
    ${flexDisplay};
    ${() => backrgba(colors["clr1"], 0.75)};
    ${(props) => props.css || null};
`;
//////////////////////////////////////////////////
const ControlView = styled.View`
    width: 100%;
    height: 100%;
    left: 0px;
    bottom: 0px;
    position: absolute;
    overflow: hidden;
    ${() => flexDisplay({ dir: "column", justify: "space-between" })};
    ${(props) => backrgba(colors["clr1"],
    props.alpha !== undefined ? props.alpha : 0.85)}
    z-index: 10;
    padding: 0;
    flex: 1;
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
const OuterBottom = styled.View`
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    ${() => flexDisplay({ dir: "column" })};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
const OtherSection = styled.View`
    width: 100%;
    height: ${(props) => props.height || pixel(40)};
    position: relative;
    overflow: hidden;
    flex: 1;
    ${() => flexDisplay({ dir: "row", justify: "space-evenly" })};
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
const BottomSection = styled.View`
    width: 100%;
    height: auto;
    position: relative;
    overflow: hidden;
    ${flexDisplay};
    ${props => props.css || null}
`;
////////////////////////////////////////////////
const VideoPlayerMain = ({
    uri, poster, statusDark = true, pausedPlayer,
    single = true, postData = {}, keyArray = ""
}) => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    /////////////////////////////////////////////
    const [state, setState] = useState({
        paused: true,
        load: false,
        showControl: true,
        duration: 0,
        currentTime: 0,
        textCurrentTime: 0,
        download: false
    });
    const refPlayer = useRef(null);
    useEffect(() => {
        setState((state) => ({ ...state, paused: pausedPlayer }));
        !pausedPlayer && refPlayer?.current?.seek(0);
        return () => {
            refPlayer?.current?.seek(0);
            setState((state) => ({
                ...state,
                currentTime: 0,
                textCurrentTime: 0,
                paused: true
            }));
        }
    }, [pausedPlayer]);
    useLayoutEffect(() => {
        statusDark && dispatch(Actions.type("setStatusBarDark", true));
        return () => dispatch(Actions.type("setStatusBarDark", false));
    }, [statusDark]);
    ///////////////////////////////////////////
    return (<VideoView css={css`border-radius: 0px;`}
        activeOpacity={1} onPress={() => {
            setState({ ...state, showControl: !state.showControl });
        }}>
        <Video
            ref={refPlayer}
            source={{ uri }}
            resizeMode="contain"
            paused={state.paused}
            rate={1.0}
            onLoad={({ duration }) => {
                setState({
                    ...state,
                    load: true,
                    duration
                });
            }}
            onProgress={({ currentTime }) => {
                setState({
                    ...state,
                    currentTime,
                    textCurrentTime: currentTime
                });
            }}
            onEnd={() => {
                setState({
                    ...state,
                    currentTime: 0,
                    textCurrentTime: 0,
                    paused: true
                });
                refPlayer.current.seek(0);
            }}
            playInBackground={true}
            playWhenInactive={true}
            poster={poster}
            style={{
                width: "100%", height: "100%",
                backgroundColor: colors["clr1"]
            }}
        />
        <ControlView alpha={state.showControl ? 0.15 : 0}>
            <OuterViewAnimation duration={400} animation={state.showControl ? "fadeIn" : "fadeOut"}
                css={css`flex-direction: ${single ? "column-reverse" : "column"};
                        width: 100%;height: 100%;justify-content: space-between;`}>
                {single ? null :
                    <OnePostTop keyArray={keyArray} posterPhoto={postData?.posterPhoto}
                        posterName={postData?.posterName}
                        posterUsername={postData?.posterUsername}
                        postId={postData?.postId} date={postData?.date}
                        isUser={postData?.isUser} isOwner={postData?.isOwner}
                        isSecure={postData?.isSecure} info={postData?.info}
                        isMe={false} fromVideo={true} />}
                <OuterBottom>
                    <BottomSection>
                        <OtherSection css={css`max-width: 120px;`}>
                            <ViewOuterCirculerAnimation back="clr2" size={pixel(40)}
                                animation={!state.load ? "pulse" : state.paused ? "pulse" : "rubberBand"}>
                                <ButtonCirculer size={pixel(38)} back="clr2" activeOpacity={0.8}
                                    onPress={() => setState({ ...state, paused: !state.paused })}>
                                    {!state.load ? <MaterialIndicator size={moderateScale(30)} color={colors["back3"]} />
                                        : <PlayControlSvg color="back3" size={moderateScale(18)} type={!state.paused} />}
                                </ButtonCirculer>
                            </ViewOuterCirculerAnimation>

                            <ButtonCirculer size={pixel(40)} activeOpacity={0.8}
                                back="clr3" onPress={() => {
                                    downloadFile(uri);
                                }}>
                                <OuterViewAnimation
                                    iterationCount={5}
                                    animation={state.download ? "bounceIn" : null}>
                                    <DownloadSvg color="yel" size={moderateScale(18)} />
                                </OuterViewAnimation>
                            </ButtonCirculer>

                        </OtherSection>
                        <OtherSection>
                            <AnyText size={moderateScale(12.5)} lineH={pixel(14)} width={pixel(40)} align="center">
                                {convertToTime(state.textCurrentTime)}
                            </AnyText>
                            <Slider
                                style={{ width: "100%", height: moderateScale(18), flex: 1 }}
                                minimumValue={0} value={state.currentTime}
                                maximumValue={state.duration} step={0.1}
                                thumbTintColor={colors["back1"]}
                                minimumTrackTintColor={colors["clr2"]}
                                maximumTrackTintColor={colors["back3"]}
                                onValueChange={(value) => {
                                    setState({ ...state, textCurrentTime: value });
                                }}
                                onSlidingStart={() => setState({ ...state, paused: true })}
                                onSlidingComplete={(value) => {
                                    refPlayer.current.seek(value);
                                    setState({ ...state, paused: false })
                                }}
                            />
                            <AnyText size={moderateScale(12.5)} lineH={pixel(14)} width={pixel(40)} align="center">
                                {convertToTime(state.duration)}
                            </AnyText>
                        </OtherSection>
                    </BottomSection>
                    {single ? null : <OnePostBottom
                        likes={postData?.likes}
                        keyArray={keyArray}
                        comments={postData?.comments}
                        clones={false}
                        postId={postData?.postId}
                        isUser={postData?.isUser}
                        likeType={postData?.likeType}
                        isliked={postData?.isliked}
                        isCloned={false}
                        openPostView={useCallback(() => navigate("postviewasnew", { postId: postData?.postId }), [postData?.postId])}
                        openLikesPostView={useCallback(() => navigate("postlikes", { postId: postData?.postId }), [postData?.postId])}
                        fromVideo={true}
                    />}
                </OuterBottom>
            </OuterViewAnimation>
        </ControlView>
    </VideoView>)
}

export default memo(VideoPlayerMain);