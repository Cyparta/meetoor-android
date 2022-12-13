import React, { memo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Socket from './socket/socket';
import Actions from './reducer/actions';
import RenderTabBarBottom from './components/home/tabsview';
import ImageBoxMeetoor from './main/imageboxview';
import { chatSound, notifySound } from './sounds/sound';
import RenderModalize from './rendermodalize';
import HomeNavigation from './homenavigation';
import { getStoredPosts, getSetting, setDataFromSocket } from './helperhome';
import AsyncStorage from '@react-native-community/async-storage';
import { PrivateCreatePost } from './components/posts/createpost/renderctrpost';
import BackgroundTimer from 'react-native-background-timer';
import Axios from './main/Axios';
//////////////////////////////////////////////////
let ReactionRender = null;
const Home = ({ navigateTo, openApp }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    ///////////////////////////////////////////////
    const socketLive = useSelector(state => state.socket.live);
    const mainSocket = useSelector(state => state.main.socket);
    const When = useSelector(state => state.main.when);
    const User = useSelector(state => state.main.user);
    const { errors, buttons, messages,
        callData, contactus, liveData
    } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isNewUser = useSelector(state => state.sign.isNewUser);
    const isOpenContact = useSelector(state => state.sign.isOpenContact);
    const lang = useSelector(state => state.sign.lang);
    const openReacts = useSelector(state => state.sign.openReacts);
    const { isConnected } = useSelector(state => state.sign.netInfo);
    const settings = useSelector(state => state.profile.settings);
    const Anonychats = useSelector(state => state.main.anonychats);
    const Messages = useSelector(state => state.main.messages);
    const Notification = useSelector(state => state.notify.notification);
    ///////////////////////////////////////////////
    // const [homeToTop, setToTop] = useState(0);
    // const goHomeToTop = useCallback(() => {
    //     setToTop(Math.floor(Math.random() * 1000) + 1);
    // }, []);
    ///////////////////////////////////////////////
    const getNotification = useCallback(async () => {
        try {
            const response = await Axios.get(`notification/?idLt=${0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                dispatch(Actions.type("setNotification", {
                    type: "set",
                    data: []
                }));
                return;
            }
            dispatch(Actions.type("setNotification", {
                type: "set",
                data: response.data
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    ////////////////////////////////////////////////////
    const getMessage = useCallback(async () => {
        try {
            const response = await Axios.get(`messages/?idLt=${0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                dispatch(Actions.type("setMessages", {
                    type: "set",
                    data: []
                }));
                return;
            }
            dispatch(Actions.type("setMessages", {
                type: "set",
                data: responseData
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    ///////////////////////////////////////////////
    const getAnonyChats = useCallback(async () => {
        try {
            const response = await Axios.get(`anonyChats/?idLt=${0}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData.length === 0 || responseData.noMore) {
                dispatch(Actions.type("setAnonyChats", {
                    type: "set",
                    data: []
                }));
                return;
            }
            dispatch(Actions.type("setAnonyChats", {
                type: "set",
                data: response.data
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [token]);
    ///////////////////////////////////////////////
    const Authorization = useCallback(() => {
        if (isConnected === null) {
            return;
        }
        if (isConnected === false) {
            ToastAndroid.show(errors.noInternet, ToastAndroid.LONG);
            Socket.disconnect();
            return;
        }
        Socket.disconnect();
        Socket.connect(`?token=${token}`, (socket) => {
            dispatch(Actions.type("setChats", {
                type: 'reset', data: {}
            }));
            dispatch(Actions.type("setSocket", socket));
            socket.live(dispatch, 'liveAll', async (data) => {
                if (!data.lang) {
                    socket.emit("onChangeLang", { lang: lang });
                    PrivateCreatePost({
                        secure: 1, mainSocket: socket, target: "mainPosts/", token, dispatch, background: 0,
                        postText: `${messages.welcomePost.first} ${data.first_name}${messages.welcomePost.last}`
                    });
                }
                dispatch(setDataFromSocket(data, token));
            });
            getNotification();
            getMessage();
            getAnonyChats();
        });
    }, [Socket, token, lang, isConnected]);
    ///////////////////////////////////////////////
    useEffect(() => {
        Authorization();
        console.log("reConnect", isConnected)
        if (isConnected === false) dispatch(getStoredPosts(token));
    }, [token, isConnected]);
    ////////////////////////////////////////////////
    useEffect(() => {
        const GetMsg = async () => {
            try {
                dispatch(Actions.type("setMessageNumber", {
                    type: 'set',
                    data: (Messages || []).filter(data => data.isNew).length
                }));
                if (Messages && Messages.length) {
                    await AsyncStorage.setItem(`@messages_${token}`, JSON.stringify(Messages.slice(0, 10)));
                }
            } catch (e) {
                console.log("Dashbord -> error.data", e)
            }
        }
        GetMsg();
    }, [Messages]);
    //////////////////////////////////////////////
    useEffect(() => {
        const GetNotify = async () => {
            try {
                dispatch(Actions.type("setNotifyNumber", {
                    type: 'set',
                    data: (Notification || []).filter(data => data.isNew).length
                }));
                if (Notification && Notification.length) {
                    await AsyncStorage.setItem(`@notifications_${token}`, JSON.stringify(Notification.slice(0, 10)));
                }
            } catch (e) {
                console.log("Dashbord -> error.data", e)
            }
        }
        GetNotify();
    }, [Notification]);
    //////////////////////////////////////////////
    useEffect(() => {
        try {
            dispatch(Actions.type("setAnonyNumber", {
                type: 'set',
                data: (Anonychats || []).filter(data => data.isNew).length
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Anonychats]);
    ///////////////////////////////////////////////
    useEffect(() => {
        dispatch(getSetting(token));
    }, [token]);
    const rebuilUser = useCallback((val, username) => {
        dispatch(Actions.type("setProfiles", {
            type: 'update',
            data: {
                key: username,
                call: (obj) => {
                    obj.payload.type = val
                }
            }
        }));
    }, []);
    ///////////////////////////////////////////////
    useEffect(() => {
        let chat = "", chatIdStr = "";
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "myStatus":
                dispatch(Actions.type("setUser", { type: 'update', data }));
                break;

            case "updateStatus":
                dispatch(Actions.type("setFriendsUser", {
                    type: 'update',
                    data: {
                        key: "userid",
                        target: data.userid,
                        call: (target) => {
                            if (target) {
                                target.status = data.status ? 1 : 0;
                            }
                        }
                    }
                }));
                break;

            case "onChangeLang":
                if (data === null) return;
                console.log("useEffect ~ lang", data)
                dispatch(Actions.type("setMeetoorLang", data));
                break;

            case "myBusyStatus":
                dispatch(Actions.type("setUser", { type: 'update', data }));
                break;

            case "sendNewPost":
                dispatch(Actions.type("setPosts", {
                    type: 'add',
                    data: data
                }));
                break;

            case "onRemovePost":
                dispatch(Actions.type("setPosts", {
                    type: 'deletesOne',
                    data: {
                        keysArray: ["mainPosts/", "timeLine/"],
                        target: data.postid,
                        key: "postId"
                    }
                }));
                break;
            case "onEditPost":
                dispatch(Actions.type("setPosts", {
                    type: 'updatesWithCall',
                    data: {
                        keysArray: ["mainPosts/", "timeLine/", `userPosts/?username=${data.posterUsername}&`],
                        target: data.postId,
                        key: "postId",
                        call: (target) => {
                            target.postText = data.postText
                            target.isEdit = true
                        }
                    }
                }));
                break;

            ///////////////////// new added /////////////////
            case "startCall":
                const { isBusy, yourBusy, notAvailable, userName, userPhoto, fullName } = data;
                // if (isMe) {
                if (yourBusy) {
                    dispatch(Actions.type("setPopupMini", {
                        html: <>
                            {callData.nocall}
                        </>,
                        closeName: buttons.cancel,
                        className: "error",
                        close: () => { }
                    }));
                    dispatch(Actions.type("setRunCall", false));
                    return;
                }

                if (notAvailable) {
                    dispatch(Actions.type("setPopupMini", {
                        html: <>{callData.notAvailable}</>,
                        className: "error",
                        close: () => { }
                    }));
                    dispatch(Actions.type("setRunCall", false));
                    return;
                }
                if (isBusy) {
                    dispatch(Actions.type("setPopupMini", {
                        html: <>{callData.busy}</>,
                        className: "error",
                        close: () => { }
                    }));
                    window.cancelCallWithoutEffect = true;
                    dispatch(Actions.type("setRunCall", false));
                    return;
                }

                dispatch(Actions.type("setRunCall", {
                    userName,
                    userPhoto,
                    fullName,
                    caller: false
                }));
                // }
                break;

            case "rejectCall":
                dispatch(Actions.type("setRunCall", false));
                break;

            case "answerInAnother":
                window.cancelCallWithoutEffect = true;
                dispatch(Actions.type("setRunCall", false));
                break;

            //////////////////////////////////////////////////
            case "onStorySeen":
                dispatch(Actions.type("setMyStory", { type: "update", data: { key: "views", val: data.views } }));
                break;

            case "newChatNum":
                dispatch(Actions.type("setMessages", {
                    type: 'updateAll',
                    data: {
                        call: (data) => {
                            return data.isNew = false;
                        }
                    }
                }));
                break;

            case 'onDeleteMessage':
                chatIdStr = `chat_user_${data.chatId}`;
                //////////////////////////////////////
                dispatch(Actions.type("setChats", {
                    type: 'check',
                    data: {
                        keyArray: chatIdStr,
                        target: data.msgid,
                        key: "msgid",
                        call: (target) => {
                            target.message = { text: "$delete$", file: null, call: null }
                        }
                    }
                }));
                if (data.isLast) {
                    dispatch(Actions.type("setMessages", {
                        type: 'update',
                        data: {
                            target: data.chatId,
                            key: "username",
                            call: (target) => {
                                target["message"] = "$delete$";
                            }
                        }
                    }));
                }
                break;

            case 'onChat':
                chat = data.chat;
                chatIdStr = `chat_user_${data.chatId}`;
                dispatch(Actions.type("setChats", {
                    type: 'check',
                    data: {
                        keyArray: chatIdStr,
                        key: "msgid",
                        target: data.virId,
                        call: (target, index, org) => {
                            if (target) {
                                target.date = chat.data;
                                target.msgid = chat.msgid;
                                target.stillSend = false;
                                target.message = chat.message;
                            } else {
                                org.push(chat)
                            }
                        }
                    }
                }));
                ////////////////////////////////////////
                dispatch(Actions.type("setMessages", {
                    type: 'replace_up',
                    data: {
                        target: data.latest.username,
                        key: "username",
                        replace: data.latest
                    }
                }));
                if (chat.username !== User.username) {
                    settings.message && chatSound();
                }
                ////////////////////////////////////////
                break;

            case 'onAnonyChat':
                if (data.isMe) {
                    ToastAndroid.show(data.error ? liveData.room.errorUser : contactus.msg2, ToastAndroid.LONG);
                } else dispatch(Actions.type("setAnonyChats", {
                    type: 'add',
                    data: data
                }));
                ////////////////////////////////////////
                break;
            case 'onAnonyReplay':
                if (data.isMe) {
                    ToastAndroid.show(data.error ? liveData.room.errorUser : contactus.msg2, ToastAndroid.LONG);
                } else dispatch(Actions.type("setMyAnonyChats", {
                    type: 'update',
                    data: {
                        target: data.msgid,
                        key: "msgid",
                        call: (target) => {
                            target.reply = data;
                        }
                    }
                }));
                ////////////////////////////////////////
                break;

            case "anonyChatNum":
                dispatch(Actions.type("setAnonyChats", {
                    type: 'updateAll',
                    data: {
                        call: (data) => {
                            console.log("useEffect ~ data", data)
                            if (data) data.isNew = false;
                        }
                    }
                }));
                break;

            case 'onChatSeen':
                dispatch(Actions.type("setMessages", {
                    type: 'update',
                    data: {
                        key: "username",
                        target: data.username,
                        call: (target) => {
                            if (!target) return;
                            target.isSeen = true;
                            target.whenSeen = data.whenSeen;
                        }
                    }
                }));
                chatIdStr = `chat_user_${data.username}`;
                dispatch(Actions.type("setChats", {
                    type: 'getLast',
                    data: {
                        keyArray: chatIdStr,
                        call: (target) => {
                            if (target) {
                                console.log("useEffect ~ target", target)
                                target.seen = {
                                    isSeen: true,
                                    date: data.whenSeen
                                }
                            }
                        }
                    }
                }));
                break;

            case 'updateMessage':
                dispatch(Actions.type("setMessages", {
                    type: 'update',
                    data: {
                        target: data.msgId,
                        key: "msgId",
                        call: (target) => {
                            target.isRead = true;
                            target.isNew = false;
                        }
                    }
                }));
                break;

            case 'onChatTeamSeen':
                dispatch(Actions.type("setMessages", {
                    type: 'update',
                    data: {
                        key: "fullname",
                        target: data.teamname,
                        call: (target) => {
                            target.isSeen = true;
                        }
                    }
                }));
                break;
            ////////////////////////////////////////
            case 'onChatTeam':
                chat = data.chat;
                chatIdStr = `chat_team_${data.chatId}`
                dispatch(Actions.type("setChatsTeam", {
                    type: 'check',
                    data: {
                        keyArray: chatIdStr,
                        key: "msgid",
                        target: data.virId,
                        call: (target, index, org) => {
                            if (target) {
                                target.date = chat.data;
                                target.msgid = chat.msgid;
                                target.stillSend = false;
                                target.message = chat.message;
                            } else {
                                org.push(chat)
                            }
                        }
                    }
                }));
                ////////////////////////////////////////
                dispatch(Actions.type("setMessages", {
                    type: 'replace_up',
                    data: {
                        target: data.latest.username,
                        key: "username",
                        replace: data.latest
                    }
                }));
                settings.message && chatSound();
                ////////////////////////////////////////
                break;
            ////////////////////////////////////////////
            case "removeFriend":
            case "replayFriendRemove":
                dispatch(Actions.type("setChatUsers", {
                    type: "delete",
                    data: {
                        key: data.username
                    }
                }));
                dispatch(Actions.type("setFriendsUser", {
                    type: 'delete',
                    data: {
                        target: data.userid,
                        key: 'userid',
                    }
                }));
                if (data.userid === User.userid) rebuilUser("anony", data.username);
                break;
            ///////////////////////////////////////
            case "newNotifyNum":
                dispatch(Actions.type("setNotification", {
                    type: 'updateAll',
                    data: {
                        call: (data) => {
                            return data.isNew = false;
                        }
                    }
                }));
                break;
            case "removeTeam":
            case "friendRequest":
            case "replayAskFriend":
            case "replayAskTeam":
            case "onStartTeamLive":
            case "onNewPost":
            case "onStartScheduledRoom":
            case "onMention":
                let notification = data.notification ? data.notification : data;
                if (notification.notifyId) {
                    dispatch(Actions.type("setNotification", { type: 'add', data: notification }));
                    settings.notification && notifySound();
                }
                if (event === "onNewPost") {
                    if (data.post.posterUsername !== User.username) {
                        dispatch(Actions.type("setPosts", {
                            type: 'add',
                            data: {
                                keyArray: `userPosts/?username=${data.post.posterUsername}&`,
                                val: data.post
                            }
                        }));
                    }
                }
                if (event === "friendRequest") {
                    rebuilUser("accept", data.username);
                }
                if (event === "replayAskFriend") {
                    if (data.friend) {
                        if (data.friend.userid === User.userid) rebuilUser("friend", data.username);
                    }
                }
                break;

            case "teamRequest":
                if (data.delNotify) {
                    dispatch(Actions.type("setNotification", {
                        type: 'delete',
                        data: {
                            target: data.delNotify,
                            key: "notifyId"
                        }
                    }));
                } else {
                    dispatch(Actions.type("setNotification", { type: 'add', data: data }));
                    settings.notification && notifySound();
                }
                break;

            case "handleAskFriend":
            case "handleAskTeam":
                console.log("useEffect ~ notification", data)
                dispatch(Actions.type("setNotification", {
                    type: 'delete',
                    data: {
                        target: data.notification.notifyId,
                        key: "notifyId"
                    }
                }));
                if (event === "handleAskFriend") {
                    if (data.friend) {
                        if (data.friend.userid === User.userid) rebuilUser("friend", data.username);
                    } else {
                        if (data.userid === User.userid) rebuilUser("anony", data.username);
                    }
                }
                break;

            case "onComment":
            case "onLike":
            case "onLikeComment":
            case "onReply":
                if (data.more.delNotify) {
                    dispatch(Actions.type("setNotification", {
                        type: 'delete', data: {
                            target: data.more.delNotify,
                            key: "notifyId"
                        }
                    }));
                }
                if (data.notification) {
                    dispatch(Actions.type("setNotification", { type: 'add', data: data.notification }));
                    settings.notification && notifySound();
                }
                if (event === "onComment") {
                    let postidStr = `post_id-${+data.more.postid}`;
                    const comment = data.comment;
                    dispatch(Actions.type("setComments", {
                        type: 'check',
                        data: {
                            keyArray: postidStr,
                            key: "commentid",
                            target: comment.virId,
                            call: (target, index, org) => {
                                if (target) {
                                    target.commentid = comment.commentid;
                                    target.commentFile = comment.commentFile;
                                    target.commentText = comment.commentText;
                                    target.date = comment.date;
                                    target.numLikes = comment.numLikes;
                                    target.numReplays = comment.numReplays;
                                    target.stillSend = false;
                                } else {
                                    org.push(comment)
                                }
                            }
                        }
                    }));

                    dispatch(Actions.type("setPosts", {
                        type: 'updatesWithCall',
                        data: {
                            keysArray: [
                                "mainPosts/", "timeLine/",
                                `pin_${data.more.posterUsername}`,
                                `userPosts/?username=${data.more.postUsername}&`
                            ],
                            target: +data.more.postid,
                            key: "postId",
                            call: (target) => {
                                target.comments = data.more.numComments;
                            }
                        }
                    }));
                }
                if (event === "onLikeComment") {
                    const more = data.more;
                    let postidStr = `post_id-${+more.postid}`;
                    console.log("useEffect ~ data", data)
                    dispatch(Actions.type("setComments", {
                        type: 'updateWithCall',
                        data: {
                            keyArray: postidStr,
                            key: "commentid",
                            target: more.commentid,
                            call: (target) => {
                                if (more.isliked !== null) {
                                    target.isliked = more.isliked;
                                }
                                target.numLikes = more.numLikes;
                            }
                        }
                    }));
                }
                if (event === "onReply") {
                    let commentStr = `comment_id-${+data.more.commentid}`;
                    const reply = data.reply;
                    dispatch(Actions.type("setReplys", {
                        type: 'check',
                        data: {
                            keyArray: commentStr,
                            key: "replayid",
                            target: reply.virId,
                            call: (target, index, org) => {
                                if (target) {
                                    target.replayid = reply.replayid;
                                    target.replayFile = reply.replayFile;
                                    target.replayText = reply.replayText;
                                    target.date = reply.date;
                                    target.stillSend = false;
                                } else {
                                    org.push(reply)
                                }
                            }
                        }
                    }));

                    dispatch(Actions.type("setComments", {
                        type: 'updateWithCall',
                        data: {
                            keyArray: `post_id-${data.more.postid}`,
                            target: +data.more.commentid,
                            key: "commentid",
                            call: (target) => {
                                target.numReplays = data.more.numReplays;
                            }
                        }
                    }));
                }
                if (event === "onLike") {
                    dispatch(Actions.type("setPosts", {
                        type: 'updatesWithCall',
                        data: {
                            keysArray: [
                                "mainPosts/", "timeLine/", "videos/",
                                `pin_${data.more.posterUsername}`,
                                `userPosts/?username=${data.more.posterUsername}&`
                            ],
                            target: data.more.postid,
                            key: "postId",
                            call: (target) => {
                                console.log("data.more", data.more)
                                if (data.more.isliked !== null) {
                                    target.isliked = data.more.isliked;
                                    target.likeType = data.more.likeType;
                                }

                                target.comments = data.more.numComments;
                                target.likes = data.more.numLikes;
                                target.clones = data.more.clones;
                            }
                        }
                    }));

                    dispatch(Actions.type("setOtherPosts", {
                        type: 'update',
                        data: {
                            key: data.more.postid,
                            call: (target) => {
                                if (data.more.isliked !== null) {
                                    target.isliked = data.more.isliked;
                                }

                                target.comments = data.more.numComments;
                                target.likes = data.more.numLikes;
                                target.clones = data.more.clones;
                            }
                        }
                    }));
                }
                break;

            case "onStoryLike":
                if (data.delNotify) {
                    dispatch(Actions.type("setNotification", {
                        type: 'delete', data: {
                            target: data?.delNotify,
                            key: "notifyId"
                        }
                    }));
                }
                if (data.notification) {
                    dispatch(Actions.type("setNotification", { type: 'add', data: data.notification }));
                    settings.notification && notifySound();
                    dispatch(Actions.type("setCurrentSeener", {
                        type: 'check',
                        data: {
                            key: "username",
                            target: data.username,
                            call: (target, index, org) => {
                                if (target) {
                                    target.likeType = data.likeType;
                                    target.isLiked = data.isLiked;
                                } else {
                                    let storyData = {
                                        likeType: data.likeType,
                                        isLiked: data.isLiked,
                                        // num: data.num,
                                        // seenid:data.seenid,
                                        fullName: data.notification.fullName,
                                        UserPhoto: data.notification.UserPhoto
                                    }
                                    org.push(storyData)
                                }
                            }
                        }
                    }));
                } else {
                    dispatch(Actions.type("setCurrentSeener", {
                        type: 'update',
                        data: {
                            key: "username",
                            target: data.username,
                            call: (target) => {
                                if (target) {
                                    target.likeType = "";
                                    target.isLiked = false;
                                }
                            }
                        }
                    }));
                    dispatch(Actions.type("setCurrentStories", {
                        type: 'update',
                        data: {
                            key: "storyId",
                            target: data.storyid,
                            call: (target) => {
                                if (target) {
                                    target.likeType = data.likeType;
                                    target.isLiked = data.isLiked;
                                }
                            }
                        }
                    }));
                }
                break;

            case "onFollow":
                if (data.another === User.username) {
                    if (data.notification) {
                        dispatch(Actions.type("setNotification", { type: 'add', data: data.notification }));
                        settings.notification && notifySound();
                    }
                }
                break;

            case "replayFriendRequest":
                rebuilUser("sent", data.username);
                break;

            case "cancelFriendRequest":
                rebuilUser("anony", data.username);
                break;

            default:
                break;
        }
    }, [socketLive]);
    ///////////////////////////////////////////////
    useEffect(() => {
        const intervalId = BackgroundTimer.setInterval(() => {
            mainSocket.emit("beat", { beat: 30000 });
            console.log("runBackgroundTimer ~ seconds")
        }, 30000);
        return () => BackgroundTimer.clearInterval(intervalId);
    }, [mainSocket]);
    ///////////////////////////////////////////////
    useEffect(() => {
        if (isNewUser) {
            navigation.navigate("friendssuggest", {
                apiType: isOpenContact ? "myContacts/" : "suggestFollow/"
            });
        }
    }, []);
    /////////////////////////////////////////
    useEffect(() => {
        if (navigateTo) {
            navigation.navigate(navigateTo.nav, navigateTo.props);
        }
    }, [navigateTo]);
    /////////////////////////////////////////
    useEffect(() => {
        if (openApp) {
            navigation.navigate(openApp.nav, openApp.props);
        }
    }, [openApp]);
    ///////////////////////////////////////////////
    const InitReactionRender = useCallback(() => {
        if (!openReacts.type) return null;
        if (ReactionRender === null) {
            ReactionRender = require('./icons/reaction').default;
        }
        return (<ReactionRender onLike={openReacts.onLike}
            closeReaction={() => {
                dispatch(Actions.type("setOpenReacts", {
                    type: false,
                    onLike: null
                }));
            }}
            active={openReacts.active} position={`${openReacts.position}px`} />)
    }, [openReacts]);
    ///////////////////////////////////////////////
    return (<>
        <HomeNavigation />
        <RenderTabBarBottom />
        <RenderModalize />
        <ImageBoxMeetoor />
        <InitReactionRender />
    </>);
}

export default memo(Home);