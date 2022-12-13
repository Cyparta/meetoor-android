import React from "react";
import Video from 'react-native-video';
import { css } from 'styled-components';
import { colors, pixel } from '../../styles/basecss';
import { PlayControlSvg } from "../../icons/all";
import { MaterialIndicator } from "react-native-indicators";
import { VideoView, ViewOuterCirculerAnimation } from "./mainplayer";
import { moderateScale } from "react-native-size-matters";
////////////////////////////////////////////////
class StatusPlayerMain extends React.Component {
    constructor() {
        super();
        this.state = {
            paused: true,
            load: false
        }
    }
    componentDidUpdate(props, state) {
        if (state.paused !== props.pausedPlayer) {
            this.setState({ paused: props.pausedPlayer });
        }
    }
    render() {
        return (<VideoView activeOpacity={1} onPress={() => {
            this.setState({ paused: !this.state.paused });
        }}>
            <Video
                ref={ref => this.refPlayer = ref}
                source={{ uri: this.props.uri }}
                resizeMode="contain"
                paused={this.state.paused}
                rate={1.0}
                repeat={true}
                volume={10}
                posterResizeMode="contain"
                onLoad={() => this.setState({ load: true })}
                playInBackground={true}
                playWhenInactive={true}
                poster={this.props.poster}
                onEnd={() => {
                    this.setState({ paused: true });
                }}
                style={{
                    width: "100%", height: "100%",
                    backgroundColor: colors["clr1"]
                }}
            />
            <ViewOuterCirculerAnimation
                back="clr2" size={pixel(50)}
                css={css`position: absolute;`}
                animation={!this.state.load ? "pulse" : this.state.paused ? "bounceIn" : "bounceOut"}>
                {!this.state.load ? <MaterialIndicator size={moderateScale(38)} color={colors["back3"]} /> :
                    <PlayControlSvg color="back3" type={!this.state.paused} size={moderateScale(20)} />}
            </ViewOuterCirculerAnimation>
        </VideoView>)
    }
}

export default StatusPlayerMain;