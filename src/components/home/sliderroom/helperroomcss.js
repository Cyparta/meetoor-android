import styled, { css } from 'styled-components';
import { colors, flexDisplay, Rgba, backrgba, pixel } from '../../../styles/basecss';
import FastImage from 'react-native-fast-image'
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: auto;
    border-radius: ${pixel(7)};
    position: relative;
    ${() => flexDisplay({ dir: "column", justify: "flex-start" })}
    border-width: 1px;
    border-color: ${() => Rgba(colors["clr1"], 0.1)};
    background:  ${colors["clr2"]};
    margin-right: ${pixel(3)};
    overflow: hidden;
`;
//////////////////////////////////////////////////
export const RoomContentOuter = styled.TouchableOpacity`
    ${OuterSharedCss}
    max-width: ${(props) => props.width};
    min-width: ${(props) => props.width};
`;
//////////////////////////////////////////////////
export const RoomContentOuterOps = styled.View`
    ${OuterSharedCss}
    max-width: ${pixel(170)};
    min-width: ${pixel(170)};
    opacity: 0.2;
`;
//////////////////////////////////////////////////
export const UserImageRoom = styled(FastImage)`
    width: ${(props) => props.sizeImage};
    height: ${(props) => props.heightSize ? props.heightSize : props.sizeImage};
    /* border-radius: 15px; */
    position: relative;
    ${flexDisplay}
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const RoomHeaderOuter = styled.View`
    width: 100%; 
    height: ${(props) => props.height || pixel(40)};
    position: relative;
    ${(props) => flexDisplay({ dir: props.dir || "row", justify: props.justify || "center" })}
    background: ${(props) => props.noBack ? "transparent" : colors[props.isDark ? "clr3" : "back3"]};
`;
//////////////////////////////////////////////////
const RoomBadgeCss = css`
    ${flexDisplay}
    background: ${(props) => colors[props.isDark ? "clr3" : "back3"]};
    position: absolute;
    right: ${pixel(4)};
    top: ${props => props.top || pixel(-36)};
    width: ${pixel(40)};
    height: ${pixel(40)};
    border-radius: ${pixel(25)};
    border-width: ${props => props.borderWid || pixel(2)};
    border-color: ${(props) => Rgba(colors[props.borderCol || "clr1"], 1)};
    z-index: 1;
`;
export const RoomBadgeCreate = styled.View`
    ${RoomBadgeCss}
    width: ${pixel(27)};
    height: ${pixel(27)};
    right: auto;
    left: auto;
    border-width: 0;
    background: ${(props) => colors[props.isDark ? "clr1" : "back1"]};
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const RoomBadgeCount = styled.View`
    ${RoomBadgeCss}
    ${flexDisplay}
    background: ${colors["back3"]};
    position: absolute;
    top: ${pixel(-15)};
    width: ${pixel(60)};
    height: ${pixel(26)};
    border-radius: ${pixel(10)};
    border-width: ${pixel(2)};
    ${props => props.isRTL ? `left: ${pixel(8)};` : `right: ${pixel(8)};`}
`;
//////////////////////////////////////////////////
export const RoomBadgeCreateIn = styled.View`
    ${RoomBadgeCss}
    right: 0px;
    top: ${pixel(-16)};
    width: ${pixel(26)};
    height: ${pixel(26)};
    border-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr1"], 0.1)};
`;
//////////////////////////////////////////////////
export const RenderBodyModal = styled.View`
    width: 100%; 
    height: auto;
    position: relative;
    ${() => flexDisplay({ dir: "column", justify: "flex-start" })}
    background: ${(props) => props.back ? colors[props.back] : "transparent"};
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const CssOuterModal = css`
    width: 100%; 
    height: ${pixel(50)};
    min-height: ${pixel(50)};
    position: relative;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "space-between"
})}
    border-bottom-width: ${props => props.borderBotWidth || "1px"};
    border-color: ${() => Rgba(colors["clr3"], 0.1)};
    padding: 0 ${pixel(8)};
    padding-bottom: ${pixel(8)};
    background: ${(props) => props.back ?
        colors[props.back] : props.backrgba ?
            Rgba(colors[props.backrgba], 0.5) : "transparent"};
    ${(props) => props.marginBottom !== undefined ? `margin-bottom: ${props.marginBottom};` : null}
`;
export const TopModalOuter = styled.View`
    ${CssOuterModal}
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const UserInfoModal = styled.View`
    width: auto;
    position: relative;
    ${() => flexDisplay({ justify: "flex-start" })}
    padding: 0;
`;
//////////////////////////////////////////////////
export const UserInfoModalTouch = styled.TouchableOpacity`
    width: auto;
    position: relative;
    ${(props) => flexDisplay({ dir: props.isRTL ? "row-reverse" : "row", justify: "flex-start" })}
    padding: 0;
    background: ${props => props.back ? colors[props.back] : "transparent"};
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterButtonControl = styled.View`
    position: relative;
    width: auto;
    max-width: ${pixel(100)};
    height: auto;
    border-radius: 5px;
    ${() => flexDisplay({ justify: "space-evenly" })}
    background: ${props => props.back ? colors[props.back] : "transparent"};
    ${(props) => {
        let style = ``
        if (props.isRTL !== undefined) style += `
            flex-direction: ${props.isRTL ? "row-reverse" : "row"}
        `
        return style;
    }}
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const cssCirculer = css`
    width: ${(props) => props.size || pixel(38)};
    height: ${(props) => props.size || pixel(38)};
    max-width: ${(props) => props.size || pixel(38)};
    border-radius: ${(props) => props.radius || (props.size ? ((parseInt(props.size) / 2) + "px") : "25px")};
    ${flexDisplay}
    border-width: 1px;
    border-color: ${(props) => Rgba(colors[props.close ? "red2" : props.borderColor || "clr2"], props.borderAlpha || 0.35)};
    background: ${(props) => colors[props.back || "back3"]};
    ${(props) => {
        let style = ``
        if (props.isDark !== undefined) style += `
            background: ${colors[props.isDark ? "clr3" : "back3"]}
        `
        if (props.backrgba !== undefined) style += `
            ${backrgba(colors[props.backrgba], props.backAlpha || 0.75)}
        `
        if (props.isRTL !== undefined) style += `
            ${props.isRTL ? `margin-left: ${pixel(8)};` : `margin-right: ${pixel(8)};`}
        `
        return style;
    }}
`
//////////////////////////////////////////////////
export const ButtonCirculer = styled.TouchableOpacity`
    ${cssCirculer}
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const ButtonNormal = styled.TouchableOpacity`
    ${cssCirculer}
    width: auto;
    height: auto;
    max-width: auto;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row"
})}
    padding: ${pixel(8)};
    ${(props) => props.css || null}
`;
export const ViewOuterCirculer = styled.View`
    ${cssCirculer}
    margin: 0px;
    ${(props) => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterUserSpeaker = styled.View`
    width: 95%;
    height: ${pixel(23)};
    border-radius: ${pixel(4)};
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    /* margin: 3px auto; */
`;