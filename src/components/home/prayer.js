import React, {memo, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import Actions from '../../reducer/actions';
import {AnyText, OuterUserName, ScrollBar} from './helperprefernce';
import {OuterFitImageTouch} from './createstatus/helpercreatestatuscss';
import {css} from 'styled-components';
import {pixel, colors, Rgba} from '../../styles/basecss';
import FitFastImage from '../../main/renderfile/fit-fast-image';
import {moderateScale} from 'react-native-size-matters';
import {OuterOneView} from './helpernotification/heplernotifycss';
import moment from 'moment-timezone';
import {ScrollView} from 'react-native';
import {OuterAnyView} from './helperhome';
/////////////////////////////////////////////////////
const RenderOnePrayer = ({time, slaha = '', src}) => {
  const Size = parseInt(moderateScale(110));

  return (
    <OuterFitImageTouch
      activeOpacity={0.95}
      css={css`
        border-radius: ${pixel(5)};
        margin: ${pixel(2)};
        width: ${Size}px;
        height: ${Size * 1.15}px;
      `}>
      <FitFastImage
        uri={`https://cdn.meetoor.com/frontend/img/prayer/${src}.png`}
        width={Size}
        height={Size * 1.2}>
        <OuterAnyView
          css={css`
            top: 0px;
            left: 0px;
            width: ${Size}px;
            height: ${Size * 1.2}px;
            flex-direction: column;
            justify-content: space-between;
          `}>
          <OuterUserName
            css={css`
              width: 100%;
              height: auto;
              padding: ${pixel(4)};
              align-items: center;
              background: ${Rgba(colors['clr1'], 0.55)};
            `}>
            <AnyText lower color="back3" size={moderateScale(13.5)}>
              {slaha}
            </AnyText>
          </OuterUserName>
          <OuterUserName
            css={css`
              padding: 0;
            `}>
            <AnyText lower color="back3" size={moderateScale(13.5)}>
              {time}
            </AnyText>
          </OuterUserName>
        </OuterAnyView>
      </FitFastImage>
    </OuterFitImageTouch>
  );
};
/////////////////////////////////////////////////////
const RenderPrayer = () => {
  const dispatch = useDispatch();
  const {messages, days, month_hijri, slaha} = useSelector(
    state => state.sign.langData,
  );
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const userLocation = useSelector(state => state.sign.userLocation);
  const prayerData = useSelector(state => state.sign.prayerData);
  const [dateHijri, setDateHijri] = useState('');
  ////////////////////////////////////////////
  useEffect(() => {
    axios
      .get(
        `https://api.pray.zone/v2/times/today.json?ip=${
          userLocation?.ip || '192'
        }&timeformat=1&school=4`,
      )
      .then(response => {
        let data = response?.data?.results?.datetime[0] || {};
        console.log('useEffect ~ data', data);
        dispatch(Actions.type('setPrayerData', data));
        let today = moment().format('ddd')?.toLowerCase();
        today = days[today];
        let date = data?.date?.hijri?.split('-');
        let year = date[0];
        let month = date[1];
        let day = date[2];
        let fullDate = `${today} ${day} ${messages.of} ${month_hijri[month]} ${year}هـ`;
        setDateHijri(fullDate);
      })
      .catch(err => console.log(err));
  }, [days, month_hijri]);
  /////////////////////////////////////////////
  return (
    <>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back={isDark ? 'clr1' : 'back1'}
        css={css`
          margin: 0;
          padding: ${pixel(4)} 0;
          justify-content: center;
        `}>
        <AnyText
          lower
          isRTL={isRTL}
          size={moderateScale(13.5)}
          color={isDark ? 'back2' : 'clr3'}>
          {dateHijri}
        </AnyText>
      </OuterOneView>
      <ScrollView
        style={{backgroundColor: colors[isDark ? 'clr1' : 'back1']}}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <RenderOnePrayer
          time={prayerData?.times?.Fajr || ''}
          slaha={slaha[1]}
          src="fajr"
        />
        <RenderOnePrayer
          time={prayerData?.times?.Dhuhr || ''}
          slaha={slaha[2]}
          src="dhuhr"
        />
        <RenderOnePrayer
          time={prayerData?.times?.Asr || ''}
          slaha={slaha[3]}
          src="asr"
        />
        <RenderOnePrayer
          time={prayerData?.times?.Maghrib || ''}
          slaha={slaha[4]}
          src="maghrib"
        />
        <RenderOnePrayer
          time={prayerData?.times?.Isha || ''}
          slaha={slaha[5]}
          src="isha"
        />
      </ScrollView>
    </>
  );
};

export default memo(RenderPrayer);
