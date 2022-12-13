import Action from '../actions';
import AsyncStorage from '@react-native-community/async-storage';
////////////////////////////////////////
import {getDataForLang, reobject, updateObj} from '../helper';
////////////////////////////////////////
const AsyncMeetoorLang = async lang => {
  await AsyncStorage.setItem('@lang', lang);
};
const langs = {
  AR: {
    name: 'العربية',
    key: 'AR',
  },
  EN: {
    name: 'English',
    key: 'EN',
  },
  // TR: {
  //     name: "Türkçe",
  //     key: "TR"
  // },
  // CH: {
  //     name: "中文",
  //     key: "CH"
  // },
  // FR: {
  //     name: "française",
  //     key: "FR"
  // }
};
////////////////////////////////////////
const initState = {
  cameraRoll: {},
  rollKeys: [],
  accounts: [],
  token: null,
  loggedIn: false,
  isDark: false,
  langs,
  lang: 'AR',
  langData: getDataForLang('AR'),
  isRTL: true,
  isApp: true,
  renderHome: true,
  goURL: false,
  CtrUpdateStories: true,
  currentTabView: 1,
  windowSize: {width: 400, height: 800},
  postState: 1,
  backgroundPost: 0,
  backgroundStatus: 14,
  netInfo: {isConnected: null},
  openReacts: {type: false},
  statusBarDark: false,
  avatarState: 0,
  usersLastId: {},
  isReady: false,
  isNewUser: false,
  isOpenContact: false,
  swiper: null,
  suggestionPress: null,
  goToTop: null,
  userLocation: null,
  prayerData: {},
};

const SignReducer = (state = initState, action) => {
  const newState = state;
  switch (action.type) {
    /////////////////////////////////////
    case Action.setMeetoorLang:
      AsyncMeetoorLang(action.peyload || 'AR');
      return {
        ...newState,
        lang: action.peyload,
        langData: getDataForLang(action.peyload),
        isRTL: action.peyload === 'AR',
      };
    /////////////////////////////////////
    case Action.setUserLocation:
      return {
        ...newState,
        userLocation: action.peyload,
      };
    /////////////////////////////////////
    case Action.setPrayerData:
      return {
        ...newState,
        prayerData: action.peyload,
      };
    /////////////////////////////////////
    case Action.setSwiper:
      return {
        ...newState,
        swiper: action.peyload,
      };
    /////////////////////////////////////
    case Action.setGoToTop:
      return {
        ...newState,
        goToTop: action.peyload,
      };
    /////////////////////////////////////
    case Action.setOpenReacts:
      return {
        ...newState,
        openReacts: action.peyload,
      };
    /////////////////////////////////////
    case Action.setIsReady:
      return {
        ...newState,
        isReady: action.peyload,
      };
    /////////////////////////////////////
    case Action.setStatusBarDark:
      return {
        ...newState,
        statusBarDark: action.peyload,
      };
    /////////////////////////////////////
    case Action.onSuggestionPress:
      console.log('SignReducer ~ action.peyload', action.peyload);
      return {
        ...newState,
        suggestionPress: action.peyload,
      };
    /////////////////////////////////////
    case Action.setRollKeys:
      return {
        ...newState,
        rollKeys: action.peyload,
      };
    case Action.setCameraRoll:
      return {
        ...newState,
        cameraRoll: updateObj(
          action.peyload.type,
          action.peyload.data,
          newState.cameraRoll,
        ),
      };
    /////////////////////////////////////
    case Action.setNetInfo:
      return {
        ...newState,
        netInfo: action.peyload,
      };
    /////////////////////////////////////
    case Action.setBackgroundPost:
      return {
        ...newState,
        backgroundPost: action.peyload,
      };
    /////////////////////////////////////
    case Action.setBackgroundStatus:
      return {
        ...newState,
        backgroundStatus: action.peyload,
      };
    /////////////////////////////////////
    case Action.setWindowSize:
      return {
        ...newState,
        windowSize: action.peyload,
      };
    /////////////////////////////////////
    case Action.setPostState:
      return {
        ...newState,
        postState: action.peyload,
      };
    /////////////////////////////////////
    case Action.setAvatarState:
      return {
        ...newState,
        avatarState: action.peyload,
      };
    /////////////////////////////////////
    case Action.setCtrUpdateStories:
      return {
        ...newState,
        CtrUpdateStories: action.peyload,
      };
    /////////////////////////////////////
    case Action.setRenderHome:
      return {
        ...newState,
        renderHome: action.peyload,
      };
    /////////////////////////////////////
    case Action.setDarkMode:
      return {
        ...newState,
        isDark: action.peyload,
      };
    /////////////////////////////////////
    case Action.setIsApp:
      return {
        ...newState,
        isApp: action.peyload,
      };
    /////////////////////////////////////
    case Action.setGoURL:
      return {
        ...newState,
        goURL: action.peyload,
      };
    case Action.setUsersLastId:
      return {
        ...newState,
        usersLastId: reobject('add', action.peyload, newState.usersLastId),
      };
    /////////////////////////////////////
    case Action.setAccounts:
      return {
        ...newState,
        accounts: action.peyload,
      };
    /////////////////////////////////////
    case Action.delAccounts:
      return {
        ...newState,
        accounts: action.peyload,
      };
    case Action.logout:
      return {
        ...newState,
        loggedIn: false,
        token: undefined,
      };
    case Action.signup:
      return {
        ...newState,
        loggedIn: true,
        token: action.peyload.token,
        isNewUser: true,
        isOpenContact: action.peyload.isAcceptContact,
      };
    case Action.login:
      return {
        ...newState,
        loggedIn: true,
        token: action.peyload,
      };
    case Action.setLoggedIn:
      return {
        ...newState,
        loggedIn: action.peyload,
      };
    case Action.setCurrentTabView:
      return {
        ...newState,
        currentTabView: action.peyload,
      };
    case Action.setFirstLoad:
      let {lang, isDark} = action.peyload;
      return {
        ...newState,
        lang,
        langData: getDataForLang(lang),
        isRTL: lang === 'AR',
        isDark,
      };
    ///////////////////////////////////////
    default:
      return newState;
  }
};

export default SignReducer;
