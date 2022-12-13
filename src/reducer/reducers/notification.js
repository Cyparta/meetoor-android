import Action from "../actions";
import {
    update,
    setNotifyNumber
} from '../helper'
////////////////////////////////////////
const initState = {
    notification: undefined,
    notifyNumber: 0,
    popup: [],
    roomAlerts: [],
};

const NotificationReducer = (state = initState, action) => {
    const newState = state;
    switch (action.type) {
        case Action.setNotifyNumber:
            return {
                ...newState,
                notifyNumber: setNotifyNumber(action.peyload.type, action.peyload.data, newState.notifyNumber)
            }
        case Action.setNotification:
            return {
                ...newState,
                notification: update(action.peyload.type, action.peyload.data, newState.notification)
            }
        case Action.setNotifiPopup:
            return {
                ...newState,
                popup: update(action.peyload.type, action.peyload.data, newState.popup)
            }
        case Action.setRoomAlerts:
            return {
                ...newState,
                roomAlerts: update(action.peyload.type, action.peyload.data, newState.roomAlerts)
            }
        default:
            return newState;
    }
}

export default NotificationReducer;