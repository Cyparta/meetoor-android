import React, { memo, useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../reducer/actions';
import { colors, pixel } from '../../../styles/basecss';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { AnyText, FlatScroll, PlaceholdView } from '../../home/helperprefernce';
import Axios from '../../../main/Axios';
import RenderOneComment from '../postview/comments/onecomment';
import BottomSectionView from './viewbottomsection';
import RenderOneReply from './replyes/onereply';
import { CommentSvg } from '../../../icons/all';
import { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderCommentView = ({ postId = 0, commentid }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const { badges } = useSelector(state => state.sign.langData);
    const mainSocket = useSelector(state => state.main.socket);
    const token = useSelector(state => state.sign.token);
    const Replys = useSelector(state => state.posts.replys);
    const comments = useSelector(state => state.posts.comments);
    const otherComments = useSelector(state => state.posts.otherComments);
    const commentsLastId = useSelector(state => state.posts.commentsLastId);
    /////////////////////////////////////////////
    const keyArray = `comment_id-${commentid}`;
    /////////////////////////////////////////////
    const commentData = otherComments[commentid];
    /////////////////////////////////////////////
    const Scroll = useRef(null);
    const IdLt = commentsLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getCommentDataApi = useCallback(async () => {
        try {
            const response = await Axios.get(`getComment/?commentid=${commentid}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (typeof response.data === "object") {
                dispatch(Actions.type("setOtherComments", {
                    type: 'add',
                    data: {
                        key: commentid,
                        val: response.data
                    }
                }));
            } else setTimeout(() => {
                history.push('/home');
            }, 100);

        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [commentid]);
    //////////////////////////////////////////////
    const getReplaysApi = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`commentsreplay/?commentid=${commentid}&idLt=${first ? 0 : IdLt}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            let responseData = response?.data;
            if (responseData?.length === 0 || responseData.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setReplys", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = responseData[responseData?.length - 1 || 0];
            // setIdLt(lastId?.commentid);
            dispatch(Actions.type("setCommentsLastId", {
                key: keyArray,
                val: lastId.replayid
            }));

            dispatch(Actions.type("setReplys", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: responseData.reverse()
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Replys[keyArray], keyArray, Scroll, commentid, isGetMore, isLoadMore, IdLt]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (Replys[keyArray] === undefined);
        if (checker) getReplaysApi(true);
    }, [commentid, token]);
    ///////////////////////////////////////////////
    useEffect(() => {
        mainSocket.emit("observerComment", { commentId: commentid });
    }, [commentid]);
    ///////////////////////////////////////////////
    useEffect(() => {
        if (otherComments[commentid] === undefined) {
            let found = false;
            for (const key in comments) {
                if (comments.hasOwnProperty(key)) {
                    const current = comments[key];
                    for (let index = 0; index < current.length; index++) {
                        const comment = current[index];
                        if (comment.commentid === parseInt(commentid)) {
                            dispatch(Actions.type("setOtherComments", {
                                type: 'add',
                                data: {
                                    key: commentid,
                                    val: comment
                                }
                            }));
                            found = true;
                            break;
                        }
                    }
                }
            }
            if (!found) getCommentDataApi();
        }
        mainSocket.emit("observerComment", { commentId: commentid });
    }, [commentid]);
    ////////////////////////////////////////////
    const OneReplyMemo = useMemo(() => ({ item }) => {
        return (<RenderOneReply {...item} keyArray={keyArray}
            // isMyPost={isMyPost}
            key={item.username + "_reply"} />);
    }, []);
    ///////////////////////////////////////////////
    return (<>
        <FlatScroll ref={Scroll}
            back={colors[isDark ? "clr1" : "back1"]}
            keyboardShouldPersistTaps='handled'
            data={Replys[keyArray]}
            renderItem={OneReplyMemo}
            onScrollBeginDrag={() => setScrollBegin(true)}
            onEndReached={() => {
                scrollBegin && getReplaysApi();
            }}
            ListHeaderComponent={<>
                <RenderOneComment {...commentData} keyArray={`post_id-${postId}`} />
                <AnyText color={isDark ? "back3" : "clr1"} align="center"
                    lineH={pixel(30)} size={moderateScale(14)}
                    css={css`background: ${colors[isDark ? "clr3" : "back3"]};`}>
                    {badges.replysOnComment}
                </AnyText>
            </>}
            ListEmptyComponent={Replys[keyArray] === undefined ?
                <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
                Replys[keyArray].length ? null : <PlaceholdView height={pixel(200)}>
                    <CommentSvg color="clr2" size={moderateScale(100)} />
                </PlaceholdView>}
            ListFooterComponent={<>
                {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null}
            </>}
        />
        <BottomSectionView commentId={commentid} keyArray={keyArray} />
    </>)
}

export default memo(RenderCommentView);