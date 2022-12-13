import React, {
    memo, useState, useRef,
    useEffect, useCallback, useMemo
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { colors, pixel } from '../../styles/basecss';
import Axios from '../../main/Axios';
import useGoBack from "../../main/goback";
import Actions from '../../reducer/actions';
import { AnyText, FlatScroll, PlaceholdView } from '../home/helperprefernce';
import OnePostMain from '../posts/posts/post/post';
import OnePostLoader from '../posts/posts/post/postloader';
import { OuterLazy, RenderCreatePost } from '../home/helperhome';
import { css } from 'styled-components';
import { BlockSvg } from '../../icons/all';
import RenderTopProfile from './profiletop';
import RenderControlProfile from './profilemid';
import RenderBotProfile from './profilebot';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////////
const RenderProfile = ({ username = "devi" }) => {
    const dispatch = useDispatch();
    const handleBack = useGoBack();
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const token = useSelector(state => state.sign.token);
    const goToTop = useSelector(state => state.sign.goToTop);
    const { navigate } = useSelector(state => state.modal.navigation);
    const { placeholder, messages } = useSelector(state => state.sign.langData);
    const posts = useSelector(state => state.posts.posts);
    const profiles = useSelector(state => state.profile.profiles);
    const postsLastId = useSelector(state => state.posts.postsLastId);
    const User = useSelector(state => state.main.user);
    const isMe = User.username === username;
    /////////////////////////////////////////////
    const keyArray = `userPosts/?username=${username}&`;
    const Scroll = useRef(null);
    const IdLt = postsLastId[keyArray] || 0;
    const [isLoadMore, setLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isGetMore, setGetMore] = useState(true);
    const [scrollBegin, setScrollBegin] = useState(false);
    /////////////////////////////////////////////
    const profile = profiles[username];
    const postsData = posts[keyArray];
    const [render, setLazyRender] = useState(false);
    const userProfile = profile ? profile.user : {};
    const userPayload = profile ? profile.payload : {};
    const [isBlock, setIsBlock] = useState(false);
    const PinPost = posts[`pin_${username}`];
    /////////////////////////////////////////////
    let isFriend = useMemo(() => profile?.payload?.type === "friend", [profile?.payload?.type]);
    /////////////////////////////////////////////
    const DATA_RENDER = useMemo(() => render ? postsData : undefined, [render, postsData]);
    /////////////////////////////////////////////
    const getPinPost = useCallback(async () => {
        try {
            const response = await Axios.get(`pinPost/?username=${username}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log("getPinPost response", response.data[0])
            dispatch(Actions.type("setPosts", {
                type: 'set',
                data: {
                    key: `pin_${username}`,
                    val: response.data[0]
                }
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [username]);
    /////////////////////////////////////////////
    const getProfileInfoApi = useCallback(async () => {
        try {
            const response = await Axios.get(`userData/?username=${username}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.data.erorr) return handleBack();
            if (response.data.isBlock) return setIsBlock(true);
            dispatch(Actions.type("setProfiles", {
                type: 'add',
                data: {
                    key: username,
                    val: response.data
                }
            }));
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [username]);
    //////////////////////////////////////////////
    const getPosts = useCallback(async (first = false, callback) => {
        try {
            if (!isGetMore) return;
            if (!first && isLoadMore) return;
            !first && setLoadMore(true);
            const response = await Axios.get(`${keyArray}idLt=${first ? 0 : IdLt}`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            if (response?.data?.length === 0 || response.data.noMore) {
                setGetMore(false);
                setLoadMore(false);
                first && dispatch(Actions.type("setPosts", {
                    type: 'set',
                    data: {
                        key: keyArray,
                        val: []
                    }
                }));
                return;
            }
            let lastId = response?.data[response?.data?.length - 1 || 0];
            dispatch(Actions.type("setPostsLastId", {
                key: keyArray,
                val: lastId.postId
            }));
            dispatch(Actions.type("setPosts", {
                type: first ? 'set' : "addGroup",
                data: {
                    key: keyArray,
                    val: response.data
                }
            }));
            !first && setLoadMore(false);
            callback && callback();
            !first && setScrollBegin(false);
        } catch (e) {
            console.log("Dashbord -> error.post", e)
        }
    }, [keyArray, Scroll, isLoadMore, IdLt, isGetMore, token]);
    ////////////////////////////////////////////
    const onRefresh = useCallback(() => {
        getProfileInfoApi();
        setRefreshing(true);
        getPosts(true, () => setRefreshing(false));
    }, [username, keyArray, Scroll, isLoadMore, IdLt, isGetMore, token]);
    ////////////////////////////////////////////
    useEffect(() => {
        (profile === undefined) && getProfileInfoApi();
        (PinPost === undefined) && getPinPost();
        (postsData === undefined) && getPosts(true);
        setTimeout(() => setLazyRender(true), 0);
    }, [username]);
    /////////////////////////////////////////////
    useEffect(() => {
        if (goToTop && goToTop?.nav === "profile") Scroll.current.scrollToOffset(0);
    }, [goToTop, Scroll]);
    ////////////////////////////////////////////
    if (isBlock) return (<PlaceholdView height="100%"
        css={css`flex-direction: column;`} alpha={0.5}>
        <BlockSvg color="red2" size={moderateScale(200)} />
        <AnyText color="red2" size={moderateScale(20)}
            css={css`margin-top: ${pixel(14)};`}>
            {messages.blockUser}
        </AnyText>
    </PlaceholdView>);
    ////////////////////////////////////////////
    const keyExtractor = useCallback(item => item.postId + "_post", []);
    const RefreshControlMemo = useMemo(() => <RefreshControl
        colors={[colors["clr2"]]} refreshing={refreshing}
        onRefresh={onRefresh} />, [refreshing]);
    const OnePostMainMemo = useCallback(({ item }) => {
        return (<OnePostMain {...item} keyArray={keyArray} />);
    }, []);
    const ListHeaderComponent = useCallback(() => <>
        <RenderTopProfile {...userProfile} isMe={isMe} />
        <RenderControlProfile {...userProfile} {...userPayload} isMe={isMe} isFriend={isFriend} />
        <RenderBotProfile username={username} isMe={isMe} />
        {isMe ? <RenderCreatePost isDark={isDark} isRTL={isRTL} header={placeholder.addPost}
            cssStyle={css`border-radius: 0;margin: ${pixel(4)} 0;padding: ${pixel(10)};`}
            action={() => {
                navigate("createpost", { target: keyArray });
                dispatch(Actions.type("setBackgroundPost", 0));
            }} /> : null}
        {PinPost ? <OnePostMain {...PinPost} keyArray={keyArray} pinned={true} /> : null}
    </>, [userProfile, username, userPayload, PinPost, isMe, isDark, isRTL, isFriend]);
    const ListFooterComponent = useCallback(() => <>
        {isLoadMore ? <OnePostLoader key="post_load-1" /> : null}
        <KeyboardSpacer />
    </>, [isLoadMore]);
    const ListEmptyComponent = useCallback(() => DATA_RENDER === undefined ?
        <OnePostLoader key="post_load-1" /> :
        DATA_RENDER.length ? null : <OuterLazy background="transparent"
            height={pixel(200)}>
            <AnyText color={isDark ? "back2" : "clr1"} lower>
                {messages.nopostyet}
            </AnyText>
        </OuterLazy>, [DATA_RENDER]);
    // const LayoutItems = useCallback((data, index) => {
    //     const { background, postFile, refId } = data[index];
    //     let height = 510;
    //     if (background) height = 480;
    //     else if (refId) height = 570;
    //     else if (postFile.length) height = 670;
    //     return { length: height, offset: height * index, index }
    // }, []);
    ////////////////////////////////////////////
    return (<FlatScroll ref={Scroll} isDark={isDark}
        keyboardShouldPersistTaps='handled'
        data={DATA_RENDER} renderItem={OnePostMainMemo}
        onScrollBeginDrag={() => setScrollBegin(true)}
        onEndReached={() => {
            scrollBegin && getPosts();
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor} horizontal={false}
        // getItemLayout={LayoutItems}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={RefreshControlMemo}
        ListFooterComponent={ListFooterComponent}
    // NumToRender={5} windowSize={11}
    />);
}
export default memo(RenderProfile);