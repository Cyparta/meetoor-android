import React, {memo, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
///////////////////////////////////////////////////
import {css} from 'styled-components';
import {MoneySvg} from '../icons/all';
import {OuterOneView} from './home/helpernotification/heplernotifycss';
import {LabelText} from './sign/helperinput';
import {AnyText, ScrollBar} from './home/helperprefernce';
import {colors, pixel} from '../styles/basecss';
import {moderateScale} from 'react-native-size-matters';
import {HeartSvg} from '../icons/reacts';
/////////////////////////////////////////////
const RenderBalanceMeetoor = () => {
  const dispatch = useDispatch();
  const {tabsData, balance, buttons} = useSelector(
    state => state.sign.langData,
  );
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const user = useSelector(state => state.main.user);
  ////////////////////////////////////////
  return (
    <ScrollBar
      stickyHeaderIndices={[0]}
      keyboardShouldPersistTaps="handled"
      padd={pixel(4)}
      back={colors[isDark ? 'clr1' : 'back1']}>
      <AnyText
        isRTL={isRTL}
        size={moderateScale(15)}
        lineH={pixel(22)}
        color={isDark ? 'back2' : 'clr1'}
        css={css`
          padding: ${pixel(7)};
        `}
        lower>
        1: {balance.note1}
      </AnyText>
      <AnyText
        isRTL={isRTL}
        css={css`
          padding: ${pixel(7)};
        `}
        size={moderateScale(15)}
        lineH={pixel(22)}
        color={isDark ? 'back2' : 'clr1'}
        lower>
        2: {balance.note2}
      </AnyText>
      <AnyText
        isRTL={isRTL}
        css={css`
          padding: ${pixel(7)};
        `}
        size={moderateScale(15)}
        lineH={pixel(22)}
        color={isDark ? 'back2' : 'clr1'}
        lower>
        3: {balance.note3}
      </AnyText>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back="clr3"
        css={css`
          margin: 0;
          padding: ${pixel(7)};
          margin-bottom: ${pixel(5)};
          border-radius: ${pixel(4)};
          justify-content: center;
        `}>
        <AnyText
          isRTL={!isRTL}
          autoMargin={pixel(6)}
          size={moderateScale(16)}
          color="back1"
          lineH={pixel(20)}>
          {balance.likes} :
        </AnyText>
        <AnyText
          isRTL={!isRTL}
          autoMargin={pixel(6)}
          size={moderateScale(18)}
          color="back1"
          lineH={pixel(20)}>
          {user?.total_likes || 0}
        </AnyText>
        <HeartSvg size={moderateScale(18)} color="red2" />
      </OuterOneView>
      <OuterOneView
        activeOpacity={1}
        isRTL={isRTL}
        back="gold"
        css={css`
          margin: 0;
          padding: ${pixel(7)};
          margin-bottom: ${pixel(5)};
          border-radius: ${pixel(4)};
          justify-content: center;
        `}>
        <AnyText
          isRTL={!isRTL}
          autoMargin={pixel(6)}
          size={moderateScale(17)}
          color="back1"
          lineH={pixel(20)}>
          {tabsData.balance} :
        </AnyText>
        <AnyText
          isRTL={!isRTL}
          autoMargin={pixel(6)}
          size={moderateScale(18)}
          color="back1"
          lineH={pixel(20)}>
          {user?.balance || 0}
        </AnyText>
        <MoneySvg size={moderateScale(18)} color="back1" />
      </OuterOneView>
    </ScrollBar>
  );
};

export default memo(RenderBalanceMeetoor);
