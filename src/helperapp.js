import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';
import styled from 'styled-components';
import FirebaseService from '../helper/FirebaseService';
import Axios from './main/Axios';
import Actions from './reducer/actions';
import { backrgba, colors, flexDisplay, pixel } from './styles/basecss';
/////////////////////////////////////////////////
export const MainAppView = styled.View`
    width: 100%;
    height: 100%;
    ${flexDisplay};
    position: absolute;
    top: 0;left: 0;
    background: ${(props) => colors[props.isDark ? "clr1" : "back1"]};
    z-index: 1000;
    ${(props) => props.back ? backrgba(colors["clr1"], 0.25) : null}
`;
//////////////////////////////////////////////////
export const ModalHeader = styled.View`
    width: 100%;
    height: ${pixel(21)};
    ${flexDisplay};
    ${() => backrgba(colors["clr2"], 0.1)}
`;
//////////////////////////////////////////////////
export const ModalBody = styled.View`
    width: 100%;
    height: 100%;
    ${flexDisplay};
    padding: ${pixel(6)};
`;
//////////////////////////////////////////////////
export const EntryMeetoor = async (dispatch) => {
    try {
        const lang = await AsyncStorage.getItem("@lang");
        const mode = await AsyncStorage.getItem("@mode");
        dispatch(Actions.type("setFirstLoad", {
            lang: lang ? lang : "AR",
            isDark: (mode === "true") ? true : false,
        }));
        /////////////////////////////////////////////////
        const token = await AsyncStorage.getItem("@token");
        token && dispatch(Actions.type("login", token));
        if (token) {
            const oldInfo = await AsyncStorage.getItem(`@${token}`);
            dispatch(Actions.type("setUser", {
                type: 'updateGroup',
                data: JSON.parse(oldInfo)
            }));
        }
        dispatch(Actions.type("setIsReady", true));
    }
    catch (e) {
        console.error("R => " + e)
    }
};
////////////////////////////////////////////////
export const setWindowSize = () => {
    const { width, height } = Dimensions.get('window');
    return (dispatch) => dispatch(Actions.type("setWindowSize", {
        width: parseInt(width),
        height: parseInt(height)
    }));
};
////////////////////////////////////////////////
export const loginFCM = async ({ token }) => {
    let fcmToken = FirebaseService.fcmToken;
    try {
        let form = new FormData();
        form.append("registration_id", fcmToken);
        form.append("type", "android");
        await Axios.post("loginFCM/", form, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
    } catch (e) {
        console.log("loginFCM ~ e", e)
    }
}
////////////////////////////////////////////////
export const logoutFCM = async ({ token }) => {
    let fcmToken = FirebaseService.fcmToken;
    try {
        let form = new FormData();
        form.append("registration_id", fcmToken);
        form.append("type", "android");
        await Axios.post("logoutFCM/", form, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
    } catch (e) {
        console.log("logoutFCM ~ e", e)
    }
}