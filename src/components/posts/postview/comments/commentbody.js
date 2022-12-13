import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { OuterPostBodyContent } from '../../posts/post/helperpostcss';
import { css } from 'styled-components';
import { ProcessTextWithLink } from '../../../../main/processtext/processtext';
import RenderSingleFile from '../../../../main/renderfile/rendersinglefile';
import SoundPlayerMain from '../../../../main/sound/player';
import { colors, pixel } from '../../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { copyToClipboard } from '../../../../reducer/helper';
import { TouchableOpacity } from 'react-native';
///////////////////////////////////////////////////
const RenderCommentBody = ({
    userPhoto,
    fullName,
    isOwner,
    isSecure = false,
    commentText,
    commentFile
}) => {
    const isDark = useSelector(state => state.sign.isDark);
    const windowSize = useSelector(state => state.sign.windowSize);
    const { messages } = useSelector(state => state.sign.langData);
    //////////////////////////////////////////////
    const isRecord = commentText?.startsWith("$record$");
    const process = useMemo(() => ProcessTextWithLink(commentText, {
        isDark,
        width: "auto",
        line: pixel(21),
        size: moderateScale(13),
    }), [commentText, isDark]);
    const { content } = process.text;
    ////////////////////////////////////////
    const onCopy = useCallback(() => {
        copyToClipboard(commentText, messages.copied);
    }, [commentText, messages]);
    ///////////////////////////////////////////////
    return (<OuterPostBodyContent
        css={css`margin: 0px;width: auto;padding: ${pixel(5)} ${pixel(isRecord ? 2 : 10)};max-width: ${pixel(windowSize.width - 110)};
            background: ${colors[isRecord ? "trans" : isDark ? "clr3" : "back3"]};border-radius: ${pixel(10)};`}>
        {isRecord ? null : content && content !== "" ?
            <OuterPostBodyContent
                css={css`overflow: hidden;justify-content: flex-start;width: auto;
                    margin-bottom: ${commentFile ? moderateScale(6) : 0}px;`}>
                <TouchableOpacity onLongPress={onCopy} activeOpacity={0.8}>{content}</TouchableOpacity>
            </OuterPostBodyContent> : null}
        {commentFile ?
            isRecord ?
                <SoundPlayerMain uri={commentFile.base} /> :
                <RenderSingleFile
                    dataFile={commentFile}
                    userPhoto={userPhoto}
                    userName={fullName}
                    isSecure={isSecure}
                    isOwner={isOwner} />
            : null}
    </OuterPostBodyContent>)
}

export default memo(RenderCommentBody);
