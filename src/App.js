/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect, useCallback, memo} from 'react';
import {LogBox, BackHandler} from 'react-native';
import {useDeviceOrientationChange} from 'react-native-orientation-locker';
import {Modalize} from 'react-native-modalize';
import NetInfo from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import FirebaseService from '../helper/FirebaseService';
import {RecordPermission} from '../helper/permissionsforandroid';
import {colors} from './styles/basecss';
import {setAccounts, signin} from './components/sign/signin';
import Actions from './reducer/actions';
import StatusBarControl from './statusbar';
import {ModalBody, ModalHeader, MainAppView, setWindowSize} from './helperapp';
import {
  NavigationContainer,
  useNavigationContainerRef,
  DefaultTheme,
} from '@react-navigation/native';
import {moderateScale} from 'react-native-size-matters';
import useInitialURL from './linking';
import useGoBack from './main/goback';
import {MinLogoSvg} from './icons/logo';
import axios from 'axios';
////////////////////////////////////////////////
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
//////////////////////////////////////////////////
let ChooseAvatarStateModal = null;
let AccountsMeetoor = null;
let Language = null;
let ChooseRollModal = null;
let SignRoot = null;
let HomeRoot = null;
//////////////////////////////////////////////////
const App = () => {
  ////////////////////////////////////////////////
  const dispatch = useDispatch();
  const handleBack = useGoBack();
  const url = useInitialURL();
  const loggedIn = useSelector(state => state.sign.loggedIn);
  const isReady = useSelector(state => state.sign.isReady);
  const isDark = useSelector(state => state.sign.isDark);
  const currentModalOutside = useSelector(
    state => state.modal.currentModalOutside,
  );
  ////////////////////////////////////////////////
  const [navigateFromNotification, setNavigateFromNotification] =
    useState(null);
  const NavigateRef = useNavigationContainerRef();
  ////////////////////////////////////////////////
  useEffect(() => {
    // dispatch(EntryMeetoor());
    axios.get('https://ipinfo.io/json').then(response => {
      dispatch(Actions.type('setUserLocation', response.data));
    });
    dispatch(setWindowSize());
    const unsubscribe = NetInfo.addEventListener(
      ({isConnected, isInternetReachable}) => {
        console.log(
          '🚀 ~ file: App.js ~ line 58 ~ useEffect ~ state',
          isConnected,
          isInternetReachable,
        );
        dispatch(
          Actions.type('setNetInfo', {
            isConnected: isInternetReachable && isConnected,
          }),
        );
        // if (!state.isInternetReachable || !state.isConnected) dispatch(Actions.type("setIsReady", true));
      },
    );
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   dispatch(Actions.type("setNetInfo", { isConnected: state.isInternetReachable && state.isConnected }));
    //   if (!state.isInternetReachable || !state.isConnected) dispatch(Actions.type("setIsReady", true));
    // });
    FirebaseService.checkPermission();
    FirebaseService.createNotificationListeners(setNavigateFromNotification);
    RecordPermission();
    //////////////////////////////////////////////
    return () => {
      unsubscribe();
    };
  }, []);
  ////////////////////////////////////////////////
  useEffect(() => {
    const onAndroidBackPress = () => {
      handleBack();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
  }, [handleBack]);
  ////////////////////////////////////////////////
  useDeviceOrientationChange(ori => {
    dispatch(setWindowSize(ori));
  });
  /////////////////////////////////////////
  const RenderModal = useCallback(() => {
    switch (currentModalOutside?.key) {
      case 'language':
        if (Language === null)
          Language = require('./components/language/lang').default;
        return <Language {...currentModalOutside} />;
      case 'accounts':
        if (AccountsMeetoor === null) {
          AccountsMeetoor = require('./components/sign/accounts').default;
        }
        return (
          <AccountsMeetoor
            signin={signin}
            setAccounts={setAccounts}
            {...currentModalOutside}
          />
        );
      case 'avatarstate':
        if (ChooseAvatarStateModal === null) {
          ChooseAvatarStateModal =
            require('./main/imguploader/avatarstate').default;
        }
        return <ChooseAvatarStateModal {...currentModalOutside} />;
      case 'chooseroll':
        if (ChooseRollModal === null) {
          ChooseRollModal = require('./main/chooseroll').default;
        }
        return <ChooseRollModal {...currentModalOutside} />;
      default:
        return null;
    }
  }, [currentModalOutside]);
  /////////////////////////////////////////
  const RenderMeetoor = useCallback(() => {
    switch (loggedIn) {
      case true:
        if (HomeRoot === null) {
          HomeRoot = require('./Home').default;
        }
        return <HomeRoot openApp={url} navigateTo={navigateFromNotification} />;

      default:
        if (SignRoot === null) {
          SignRoot = require('./SignRoot').default;
        }
        return <SignRoot openApp={url} />;
    }
  }, [loggedIn, navigateFromNotification, url]);
  /////////////////////////////////////////
  useEffect(() => {
    dispatch(Actions.type('setNavigateRef', NavigateRef));
  }, [NavigateRef]);
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      card: colors[isDark ? 'clr1' : 'back1'],
      background: colors[isDark ? 'clr1' : 'back1'],
    },
  };
  /////////////////////////////////////////
  return (
    <NavigationContainer ref={NavigateRef} theme={MyTheme}>
      <StatusBarControl />
      <RenderMeetoor />
      {!isReady ? (
        <MainAppView isDark={isDark}>
          <MinLogoSvg size={moderateScale(220)} />
        </MainAppView>
      ) : null}
      <Modalize
        ref={ref => {
          dispatch(Actions.type('setModalizeOutside', ref));
        }}
        snapPoint={270}
        modalStyle={{backgroundColor: colors['back3']}}
        handleStyle={{
          width: moderateScale(110),
          height: moderateScale(5),
          backgroundColor: colors['clr2'],
        }}
        onClose={() => dispatch(Actions.type('setCurrentModalOutside', null))}
        handlePosition="inside"
        avoidKeyboardLikeIOS={true}
        disableScrollIfPossible={false}
        adjustToContentHeight
        keyboardAvoidingBehavior="height"
        HeaderComponent={<ModalHeader />}>
        <ModalBody>
          <RenderModal />
        </ModalBody>
      </Modalize>
    </NavigationContainer>
  );
};

export default memo(App);
