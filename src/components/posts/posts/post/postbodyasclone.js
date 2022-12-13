import React, {memo, useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {css} from 'styled-components';
import {ProcessTextWithLink} from '../../../../main/processtext/processtext';
import {OuterPostBodyContent, OuterSectionWithPress} from './helperpostcss';
import RenderPostFile from '../../../../main/renderfile/renderpostfile';
import {AnyText} from '../../../home/helperprefernce';
import FitFastImage from '../../../../main/renderfile/fit-fast-image';
import {pixel} from '../../../../styles/basecss';
import {moderateScale} from 'react-native-size-matters';
import {copyToClipboard} from '../../../../reducer/helper';
//////////////////////////////////////////////////////
const OnePostBodyAsclone = ({
  postText,
  postFile,
  background,
  posterPhoto,
  posterName,
  isSecure,
  isOwner,
  openPostView,
  asView,
}) => {
  //////////////////////////////////////////////
  const {placeholder, messages} = useSelector(state => state.sign.langData);
  const isDark = useSelector(state => state.sign.isDark);
  //////////////////////////////////////////////
  const process = useMemo(
    () =>
      ProcessTextWithLink(postText, {
        isDark,
        size: moderateScale(background ? 18 : 13),
        center: background,
        colorPosts: background,
        isPadding: background,
      }),
    [postText, background, isDark],
  );
  const {content, isBig} = process.text;
  ////////////////////////////////////////
  const onCopy = useCallback(() => {
    copyToClipboard(postText, messages.copied);
  }, [postText, messages]);
  //////////////////////////////////////////////
  return (
    <OuterPostBodyContent
      css={css`
        margin: ${pixel(12)} 0px ${pixel(2)} 0px;
      `}>
      {background ? (
        <FitFastImage
          type="contain"
          inner100={true}
          uri={`https://cdn.meetoor.com/frontend/img/postsback/${background}.png`}>
          {content}
        </FitFastImage>
      ) : (
        <>
          {content && content !== '' ? (
            <OuterSectionWithPress
              onLongPress={onCopy}
              activeOpacity={0.8}
              onPress={openPostView}>
              <OuterPostBodyContent
                css={css`
                  max-height: ${asView ? 'auto' : isBig ? pixel(240) : 'auto'};
                  overflow: hidden;
                  justify-content: flex-start;
                  margin-bottom: ${postFile?.length !== 0
                    ? moderateScale(7)
                    : 0}px;
                `}>
                {content}
              </OuterPostBodyContent>
              {asView ? null : isBig ? (
                <AnyText
                  lineH={pixel(14)}
                  color="blu"
                  css={css`
                    margin: ${pixel(3)} 0px;
                  `}
                  lower
                  size={moderateScale(13)}
                  align="center">
                  {placeholder.more}
                </AnyText>
              ) : null}
            </OuterSectionWithPress>
          ) : null}
          {postFile?.length === 0 ? null : (
            <RenderPostFile
              postFile={postFile}
              userPhoto={posterPhoto}
              userName={posterName}
              isSecure={isSecure}
              isOwner={isOwner}
              text={content}
            />
          )}
        </>
      )}
    </OuterPostBodyContent>
  );
};
//////////////////////////////////////////////////////
export default memo(OnePostBodyAsclone);
