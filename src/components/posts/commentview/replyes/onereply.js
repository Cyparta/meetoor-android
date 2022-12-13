import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { OuterMainPost } from '../../posts/post/helperpostcss';
import { css } from 'styled-components';
///////////////////////////////////////////////////
import RenderReplyTop from './replytop';
import { pixel } from '../../../../styles/basecss';
///////////////////////////////////////////////////
const RenderOneReply = ({
    replayid,
    username,
    userPhoto,
    fullName,
    date,
    isSecure = false,
    isOwner,
    keyArray,
    replayText,
    commenterUsername,
    commentid,
    postId,
    stillSend = false,
    replayFile
}) => {
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    const isMe = username === User.username;
    ///////////////////////////////////////////////14+
    return (<OuterMainPost isDark={isDark}
        asView css={css`padding: 0px ${pixel(14)};background: transparent;
            border-color: transparent;border-width: 0px;`}>
        <RenderReplyTop
            isMe={isMe}
            username={username}
            isOwner={isOwner}
            isSecure={isSecure}
            stillSend={stillSend}
            date={date}
            userPhoto={userPhoto}
            fullName={fullName}
            replayText={replayText}
            keyArray={keyArray}
            replayid={replayid}
            commentid={commentid}
            postId={postId}
            replayFile={replayFile}
            replayText={replayText} />
    </OuterMainPost>)
}

export default memo(RenderOneReply);