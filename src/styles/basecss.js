import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////
export const colors = {
    back1: "#ffffff",
    back2: "#c5c8d4",
    back3: "#f2f2f2",
    clr1: "#010409",
    clr2: "#267b77",
    clr3: "#161b22",
    clr4: "#40454a",
    blu: "#86bcff",
    red2: "#D7443E",
    yel: "#ffd900",
    online: "#00eb62",
    offline: "#e64c3c",
    gold: "#e1a63a",
    trans: "transparent"
}
// clr3: "#09141c",222831
// clr1: #040F16
export const backgroundDrk = (color) => `
    background: ${colors[color]} url(../img/mat.png) repeat !important;
`;
// moderateScale(px)
export const pixel = (px, unit = "px") => `${moderateScale(px)}${unit}`;

export const flexDisplay = ({
    dir = "row",
    align = "center",
    justify = "center",
    content = "center"
}) => `
    display: flex;
    justify-content: ${justify};
    align-content: ${content};
    align-items: ${align};
    flex-direction: ${dir};
`;

export const font = ({ size = "32px", line = "25px", wit = "600", isAr = true, align }) => `
    font-size: ${size};
    font-weight: ${wit};
    font-style: normal;
    font-family: fontReg;
    font-family: marai;
    line-height: ${line};
    text-align: ${align ? align : isAr ? "right" : "left"};
`;

export const fontLit = ({ size = "32px", line = "25px", isAr = true, align }) => `
    font-size: ${size};
    font-weight: 400;
    font-style: normal;
    font-family: fontLit;
    font-family: marai;
    line-height: ${line};
    text-align: ${align ? align : isAr ? "right" : "left"};
`;

export const backrgba = (hex, alpha = 1) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return `background: rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

export const Rgba = (hex, alpha = 1) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

export const ChangeColor = (col, amt) => {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

export const GetColorToBacks = (colorBacks) => {
    switch (colorBacks) {
        case 1:
        case 6:
        case 7:
        case 8:
            return '#1d1d1b';
        case 2:
        case 4:
        case 9:
            return '#fffdf1';
        case 3:
        case 10:
        case 15:
            return '#fdeff0';
        case 5:
            return '#9a4c31';
        case 11:
            return '#ca545e';
        case 14:
            return '#FF5039';
        default:
            return colors["clr2"];
    }
}

export const GetColorToStatus = (colorStatus) => {
    switch (colorStatus) {
        case 1:
            return '#003c18';
        case 2:
        case 4:
        case 6:
        case 16:
        case 19:
            return '#f2f2f2';
        case 3:
        case 12:
        case 17:
            return '#040f16';
        case 5:
            return '#8104c1';
        case 7:
            return '#267b77';
        case 8:
            return '#01657d';
        case 9:
        case 18:
            return '#216ba5';
        case 10:
        case 14:
            return '#00b3ff';
        case 11:
            return '#f1c8c6';
        case 13:
            return '#5a0088';
        case 15:
            return '#202429';
        default:
            return colors["clr2"];
    }
}