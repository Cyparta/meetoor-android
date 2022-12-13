import React, {memo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
///////////////////////////////////////////////////
import {css} from 'styled-components';
import {AudioSvg, PrayerSvg, RequestSvg} from '../../icons/all';
import {OuterOneView} from '../home/helpernotification/heplernotifycss';
import {LabelText} from '../sign/helperinput';
import {OuterGlobalUser} from '../home/helperprefernce';
import SwitchButton from '../../main/switchbutton/switch';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import {pixel} from '../../styles/basecss';
import {moderateScale} from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderSoundSystem = () => {
  const dispatch = useDispatch();
  const {settings, buttons} = useSelector(state => state.sign.langData);
  const settingsMeetoor = useSelector(state => state.profile.settings);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const token = useSelector(state => state.sign.token);
  const [controls, setControls] = useState(settingsMeetoor);
  console.log(
    '🚀 ~ file: soundsystem.js ~ line 23 ~ RenderSoundSystem ~ controls',
    controls,
  );
  ///////////////////////////////////////////
  const setSoundUser = async (key, value) => {
    try {
      let data = new FormData();
      setControls({...controls, [key]: value});
      data.append(key, value ? 1 : 0);
      const response = await Axios.post(`preference/`, data, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(Actions.type('setSettings', response.data));
    } catch (e) {
      console.log('signin -> catch', e);
    }
  };
  ////////////////////////////////////////
  return (
    <>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back={isDark ? 'clr3' : 'back3'}
        css={css`
          justify-content: center;
          margin: 0;
          padding: 0 ${pixel(6)};
          margin-bottom: ${pixel(4)};
          border-radius: ${pixel(4)};
          flex-direction: column;
        `}>
        <LabelText isDrak={isDark} isRTL={isRTL}>
          {settings.sounds}
        </LabelText>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.call}
            onChange={bool => {
              setSoundUser('call', bool);
            }}
            fontSize={pixel(13)}
            text={settings.call}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={<AudioSvg size={moderateScale(19)} type={controls.call} />}
          />
        </OuterGlobalUser>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.message}
            onChange={bool => {
              setSoundUser('message', bool);
            }}
            fontSize={pixel(13)}
            text={settings.newMsg}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={
              <AudioSvg size={moderateScale(19)} type={controls.message} />
            }
          />
        </OuterGlobalUser>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.notification}
            onChange={bool => {
              setSoundUser('notification', bool);
            }}
            fontSize={pixel(13)}
            text={settings.newNotify}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={
              <AudioSvg size={moderateScale(19)} type={controls.notification} />
            }
          />
        </OuterGlobalUser>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.like}
            onChange={bool => {
              setSoundUser('like', bool);
            }}
            fontSize={pixel(13)}
            text={settings.addLike}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={<AudioSvg size={moderateScale(19)} type={controls.like} />}
          />
        </OuterGlobalUser>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.comein}
            onChange={bool => {
              setSoundUser('comein', bool);
            }}
            fontSize={pixel(13)}
            text={settings.addComm}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={
              <AudioSvg size={moderateScale(19)} type={controls.comein} />
            }
          />
        </OuterGlobalUser>
      </OuterOneView>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back={isDark ? 'clr3' : 'back3'}
        css={css`
          justify-content: center;
          margin: 0;
          padding: 0 ${pixel(6)};
          margin-bottom: ${pixel(4)};
          border-radius: ${pixel(4)};
          flex-direction: column;
        `}>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.anonyChat}
            onChange={bool => {
              setSoundUser('anonyChat', bool);
            }}
            fontSize={pixel(13)}
            text={buttons.anonychatSetting}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={
              <RequestSvg size={moderateScale(19)} type={controls.anonyChat} />
            }
          />
        </OuterGlobalUser>
      </OuterOneView>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back={isDark ? 'clr3' : 'back3'}
        css={css`
          justify-content: center;
          margin: 0;
          padding: 0 ${pixel(6)};
          margin-bottom: ${pixel(4)};
          border-radius: ${pixel(4)};
          flex-direction: column;
        `}>
        <OuterGlobalUser
          isRTL={isRTL}
          css={css`
            padding: 0 ${pixel(6)};
          `}>
          <SwitchButton
            value={controls.isPrayer}
            onChange={bool => {
              setSoundUser('isPrayer', bool);
            }}
            fontSize={pixel(13)}
            text={buttons.prayerSetting}
            css={css`
              flex: 1;
            `}
            csstext={css`
              flex: 1;
            `}
            element={
              <PrayerSvg size={moderateScale(19)} type={controls.isPrayer} />
            }
          />
        </OuterGlobalUser>
      </OuterOneView>
    </>
  );
};

export default memo(RenderSoundSystem);
