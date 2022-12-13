import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native";
//////////////////////////////////////////////////
const useMount = func => useEffect(() => func(), []);
//////////////////////////////////////////////////
const useInitialURL = () => {
    const [url, setUrl] = useState(null);
    const getNav = useCallback((url) => {
        const params = {};
        let username = '';
        switch (true) {
            case url.includes("/team/"):
                let teamid = url.split("?t=")[1];
                teamid = teamid.split("&")[0];
                setUrl({
                    nav: "team",
                    props: { teamid }
                });
                break;
            case url.includes("/story/"):
                username = url.split("?id=")[1];
                username = username.split("&")[0];
                setUrl({
                    nav: "story",
                    props: { username }
                });
                break;
            case url.includes("/profile/"):
                username = url.split("?p=")[1];
                username = username.split("&")[0];
                setUrl({
                    nav: "profile",
                    props: { username }
                });
                break;
            case url.includes("/reset_password/"):
                let token = url.split("?token=")[1];
                token = token.split("&")[0];
                setUrl({
                    nav: "reset_password",
                    props: { token }
                });
                break;
            case url.includes("/writeanonychat/"):
                username = url.split("?p=")[1];
                username = username.split("&")[0];
                setUrl({
                    nav: "writeanonychat",
                    props: { username }
                });
                break;
            case url.includes("#postview"):
                let postview = url.split("#postview")[1];
                postview = postview.split("&")[0];
                postview.split("_")
                    .filter(f => f !== "")
                    .forEach(param => {
                        param = param.split("=");
                        params[param[0]] = param[1];
                    });
                setUrl({
                    nav: "postviewasnew",
                    props: {
                        postId: params.id,
                        gotoComment: params.go
                    }
                });
                break;
            case url.includes("#commentview"):
                let commentview = url.split("#commentview")[1];
                commentview = commentview.split("&")[0];
                commentview.split("_")
                    .filter(f => f !== "")
                    .forEach(param => {
                        param = param.split("=");
                        params[param[0]] = param[1];
                    });
                setUrl({
                    nav: "commentview",
                    props: {
                        postId: params.id,
                        commentid: params.idComment,
                        replyid: params.go
                    }
                });
                break;
            case url.includes("/meetoor/"):
                let roomid = url.split("?id=")[1];
                roomid = roomid.split("&")[0];
                // setUrl({
                //     nav: "team",
                //     props: { roomid }
                // });
                break;
            default:
                break;
        }
    });
    useMount(() => {
        const getUrlAsync = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (!initialUrl) return;
                getNav(initialUrl);
            } catch (e) {
                console.log(e);
            }
        };
        getUrlAsync();
    });
    return url;
};

export default useInitialURL;