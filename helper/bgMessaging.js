import firebase from 'react-native-firebase';
//////////////////////////////////////////////
export default async (message) => {
    // handle your message
    const data = message.data;
    const channelId = data.channelId ? data.channelId : "other";
    console.log("🚀 ~ file: bgMessaging.js ~ line 7 ~ channelId", channelId)
    const notification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(data.title)
        .setBody(data.text)
        .setData({ target: data.targetData })
        .android.setBigText(data.text)
        .android.setAutoCancel(true)
        .android.setLargeIcon(data.image)
        .android.setChannelId(channelId)
        .android.setSmallIcon('ic_notification')
        .setSubtitle(data.subTitle)
        .android.setPriority(firebase.notifications.Android.Priority.Max)

    if (channelId === "chat" || channelId === "teamChat") {
        const action = new firebase.notifications.Android.Action('reply', 'ic_launcher', "add your reply ...");
        action.setShowUserInterface(false);
        const remoteInput = new firebase.notifications.Android.RemoteInput("input");
        remoteInput.setLabel('Reply');
        action.addRemoteInput(remoteInput);
        notification.android.setColor("#267b77").android.addAction(action);
    }

    await firebase.notifications().displayNotification(notification);
    return Promise.resolve();
}