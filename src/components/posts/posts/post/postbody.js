import React, {memo, useCallback, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {css} from 'styled-components';
import MainPostClonedView from '../clonedpost';
import {ProcessTextWithLink} from '../../../../main/processtext/processtext';
import {OuterPostBodyContent, OuterSectionWithPress} from './helperpostcss';
import {AnyText} from '../../../home/helperprefernce';
import FitFastImage from '../../../../main/renderfile/fit-fast-image';
import {moderateScale} from 'react-native-size-matters';
import {pixel} from '../../../../styles/basecss';
import {TouchableOpacity} from 'react-native';
import {copyToClipboard} from '../../../../reducer/helper';
//////////////////////////////////////////////////////
let RenderPostFile = null;
const OnePostBody = ({
  postText,
  postFile = [],
  background,
  refId,
  posterUsername,
  posterPhoto,
  posterName,
  isSecure,
  isOwner,
  openPostView,
  asView,
  noAction,
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
        line: pixel(background ? 28 : 21),
        center: background,
        colorPosts: background,
        isPadding: background,
      }),
    [postText, background, isDark],
  );
  const {content, isBig} = process?.text;
  ////////////////////////////////////////
  const onCopy = useCallback(() => {
    if (noAction) return;
    copyToClipboard(postText, messages.copied);
  }, [postText, messages, noAction]);
  ////////////////////////////////////////
  const RenderPostFileBack = useCallback(() => {
    if (postFile?.length > 0) {
      if (RenderPostFile === null) {
        RenderPostFile =
          require('../../../../main/renderfile/renderpostfile').default;
      }
      return (
        <RenderPostFile
          postFile={postFile}
          userPhoto={posterPhoto}
          userName={posterName}
          isSecure={isSecure}
          isOwner={isOwner}
          text={content}
        />
      );
    }
    return null;
  }, [postFile, posterPhoto, posterName, isSecure, isOwner, content]);
  //////////////////////////////////////////////
  return (
    <OuterPostBodyContent
      css={css`
        margin: ${pixel(12)} 0px ${pixel(2)} 0px;
      `}>
      {refId ? (
        <>
          <TouchableOpacity onLongPress={onCopy} activeOpacity={0.8}>
            {content && content !== '' ? content : null}
          </TouchableOpacity>
          <MainPostClonedView
            refId={refId}
            clonedUsername={posterUsername}
            asView={asView}
          />
        </>
      ) : background ? (
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
          <RenderPostFileBack />
        </>
      )}
    </OuterPostBodyContent>
  );
};
//////////////////////////////////////////////////////
export default memo(OnePostBody);
