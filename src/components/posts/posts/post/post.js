import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { OuterMainPost } from './helperpostcss';
//////////////////////////////////////////////////////
import OnePostTop from './posttop';
import OnePostBody from './postbody';
import OnePostBottom from './postbottom';
//////////////////////////////////////////////////////
const OnePostMain = ({
    comments,
    postText,
    postFile,
    keyArray,
    posterPhoto,
    posterName,
    posterUsername,
    postId,
    likes,
    date,
    secure,
    isFriend,
    isFollowing,
    teamid,
    likeType = "heart",
    isUser = true,
    isPin,
    background,
    isOwner = false,
    isSecure = false,
    isliked = false,
    info,
    isEdit,
    isSaved,
    refId,
    clones = 0,
    pinned,
    isCloned = false,
    isCopy = false,
    asView = false,
    noAction = false,
    clonedUsername = false
}) => {
    const { navigate } = useSelector(state => state.modal.navigation);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    const isMe = User.username === posterUsername;
    const openPostView = useCallback((extra) => navigate("postview", {
        comments, postText, postFile, keyArray, posterPhoto,
        posterName, posterUsername, postId, likes,
        date, secure, isFriend, isFollowing, teamid, isCloned,
        likeType, isUser, isPin, background, isOwner, isSecure,
        isliked, info, isEdit, isSaved, refId, clones, pinned,
        isCopy, noAction, asView, clonedUsername, ...extra
    }));
    const openLikesPostView = useCallback(() => navigate("postlikes", { postId }), [postId]);
    //////////////////////////////////////////////////////////
    return (<OuterMainPost pinned={asView ? false : pinned}
        asView={asView} isCloned={isCloned} isDark={isDark}>
        <OnePostTop postText={postText}
            keyArray={keyArray}
            posterPhoto={posterPhoto}
            posterName={posterName}
            posterUsername={posterUsername}
            postId={postId}
            date={date}
            isUser={isUser}
            isOwner={isOwner}
            isSecure={isSecure}
            info={info}
            background={background}
            secure={secure}
            teamid={teamid}
            isEdit={isEdit}
            isSaved={isSaved}
            isFriend={isFriend}
            isFollowing={isFollowing}
            refId={refId}
            isPin={isPin}
            pinned={pinned}
            noAction={noAction}
            isMe={isMe} />

        <OnePostBody postText={postText}
            posterPhoto={posterPhoto}
            posterName={posterName}
            postFile={postFile}
            refId={refId}
            posterUsername={posterUsername}
            background={background}
            isOwner={isOwner}
            isSecure={isSecure}
            openPostView={noAction ? null : openPostView}
            asView={asView}
            noAction={noAction}
        />

        {(noAction || refId) ? null :
            <OnePostBottom likes={likes}
                keyArray={keyArray}
                comments={comments}
                clones={clones}
                postId={postId}
                isUser={isUser}
                likeType={likeType}
                isliked={isliked}
                refId={refId}
                isCloned={isCloned}
                openPostView={openPostView}
                asView={asView}
                isCopy={isCopy}
                posterUsername={posterUsername}
                clonedUsername={clonedUsername}
                openLikesPostView={openLikesPostView}
            />}
    </OuterMainPost>)
}

export default memo(OnePostMain);