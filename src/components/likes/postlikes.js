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
const PostLikesView = ({ postId }) => {
    const dispatch = useDispatch();
    const { badges } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    const socketLive = useSelector(state => state.socket.live);
    const When = useSelector(state => state.main.when);
    const token = useSelector(state => state.sign.token);
    const Likes = useSelector(state => state.posts.likes);
    const likesLastId = useSelector(state => state.posts.likesLastId);
    /////////////////////////////////////////////
    const keyArray = `post_id-${postId}`;
    const IdLt = likesLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    const DATA_RENDER = Likes[keyArray]
    //////////////////////////////////////////////
    const getLikesApi = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            // if (!firstDone && !first) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`likes/?postid=${postId}&idLt=${first ? 0 : IdLt}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response?.data?.length === 0 || response.data.noMore) {
                console.log("getLikesApi ~ response more", false)
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setLikes", {
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
            let sortData = response.data.sort(() => Math.random() - 0.5);
            dispatch(Actions.type("setLikesLastId", {
                key: keyArray,
                val: lastId.likeid
            }));
            dispatch(Actions.type("setLikes", {
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
    }, [DATA_RENDER, keyArray, isGetMore, postId, isLoadMore, IdLt]);
    ////////////////////////////////////////////
    useEffect(() => {
        const checker = (DATA_RENDER === undefined);
        if (checker) getLikesApi(true);
    }, [postId]);
    /////////////////////////////////////////////
    useEffect(() => {
        const { event, data, when } = socketLive;
        if (when >= When()) switch (event) {
            case "replayFriendRequest":
                dispatch(Actions.type("setLikes", {
                    type: "updateWithCall",
                    data: {
                        keyArray,
                        key: "username",
                        target: data.username,
                        call: (target) => {
                            target.isFriend = "sent"
                        }
                    }
                }));
                break;
            case "cancelFriendRequest":
                dispatch(Actions.type("setLikes", {
                    type: "updateWithCall",
                    data: {
                        keyArray,
                        key: "username",
                        target: data.username,
                        call: (target) => {
                            target.isFriend = false;
                        }
                    }
                }));
                break;
            default:
                break;
        }
    }, [socketLive]);
    ////////////////////////////////////////////
    const OneLikeMemo = useMemo(() => ({ item }) => {
        return (<RenderOneLike {...item} />);
    }, []);
    const keyExtractor = useCallback((item, i) => item.likeid + "_post_like" + i, []);
    const ListHeaderComponent = useCallback(() => <AnyText
        color={isDark ? "back3" : "clr1"} align="center" lineH={pixel(30)}
        size={moderateScale(14)}
        css={css`background: ${colors[isDark ? "clr3" : "back3"]};`}>
        {badges.likesOnPost}
    </AnyText>, [isDark]);
    const ListFooterComponent = useCallback(() => isLoadMore ? <DotIndicator
        size={moderateScale(5)} count={7} color={colors["clr2"]} /> : null, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => DATA_RENDER === undefined ?
        <WaveIndicator size={moderateScale(150)} color={colors[isDark ? "back3" : "clr2"]} /> :
        DATA_RENDER.length ? null : <PlaceholdView height={pixel(200)}>
            <HeartSvg color="red2" size={moderateScale(100)} />
        </PlaceholdView>, [DATA_RENDER]);
    ///////////////////////////////////////////////
    return (<FlatScroll
        back={colors[isDark ? "clr1" : "back1"]}
        data={DATA_RENDER}
        renderItem={OneLikeMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getLikesApi();
        }}
        keyExtractor={keyExtractor}
        removeClippedSubviews
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
    />)
}

export default memo(PostLikesView);