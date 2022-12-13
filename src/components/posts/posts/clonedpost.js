import React, { useEffect, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnyText } from '../../home/helperprefernce';
import Axios from '../../../main/Axios';
import Actions from '../../../reducer/actions';
import { OuterMainPost } from './post/helperpostcss';
import OnePostLoader from './post/postloader';
import OnePostTop from './post/posttop';
import OnePostBodyAsclone from './post/postbodyasclone';
import OnePostBottom from './post/postbottom';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////
const MainPostClonedView = ({ refId, clonedUsername, asView }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const { messages } = useSelector(state => state.sign.langData);
    const { navigate } = useSelector(state => state.modal.navigation);
    const isDark = useSelector(state => state.sign.isDark);
    const User = useSelector(state => state.main.user);
    const otherPosts = useSelector(state => state.posts.otherPosts);
    const postData = otherPosts[refId];
    const isMe = User.username === postData?.posterUsername;
    //////////////////////////////////////////////
    const getPostDataApi = useCallback(async () => {
        try {
            const response = await Axios.get(`getPost/?postid=${refId}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (typeof response.data === "object") {
                dispatch(Actions.type("setOtherPosts", {
                    type: 'add',
                    data: {
                        key: refId,
                        val: response.data
                    }
                }));
            } else {
                dispatch(Actions.type("setOtherPosts", {
                    type: 'add',
                    data: {
                        key: refId,
                        val: { remove: true }
                    }
                }));
            }

        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [refId]);
    //////////////////////////////////////////////
    useEffect(() => {
        if (postData === undefined) getPostDataApi();
    }, [refId]);
    //////////////////////////////////////////////
    const openPostView = useCallback((extra) =>
        navigate("postview", {
            ...postData, ...extra
        }), [postData]);
    //////////////////////////////////////////////
    const openLikesPostView = useCallback(() =>
        navigate("postlikes", {
            postId: postData?.postId
        }), [postData?.postId]);
    //////////////////////////////////////////////
    return ((postData === undefined) ? <OnePostLoader /> :
        postData.remove ?
            <AnyText color="clr2" lower style={{
                marginTop: moderateScale(14),
                marginBottom: moderateScale(14)
            }}>
                {messages.noPostAnyMore}
            </AnyText>
            : <OuterMainPost pinned={false} asView={asView}
                isCloned={true} isDark={isDark}>
                <OnePostTop postText={postData?.postText}
                    posterPhoto={postData?.posterPhoto}
                    posterName={postData?.posterName}
                    posterUsername={postData?.posterUsername}
                    postId={postData?.postId}
                    date={postData?.date}
                    isUser={postData?.isUser}
                    isOwner={postData?.isOwner}
                    isSecure={postData?.isSecure}
                    info={postData?.info}
                    background={postData?.background}
                    secure={postData?.secure}
                    teamid={postData?.teamid}
                    isEdit={postData?.isEdit}
                    isSaved={postData?.isSaved}
                    isFriend={postData?.isFriend}
                    isFollowing={postData?.isFollowing}
                    refId={postData?.refId}
                    isPin={postData?.isPin}
                    pinned={postData?.pinned}
                    isMe={isMe} />

                <OnePostBodyAsclone postText={postData?.postText}
                    posterPhoto={postData?.posterPhoto}
                    posterName={postData?.posterName}
                    postFile={postData?.postFile}
                    refId={false}
                    background={postData?.background}
                    isOwner={postData?.isOwner}
                    isSecure={postData?.isSecure}
                    openPostView={openPostView}
                    asView={postData?.asView}
                />
                <OnePostBottom
                    likes={postData?.likes}
                    comments={postData?.comments}
                    clones={postData?.clones}
                    postId={postData?.postId}
                    isUser={postData?.isUser}
                    likeType={postData?.likeType}
                    isliked={postData?.isliked}
                    refId={postData?.refId}
                    isCloned={true}
                    openPostView={openPostView}
                    asView={postData?.asView}
                    isCopy={postData?.isCopy}
                    clonedUsername={clonedUsername}
                    openLikesPostView={openLikesPostView}
                />
            </OuterMainPost>)
}
export default memo(MainPostClonedView);
