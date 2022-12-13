import { ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';
import Axios from '../src/main/Axios';
import AsyncStorage from '@react-native-community/async-storage';
///////////////////////////////////////////
export default async (notificationOpen) => {
    if (notificationOpen && notificationOpen.notification) {
        const action = notificationOpen.action;
        const notificationId = notificationOpen.notification.notificationId;
        const { channelId } = notificationOpen.notification["android"];
        const { target } = notificationOpen.notification["data"];
        const message = notificationOpen.results.input;
        if (action === "reply") {
            const Token = await AsyncStorage.getItem("@token");
            try {
                let form = new FormData();
                form.append("type", channelId);
                form.append("message", message);
                form.append("target", target);
                ///////////////////////////////////////////
                await Axios.post("singleMessage/", form, {
                    headers: {
                        'Authorization': `Token ${Token}`
                    }
                });
                ToastAndroid.show("massage has been sent", ToastAndroid.SHORT);
            } catch (e) {
                ToastAndroid.show("Not sent", ToastAndroid.SHORT);
            }
        }
        firebase.notifications().removeDeliveredNotification(notificationId);
    }
}