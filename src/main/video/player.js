import React from "react";
import Video from 'react-native-video';
import { css } from 'styled-components';
import { colors, pixel } from '../../styles/basecss';
import { PlayControlSvg } from "../../icons/all";
import { VideoView, ViewOuterCirculerAnimation } from "./mainplayer";
import { moderateScale } from "react-native-size-matters";
////////////////////////////////////////////////
class VideoPlayerLocal extends React.Component {
    constructor() {
        super();
        this.state = { paused: true }
    }
    render() {
        return (<VideoView width={this.props.width}
            height={this.props.height}
            activeOpacity={1} onPress={() => {
                this.setState({ paused: !this.state.paused });
            }}>
            <Video source={{ uri: this.props.uri }}
                resizeMode="contain"
                paused={this.state.paused || false}
                onLoad={() => {
                    this.setState({ paused: false });
                    setTimeout(() => this.setState({ paused: true }), 500);
                }}
                style={{
                    width: "100%", height: "100%",
                    backgroundColor: colors["clr1"]
                }}
            />
            <ViewOuterCirculerAnimation
                back="clr2" size={pixel(50)}
                css={css`position: absolute;`}
                animation={this.state.paused ? "bounceIn" : "bounceOut"}>
                <PlayControlSvg color="back3" type={!this.state.paused} size={moderateScale(19)} />
            </ViewOuterCirculerAnimation>
        </VideoView>)
    }
}

export default VideoPlayerLocal;