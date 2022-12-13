import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {DotIndicator} from 'react-native-indicators';
import {useSelector, useDispatch} from 'react-redux';
///////////////////////////////////////////////////
import {css} from 'styled-components';
import {
  AskFriendSvg,
  ChatSvg,
  CloseSvg,
  FollowersSvg,
  JoinedSvg,
  MoreSvg,
  PhoneSvg,
} from '../../../icons/all';
import Actions from '../../../reducer/actions';
import {colors, pixel} from '../../../styles/basecss';
import {OuterOneView} from '../../home/helpernotification/heplernotifycss';
import {AnyText} from '../../home/helperprefernce';
import {ButtonNormal} from '../../home/sliderroom/helperroomcss';
import useGoBack from '../../../main/goback';
import {moderateScale} from 'react-native-size-matters';
import {OuterAnyView} from '../../home/helperhome';
////////////////////////////////////////////
const BuildButton = memo(({username, userid, payload, setLoad, loader}) => {
  const {buttons} = useSelector(state => state.sign.langData);
  const mainSocket = useSelector(state => state.main.socket);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const [render, setRender] = useState(
    <ButtonNormal
      isRTL={isRTL}
      radius={pixel(5)}
      activeOpacity={0.8}
      borderAlpha={0.2}
      back={isDark ? 'clr3' : 'back1'}
      borderColor="clr1"
      css={css`
        height: ${pixel(36)};
        min-width: ${pixel(60)};
      `}>
      <DotIndicator size={moderateScale(3)} count={7} color={colors['clr2']} />
    </ButtonNormal>,
  );
  /////////////////////////////////////////
  useMemo(() => {
    switch (payload?.type) {
      case 'friend':
        setRender(null);
        break;
      case 'accept':
        setRender(
          <ButtonNormal
            isRTL={isRTL}
            radius={pixel(5)}
            activeOpacity={0.8}
            borderAlpha={0.2}
            back={isDark ? 'clr3' : 'back1'}
            css={css`
              height: ${pixel(36)};
            `}
            borderColor="clr1"
            onPress={() => {
              setLoad(true);
              mainSocket.emit('handleAskFriend', {
                action: 1,
                userid,
              });
            }}>
            {loader ? (
              <OuterAnyView
                css={css`
                  min-width: ${pixel(65)};
                  max-width: ${pixel(65)};
                `}>
                <DotIndicator
                  size={moderateScale(3)}
                  count={5}
                  color={colors['clr2']}
                />
              </OuterAnyView>
            ) : (
              <>
                <JoinedSvg size={moderateScale(18)} />
                <AnyText
                  lower
                  color={isDark ? 'back3' : 'clr3'}
                  lineH={pixel(16)}
                  size={moderateScale(13)}
                  isRTL={isRTL}
                  autoMargin={pixel(5)}>
                  {buttons.accept}
                </AnyText>
              </>
            )}
          </ButtonNormal>,
        );
        break;
      case 'sent':
        setRender(
          <ButtonNormal
            isRTL={isRTL}
            radius={pixel(5)}
            activeOpacity={0.8}
            borderAlpha={0.2}
            back={isDark ? 'clr3' : 'back1'}
            css={css`
              height: ${pixel(36)};
            `}
            borderColor="clr1"
            onPress={() => {
              setLoad(true);
              mainSocket.emit('friendRequest', {
                username,
              });
            }}>
            {loader ? (
              <OuterAnyView
                css={css`
                  min-width: ${pixel(65)};
                  max-width: ${pixel(65)};
                `}>
                <DotIndicator
                  size={moderateScale(3)}
                  count={5}
                  color={colors['clr2']}
                />
              </OuterAnyView>
            ) : (
              <>
                <CloseSvg size={moderateScale(14)} />
                <AnyText
                  lower
                  color="red2"
                  isRTL={isRTL}
                  lineH={pixel(16)}
                  size={moderateScale(13)}
                  autoMargin={pixel(5)}>
                  {buttons.cancel}
                </AnyText>
              </>
            )}
          </ButtonNormal>,
        );
        break;
      case 'anony':
        setRender(
          <ButtonNormal
            isRTL={isRTL}
            radius={pixel(5)}
            activeOpacity={0.8}
            borderAlpha={0.2}
            css={css`
              height: ${pixel(36)};
            `}
            back={isDark ? 'clr3' : 'back1'}
            borderColor="clr1"
            onPress={() => {
              setLoad(true);
              mainSocket.emit('friendRequest', {
                username,
              });
            }}>
            {loader ? (
              <OuterAnyView
                css={css`
                  min-width: ${pixel(65)};
                  max-width: ${pixel(65)};
                `}>
                <DotIndicator
                  size={moderateScale(3)}
                  count={5}
                  color={colors['clr2']}
                />
              </OuterAnyView>
            ) : (
              <>
                <AskFriendSvg size={moderateScale(18)} />
                <AnyText
                  lower
                  color={isDark ? 'back3' : 'clr3'}
                  isRTL={isRTL}
                  lineH={pixel(16)}
                  size={moderateScale(13)}
                  autoMargin={pixel(5)}>
                  {buttons.add}
                </AnyText>
              </>
            )}
          </ButtonNormal>,
        );
        break;
      default:
        break;
    }
  }, [payload?.type, loader, username, userid]);
  return render;
});
////////////////////////////////////////////
const UserControlProfile = ({
  username,
  isFriend,
  userid,
  follow,
  setFollow,
  waitFollow,
  setWaitFollow,
}) => {
  const dispatch = useDispatch();
  const {navigate} = useSelector(state => state.modal.navigation);
  const {buttons} = useSelector(state => state.sign.langData);
  const socketLive = useSelector(state => state.socket.live);
  const mainSocket = useSelector(state => state.main.socket);
  const When = useSelector(state => state.main.when);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const profiles = useSelector(state => state.profile.profiles);
  const handleBack = useGoBack();
  const profile = profiles[username] ? profiles[username] : {};
  const payload = profile.payload;
  const user = profile.user;
  /////////////////////////////////////////
  const [loader, setLoad] = useState(false);
  ////////////////////////////////////////
  const onFollow = useCallback(() => {
    setWaitFollow(true);
    mainSocket.emit('onFollow', {username});
  }, [username]);
  /////////////////////////////////////////
  const rebuilUser = useCallback(
    val => {
      setFollow(back => {
        return {...back, followYou: val === 'friend'};
      });
      dispatch(
        Actions.type('setProfiles', {
          type: 'update',
          data: {
            key: username,
            call: obj => {
              obj.payload.type = val;
              setLoad(false);
            },
          },
        }),
      );
    },
    [username],
  );
  ///////////////////////////////////////
  const openProfileMore = useCallback(() => {
    dispatch(
      Actions.type('setCurrentModalWithNav', {
        key: 'profilemore',
        username,
        isFriend,
      }),
    );
  }, [username, isFriend]);
  /////////////////////////////////////////
  useEffect(() => {
    const {event, data, when} = socketLive;
    if (when >= When())
      switch (event) {
        case 'friendRequest':
          if (data.userid === user.userid) rebuilUser('accept');
          break;

        case 'onBlockUser':
          if (data.type) {
            handleBack();
            if (data.another === user.username) {
              dispatch(
                Actions.type('setAnonyUsers', {
                  type: 'update',
                  data: {
                    key: data.another,
                    call: user => {
                      user.isFriend = false;
                    },
                  },
                }),
              );
            }
          }
          break;

        case 'replayFriendRequest':
          if (data.userid === user.userid) rebuilUser('sent');
          break;

        case 'cancelFriendRequest':
          if (data.userid === user.userid) rebuilUser('anony');
          break;

        case 'handleAskFriend':
          if (data.friend) {
            if (data.friend.userid === user.userid) rebuilUser('friend');
          } else {
            if (data.userid === user.userid) rebuilUser('anony');
          }
          break;

        case 'replayAskFriend':
          if (data.friend) {
            if (data.friend.userid === user.userid) rebuilUser('friend');
          }
          break;

        case 'removeFriend':
          if (data.userid === user.userid) rebuilUser('anony');
          break;

        case 'replayFriendRemove':
          if (data.userid === user.userid) rebuilUser('anony');
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
      css={css`
        justify-content: center;
        margin: 0;
        margin-top: ${pixel(6)};
        background: transparent;
        flex-direction: column;
      `}>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        css={css`
          justify-content: center;
          margin: 0;
          background: transparent;
        `}>
        <ButtonNormal
          radius={pixel(5)}
          activeOpacity={0.8}
          borderAlpha={0.2}
          back={isDark ? 'clr3' : 'back1'}
          borderColor="clr1"
          onPress={openProfileMore}
          css={css`
            margin-right: ${isRTL ? 0 : pixel(8)};
            max-width: ${pixel(20)};
            height: ${pixel(36)};
          `}>
          <MoreSvg size={moderateScale(18)} rot={90} />
        </ButtonNormal>
        {isFriend ? (
          <>
            <ButtonNormal
              isRTL={isRTL}
              radius={pixel(5)}
              activeOpacity={0.8}
              borderAlpha={0.2}
              onPress={() => navigate('chat', {username})}
              back={isDark ? 'clr3' : 'back1'}
              borderColor="clr1">
              <ChatSvg size={moderateScale(18)} />
            </ButtonNormal>
            <ButtonNormal
              isRTL={isRTL}
              radius={pixel(5)}
              activeOpacity={0.8}
              borderAlpha={0.2}
              back={isDark ? 'clr3' : 'back1'}
              borderColor="clr1">
              <PhoneSvg size={moderateScale(18)} />
            </ButtonNormal>
          </>
        ) : null}
        <BuildButton
          payload={payload}
          username={username}
          userid={userid}
          loader={loader}
          setLoad={setLoad}
        />
        <ButtonNormal
          isRTL={isRTL}
          radius={pixel(5)}
          activeOpacity={0.8}
          borderAlpha={0.2}
          css={css`
            height: ${pixel(36)};
          `}
          back={isDark ? 'clr3' : 'back1'}
          borderColor="clr1"
          onPress={onFollow}>
          {waitFollow ? (
            <OuterAnyView
              css={css`
                min-width: ${pixel(55)};
                max-width: ${pixel(55)};
              `}>
              <DotIndicator
                size={moderateScale(3)}
                count={5}
                color={colors['clr2']}
              />
            </OuterAnyView>
          ) : (
            <>
              {follow.followYou ? (
                <FollowersSvg size={moderateScale(18)} />
              ) : null}
              <AnyText
                lower
                color={isDark ? 'back3' : 'clr3'}
                lineH={pixel(16)}
                size={moderateScale(13)}
                isRTL={isRTL}
                autoMargin={pixel(follow.followYou ? 5 : 0)}>
                {follow.followYou ? buttons.following : buttons.follow}
              </AnyText>
            </>
          )}
        </ButtonNormal>
      </OuterOneView>
    </OuterOneView>
  );
};

export default memo(UserControlProfile);
