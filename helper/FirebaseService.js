import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";
/////////////////////////////////////////////
export default class FirebaseService {
    static checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            FirebaseService.getToken();
        } else {
            FirebaseService.requestPermission();
        }
    }

    static requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            FirebaseService.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    static getToken = async () => {
        // this.fcmToken = await firebase.messaging().getToken();

        this.fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!this.fcmToken) {
            this.fcmToken = await firebase.messaging().getToken();
            if (this.fcmToken) {
                await AsyncStorage.setItem('fcmToken', this.fcmToken);
            }
        }
        return this.fcmToken;
    }

    static CreateChannel = async ({ id, name, sound = "notification.mp3", descrip }) => {
        const channel = new firebase.notifications.Android
            .Channel(id, name, firebase.notifications.Android.Importance.Max)
            .setSound(sound)
            .setDescription(descrip);
        firebase.notifications().android.createChannel(channel);
    }

    static createNotificationListeners = async (setNavigate) => {
        const hrefs = (targetData, channel, image) => {
            targetData = typeof targetData === "string" && targetData?.startsWith("{") ? JSON.parse(targetData) : targetData;
            const hrefsData = {
                "chat": { nav: "chat", props: { username: targetData } },
                "teamChat": {
                    nav: "team-chat", props: {
                        teamName: targetData?.teamName,
                        teamid: targetData?.teamid, teamPhoto: image
                    }
                },
                "friends": { nav: "profile", props: { username: targetData } },
                "teams": { nav: "team", props: { teamid: targetData } },
                "likes": { nav: "postviewasnew", props: { postId: targetData?.postid } },
                "trends": { nav: "trend", props: { hashtag: targetData } },
                "posts": { nav: "postviewasnew", props: { postId: targetData?.postid } },
                "comments": { nav: "postviewasnew", props: { postId: targetData?.postid, gotoComment: targetData?.commentid } },
                "likesComment": { nav: "commentlikes", props: { commentid: targetData?.commentid } },
                "replys": { nav: "commentview", props: { commentid: targetData?.commentid } }
            }
            return hrefsData[channel];
        }
        FirebaseService.CreateChannel({
            id: "chat",
            name: "Friends messages",
            descrip: "Friends messages",
            sound: "message.mp3"
        });
        FirebaseService.CreateChannel({
            id: "teamChat",
            name: "Teams messages",
            descrip: "Teams messages",
            sound: "message.mp3"
        });
        FirebaseService.CreateChannel({
            id: "trends",
            name: "trends",
            descrip: "Most important trend"
        });
        FirebaseService.CreateChannel({
            id: "friends",
            name: "Friendship requests",
            descrip: "Friendship requests"
        });
        FirebaseService.CreateChannel({
            id: "teams",
            name: "Teams requests",
            descrip: "Teams requests"
        });
        FirebaseService.CreateChannel({
            id: "likes",
            name: "Likes on posts",
            descrip: "Likes from friends on posts"
        });
        FirebaseService.CreateChannel({
            id: "likesComment",
            name: "Like on comments",
            descrip: "Likes from friends on comments"
        });
        FirebaseService.CreateChannel({
            id: "posts",
            name: "posts",
            descrip: "posts from friends and others"
        });
        FirebaseService.CreateChannel({
            id: "comments",
            name: "comment on posts",
            descrip: "comment from friends on posts"
        });
        FirebaseService.CreateChannel({
            id: "replys",
            name: "reply on comments",
            descrip: "reply from friends on comments"
        });
        FirebaseService.CreateChannel({
            id: "other",
            name: "Other notices",
            descrip: "Other notices"
        });
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { _channelId } = notificationOpen.notification["_android"];
            const { _data } = notificationOpen.notification["_android"]["_notification"]
            const href = hrefs(_data.target, _channelId, _data.image);
            if (_channelId !== "other") {
                setNavigate(href);
                console.log("FirebaseService ~ hrefs ~ href", href)
            }
        }
        FirebaseService.messageListener = firebase.messaging().onMessage((message) => {
            console.log("message ==>", JSON.stringify(message));
        });
    }
}
