import { ToastAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
////////////////////////////////////////////
export const downloadFile = (url) => {
    let date = new Date();
    let file_ext = /[.]/.exec(url) ? /[^.]+$/.exec(url) : undefined;
    file_ext = '.' + file_ext[0];
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let nameFile = Math.floor(date.getSeconds() / 2) + file_ext;
    let options = {
        fileCache: true,
        addAndroidDownloads: {
            path: `${RootDir}/meetoor_${nameFile}`,
            description: 'downloading file...',
            notification: true,
            useDownloadManager: true,
        },
    };

    ToastAndroid.show("Downloading file...!", ToastAndroid.SHORT);
    
    config(options).fetch('GET', url).then(res => {
        ToastAndroid.show("downloaded...", ToastAndroid.SHORT);
    });
};