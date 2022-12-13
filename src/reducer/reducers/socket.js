import Action from "../actions";
/////////////////////////////////////////////
const initState = {
    live: {},
    liveRoom: {},
    typingSocket: {}
};
/////////////////////////////////////////////
const SocketReduser = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        /////////////////////////////////////
        case Action.liveAll:
            return {
                ...newState,
                live: action.peyload
            }
        /////////////////////////////////////
        case Action.setTypingSocket:
            return {
                ...newState,
                typingSocket: action.peyload
            }
        /////////////////////////////////////
        case Action.setLiveRoom:
            return {
                ...newState,
                liveRoom: action.peyload
            }
        /////////////////////////////////////
        case Action.liveTeam:
            return {
                ...newState,
                liveTeam: action.peyload
            }
        /////////////////////////////////////
        case Action.setSocketTeam:
            return {
                ...newState,
                socket: action.peyload
            }
        default:
            return newState;
    }
}

export default SocketReduser;