import React, {memo, useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
///////////////////////////////////////////////////
import {css} from 'styled-components';
import {ChatSvg, SecureSvg, StarSvg} from '../../icons/all';
import Actions from '../../reducer/actions';
import {colors, pixel} from '../../styles/basecss';
import {OuterOneView} from '../home/helpernotification/heplernotifycss';
import {AnyText} from '../home/helperprefernce';
import OwenControlProfile from './rendercontrol/owencontrol';
import UserControlProfile from './rendercontrol/usercontrol';
import {ButtonPostCTR} from '../posts/createpost/helpercreatepostcss';
import {moderateScale} from 'react-native-size-matters';
import {ButtonNormal} from '../home/sliderroom/helperroomcss';
import {WaveIndicator} from 'react-native-indicators';
///////////////////////////////////////////////////
const RenderControlProfile = ({
  username,
  fullName,
  isFriend,
  isOwner,
  isSecure,
  UserPhoto,
  isMe,
  anonyChat,
  isVerified,
  verifyNum,
  followMe,
  followYou,
  bio,
  userid,
}) => {
  const dispatch = useDispatch();
  const socketLive = useSelector(state => state.socket.live);
  const mainSocket = useSelector(state => state.main.socket);
  const When = useSelector(state => state.main.when);
  const {placeholder, buttons} = useSelector(state => state.sign.langData);
  const {navigate} = useSelector(state => state.modal.navigation);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const User = useSelector(state => state.main.user);
  const name = isMe ? User.fullName : fullName;
  ////////////////////////////////////////
  const [Secure, setSecure] = useState(isSecure);
  const [VerifyNum, setVerifyNum] = useState(verifyNum);
  const [Verified, setVerified] = useState(isVerified);
  const [follow, setFollow] = useState({followMe, followYou});
  const [waitVerified, setWaitVerified] = useState(false);
  const [waitFollow, setWaitFollow] = useState(false);
  ////////////////////////////////////////
  const onConfirm = useCallback(() => {
    setWaitVerified(true);
    mainSocket.emit('onVerified', {username});
  }, []);
  ////////////////////////////////////////
  useEffect(() => {
    setSecure(isSecure);
    setVerified(isVerified);
    setVerifyNum(verifyNum);
    setFollow({followMe, followYou});
  }, [isSecure, isVerified, verifyNum, followMe, followYou]);
  ////////////////////////////////////////
  useEffect(() => {
    const {event, data, when} = socketLive;
    if (when >= When())
      switch (event) {
        case 'onVerified':
          setSecure(data.isSecure);
          setVerified(true);
          setVerifyNum(data.verifyNum);
          setWaitVerified(false);
          break;

        case 'onFollow':
          console.log('useEffect ~ data', data);
          setWaitFollow(false);
          if (data.another === User.username) {
            setFollow(back => {
              return {...back, followMe: data.type};
            });
          } else {
            setFollow(back => {
              return {...back, followYou: data.type};
            });
            dispatch(
              Actions.type('setProfiles', {
                type: 'update',
                data: {
                  key: username,
                  call: target => {
                    let followers = target.user.infos.followers;
                    if (data.type) ++followers;
                    else --followers;
                    target.user.infos.followers = followers;
                    console.log('target => follow', target.user.infos);
                  },
                },
              }),
            );
          }
          break;

        default:
          break;
      }
  }, [socketLive]);
  ////////////////////////////////////////
  return (
    <OuterOneView
      activeOpacity={1}
      isRTL={isRTL}
      back={isDark ? 'clr1' : 'back1'}
      css={css`
        justify-content: center;
        margin: 0;
        padding: 8px 0;
        margin-bottom: 4px;
        border-radius: 10px;
        flex-direction: column;
      `}>
      <OuterOneView
        isRTL={isRTL}
        activeOpacity={1}
        css={css`
          width: auto;
          padding: 0;
          margin: 0;
          margin-bottom: ${pixel(4)};
          justify-content: center;
        `}>
        {Secure ? (
          isOwner ? (
            <StarSvg color="gold" />
          ) : (
            <SecureSvg />
          )
        ) : isFriend ? (
          Verified ? null : (
            <ButtonPostCTR
              style={{minWidth: moderateScale(46)}}
              activeOpacity={0.8}
              back="clr2"
              onPress={onConfirm}>
              {waitVerified ? (
                <WaveIndicator
                  size={moderateScale(30)}
                  color={colors['back1']}
                />
              ) : (
                <AnyText
                  lower
                  color="back3"
                  size={moderateScale(13)}
                  lineH={pixel(16)}>
                  {buttons.confirm}
                </AnyText>
              )}
            </ButtonPostCTR>
          )
        ) : isMe ? (
          <AnyText
            lower
            color="back3"
            size={moderateScale(13)}
            lineH={pixel(16)}
            css={css`
              padding: ${pixel(1)} ${pixel(4)};
              border-radius: ${pixel(3)};
              background: ${colors['clr2']};
            `}>
            {VerifyNum}
          </AnyText>
        ) : null}
        <AnyText
          lower
          color={isDark ? 'back3' : 'clr3'}
          isRTL={isRTL}
          autoMargin={pixel(5)}>
          {name}
        </AnyText>
      </OuterOneView>
      <AnyText
        lower
        color="clr2"
        size={moderateScale(13)}
        lineH={pixel(16)}
        align="center"
        css={css`
          margin-bottom: ${pixel(4)};
        `}>
        {bio || placeholder.bio}
      </AnyText>
      {isMe ? (
        <OwenControlProfile />
      ) : (
        <UserControlProfile
          username={username}
          isFriend={isFriend}
          setFollow={setFollow}
          userid={userid}
          follow={follow}
          waitFollow={waitFollow}
          setWaitFollow={setWaitFollow}
        />
      )}
      {isMe ? null : anonyChat ? (
        <ButtonNormal
          isRTL={isRTL}
          radius={pixel(5)}
          activeOpacity={0.8}
          borderAlpha={0.2}
          css={css`
            margin: 0;
            margin-top: ${pixel(12)};
          `}
          back={isDark ? 'clr3' : 'back1'}
          borderColor="clr1"
          onPress={() => navigate('writeanonychat', {username})}>
          <ChatSvg size={moderateScale(18)} />
          <AnyText
            lower
            color={isDark ? 'back3' : 'clr3'}
            lineH={pixel(16)}
            size={moderateScale(13)}
            isRTL={isRTL}
            autoMargin={pixel(5)}>
            {buttons.sendNote}
          </AnyText>
        </ButtonNormal>
      ) : null}
      {follow.followMe ? (
        <AnyText
          css={css`
            margin-top: ${pixel(4)};
          `}
          lower
          color="clr2"
          size={moderateScale(13)}
          align="center">
          {buttons.follower}
        </AnyText>
      ) : null}
    </OuterOneView>
  );
};

export default memo(RenderControlProfile);
