import Action from "../actions";
import Time from '../../main/createtime';
import {
    update,
    createServer,
    setNotifyNumber,
    setTitle,
    setUser
} from '../helper';
import StickersData from "../../main/stickersdata";
//npx browserslist@latest --update-db
//rm -rf node_modules && npm install && rm -rf /tmp/metro-* && npm run start --reset-cache
/////////////////////////////////////////
const genrateRandom = Math.random().toString(36).substr(2, 9);
export const userInit = {
    Address: "",
    JoinedDate: "",
    isApp: false,
    Phone: "",
    UserPhoto: "https://cdn.meetoor.com/media/media/UsersPhoto/Meetoor_rxvnthrnnomuaxowwaoa.jpeg",
    email: "meetoor@gmail.com",
    first_name: "anony",
    last_name: "user",
    fullName: `meetoor_user_${genrateRandom}`,
    userid: `id_${genrateRandom}`,
    username: `user_${genrateRandom}`,
    status: false,
}
const version = "3.9.5";
////////////////////////////////////////
const initState = {
    store: {
        popup: {}
    },
    lives: [],
    title: "Meetoor",
    time: Time,
    scrollsPosition: {},
    chatsRoom: [],
    when: () => {
        let time = new Date();
        return parseInt(`${time.getHours()}${time.getMinutes()}${time.getSeconds()}`);
    },
    suggestFriends: undefined,
    requestFriends: undefined,
    scheduledRooms: undefined,
    receivedFriends: undefined,
    myShareScreen: null,
    socket: { emit: () => { } },
    toggleLeft: false,
    anonychats: [],
    myAnonychats: [],
    anonyChatNumber: 0,
    messages: undefined,
    chatUsers: undefined,
    messageNumber: 0,
    currentRooms: undefined,
    version,
    info: {
        href: "devi",
        name: "Dev Ahmad Hassan",
        head: "meetoor developer",
        ver: `version: ${version}`
    },
    runCall: false,
    resCall: false,
    rtcBusy: false,
    apiUrl: "https://meetoor.com",
    cdnUrl: "https://cdn.meetoor.com",
    GoToTop: 27,
    user: userInit,
    friendsUser: undefined,
    inviteUsers: undefined,
    stickers: StickersData,
    renderLeft: true,
    popupControls: false,
    toggelMemberRoom: false,
    toggelWinRoom: false,
    popupFloatWindow: false,
    popupFloatWindowTeam: false,
    itemTeamHumber: false,
    toggleSearch: false,
    itemMainHumber: false,
    popupUserWindow: false,
    popupChatWindow: false,
    popupNotifyWindow: false,
    popupMainWindow: false,
    popupImageWindow: { open: false },
    miniPopup: false,
    openMoreWin: false,
    replyWin: false,
    suggestFollowers: undefined,
    followings: undefined,
    followers: undefined,
    myStory: undefined,
    currentSeener: undefined,
    windowStatus: false,
    currentStories: [],
    audioRoom: null,
    servers: createServer('name:run'),
    bansUser: undefined,
    /////////////////////////////
    // currentStoryId: 0,
};
////////////////////////////////////////
const MainReducer = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        /////////////////////////////////////
        case Action.setScrollsPosition:
            return {
                ...newState,
                scrollsPosition: { ...newState.scrollsPosition, [action.peyload.key]: action.peyload.value }
            }
        /////////////////////////////////////
        case Action.setAudioRoom:
            return {
                ...newState,
                audioRoom: action.peyload
            }
        // /////////////////////////////////////
        // case Action.setCurrentStoryId:
        //     return {
        //         ...newState,
        //         currentStoryId: action.peyload
        //     }
        /////////////////////////////////////
        case Action.setStickers:
            return {
                ...newState,
                stickers: action.peyload
            }
        /////////////////////////////////////
        case Action.setGoToTop:
            return {
                ...newState,
                GoToTop: action.peyload
            }
        /////////////////////////////////////
        case Action.rtcBusy:
            return {
                ...newState,
                rtcBusy: action.peyload
            }
        /////////////////////////////////////
        case Action.setServers:
            return {
                ...newState,
                servers: createServer(action.peyload)
            }
        /////////////////////////////////////
        case Action.setRunCall:
            return {
                ...newState,
                runCall: action.peyload
                // rtc: action.peyload.rtc || newState.rtc
            }
        /////////////////////////////////////
        case Action.setResCall:
            return {
                ...newState,
                resCall: action.peyload.run || false,
                rtc: action.peyload.rtc || newState.rtc
            }
        /////////////////////////////////////
        case Action.setChatsRoom:
            return {
                ...newState,
                chatsRoom: update(action.peyload.type, action.peyload.data, newState.chatsRoom)//[...newState.chatsRoom, action.peyload]
            }
        /////////////////////////////////////
        case Action.setMyShareScreen:
            return {
                ...newState,
                myShareScreen: action.peyload
            }
        /////////////////////////////////////
        case Action.setRenderLeft:
            return {
                ...newState,
                renderLeft: action.peyload
            }
        /////////////////////////////////////
        case Action.setWindowStatus:
            return {
                ...newState,
                windowStatus: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupControls:
            return {
                ...newState,
                popupControls: action.peyload
            }
        /////////////////////////////////////
        case Action.setToggelMemberRoom:
            return {
                ...newState,
                toggelMemberRoom: action.peyload
            }
        /////////////////////////////////////
        case Action.setToggelWinRoom:
            return {
                ...newState,
                toggelWinRoom: action.peyload
            }
        /////////////////////////////////////
        case Action.setOpenMoreWin:
            return {
                ...newState,
                openMoreWin: action.peyload
            }
        /////////////////////////////////////
        case Action.setReplyWin:
            return {
                ...newState,
                replyWin: action.peyload
            }
        /////////////////////////////////////
        case Action.setToggleSearch:
            return {
                ...newState,
                toggleSearch: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupFloatWindow:
            return {
                ...newState,
                popupFloatWindow: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupFloatWindowTeam:
            return {
                ...newState,
                popupFloatWindowTeam: action.peyload
            }
        /////////////////////////////////////
        case Action.setItemTeamHumber:
            return {
                ...newState,
                itemTeamHumber: action.peyload
            }
        /////////////////////////////////////
        case Action.setItemMainHumber:
            return {
                ...newState,
                itemMainHumber: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupChatWindow:
            return {
                ...newState,
                popupChatWindow: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupUserWindow:
            return {
                ...newState,
                popupUserWindow: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupNotifyWindow:
            return {
                ...newState,
                popupNotifyWindow: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupImage:
            return {
                ...newState,
                popupImageWindow: action.peyload
            }
        /////////////////////////////////////
        case Action.setPopupMain:
            return {
                ...newState,
                popupMainWindow: action.peyload
            }
        case Action.setPopupMini:
            return {
                ...newState,
                miniPopup: action.peyload
            }
        case Action.toggleWinFriends:
            return {
                ...newState,
                toggleLeft: action.peyload
            }
        case Action.setSuggestLoad:
            return {
                ...newState,
                suggestLoad: action.peyload
            }
        case Action.setLives:
            return {
                ...newState,
                lives: action.peyload
            }
        case Action.setSocket:
            return {
                ...newState,
                socket: action.peyload
            }
        case Action.setTitle:
            return {
                ...newState,
                title: setTitle(action.peyload.type, action.peyload.data, newState.title)
            }
        ////////////////////////////////////
        case Action.setMessageNumber:
            return {
                ...newState,
                messageNumber: setNotifyNumber(action.peyload.type, action.peyload.data, newState.messageNumber)
            }
        case Action.setMessages:
            return {
                ...newState,
                messages: update(action.peyload.type, action.peyload.data, newState.messages)
            }
        case Action.setAnonyChats:
            return {
                ...newState,
                anonychats: update(action.peyload.type, action.peyload.data, newState.anonychats)
            }
        case Action.setMyAnonychats:
            return {
                ...newState,
                myAnonychats: update(action.peyload.type, action.peyload.data, newState.myAnonychats)
            }
        ////////////////////////////////////
        case Action.setAnonyNumber:
            return {
                ...newState,
                anonyChatNumber: setNotifyNumber(action.peyload.type, action.peyload.data, newState.anonyChatNumber)
            }
        case Action.setChatUsers:
            return {
                ...newState,
                chatUsers: update(action.peyload.type, action.peyload.data, newState.chatUsers)
            }
        case Action.setCurrentRooms:
            return {
                ...newState,
                currentRooms: update(action.peyload.type, action.peyload.data, newState.currentRooms)
            }
        case Action.setScheduledRooms:
            return {
                ...newState,
                scheduledRooms: update(action.peyload.type, action.peyload.data, newState.scheduledRooms)
            }
        /////////////////////////////////////
        case Action.setReceivedFriends:
            return {
                ...newState,
                receivedFriends: update(action.peyload.type, action.peyload.data, newState.receivedFriends)
            }
        /////////////////////////////////////
        case Action.setRequestFriends:
            return {
                ...newState,
                requestFriends: update(action.peyload.type, action.peyload.data, newState.requestFriends)
            }
        ////////////////////////////////////
        case Action.setMyStory:
            return {
                ...newState,
                myStory: setUser(action.peyload.type, action.peyload.data, newState.myStory)
            }
        case Action.setCurrentStories:
            return {
                ...newState,
                currentStories: update(action.peyload.type, action.peyload.data, newState.currentStories)
            }
        case Action.setCurrentSeener:
            return {
                ...newState,
                currentSeener: update(action.peyload.type, action.peyload.data, newState.currentSeener)
            }
        case Action.setSuggestFriends:
            return {
                ...newState,
                suggestFriends: update(action.peyload.type, action.peyload.data, newState.suggestFriends)
            }

        case Action.setFollowers:
            return {
                ...newState,
                followers: update(action.peyload.type, action.peyload.data, newState.followers)
            }
        case Action.setFollowing:
            return {
                ...newState,
                followings: update(action.peyload.type, action.peyload.data, newState.followings)
            }
        case Action.setSuggestFollowers:
            return {
                ...newState,
                suggestFollowers: update(action.peyload.type, action.peyload.data, newState.suggestFollowers)
            }
        case Action.setFriendsUser:
            return {
                ...newState,
                friendsUser: update(action.peyload.type, action.peyload.data, newState.friendsUser)
            }
        case Action.setInviteUsers:
            return {
                ...newState,
                inviteUsers: update(action.peyload.type, action.peyload.data, newState.inviteUsers)
            }
        case Action.setUser:
            return {
                ...newState,
                user: setUser(action.peyload.type, action.peyload.data, newState.user)
            }
        case Action.setBansUser:
            return {
                ...newState,
                bansUser: update(action.peyload.type, action.peyload.data, newState.bansUser)
            }
        default:
            return newState;
    }
}

export default MainReducer;