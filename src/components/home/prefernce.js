import React, {memo, useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import SwitchButton from '../../main/switchbutton/switch';
import {shareTo} from '../../reducer/helper';
import AsyncStorage from '@react-native-community/async-storage';
import Rate, {AndroidMarket} from 'react-native-rate';
import {downloadFile} from '../../main/downloadfile';
import {
  SettingsSvg,
  ActivityStatusSvg,
  DarkModeSvg,
  EditPenSvg,
  LanguageSvg,
  LogoutSvg,
  AskFriendSvg,
  AccountSwitchSvg,
  StarSvg,
  MoneySvg,
  DownloadSvg,
  RequestSvg,
} from '../../icons/all';
import Actions from '../../reducer/actions';
import {RenderUserPhoto} from './helperhome';
import {
  AnyText,
  CircleStatus,
  OuterNameStatus,
  OuterProfileUser,
  OuterUserName,
  OuterUserStatus,
  ScrollBar,
  OuterGlobalUser,
} from './helperprefernce';
import {logoutFCM} from '../../helperapp';
import {colors, pixel} from '../../styles/basecss';
import {moderateScale} from 'react-native-size-matters';
import {css} from 'styled-components';
// import RenderPrayer from './prayer';
////////////////////////////////////////////////
const RenderPrefrence = () => {
  const dispatch = useDispatch();
  const {navigate} = useSelector(state => state.modal.navigation);
  const windowSize = useSelector(state => state.sign.windowSize);
  const {buttons, tabsData, settings, messages} = useSelector(
    state => state.sign.langData,
  );
  const User = useSelector(state => state.main.user);
  const version = useSelector(state => state.main.version);
  const token = useSelector(state => state.sign.token);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const mainSocket = useSelector(state => state.main.socket);
  const [myStatus, setMyStatus] = useState(User.status);
  const [IsDarkSwich, setIsDarkSwich] = useState(isDark);
  const status = myStatus ? 'online' : 'offline';
  ////////////////////////////////////////////
  const GoToProfile = useCallback(
    () => navigate('profile', {username: User.username}),
    [User],
  );
  ////////////////////////////////////////////
  const LogOutMeetoor = async () => {
    await AsyncStorage.removeItem('@token');
    dispatch(
      Actions.type('setPosts', {
        type: 'reset',
        data: {},
      }),
    );
    dispatch(
      Actions.type('setComments', {
        type: 'reset',
        data: {},
      }),
    );
    dispatch(Actions.type('logout'));
    logoutFCM({token});
  };
  ////////////////////////////////////////////
  const InviteFriends = () => {
    shareTo(
      `${messages.invite.name} ${User.first_name}
        \n${messages.invite.msg1}\n${messages.invite.msg2}
        \n${messages.invite.msg3}
        \nhttps://play.google.com/store/apps/details?id=com.meetoor`,
      messages.copied,
      dispatch,
    );
  };
  ////////////////////////////////////////////
  useEffect(() => {
    setMyStatus(User.status);
  }, [User.status]);
  ////////////////////////////////////////////
  return (
    <ScrollBar back={colors[isDark ? 'clr1' : 'back1']}>
      {/* <RenderPrayer /> */}
      <OuterProfileUser isRTL={isRTL} activeOpacity={0.9} onPress={GoToProfile}>
        <RenderUserPhoto size={pixel(60)} />
        <OuterNameStatus width={windowSize.width} isRTL={isRTL}>
          <OuterUserName>
            <AnyText color={isDark ? 'back2' : 'clr1'} isRTL={isRTL}>
              {User.fullName}
            </AnyText>
            <OuterUserStatus isRTL={isRTL}>
              <CircleStatus color={status} />
              <AnyText color={isDark ? 'back2' : 'clr1'} isRTL={isRTL} small>
                {buttons[status]}
              </AnyText>
            </OuterUserStatus>
          </OuterUserName>
        </OuterNameStatus>
      </OuterProfileUser>
      <OuterGlobalUser isRTL={isRTL}>
        <SwitchButton
          value={myStatus}
          onChange={bool => {
            let status = bool ? 1 : 0;
            setMyStatus(bool);
            mainSocket.emit('updateStatus', {status});
            mainSocket.emit('myStatus', {status});
          }}
          fontSize={pixel(14)}
          text={buttons.myStatus}
          element={<ActivityStatusSvg />}
        />
      </OuterGlobalUser>
      <OuterGlobalUser isRTL={isRTL}>
        <SwitchButton
          value={IsDarkSwich}
          onChange={async (bool, string) => {
            setIsDarkSwich(bool);
            dispatch(Actions.type('setDarkMode', bool));
            await AsyncStorage.setItem('@mode', string);
          }}
          fontSize={pixel(14)}
          text={buttons.darkMode}
          element={<DarkModeSvg />}
        />
      </OuterGlobalUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() => navigate('editprofile')}>
        <EditPenSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.editProfile}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() =>
          dispatch(Actions.type('setCurrentModalOutside', {key: 'language'}))
        }>
        <LanguageSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {settings.changeLang}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() =>
          dispatch(
            Actions.type('setCurrentModalOutside', {
              key: 'accounts',
              reload: true,
            }),
          )
        }>
        <AccountSwitchSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.accSwitch}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() => navigate('settings')}>
        <SettingsSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {tabsData.settings}
        </AnyText>
      </OuterProfileUser>
      {User?.isGain ? (
        <OuterProfileUser
          activeOpacity={0.9}
          isRTL={isRTL}
          onPress={() => navigate('balance')}>
          <MoneySvg />
          <AnyText
            isRTL={isRTL}
            size={moderateScale(14)}
            color={isDark ? 'back2' : 'clr1'}
            autoMargin={pixel(14)}>
            {tabsData.balance}
          </AnyText>
        </OuterProfileUser>
      ) : null}
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() => navigate('money-prizes')}>
        <MoneySvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {tabsData.money}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={InviteFriends}>
        <AskFriendSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.inviteFriends}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() =>
          downloadFile('https://cdn.meetoor.com/media/media/Apps/meetoor.apk')
        }>
        <DownloadSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {messages.huawei}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() => {
          const options = {
            GooglePackageName: 'com.meetoor',
            AmazonPackageName: 'com.meetoor',
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: false,
            openAppStoreIfInAppFails: true,
            fallbackPlatformURL: 'https://meetoor.com/home',
          };
          Rate.rate(options);
        }}>
        <StarSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.rateUs}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={() => navigate('help-learn')}>
        <RequestSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.helpAndLearn}
        </AnyText>
      </OuterProfileUser>
      <OuterProfileUser
        activeOpacity={0.9}
        isRTL={isRTL}
        onPress={LogOutMeetoor}>
        <LogoutSvg />
        <AnyText
          isRTL={isRTL}
          size={moderateScale(14)}
          color={isDark ? 'back2' : 'clr1'}
          autoMargin={pixel(14)}>
          {buttons.logout}
        </AnyText>
      </OuterProfileUser>
      <AnyText
        isRTL={isRTL}
        size={moderateScale(13)}
        lower
        css={css`
          border-top-width: 1px;
          margin-top: ${pixel(12)};
          border-top-color: ${colors[isDark ? 'clr4' : 'back2']};
          padding-top: ${pixel(4)};
        `}
        color={isDark ? 'clr4' : 'back2'}
        width="100%"
        align="center"
        autoMargin={pixel(14)}>
        meetoor v{version}
      </AnyText>
    </ScrollBar>
  );
};

export default memo(RenderPrefrence);
