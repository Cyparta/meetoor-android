import ReconnectingWebSocket from 'reconnecting-websocket';
import Actions from '../reducer/actions';
/////////////////////////////////////////////////////////////////////
class Socket {
    connect(token, callback = () => { }) {
        const ENDPOINT = "wss://meetoor.com/wss-meetoor/";
        this.socket = new ReconnectingWebSocket(ENDPOINT + token,
            {
                maxReconnectionDelay: 15 * 1000,
                minReconnectionDelay: 7 * 1000,
                connectionTimeout: 7 * 1000,
                maxRetries: 7,
            });
        callback(this);
    }
    emit(event, data, type = false) {
        if (type) {
            this.socket.send({ event, data });
        } else {
            this.socket.send(JSON.stringify({ event, data }));
        }
    }

    live(dispatch, eventDispatch, callback = () => { }, logout = () => { }) {
        this.socket.onmessage = (e) => {
            const response = JSON.parse(e.data);
            if (response.erorr) return logout();
            const data = response.data;
            const event = response.event;
            console.log("event", event, data?.username)
            const when = () => {
                let time = new Date();
                return parseInt(`${time.getHours()}${time.getMinutes()}${time.getSeconds() + 1}`);
            }
            switch (event) {
                case "connect":
                    callback(data);
                    console.log("connect", data.isPrayer)
                    this.emit("updateStatus", { status: data.status });
                    break;
                case "onTyping":
                case "onTypingTeam":
                    dispatch(Actions.type("setTypingSocket", { event, data, when: when() }));
                    break;
                default:
                    dispatch(Actions.type(eventDispatch, { event, data, when: when() }));
                    break;
            }
        };
    }
    error(callback = () => { }) {
        this.socket.onerror = (e) => {
            callback(e);
        }
    }
    disconnect(callback = () => { }) {
        callback(null);
        this.socket?.close();
    }
}
///////////////////////////
export default new Socket();