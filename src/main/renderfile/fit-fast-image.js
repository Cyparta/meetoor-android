import React from "react";
import FastImage from "react-native-fast-image";
import { css } from "styled-components";
import { OuterFitImage } from "../../components/home/createstatus/helpercreatestatuscss";
import { OuterLazy } from "../../components/home/helperhome";
import { colors, pixel } from "../../styles/basecss";
////////////////////////////////////////////////
export default class FitFastImage extends React.PureComponent {
    state = {
        layoutWidth: 400,
        imgHeight: 50,
    };
    render() {
        const { height = 0, maxHeight = 420,
            type = "cover", uri,
            width = 0, inner100 = false,
            // forceReto = false
        } = this.props;
        const { imgHeight, layoutWidth } = this.state;
        const calcImgHeight = imgHeight * (width || layoutWidth);
        // let chooseHeight = (height || calcImgHeight);
        // let chooseMaxHeight = (chooseHeight > maxHeight) ? maxHeight : chooseHeight;
        return (<OuterLazy background={inner100 ? false : colors["clr3"]}
            css={css`border-radius: 5px;height: auto;
                ${height ? null : `max-height: ${pixel(maxHeight)};`}`}
            onLayout={({ nativeEvent: { layout } }) => {
                this.setState({
                    layoutWidth: parseInt(layout?.width)
                })
            }}>
            <FastImage
                style={{
                    width: (width || layoutWidth),
                    height: (height || calcImgHeight),
                    borderRadius: 5
                }}
                source={{ uri, priority: FastImage.priority.normal }}
                resizeMode={FastImage.resizeMode[type]}
                onLoad={({ nativeEvent }) => {
                    this.setState({
                        imgHeight: ((nativeEvent?.height || 100) / (nativeEvent?.width || 200))
                    })
                }
                }
            />
            <OuterFitImage css={css`width: ${inner100 ? "100%" : "auto"};position: absolute;`}>
                {this.props.children}
            </OuterFitImage>
        </OuterLazy>);
    }
}