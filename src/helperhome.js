import Actions from './reducer/actions';
import Axios from './main/Axios';
import CameraRoll from '@react-native-community/cameraroll';
import { convertToTime } from './reducer/helper';
import AsyncStorage from '@react-native-community/async-storage';
import { loginFCM } from './helperapp';
//////////////////////////////////////////////////
export const getPhotosRoll = () => async (dispatch, getState) => {
    dispatch(Actions.type("setRollKeys", []));
    try {
        const AlbumsRoll = await CameraRoll.getAlbums()
        AlbumsRoll.map(async ({ count, title }) => {
            let photosRoll = await CameraRoll.getPhotos({
                first: count,
                groupName: title,
                assetType: "All",
                include: ["playableDuration", "filename", "fileSize"]
            });
            let data = photosRoll.edges ? photosRoll.edges?.length
                ? photosRoll.edges.map(({ node: {
                    image: { uri, playableDuration, filename, fileSize }
                } }) => {
                    let size = fileSize ? fileSize : 0;
                    let duration = playableDuration !== null ? convertToTime(playableDuration) : null;
                    return { uri, duration, filename, fileSize: size }
                }).filter(({ filename }) => filename.match(/\.tif/gi) ? false : true)
                : [] : [];
            dispatch(Actions.type("setCameraRoll",
                {
                    type: "set", data: {
                        key: title,
                        val: data
                    }
                }));
            let keysRoll = getState().sign.rollKeys;
            dispatch(Actions.type("setRollKeys", [...keysRoll, title]));
        });
    }
    catch (e) {
        console.log(e)
    }
};
//////////////////////////////////////////////////
export const getStoredPosts = (token) => async (dispatch, getState) => {
    try {
        if (token) {
            let posts = getState().posts.posts["mainPosts/"];
            if (posts) return;
            const oldPosts = await AsyncStorage.getItem(`@${token}_posts`);
            dispatch(Actions.type("setStoredPosts", JSON.parse(oldPosts)));
        }
    } catch (e) {
        console.log("Dashbord -> error.data", e)
    }
};
//////////////////////////////////////////////////
export const getSetting = (token) => async (dispatch) => {
    try {
        const response = await Axios.get(`preference/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        dispatch(Actions.type("setSettings", response.data));
    } catch (e) {
        console.log("Dashbord -> error.data", e)
    }
};
//////////////////////////////////////////////////
export const setDataFromSocket = (data, token) => async (dispatch, getState) => {
    let appVersion = getState().main.version;
    data.lang && dispatch(Actions.type("setMeetoorLang", data.lang));
    dispatch(Actions.type("setUser", {
        type: 'set',
        data: data
    }));
    dispatch(Actions.type("setServers", data.mtr));

    if (appVersion.toString() !== data.version.toString()) {
        dispatch(Actions.type("setCurrentModalWithNav", {
            key: "newupdate", info: data.appInfo
        }))
    }
    await AsyncStorage.setItem(`@${token}`, JSON.stringify({
        UserPhoto: data.UserPhoto,
        fullName: data.fullName
    }));
    loginFCM({ token });
    dispatch(getPhotosRoll());
}