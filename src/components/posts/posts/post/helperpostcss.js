import styled from 'styled-components';
import { colors, Rgba, flexDisplay, pixel } from '../../../../styles/basecss';
//////////////////////////////////////////////////
export const OuterMainPost = styled.View`
    width: 100%;
    height: auto;
    position: relative;
    margin-bottom: ${pixel(8)};
    padding: 0px ${pixel(4)};
    position: relative;
    /* border-radius: ${pixel(4)}; */
    ${() => flexDisplay({
    dir: "column",
    justify: "flex-start",
    align: "flex-start",
})}
    border-top-width: ${pixel(1)};
    border-bottom-width: ${pixel(1)};
    border-color: ${(props) => Rgba(colors["clr3"], props.isDark ? 0.85 : 0.1)};
    background: ${(props) => Rgba(colors[props.isDark ? "clr1" : "back1"], props.alpha || 1)};
    ${(props) => {
        let style = ``;
        if (props.isCloned) style += `
            margin-top: ${pixel(3)};
            margin-bottom: 0px;
            border-radius: ${pixel(4)};
            border-width: ${pixel(1)};
        `
        if (props.asView) style += `
            border-radius: 0px;
            margin: auto;
        `
        if (props.noMargin) style += `
            margin: auto;
        `
        return style;
    }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterPadgesPost = styled.View`
    position: absolute;
    width: 100%;
    bottom: ${pixel(-15)};
    margin: 0px auto;
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const InnerPadgesPost = styled.View`
    position: relative;
    width: auto;
    margin: 0px auto;
    border-radius: ${pixel(5)};
    background: ${colors["clr2"]};
    ${flexDisplay}
`;
//////////////////////////////////////////////////
export const OnePadgePost = styled.View`
    position: relative;
    width: auto;
    padding: ${pixel(3)};
`;
//////////////////////////////////////////////////
export const OuterPostTop = styled.View`
    width: 100%;
    height: auto;
    border-radius: ${pixel(5)};
    position: relative;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${(props) => {
        let style = ``;
        if (props.isDark !== undefined) style += `
            background: ${Rgba(colors[props.back ? props.back : props.isDark ? "clr1" : "back1"], props.alpha || 1)}
        `
        return style;
    }}
   ${props => props.css || null}
   z-index: 10;
`;
//////////////////////////////////////////////////
export const ReactSectionTop = styled.TouchableOpacity`
    width: 100%;
    height: auto;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "flex-start"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterSectionWithPress = styled.TouchableOpacity`
    width: 100%;
    height: auto;
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const ReactSectionBottom = styled.View`
    width: 100%;
    height: ${pixel(28)};
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "space-between"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterReactBotSection = styled.View`
    width: auto;
    height: auto;
    ${(props) => flexDisplay({
    dir: props.isRTL ? "row-reverse" : "row",
    justify: "space-between"
})}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterPostBodyContent = styled.View`
    width: 100%;
    height: auto;
    position: relative;
    ${() => flexDisplay({
    dir: "column",
})}
    margin-top: ${props => props.marTop || "0px"}
    ${props => props.css || null}
`;