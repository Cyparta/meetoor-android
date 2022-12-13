import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DotIndicator, WaveIndicator } from 'react-native-indicators';
import RenderOneLike from './onelike';
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { AnyText, FlatScroll, PlaceholdView } from '../home/helperprefernce';
import { HeartSvg } from '../../icons/reacts';
import Axios from '../../main/Axios';
import { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const CommentLikesView = ({ commentid }) => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const token = useSelector(state => state.sign.token);
    const Likes = useSelector(state => state.posts.likesReply);
    const likesLastId = useSelector(state => state.posts.likesLastId);
    /////////////////////////////////////////////
    const keyArray = `comment_id-${commentid}`;
    const IdLt = likesLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    //////////////////////////////////////////////
    const getLikesApi = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`likeComments/?commentid=${commentid}&idLt=${first ? 0 : IdLt}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response?.data?.length === 0 || response.data.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setLikesReply", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            // console.log("response", response.data);
            let lastId = response?.data[response?.data?.length - 1 || 0];
            console.log("getLikesApi ~ lastId", lastId.likeid)
            // setIdLt(lastId?.likeid);
            let sortData = response.data.sort(() => Math.random() - 0.5);
            dispatch(Actions.type("setLikesLastId", {
                key: keyArray,
                val: lastId.likeid
            }));
            dispatch(Actions.type("setLikesReply", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: sortData
                }
            }));
            ////////////////////////////////////////////////////////
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [Likes[keyArray], keyArray, isGetMore, commentid, isLoadMore, IdLt]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (Likes[keyArray] === undefined);
        if (checker) getLikesApi(true);
    }, [commentid]);
    /////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "onLikeComment":
                if (data.more.commentid === commentid) {
                    if (data.like) {
                        dispatch(Actions.type("setLikesReply", {
                            type: 'update',
                            data: {
                                key: keyArray,
                                val: data.like
                            }
                        }));
                    } else {
                        dispatch(Actions.type("setLikesReply", {
                            type: 'deleteOne',
                            data: {
                                keyArray: keyArray,
                                target: data.more.likeid,
                                key: "likeid"
                            }
                        }));
                    }
                }
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneLikeCommentMemo = useMemo(() => ({ item }) => {
        return (<RenderOneLike {...item} key={item.username + "_like-post"} />);
    }, []);
    ///////////////////////////////////////////////
    return (<FlatScroll back={colors[isDark ? "clr1" : "back1"]}
        data={Likes[keyArray]}
        renderItem={OneLikeCommentMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getLikesApi();
        }}
        ListHeaderComponent={<>
            <AnyText color={isDark ? "back3" : "clr1"} align="center"
                lineH={pixel(30)} size={moderateScale(14)}
                css={css`background: ${colors[isDark ? "clr3" : "back3"]};`}>
                {badges.likesOnComment}
            </AnyText>
        </>}
        ListEmptyComponent={Likes[keyArray] === undefined ?
            <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
            Likes[keyArray].length ? null : <PlaceholdView height={pixel(200)}>
                <HeartSvg color="red2" size={moderateScale(100)} />
            </PlaceholdView>}
        ListFooterComponent={<>
            {isLoadMore ? <DotIndicator size={moderateScale(5)}
                count={7} color={colors["clr2"]} /> : null}
        </>}
    />)
}

export default memo(CommentLikesView);