import Action from "../actions";
import {
    updateObj,
    reobject,
    update
} from '../helper'
////////////////////////////////////////
const initState = {
    posts: {},
    postsLastId: {},
    chatTeam: {},
    chats: {},
    comments: {},
    commentsLastId: {},
    likes: {},
    likesLastId: {},
    replys: {},
    likesReply: {},
    otherPosts: {},
    otherComments: {},
    meetoorTips: undefined,
    trends: [],
    meetoorTips: undefined,
    storedPosts: undefined,
};

const PostReducer = (state = initState, action) => {
    const newState = state;
    let preparToSave;
    switch (action.type) {
        case Action.setStoredPosts:
            return {
                ...newState,
                storedPosts: action.peyload
            }

        case Action.setOtherPosts:
            return {
                ...newState,
                otherPosts: reobject(action.peyload.type, action.peyload.data, newState.otherPosts)
            }
        case Action.setMeetoorTips:
            return {
                ...newState,
                meetoorTips: update(action.peyload.type, action.peyload.data, newState.meetoorTips)
            }
        case Action.setTrends:
            return {
                ...newState,
                trends: action.peyload
            }

        case Action.setOtherComments:
            return {
                ...newState,
                otherComments: reobject(action.peyload.type, action.peyload.data, newState.otherComments)
            }
        case Action.setChatsTeam:
            preparToSave = updateObj(action.peyload.type, action.peyload.data, newState.chatTeam);
            // saveData("chatTeam", preparToSave);
            return {
                ...newState,
                chatTeam: preparToSave
            }
        case Action.setChats:
            preparToSave = updateObj(action.peyload.type, action.peyload.data, newState.chats);
            // saveData("chats", preparToSave);
            return {
                ...newState,
                chats: preparToSave
            }
        /////////////////////////////////////////////////
        case Action.setPosts:
            preparToSave = updateObj(action.peyload.type, action.peyload.data, newState.posts);
            return {
                ...newState,
                posts: preparToSave
            }
        case Action.setPostsLastId:
            return {
                ...newState,
                postsLastId: reobject("add", action.peyload, newState.postsLastId)
            }
        /////////////////////////////////////////////////
        case Action.setComments:
            return {
                ...newState,
                comments: updateObj(action.peyload.type, action.peyload.data, newState.comments)
            }
        case Action.setCommentsLastId:
            return {
                ...newState,
                commentsLastId: reobject("add", action.peyload, newState.commentsLastId)
            }
        /////////////////////////////////////////////////
        case Action.setLikes:
            return {
                ...newState,
                likes: updateObj(action.peyload.type, action.peyload.data, newState.likes),
            }
        case Action.setLikesLastId:
            return {
                ...newState,
                likesLastId: reobject("add", action.peyload, newState.likesLastId)
            }
        ////////////////////////////////////////////////
        case Action.setReplys:
            return {
                ...newState,
                replys: updateObj(action.peyload.type, action.peyload.data, newState.replys)
            }
        case Action.setLikesReply:
            return {
                ...newState,
                likesReply: updateObj(action.peyload.type, action.peyload.data, newState.likesReply)
            }

        default:
            return newState;
    }
}

export default PostReducer;