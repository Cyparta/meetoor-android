import React, {memo, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Actions from '../../reducer/actions';
import {ViewOuterCirculerAnimation} from '../video/mainplayer';
import {css} from 'styled-components';
import {ScrollView} from 'react-native';
import {PlayControlSvg} from '../../icons/all';
import {OuterFitImageTouch} from '../../components/home/createstatus/helpercreatestatuscss';
import FitFastImage from './fit-fast-image';
import {moderateScale} from 'react-native-size-matters';
import {pixel} from '../../styles/basecss';
/////////////////////////////////////////////////////////
const RenderAsMulti = ({
  postFile,
  userPhoto,
  userName,
  isSecure,
  isOwner,
  text,
}) => {
  const dispatch = useDispatch();
  const windowSize = useSelector(state => state.sign.windowSize);
  const {navigate} = useSelector(state => state.modal.navigation);
  /////////////////////////////////////////////////////
  const Size = useMemo(() => {
    switch (postFile.length) {
      case 2:
        return parseInt(windowSize.width / 2 - moderateScale(18));
      default:
        return parseInt(windowSize.width / 3 - moderateScale(18));
    }
  }, [postFile]);
  const rebuildUrls = useMemo(
    () =>
      postFile
        .filter(({isVideo}) => isVideo !== true)
        .map(({url}) => {
          return {url};
        }),
    [postFile],
  );
  /////////////////////////////////////////////////////
  return (
    <ScrollView
      horizontal={true}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      {postFile?.map(({url, isVideo, frame}, i) => {
        return (
          <OuterFitImageTouch
            activeOpacity={0.9}
            key={url + '_index' + i}
            onPress={() => {
              if (isVideo) navigate('video', {uri: url, poster: frame});
              else {
                dispatch(
                  Actions.type('setPopupImage', {
                    open: true,
                    index: i,
                    imageUrls: rebuildUrls,
                    userPhoto,
                    userName,
                    isSecure,
                    isOwner,
                    text,
                  }),
                );
              }
            }}
            style={{width: Size, height: Size * 1.27}}
            css={css`
              border-radius: ${pixel(4)};
              margin: 0 ${pixel(4)};
              margin-top: ${pixel(6)};
            `}>
            <FitFastImage
              uri={isVideo ? frame : url}
              width={Size}
              height={Size * 1.27}
              type="cover">
              {isVideo ? (
                <ViewOuterCirculerAnimation
                  back="clr2"
                  size={pixel(50)}
                  css={css`
                    margin: 0px;
                  `}>
                  <PlayControlSvg color="back3" type={false} />
                </ViewOuterCirculerAnimation>
              ) : null}
            </FitFastImage>
          </OuterFitImageTouch>
        );
      })}
    </ScrollView>
  );
};
/////////////////////////////////////////////////
const RenderPostFile = memo(
  ({postFile, userPhoto, userName, isSecure, isOwner, text}) => {
    const dispatch = useDispatch();
    const [isMulti] = useState(postFile.length > 1);
    const {navigate} = useSelector(state => state.modal.navigation);
    //////////////////////////////////////////////
    if (isMulti)
      return (
        <RenderAsMulti
          postFile={postFile}
          userPhoto={userPhoto}
          userName={userName}
          isSecure={isSecure}
          isOwner={isOwner}
        />
      );
    ///////////////////////////////////////////////
    // const [width, setWidth] = useState(380);
    const {url, isVideo, frame} = postFile[0];
    ///////////////////////////////////////////////
    return (
      <OuterFitImageTouch
        activeOpacity={0.9}
        css={css`
          border-radius: ${pixel(4)};
          max-width: 550px;
          max-height: 550px;
        `}
        onPress={() => {
          if (isVideo) {
            navigate('video', {uri: url, poster: frame});
          } else {
            dispatch(
              Actions.type('setPopupImage', {
                open: true,
                index: 0,
                imageUrls: [{url}],
                userPhoto,
                userName,
                isSecure,
                isOwner,
                text,
              }),
            );
          }
        }}>
        <FitFastImage uri={isVideo ? frame : url}>
          {isVideo ? (
            <ViewOuterCirculerAnimation
              back="clr2"
              size={pixel(50)}
              css={css`
                margin: 0px;
              `}>
              <PlayControlSvg color="back3" type={false} />
            </ViewOuterCirculerAnimation>
          ) : null}
        </FitFastImage>
      </OuterFitImageTouch>
    );
  },
);

export default memo(RenderPostFile);
