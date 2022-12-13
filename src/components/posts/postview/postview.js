import React, { memo, useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../reducer/actions';
import { colors, pixel } from '../../../styles/basecss';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import { FlatScroll, PlaceholdView } from '../../home/helperprefernce';
import OnePostMain from '../posts/post/post';
import Axios from '../../../main/Axios';
import BottomSectionView from './viewbottomsection';
import RenderOneComment from './comments/onecomment';
import { CommentSvg } from '../../../icons/all';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderPostView = ({ toComments = false, ...postData }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    // const windowSize = useSelector(state => state.sign.windowSize);
    const mainSocket = useSelector(state => state.main.socket);
    // const User = useSelector(state => state.main.user);
    const token = useSelector(state => state.sign.token);
    const Comments = useSelector(state => state.posts.comments);
    const commentsLastId = useSelector(state => state.posts.commentsLastId);
    /////////////////////////////////////////////
    const postId = postData.postId;
    const keyArray = `post_id-${postId}`;
    /////////////////////////////////////////////
    const Scroll = useRef(null);
    const IdLt = commentsLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getCommentsApi = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`comments/?postid=${postId}&idLt=${first ? 0 : IdLt}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response?.data?.length === 0 || response.data.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setComments", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = response?.data[response?.data?.length - 1 || 0];
            // setIdLt(lastId?.commentid);
            dispatch(Actions.type("setCommentsLastId", {
                key: keyArray,
                val: lastId.commentid
            }));
            let sortData = response.data;
            dispatch(Actions.type("setComments", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: sortData
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            first && setTimeout(() => {
                if (sortData.length && Scroll.current) Scroll
                    .current.scrollToIndex({
                        animated: true,
                        index: 0,
                        viewPosition: 0
                    });
            }, 100);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Comments[keyArray], keyArray, Scroll, postId, isGetMore, isLoadMore, toComments, IdLt]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (Comments[keyArray] === undefined);
        if (checker) getCommentsApi(true);
        else {
            setTimeout(() => {
                if (toComments && Comments[keyArray].length && Scroll.current)
                    Scroll.current.scrollToIndex({
                        animated: true,
                        index: 0,
                        viewPosition: 0
                    })
            }, 0);
        }
    }, [postId, token]);
    ///////////////////////////////////////////////
    useEffect(() => {
        mainSocket.emit("observerPost", { postId });
    }, [postId]);
    ////////////////////////////////////////////
    const OneCommentMemo = useMemo(() => ({ item }) => {
        return (<RenderOneComment {...item} keyArray={keyArray}
            posterUsername={postData.posterUsername}
            key={item.username + "_comment"} />);
    }, [postData.posterUsername]);
    ///////////////////////////////////////////////
    return (<>
        <FlatScroll ref={Scroll} back={colors[isDark ? "clr1" : "back1"]}
            keyboardShouldPersistTaps='handled'
            data={Comments[keyArray]}
            renderItem={OneCommentMemo}
            onScrollBeginDrag={() => setScrollBegin(true)}
            onEndReached={() => {
                scrollBegin && getCommentsApi();
            }}
            ListHeaderComponent={<>
                <OnePostMain {...postData} asView={true} />
            </>}
            ListEmptyComponent={Comments[keyArray] === undefined ?
                <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
                Comments[keyArray].length ? null : <PlaceholdView height={pixel(200)}>
                    <CommentSvg color="clr2" size={moderateScale(100)} />
                </PlaceholdView>}
            ListFooterComponent={<>
                {isLoadMore ? <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null}
            </>}
        />
        <BottomSectionView postId={postId} keyArray={keyArray} />
    </>)
}

export default memo(RenderPostView);