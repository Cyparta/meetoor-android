import Action from "../actions";
import {
    reobject
} from '../helper'
////////////////////////////////////////
const initState = {
    profiles: {},
    settings: {},
    chatUsers: {},
};

const ProfileReducer = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        /////////////////////////////////////
        case Action.setProfiles:
            return {
                ...newState,
                profiles: reobject(action.peyload.type, action.peyload.data, newState.profiles)
            }
        /////////////////////////////////////
        case Action.setChatUsers:
            return {
                ...newState,
                chatUsers: reobject(action.peyload.type, action.peyload.data, newState.chatUsers)
            }
        /////////////////////////////////////
        case Action.setSettings:
            return {
                ...newState,
                settings: Object.assign({}, action.peyload)
            }
        default:
            return newState;
    }
}

export default ProfileReducer;