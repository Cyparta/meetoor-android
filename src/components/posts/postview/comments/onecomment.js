import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OuterMainPost } from '../../posts/post/helperpostcss';
import { css } from 'styled-components';
///////////////////////////////////////////////////
import RenderCommentTop from './commenttop';
import RenderCommentBottom from './commentbottom';
import { pixel } from '../../../../styles/basecss';
///////////////////////////////////////////////////
const RenderOneComment = ({
    username,
    userPhoto,
    fullName,
    commentid,
    isliked,
    date,
    keyArray,
    commentText,
    numReplays,
    numLikes,
    isOwner,
    isSecure = false,
    posterUsername,
    postId,
    likeType = "heart",
    isEdit,
    // isMyPost,
    stillSend = false,
    commentFile
}) => {
    const isDark = useSelector(state => state.sign.isDark);
    const { navigate } = useSelector(state => state.modal.navigation);
    const User = useSelector(state => state.main.user);
    const isMe = username === User.username;
    const isMyPost = posterUsername === User.username;
    console.log("posterUsername", posterUsername)
    const openCommentView = useCallback(() => navigate("commentview", { postId, commentid }), [postId, commentid]);
    const openLikesCommentView = useCallback(() => navigate("commentlikes", { commentid }), [commentid]);
    ///////////////////////////////////////////////
    return (<OuterMainPost isDark={isDark} asView
        css={css`width: 100%;padding: 0px ${pixel(10)};background: transparent;
            border-color: transparent;border-width: 0px;`}>
        <RenderCommentTop
            isMe={isMe}
            isEdit={isEdit}
            isMyPost={isMyPost}
            isOwner={isOwner}
            isSecure={isSecure}
            stillSend={stillSend}
            date={date}
            postId={postId}
            username={username}
            userPhoto={userPhoto}
            fullName={fullName}
            commentText={commentText}
            keyArray={keyArray}
            commentid={commentid}
            commentFile={commentFile} />

        <RenderCommentBottom
            username={username}
            commentid={commentid}
            isliked={isliked}
            keyArray={keyArray}
            numReplays={numReplays}
            numLikes={numLikes}
            likeType={likeType}
            openCommentView={openCommentView}
            openLikesCommentView={openLikesCommentView} />
    </OuterMainPost>)
}

export default memo(RenderOneComment);