import React, {
    memo, useCallback,
    useEffect, useState
} from "react";
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import styled, { css } from 'styled-components';
import { WaveIndicator } from 'react-native-indicators';
import { colors, flexDisplay, font, pixel } from '../../styles/basecss';
import { OuterButtonIcon } from "../editable/editablecss";
import { PlayControlSvg } from "../../icons/all";
import { useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import { ToastAndroid } from "react-native";
Sound.setCategory('Playback');
//////////////////////////////////////////////////
const OuterSoundView = styled.View`
    width: auto;
    height: auto;
    position: relative;
    overflow: hidden;
    margin: ${pixel(4)} 0px;
    ${(props) => flexDisplay({ justify: props.isRTL ? "flex-end" : "flex-start" })};
`;
//////////////////////////////////////////////////
const SoundView = styled.View`
    width: ${pixel(240)};
    height: ${pixel(40)};
    position: relative;
    overflow: hidden;
    border-radius: ${pixel(20)};
    background: ${colors["clr2"]};
    ${() => flexDisplay({ justify: "space-between" })};
`;
//////////////////////////////////////////////////
const PlaySection = styled.View`
    width: ${pixel(38)};
    height: ${pixel(38)};
    position: relative;
    overflow: hidden;
    ${flexDisplay};
`;
//////////////////////////////////////////////////
const OtherSection = styled.View`
    width: ${pixel(200)};
    height: ${pixel(40)};
    position: relative;
    overflow: hidden;
    ${() => flexDisplay({ dir: "column", justify: "space-evenly" })};
`;
//////////////////////////////////////////////////
const soundSharedCss = css`
    width: 100%;
    height: ${pixel(20)};
    position: relative;
    overflow: hidden;
    ${flexDisplay};
`;
const SoundTimerShow = styled.Text`
    ${soundSharedCss};
    justify-content: center;
    ${() => font({ size: pixel(14), line: pixel(21), isAr: false, align: "center" })};
`;
//////////////////////////////////////////////////
const SoundBarOuter = styled.View`
    ${soundSharedCss};
`;
////////////////////////////////////////////////
const SoundPlayerMain = ({ uri }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const [SoundPlayer, setSoundPlayer] = useState(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playState, setPlayState] = useState(false);
    const [sliderState, setSliderState] = useState(false);
    /////////////////////////////////////////////
    const getAudioTimeString = useCallback((seconds) => {
        const m = parseInt(seconds % (60 * 60) / 60);
        const s = parseInt(seconds % 60);
        return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
    }, []);
    /////////////////////////////////////////////
    const onSliderChange = useCallback(value => {
        if (SoundPlayer) {
            SoundPlayer.setCurrentTime(value);
            setCurrentTime(value);
        }
    }, [SoundPlayer])
    /////////////////////////////////////////////
    const playComplete = useCallback((success, sound) => {
        if (sound) {
            setPlayState("finish");
            setCurrentTime(0);
            sound.setCurrentTime(0);
        }
    }, []);
    //////////////////////////////////////////////
    const PlaySound = useCallback(async () => {
        try {
            if (SoundPlayer) {
                if (playState === "paused" || playState === "finish") {
                    SoundPlayer.play((back) => playComplete(back, SoundPlayer));
                    setPlayState("playing");
                } else {
                    SoundPlayer.pause();
                    setPlayState("paused");
                }

            } else {
                setPlayState("buffer");
                let sound = new Sound(uri, null, (error) => {
                    if (error) {
                        setPlayState("paused");
                        ToastAndroid.show("error", ToastAndroid.LONG);
                        return;
                    } else {
                        setPlayState("playing");
                        setDuration(sound.getDuration());
                        sound.play((back) => {
                            playComplete(back, sound);
                        });
                        setSoundPlayer(sound);
                    }
                });
            }
        }
        catch (e) {
            console.log("PlaySound ~ e", e);
        }
    }, [uri, SoundPlayer, playState]);
    /////////////////////////////////////////////
    useEffect(() => {
        let progress = 0;
        if (playState === "playing" && !sliderState) {
            progress = setInterval(() => {
                if (SoundPlayer && SoundPlayer.isLoaded()) {
                    SoundPlayer.getCurrentTime((sec) => {
                        setCurrentTime(sec);
                    })
                }
            }, 100);
        }
        return () => clearInterval(progress);
    }, [playState, SoundPlayer, sliderState]);
    ////////////////////////////////////////////
    useEffect(() => {
        // if (!SoundPlayer) return;
        return () => SoundPlayer?.stop();
    }, [SoundPlayer]);
    ////////////////////////////////////////////
    return (<OuterSoundView isRTL={isRTL}>
        <SoundView>
            <PlaySection>
                <OuterButtonIcon back="clr2" onPress={PlaySound}>
                    {playState === "buffer" ? <WaveIndicator
                        size={moderateScale(22)} color={colors["clr1"]} />
                        : <PlayControlSvg color="clr2" size={moderateScale(20)}
                            type={playState === "playing" ? true : false} />}
                </OuterButtonIcon>
            </PlaySection>

            <OtherSection>
                <SoundTimerShow>
                    {getAudioTimeString(currentTime)} / {getAudioTimeString(duration)}
                </SoundTimerShow>
                <SoundBarOuter>
                    <Slider style={{ width: "100%", height: moderateScale(25) }}
                        minimumValue={0} step={1} value={currentTime}
                        maximumValue={duration} thumbTintColor={colors["back1"]}
                        minimumTrackTintColor={colors["back3"]}
                        maximumTrackTintColor={colors["back3"]}
                        onValueChange={onSliderChange}
                        onSlidingStart={() => setSliderState(true)}
                        onSlidingComplete={() => setSliderState(false)}
                    />
                </SoundBarOuter>
            </OtherSection>
        </SoundView>
    </OuterSoundView>)
}

export default memo(SoundPlayerMain);