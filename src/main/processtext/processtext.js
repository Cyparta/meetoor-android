import React, { memo, useEffect, useState } from 'react';
import anchorme from "anchorme";
import { useSelector } from 'react-redux';
import {
    CustomViewProcessBig,
    CustomViewProcess,
    CustomTextProcess,
    LinkOuterUrl,
    LinkInnerUrl
} from './processcss';
import {
    BlockSvg, MicSvg,
    ReplySvg, UploadSvg, LiveSvg
} from '../../icons/all';
import { AnyText } from '../../components/home/helperprefernce';
import { Linking } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../styles/basecss';
import { css } from 'styled-components';
///////////////////////////////////////////////////////////
let colorsNum = {
    1: "clr2",
    2: "blu",
    3: "red2",
    4: "gold"
}
///////////////////////////////////////////////////////////
const CustomHashTag = memo(({ color = "clr2", hash, size, nav = "" }) => {
    const { navigate } = useSelector(state => state.modal.navigation);
    return <AnyText onPress={() => navigate(nav, { hashtag: hash })}
        isRTL={false} size={size || moderateScale(13)} lower
        color={color}>{"#" + decodeURI(hash)}</AnyText>;
});
const CustomLinkNavigate = memo(({ href, nav = "",
    type = "username", color = "clr2", info = "", target }) => {
    const { navigate } = useSelector(state => state.modal.navigation);
    let name = href.split("/").pop().split("=").pop();
    return <AnyText onPress={() => navigate(nav, { [type]: target || name })}
        lower size={moderateScale(13)} color={color}
    > {info}{decodeURI(target || name)} </AnyText>;
});
const DeleteText = memo(({ ...props }) => {
    const { messages } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    return <CustomViewProcess isRTL={isRTL} ops {...props} >
        <BlockSvg size={moderateScale(13)} color="red2" /><CustomTextProcess color="red2">
            {messages.deletedMsg}
        </CustomTextProcess>
    </CustomViewProcess>;
});
const RecordText = memo(({ ...props }) => {
    const { messages } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    return <CustomViewProcess isRTL={isRTL} {...props} >
        <MicSvg size={moderateScale(13)} color="clr2" /><CustomTextProcess>{messages.recordMsg}</CustomTextProcess>
    </CustomViewProcess>;
});
const StoryReply = memo(({ ...props }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    return <CustomViewProcess isRTL={isRTL} {...props} >
        <ReplySvg size={moderateScale(13)} color="clr2" />
    </CustomViewProcess>;
});
const FileText = memo(({ ...props }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { messages } = useSelector(state => state.sign.langData);
    return <CustomViewProcess isRTL={isRTL} {...props} >
        <UploadSvg size={moderateScale(13)} color="clr2" lineH="20px" /><CustomTextProcess>{messages.fileMsg}</CustomTextProcess>
    </CustomViewProcess>;
});
const ForRoomId = memo(({ roomId }) => {
    const mainSocket = useSelector(state => state.main.socket);
    return (<LinkOuterUrl>
        <LinkInnerUrl onPress={() => {
            mainSocket.emit("joinAudioRoom", { roomId });
        }}>
            <LiveSvg size={moderateScale(16)} color="back3" />
            <AnyText lower target color="back3"> ID </AnyText>
            <ReplySvg size={moderateScale(13)} color="back3" />
            <AnyText lower target color="back3"> {roomId} </AnyText>
        </LinkInnerUrl>
    </LinkOuterUrl>)
});
///////////////////////////////////////////////////////////
export const ProcessTextWithoutLink = (text, dir, size = moderateScale(13), color = "back2") => {
    let match = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
    let isRTL = (text.match(match) !== null) ? true : false;
    if (!text) return "";
    return text
        .replace(/!(\S|_)+/gi, (target) => {
            return `_!_${target}_!_`
        })
        .replace(/\$(.*)\$/gi, (target) => {
            return `_!_${target}_!_`
        })
        .split("_!_").filter(f => f !== "")
        .map((target, i) => {
            let uniquId = Math.random().toString(36).substr(2, 9);
            let dolar = /\$(.*)\$/gi.exec(target);
            if (dolar?.[0]) {
                let render = <RecordText key={i + uniquId} />;
                if (dolar?.[1] === "delete") render = <DeleteText key={i + uniquId} />;
                else if (dolar?.[1] === "file") render = <FileText key={i + uniquId} />;
                else if (dolar?.[1] === "story") render = <StoryReply key={i + uniquId} />;
                return render;
            }
            ////////////////////////////////////////////
            let customColor = /!(\S|_)+/gi.exec(target);
            customColor = customColor?.[0];
            if (customColor) {
                let colorNum = customColor.split("_")?.[0];
                let text = customColor.replace(colorNum, "").replace(/_/gm, " ");
                colorNum = parseInt(colorNum.replace("!", "").replace(/[\u0660-\u0669]/g, d => d.charCodeAt() - 1632))
                return <AnyText lower numberOfLines={1}
                    ellipsizeMode="tail" width={"100%"} size={size}
                    key={i + uniquId} isRTL={isRTL} lineH={pixel(size + 2)}
                    align={dir ? "right" : "left"}
                    color={colorsNum[colorNum] ? colorsNum[colorNum] : color}>
                    {text}
                </AnyText>
            }
            return <AnyText lower numberOfLines={1}
                ellipsizeMode="tail" width={"100%"} size={size}
                key={i + uniquId} isRTL={isRTL} lineH={pixel(size + 2)}
                align={dir ? "right" : "left"} color={color}>
                {target}
            </AnyText>;
        });
}
////////////////////////////////////////////////
const ConvertToLink = memo(({ text, links, isRTL, ...props }) => {
    const [processText, setProcessText] = useState("")
    ////////////////////////////////////////////
    useEffect(() => {
        let newLinks = [];
        let getLinkData = {};
        for (let index = 0; index < links.length; index++) {
            const link = links[index];
            newLinks.push(link.string);
            text = text?.replace(link.string, "_!_" + link.string + "_!_");
        }
        text = text.split("_!_").filter(f => f !== "")
        text.forEach((target, i) => {
            let ind = newLinks.indexOf(target);
            let uniquId = Math.random().toString(36).substr(2, 9);
            if (ind >= 0) {
                getLinkData = links[ind];
                let href = "";
                if (getLinkData.string.startsWith("https://meetoor.com")) {
                    href = getLinkData.string.split("https://meetoor.com")[1];
                    switch (true) {
                        case href.includes("/team/"):
                            text[i] = <CustomLinkNavigate info="team ➡ " type="teamid"
                                href={href} key={i + uniquId} nav="team" />;
                            break;
                        case href.includes("/chat/"):
                            text[i] = <CustomLinkNavigate info="chat ➡ "
                                href={href} key={i + uniquId} nav="chat" />;
                            break;
                        case href.includes("/meetoor/"):
                            text[i] = <CustomLinkNavigate href={href} key={i + uniquId} nav="room" />;
                            break;
                        case href.includes("/story/"):
                            text[i] = <CustomLinkNavigate info="story ➡ "
                                href={href} key={i + uniquId} nav="story" />;
                            break;
                        case href.includes("/profile/"):
                            text[i] = <CustomLinkNavigate info="profile ➡ @"
                                href={href} nav="profile" key={i + uniquId} />;
                            break;
                        case href.includes("/home#postview"):
                            text[i] = <CustomLinkNavigate info="post ➡ "
                                type="postId" target={href.split("=").pop()}
                                href={href} nav="postviewasnew" key={i + uniquId} />;
                            break;
                        default:
                            text[i] = <AnyText key={i + uniquId}
                                onPress={() => Linking.openURL(href)}
                                size={props.size || moderateScale(13)} lower color="clr2">
                                {decodeURI(href)}
                            </AnyText>;
                            break;
                    }
                } else {
                    href = getLinkData.string;
                    let type = getLinkData.isEmail ? "mailto:" : "";
                    text[i] = <AnyText key={i + uniquId}
                        onPress={() => Linking.openURL(type + href)}
                        size={props.size || moderateScale(13)} lower color="clr2">
                        {decodeURI(href)}
                    </AnyText>;
                }
            }
            else {
                let hashs = [], ats = [], rooms = [];
                /////////////////////////////////////////////
                text[i] = text[i]
                    .replace(/!(\S|_)+/gi,
                        (target) => {
                            return `_!_${target}_!_`
                        })
                    .replace(/#(\S|_)+/gi,
                        (target) => {
                            hashs.push(target);
                            return `_!_${target}_!_`
                        })
                    .replace(/@(\S|_)+/gi,
                        (target) => {
                            ats.push(target);
                            return `_!_${target}_!_`
                        })
                    .replace(/\$-(\S)+/gi,
                        (target) => {
                            rooms.push(target);
                            return `_!_${target}_!_`
                        })
                    .replace(/\$(.*)\$/gi,
                        (target) => {
                            return `_!_${target}_!_`
                        })
                    .split("_!_").filter(f => f !== "")
                    .map(target => {
                        uniquId = Math.random().toString(36).substr(2, 9);
                        let hash = hashs.indexOf(target);
                        let at = ats.indexOf(target);
                        let id = rooms.indexOf(target);
                        ////////////////////////////////////////////
                        if (hash >= 0) return <CustomHashTag hash={target.split("#")[1]}
                            key={i + uniquId} size={props.size || moderateScale(13)} nav="trend" />;
                        if (at >= 0) return <CustomLinkNavigate info="@"
                            href={`profile/?p=${target.split("@")[1]}`}
                            key={i + uniquId} nav="profile" />;
                        if (id >= 0) return <ForRoomId key={i + uniquId} roomId={target.split("$-")[1]} />;
                        ////////////////////////////////////////////
                        let dolar = /\$(.*)\$/gi.exec(target);
                        if (dolar?.[0]) {
                            if (dolar?.[1] === "delete") return <DeleteText key={i + uniquId} />;
                            else if (dolar?.[1] === "file") return "";
                        }
                        ////////////////////////////////////////////
                        let customColor = /!(\S|_)+/gi.exec(target);
                        customColor = customColor?.[0];
                        if (customColor) {
                            let colorNum = customColor.split("_")?.[0];
                            let text = customColor.replace(colorNum, "").replace(/_/gm, " ");
                            colorNum = parseInt(colorNum.replace("!", "").replace(/[\u0660-\u0669]/g, d => d.charCodeAt() - 1632))
                            return <AnyText key={i + uniquId}
                                size={props.size || moderateScale(13)} lower
                                color={colorsNum[colorNum] ? colorsNum[colorNum] : "clr2"}>
                                {text}
                            </AnyText>
                        }
                        return target;
                    });
            }
        });
        setProcessText(text);
    }, [text]);
    //////////////////////////////////////////
    return <AnyText lower size={props.size || moderateScale(14)}
        color={props.textColor ? props.textColor : props.isDark ? "back2" : "clr1"}
        isRTL={isRTL} noFlex={true} lineH={props.line || pixel(21)}
        align={props.isPadding ? "center" : undefined}
        colorPosts={props.colorPosts ? props.colorPosts : false}
        css={css`${props.opacity ? "opacity: 0.5;" : null};`}
        colorStatus={props.colorStatus ? props.colorStatus : false}>
        {processText}
    </AnyText>
});
////////////////////////////////////////////////
const MainConverterText = memo(({ text, links, ...props }) => (text.split("\n").map((toProsess, i) => {
    if (toProsess === "") return null;
    let match = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
    let isRTL = (toProsess.match(match) !== null) ? true : false;
    return (<CustomViewProcessBig key={`big_${i}`} width={props.width}
        isRTL={isRTL} isPadding={props.isPadding} center={props.center}>
        <ConvertToLink text={toProsess} links={links} {...props} isRTL={isRTL} />
    </CustomViewProcessBig>)
})));
export const ProcessTextWithLink = (text, props) => {
    if (!text) return { text: {}, urls: {} };
    const links = anchorme.list(text);
    const link = links[0];
    let urls = link ? {
        isURL: (link.isURL && link.protocol) && true,
        string: link.string,
        host: link.host,
        path: link.path,
        query: link.query
    } : {};
    // const { emojiLength } = EmojiRegx(text);
    return {
        text: {
            content: <MainConverterText text={text} links={links} {...props} />,
            isEmoji: false,
            isText: text.length,
            isBig: text.length > 700
        }, urls
    };
}