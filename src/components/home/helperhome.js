import React, {memo} from 'react';
import {useSelector} from 'react-redux';
import styled, {css} from 'styled-components';
import {DotIndicator} from 'react-native-indicators';
import {ChatSvg, NotifySvg} from '../../icons/all';
import {colors, Rgba, flexDisplay, font, pixel} from '../../styles/basecss';
import {AnyText} from './helperprefernce';
import FastImage from 'react-native-fast-image';
import {moderateScale} from 'react-native-size-matters';
import {ReactionIconAnim} from '../../icons/reaction';
//////////////////////////////////////////////////
export const TabOuterButton = styled.TouchableOpacity`
  width: auto;
  height: auto;
  min-width: ${pixel(45)};
  min-height: ${pixel(45)};
  position: relative;
  background: ${props => props.backcolor || 'transparent'};
  ${flexDisplay}
  ${props => {
    let style = ``;
    if (props.isRTL !== undefined)
      style += `
            flex-direction: ${props.isRTL ? 'row-reverse' : 'row'}
        `;
    return style;
  }}
    ${props => props.css || null}
`;
//////////////////////////////////////////////////isRTL
const UserImage = styled(FastImage)`
  width: ${props => props.sizeImage};
  height: ${props => props.sizeImage};
  border-radius: ${props =>
    props.radius ? props.radius : parseInt(parseInt(props.sizeImage) / 2)}px;
  border-width: ${pixel(2)};
  border-color: ${() => Rgba(colors['clr2'], 0.15)};
  background-color: ${props =>
    Rgba(
      colors[props.back || 'clr2'],
      props.alpha !== undefined ? props.alpha : 0.15,
    )};
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterSquarView = styled.View`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => (props.radius ? props.radius : moderateScale(4))}px;
  border-width: ${pixel(2.5)};
  ${flexDisplay};
  padding: ${props => props.padding || pixel(2)};
  border-color: ${props => colors[props.color || 'clr2']};
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const BadgeNumer = styled.Text`
  width: auto;
  height: ${pixel(24)};
  min-width: ${pixel(20)};
  max-width: ${pixel(20)};
  color: ${colors['back1']};
  background-color: ${colors['red2']};
  border-radius: ${pixel(10)};
  position: absolute;
  top: ${pixel(-2)};
  right: ${pixel(-2)};
  padding: 0 ${pixel(2)};
  ${flexDisplay}
  ${props =>
    font({
      size: pixel(15),
      line: pixel(24),
      isAr: props.isRTL,
      align: 'center',
    })};
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterMainOneChat = styled.TouchableOpacity`
  width: 100%;
  height: auto;
  position: relative;
  ${props =>
    flexDisplay({
      dir: props.isRTL ? 'row-reverse' : 'row',
      justify: 'flex-start',
    })}
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterLogo = styled.View`
  width: ${pixel(47)};
  height: ${pixel(47)};
  border-radius: ${pixel(10)};
  ${flexDisplay};
  margin-top: ${pixel(-12)};
  background: ${props => colors[props.isDark ? 'clr1' : 'back1']};
  border-width: ${pixel(2)};
  border-color: ${props => Rgba(colors[props.isDark ? 'clr2' : 'clr3'], 0.1)};
`;
//////////////////////////////////////////////////
export const OuterAnyView = styled.View`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: ${props => (props.radius ? props.radius : moderateScale(0))}px;
  ${() =>
    flexDisplay({
      justify: 'flex-start',
    })}
  background: ${props => (props.back ? colors[props.back] : 'transparent')};
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterLazy = styled.View`
  width: 100%;
  height: ${props => props.height || '100%'};
  overflow: hidden;
  ${flexDisplay};
  background: ${props => props.background || 'transparent'};
  ${props => (props.back ? ` background: ${colors[props.back]}` : null)};
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const CreatePostOuter = styled.TouchableOpacity`
  width: 100%;
  position: relative;
  ${props =>
    flexDisplay({
      dir: props.isRTL ? 'row-reverse' : 'row',
      justify: 'flex-start',
    })}
  /* margin: ${pixel(4)} auto; */
    border-radius: ${pixel(5)};
  ${props => {
    let style = ``;
    if (props.isDark !== undefined)
      style += `
            background: ${colors[props.isDark ? 'clr1' : 'back1']}
        `;
    return style;
  }}
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const TabBarBottom = styled.View`
  width: 100%;
  height: ${props => props.height || pixel(45)};
  position: relative;
  ${props =>
    flexDisplay({
      justify: 'space-around',
      dir: props.isRTL ? 'row' : 'row-reverse',
    })}
  border-top-width: ${pixel(2)};
  border-color: ${() => Rgba(colors['clr2'], 0.085)};
  ${props => props.css || null}
  ${props => {
    let style = ``;
    if (props.isDark !== undefined)
      style += `
            background: ${Rgba(
              colors[props.back ? props.back : props.isDark ? 'clr1' : 'back1'],
              props.alpha || 1,
            )}
        `;
    if (props.hide)
      style += `
            padding: 0;margin: 0;height: 0;overflow: hidden;border: 0;
        `;
    return style;
  }}
`;
///////////////////////////////////////////////////
export const RenderUserNotify = memo(({active}) => {
  const isRTL = useSelector(state => state.sign.isRTL);
  const notifyNumber = useSelector(state => state.notify.notifyNumber);
  return (
    <>
      <ReactionIconAnim
        animation={active ? 'rubberBand' : null}
        easing="linear"
        iterationCount={1}>
        <NotifySvg color={active ? 'clr2' : false} />
      </ReactionIconAnim>
      {notifyNumber > 0 ? (
        <BadgeNumer isRTL={isRTL}>{notifyNumber}</BadgeNumer>
      ) : null}
    </>
  );
});
////////////////////////////////////////////////////
export const RenderUserChats = memo(({active}) => {
  const isRTL = useSelector(state => state.sign.isRTL);
  const messageNumber = useSelector(state => state.main.messageNumber);
  ////////////////////////////////////////////////
  return (
    <>
      <ReactionIconAnim
        animation={active ? 'rubberBand' : null}
        easing="linear"
        iterationCount={1}>
        <ChatSvg color={active ? 'clr2' : false} />
      </ReactionIconAnim>
      {messageNumber > 0 ? (
        <BadgeNumer isRTL={isRTL}>{messageNumber}</BadgeNumer>
      ) : null}
    </>
  );
});
/////////////////////////////////////////////////////
export const RenderUserPhoto = memo(({size = pixel(40), radius}) => {
  const User = useSelector(state => state.main.user);
  const UserPhoto = User.UserPhoto;
  return (
    <UserImage source={{uri: UserPhoto}} sizeImage={size} radius={radius} />
  );
});
/////////////////////////////////////////////////////
export const RenderAnyUserPhoto = memo(
  ({size = pixel(40), userPhoto, renderBadge = null, radius, ...props}) => {
    return (
      <>
        <UserImage
          source={{
            uri: userPhoto,
            priority: FastImage.priority.normal,
          }}
          sizeImage={size}
          radius={radius}
          {...props}
        />
        {renderBadge}
      </>
    );
  },
);
//////////////////////////////////////////////////
export const RenderPlaceholder = ({route}, isDark) => {
  switch (route.key) {
    case 'more':
    case 'tabs':
      return (
        <OuterLazy background={colors['clr1']}>
          <DotIndicator
            size={moderateScale(5)}
            count={7}
            color={colors['clr2']}
          />
        </OuterLazy>
      );
    default:
      return (
        <OuterLazy background={colors[isDark ? 'clr1' : 'back3']}>
          <DotIndicator
            size={moderateScale(5)}
            count={7}
            color={colors['clr2']}
          />
        </OuterLazy>
      );
  }
};
/////////////////////////////////////////////////////
export const RenderCreatePost = memo(
  ({isDark, isRTL, header = '', cssStyle, action}) => {
    const User = useSelector(state => state.main.user);
    const UserPhoto = User.UserPhoto;
    return (
      <CreatePostOuter
        activeOpacity={0.8}
        css={cssStyle}
        isDark={isDark}
        isRTL={isRTL}
        onPress={action}>
        <UserImage
          source={{uri: UserPhoto}}
          sizeImage={pixel(40)}
          radius={moderateScale(30)}
        />
        <AnyText
          lower
          autoMargin={pixel(10)}
          lineH={pixel(40)}
          size={moderateScale(13)}
          css={css`
            border-width: ${pixel(0)};
            border-color: ${colors['clr2']};
            border-radius: ${pixel(20)};
            padding: 0 ${pixel(10)};
            flex: 1;
            height: ${pixel(40)};
            background-color: ${Rgba(colors[isDark ? 'clr3' : 'back3'], 0.55)};
          `}
          isRTL={isRTL}
          color={isDark ? 'back2' : 'clr3'}>
          {header}
        </AnyText>
      </CreatePostOuter>
    );
  },
);
