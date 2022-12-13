import React, {memo, useCallback} from 'react';
import {Modal} from 'react-native';
import ImageBoxViewer from 'react-native-image-zoom-viewer';
import {useSelector, useDispatch} from 'react-redux';
import Actions from '../reducer/actions';
import FastImage from 'react-native-fast-image';
import {
  ButtonCirculer,
  UserInfoModalTouch,
  ViewOuterCirculer,
} from '../components/home/sliderroom/helperroomcss';
import {css} from 'styled-components';
import {OuterAnyView, RenderAnyUserPhoto} from '../components/home/helperhome';
import {
  AnyText,
  OuterUserName,
  ScrollBar,
} from '../components/home/helperprefernce';
import {DownloadSvg, SecureSvg, StarSvg} from '../icons/all';
import {colors, pixel, Rgba} from '../styles/basecss';
import {DotIndicator} from 'react-native-indicators';
import {TopModalWithGradient} from '../components/story/onestory';
import {downloadFile} from './downloadfile';
import {moderateScale} from 'react-native-size-matters';
////////////////////////////////////////////
const ImageBoxMeetoor = () => {
  const dispatch = useDispatch();
  const isRTL = useSelector(state => state.sign.isRTL);
  const popupImageWindow = useSelector(state => state.main.popupImageWindow);
  ////////////////////////////////////////
  const closeBox = useCallback(
    () =>
      dispatch(
        Actions.type('setPopupImage', {
          open: false,
        }),
      ),
    [],
  );
  console.log('ImageBoxMeetoor ~ popupImageWindow', popupImageWindow.text);
  ////////////////////////////////////////
  return (
    <Modal
      onRequestClose={closeBox}
      transparent={true}
      animationType="fade"
      visible={popupImageWindow.open}>
      <ImageBoxViewer
        enablePreload={true}
        index={popupImageWindow.index}
        enableSwipeDown={true}
        onSwipeDown={closeBox}
        saveToLocalByLongPress={false}
        menuContext={false}
        menus={null}
        imageUrls={popupImageWindow.imageUrls}
        renderImage={({source, style, ...props}) => (
          <FastImage
            {...props}
            style={style}
            source={{
              uri: source.uri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        )}
        loadingRender={() => {
          return (
            <DotIndicator
              size={moderateScale(4)}
              count={10}
              color={colors['clr2']}
            />
          );
        }}
        renderHeader={currentIndex => (
          <TopModalWithGradient
            css={css`
              position: absolute;
              z-index: 2;
              padding-bottom: ${pixel(2)};
              top: 0px;
            `}
            colors={[
              Rgba(colors['clr1'], 1),
              Rgba(colors['clr1'], 0.6),
              Rgba(colors['clr3'], 0.2),
            ]}>
            {popupImageWindow.noHeader ? null : (
              <UserInfoModalTouch activeOpacity={1}>
                <RenderAnyUserPhoto
                  userPhoto={popupImageWindow.userPhoto}
                  size={pixel(42)}
                  renderBadge={
                    popupImageWindow.isSecure ? (
                      <ViewOuterCirculer
                        size={pixel(22)}
                        back="clr1"
                        css={css`
                          position: absolute;
                          left: 0px;
                          bottom: 0px;
                        `}>
                        {popupImageWindow.isOwner ? (
                          <StarSvg color="back3" size={moderateScale(14)} />
                        ) : (
                          <SecureSvg color="back3" size={moderateScale(14)} />
                        )}
                      </ViewOuterCirculer>
                    ) : null
                  }
                />
                <OuterUserName>
                  <AnyText
                    isRTL={isRTL}
                    size={moderateScale(14)}
                    lineH={pixel(16)}
                    color="back3">
                    {popupImageWindow.userName}
                  </AnyText>
                </OuterUserName>
              </UserInfoModalTouch>
            )}

            {popupImageWindow.noDownload ? null : (
              <ButtonCirculer
                back="clr3"
                activeOpacity={0.8}
                css={css`
                  margin: 0px;
                `}
                onPress={() =>
                  downloadFile(popupImageWindow.imageUrls[currentIndex].url)
                }
                size={pixel(40)}>
                <DownloadSvg color="yel" size={moderateScale(18)} />
              </ButtonCirculer>
            )}
          </TopModalWithGradient>
        )}
        renderFooter={() =>
          popupImageWindow.text ? (
            <ScrollBar
              back="transparent"
              css={css`
                padding: ${pixel(4)};
                max-height: ${pixel(180)};
              `}>
              {popupImageWindow.text}
            </ScrollBar>
          ) : null
        }
      />
    </Modal>
  );
};

export default memo(ImageBoxMeetoor);
