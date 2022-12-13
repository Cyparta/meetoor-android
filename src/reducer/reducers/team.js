import Action from "../actions";
import {
    reobject, update, updateObj,
} from '../helper'
////////////////////////////////////////
const initState = {
    teams: {},
    teamsMember: {},
    teamsUser: undefined,
    teamsJoin: undefined,
    requestTeams: undefined,
    suggestTeams: undefined,
    receivedTeams: undefined,
};

const TeamReducer = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        /////////////////////////////////////
        case Action.setTeams:
            return {
                ...newState,
                teams: reobject(action.peyload.type, action.peyload.data, newState.teams)
            }
        case Action.setTeamsMember:
            return {
                ...newState,
                teamsMember: updateObj(action.peyload.type, action.peyload.data, newState.teamsMember)
            }
        case Action.setTeamsUser:
            return {
                ...newState,
                teamsUser: update(action.peyload.type, action.peyload.data, newState.teamsUser)
            }
        case Action.setTeamsJoin:
            return {
                ...newState,
                teamsJoin: update(action.peyload.type, action.peyload.data, newState.teamsJoin)
            }
        /////////////////////////////////////
        case Action.setReceivedTeams:
            return {
                ...newState,
                receivedTeams: update(action.peyload.type, action.peyload.data, newState.receivedTeams)
            }
        /////////////////////////////////////
        case Action.setRequestTeams:
            return {
                ...newState,
                requestTeams: update(action.peyload.type, action.peyload.data, newState.requestTeams)
            }
        ////////////////////////////////////
        case Action.setSuggestTeams:
            return {
                ...newState,
                suggestTeams: update(action.peyload.type, action.peyload.data, newState.suggestTeams)
            }
        default:
            return newState;
    }
}

export default TeamReducer;