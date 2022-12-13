import React, { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { BackHandler } from 'react-native';
import * as Animatable from 'react-native-animatable';
/////////////////////////////////////////////
import styled, { css } from 'styled-components';
import { likeSound } from '../sounds/sound';
import { colors, flexDisplay, pixel, Rgba } from '../styles/basecss';
import ReactsIcons, { listIcons, listIconsAnimation } from './reacts';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////
const OuterSharedCss = css`
    width: auto;
    border-radius: ${pixel(40)};
    margin: 0 auto;
    position: absolute;
    ${() => flexDisplay({ dir: "row", justify: "space-between" })}
    border-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr1"], 0.1)};
    background:  ${() => Rgba(colors["clr2"], 0.75)};
    padding: ${pixel(4)};
`;
/////////////////////////////////////////////
export const ReactionContentOuter = styled(Animatable.View)`
    ${OuterSharedCss}
    z-index: 1000;
    max-width: ${(props) => props.width};
    min-width: ${(props) => props.width};
    ${(props) => props.setDir ? props.isRTL ? `right: ${pixel(2)}` : `left: ${pixel(2)};` : null};
    ${(props) => props.pos ? `top: ${props.pos};` : null};
    ${(props) => props.css ? props.css : null};
`;
/////////////////////////////////////////////
export const ReactionIconOuter = styled(Animatable.View)`
    max-width: ${(props) => props.size}px;
    min-width: ${(props) => props.size}px;
    max-height: ${(props) => props.size}px;
    min-height: ${(props) => props.size}px;
    border-radius: ${(props) => parseInt(props.size / 2)}px;
    position: relative;
    ${flexDisplay}
    background:  ${(props) => colors[props.active ? "back3" : "clr1"]};
    transform: scale(${(props) => props.active ? 1.2 : 1}) translateY(-${(props) => pixel(props.active ? 12 : 0)});
`;
//////////////////////////////////////////////////
export const ReactionIcon = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  ${flexDisplay}
`;
//////////////////////////////////////////////////
export const ReactionIconAnim = styled(Animatable.View)`
  width: auto;
  height: auto;
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const OuterViewAnimation = styled(Animatable.View)`
  width: auto;
  height: auto;
  position: relative;
  ${flexDisplay}
  ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const ReactionOuterOverlay = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px; left: 0px;
  z-index: 1000;
  flex: 1;
  ${flexDisplay}
`;
/////////////////////////////////////////////
const RenderOneReaction = memo(({ icon, animRepeat,
  deley, iconInfo, closeReaction, onLike, active }) => {
  const [activeLike, setLike] = useState(null);
  const [activeAnim, setActiveAnim] = useState(iconInfo.type);
  useEffect(() => {
    let one = 0, two = 0;
    if (activeLike) {
      setActiveAnim(null);
      one = setTimeout(() => {
        setActiveAnim("bounceInDown");
        clearTimeout(two);
        two = setTimeout(() => {
          setActiveAnim("bounceOutDown");
        }, 1000);
      }, 50);
    }
    return () => {
      clearTimeout(one);
      clearTimeout(two);
    }
  }, [activeLike]);
  //////////////////////////////////////////////
  return (<ReactionIconOuter size={moderateScale(35)}
    animation={animRepeat !== "infinite" ? "" : "zoomInDown"}
    easing="ease-in-out" iterationCount={1}
    duration={500} iterationDelay={deley}
    active={active}>
    <ReactionIcon onPress={() => {
      likeSound();
      setLike(icon);
      onLike && onLike(icon);
      closeReaction && closeReaction();
    }}
      activeOpacity={0.8}>
      <ReactionIconAnim duration={iconInfo.easing}
        animation={active ? activeAnim : iconInfo.type}
        easing="linear" direction="alternate-reverse"
        iterationCount={animRepeat} iterationDelay={deley}>
        {ReactsIcons[icon]({ size: iconInfo.size })}
      </ReactionIconAnim>
    </ReactionIcon>
  </ReactionIconOuter>)
});
/////////////////////////////////////////////
const ReactionRender = ({ onLike, closeReaction, css, active = null,
  backhander = true, opensound = true, animRepeat = "infinite", position }) => {
  const isRTL = useSelector(state => state.sign.isRTL);
  ///////////////////////////////////////////
  useEffect(() => {
    // if (opensound) openLikeSound();
    const backAction = () => {
      if (!backhander) return false;
      closeReaction && closeReaction();
      backHandler.remove();
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);
  ///////////////////////////////////////////
  return (<ReactionOuterOverlay
    activeOpacity={1}
    onPress={closeReaction}>
    <ReactionContentOuter isRTL={isRTL}
      setDir={opensound} width={pixel(330)} animation="fadeIn"
      easing="ease-in" duration={250}
      iterationCount={1} pos={position} css={css}>
      {listIcons.map((icon, i) => <RenderOneReaction
        icon={icon} key={icon + i} deley={i * 50} active={active === icon}
        onLike={onLike} iconInfo={listIconsAnimation[icon]}
        closeReaction={closeReaction} animRepeat={animRepeat} />)}
    </ReactionContentOuter>
  </ReactionOuterOverlay>)
}

export default memo(ReactionRender);