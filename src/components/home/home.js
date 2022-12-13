import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {useSelector, useDispatch} from 'react-redux';
// import RoomSliderMeetoor from './sliderroom/rooms';
import StatusSliderMeetoor from './sliderstatus/status';
import {
  BadgeNumer,
  CreatePostOuter,
  OuterAnyView,
  RenderCreatePost,
  TabOuterButton,
} from './helperhome';
import Actions from '../../reducer/actions';
import {RefreshControl} from 'react-native';
import {colors, pixel} from '../../styles/basecss';
import {AnyText, FlatScroll} from './helperprefernce';
import OnePostMain from '../posts/posts/post/post';
import OnePostLoader from '../posts/posts/post/postloader';
import Axios from '../../main/Axios';
import AsyncStorage from '@react-native-community/async-storage';
import {css} from 'styled-components';
import {ButtonCirculer} from './sliderroom/helperroomcss';
import {PlusSvg} from '../../icons/all';
import {ReactionIconAnim} from '../../icons/reaction';
import {moderateScale} from 'react-native-size-matters';
//////////////////////////////////////////////
const RenderHome = () => {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.sign.isDark);
  const isRTL = useSelector(state => state.sign.isRTL);
  const token = useSelector(state => state.sign.token);
  const goToTop = useSelector(state => state.sign.goToTop);
  const {navigate} = useSelector(state => state.modal.navigation);
  const {placeholder, buttons} = useSelector(state => state.sign.langData);
  const storedPosts = useSelector(state => state.posts.storedPosts);
  const posts = useSelector(state => state.posts.posts);
  const postsLastId = useSelector(state => state.posts.postsLastId);
  ///////////////////////////////////////////
  const [scrollOffsetTop, setScrollOffsetTop] = useState(0);
  const [isLoadMore, setLoadMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isGetMore, setGetMore] = useState(true);
  const [scrollBegin, setScrollBegin] = useState(false);
  const [keyArray, setKeyArray] = useState('mainPosts/');
  console.log('line 94 ~ keyArray', keyArray);
  const isMainMode = keyArray === 'mainPosts/';
  const Scroll = useRef(null);
  const IdLt = postsLastId[keyArray] || 0;
  const DATA_RENDER = useMemo(
    () => posts[keyArray] || storedPosts,
    [posts, keyArray],
  );
  const TimeLinePosts = isMainMode ? posts['timeLine/'] || [] : [];
  ////////////////////////////////////////////
  const [CreatePostAsFloat, setCreatePostAsFloat] = useState(false);
  ////////////////////////////////////////////
  const getTimeLine = useCallback(async () => {
    try {
      const response = await Axios.get(`timeLine/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      dispatch(
        Actions.type('setPosts', {
          type: 'set',
          data: {
            key: 'timeLine/',
            val: response.data,
          },
        }),
      );
    } catch (e) {
      console.log('Dashbord -> error.data', e);
    }
  }, [token]);
  ////////////////////////////////////////////
  const getPosts = useCallback(
    async (first = false, callback, keyOverwrite, idLtOverwrite) => {
      try {
        if (!isGetMore) return;
        if (!first && isLoadMore) return;
        !first && setLoadMore(true);
        let key = keyOverwrite || keyArray;
        let id = idLtOverwrite || IdLt;
        const response = await Axios.get(`${key}?idLt=${first ? 0 : id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        console.log('line 94 ~ response', key);
        let responseData = response?.data;
        if (responseData.length === 0 || responseData.noMore) {
          setGetMore(false);
          setLoadMore(false);
          first &&
            dispatch(
              Actions.type('setPosts', {
                type: 'set',
                data: {
                  key: keyArray,
                  val: [],
                },
              }),
            );
          return;
        }
        let lastId = responseData[responseData?.length - 1 || 0];
        console.log('line 52 ~ lastId', lastId.postId);
        dispatch(
          Actions.type('setPostsLastId', {
            key: key,
            val: lastId.postId,
          }),
        );
        const getDataToStore = responseData;//.sort(() => Math.random() - 0.5);
        dispatch(
          Actions.type('setPosts', {
            type: first ? 'set' : 'addGroup',
            data: {
              key: key,
              val: getDataToStore,
            },
          }),
        );
        ////////////////////////////////////////////////////////
        !first && setLoadMore(false);
        callback && callback();
        !first && setScrollBegin(false);
        ////////////////////////////////////////////////////////
        if (first) {
          await AsyncStorage.setItem(
            `@${token}_posts`,
            JSON.stringify(responseData),
          );
        }
      } catch (e) {
        console.log('Dashbord -> error.data', e);
      }
    },
    [keyArray, IdLt, token, isGetMore, isLoadMore],
  );
  ////////////////////////////////////////////
  const onRefresh = useCallback(
    keyOverwrite => {
      setRefreshing(true);
      getPosts(
        true,
        () => {
          getTimeLine();
          setRefreshing(false);
        },
        keyOverwrite,
        postsLastId[keyOverwrite] || 0,
      );
    },
    [keyArray, IdLt, token, isGetMore, isLoadMore, postsLastId],
  );
  ////////////////////////////////////////////
  useEffect(() => {
    const checker = DATA_RENDER === undefined;
    if (checker) getPosts(true);
    getTimeLine();
  }, []);
  /////////////////////////////////////////////
  useEffect(() => {
    if (goToTop && goToTop?.nav === 'home') {
      Scroll.current.scrollToOffset(0);
      setScrollOffsetTop(0);
      setCreatePostAsFloat(false);
    }
  }, [goToTop, Scroll]);
  ////////////////////////////////////////////
  useEffect(() => {
    let setter = setInterval(() => {
      if (!isMainMode) {
        window.clearInterval(setter);
        return;
      }
      if (scrollOffsetTop < 150) getTimeLine();
    }, 180 * 1000);
    /////////////////////////////////////////
    return () => {
      window.clearInterval(setter);
    };
  }, [token, scrollOffsetTop, isMainMode]);
  ////////////////////////////////////////////
  const OnePostMainMemo = useMemo(
    () =>
      ({item}) => {
        return <OnePostMain {...item} keyArray={keyArray} />;
      },
    [keyArray],
  );
  const keyExtractor = useCallback(item => item.postId + '_post', []);
  const RefreshControlMemo = useMemo(
    () => (
      <RefreshControl
        colors={[colors['clr2']]}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    ),
    [refreshing],
  );
  const ListHeaderComponent = useCallback(
    () => (
      <>
        {/* <RoomSliderMeetoor /> */}
        <StatusSliderMeetoor />
        <RenderCreatePost
          isDark={isDark}
          isRTL={isRTL}
          header={placeholder.addPost}
          cssStyle={css`
            border-radius: 0;
            margin-top: 0;
            padding: ${pixel(10)};
            margin-bottom: ${pixel(0)};
          `}
          action={() => {
            navigate('createpost', {target: keyArray});
            dispatch(Actions.type('setBackgroundPost', 0));
          }}
        />
        <CreatePostOuter
          activeOpacity={0.8}
          css={css`
            border-radius: 0;
            margin-top: 0;
            padding-horizontal: ${pixel(5)};
            margin-bottom: ${pixel(8)};
            justify-content: space-between;
          `}
          isDark={isDark}
          isRTL={isRTL}>
          <TabOuterButton
            activeOpacity={0.8}
            isRTL={isRTL}
            backcolor={isMainMode ? colors[isDark ? 'clr3' : 'back3'] : null}
            css={css`
              flex: 1;
              min-height: auto;
              border-top-left-radius: ${pixel(5)};
              border-top-right-radius: ${pixel(5)};
              padding: ${pixel(8)};
              margin-horizontal: ${pixel(5)};
            `}
            onPress={() => {
              setKeyArray('mainPosts/');
              onRefresh('mainPosts/');
            }}>
            <AnyText
              lower
              color={isMainMode ? 'clr2' : isDark ? 'back3' : 'clr3'}
              isRTL={isRTL}
              lineH={pixel(16)}
              size={moderateScale(13)}
              autoMargin={pixel(5)}>
              {buttons.home}
            </AnyText>
          </TabOuterButton>
          <TabOuterButton
            css={css`
              flex: 1;
              min-height: auto;
              border-top-left-radius: ${pixel(5)};
              border-top-right-radius: ${pixel(5)};
              padding: ${pixel(8)};
              margin-horizontal: ${pixel(5)};
            `}
            activeOpacity={0.8}
            isRTL={isRTL}
            backcolor={!isMainMode ? colors[isDark ? 'clr3' : 'back3'] : null}
            onPress={() => {
              setKeyArray('explorePosts/');
              onRefresh('explorePosts/');
            }}>
            <AnyText
              lower
              color={!isMainMode ? 'clr2' : isDark ? 'back3' : 'clr3'}
              isRTL={isRTL}
              lineH={pixel(16)}
              size={moderateScale(13)}
              autoMargin={pixel(5)}>
              {buttons.explore}
            </AnyText>
            {!isMainMode ? null : (
              <BadgeNumer
                isRTL={true}
                css={css`
                  height: ${pixel(20)};
                  transform: scale(0.45);
                  top: ${pixel(5)};
                  right: ${pixel(5)};
                  opacity: 0.9;
                `}
              />
            )}
          </TabOuterButton>
        </CreatePostOuter>
        {TimeLinePosts.map(item => (
          <OnePostMain
            {...item}
            keyArray={'timeLine/'}
            key={item.postId + '_timeline'}
          />
        ))}
      </>
    ),
    [isDark, isRTL, TimeLinePosts, keyArray, placeholder, isMainMode],
  );
  const ListFooterComponent = useCallback(
    () => <>{isLoadMore ? <OnePostLoader key="post_load-1" /> : null}</>,
    [isLoadMore],
  );
  const ListEmptyComponent = useCallback(
    () => <OnePostLoader key="post_load-1" />,
    [],
  );
  // const LayoutItems = useCallback((data, index) => {
  //     const { background, postFile, refId } = data[index];
  //     let height = 510;
  //     if (background) height = 480;
  //     else if (refId) height = 570;
  //     else if (postFile.length) height = 670;
  //     return { length: height, offset: height * index, index }
  // }, []);
  const onScrollBack = useCallback(
    ({nativeEvent: {contentOffset}}) => {
      let offsetTop = parseInt(contentOffset.y);
      if (offsetTop > 200) {
        !CreatePostAsFloat && setCreatePostAsFloat(true);
      } else {
        CreatePostAsFloat && setCreatePostAsFloat(false);
      }
    },
    [CreatePostAsFloat],
  );
  const onScrollBeginDrag = useCallback(({nativeEvent: {contentOffset}}) => {
    let offsetTop = parseInt(contentOffset.y);
    setScrollOffsetTop(offsetTop);
    setScrollBegin(true);
  }, []);
  const onEndReached = useCallback(
    () => scrollBegin && getPosts(),
    [scrollBegin, keyArray, IdLt, token, isGetMore, isLoadMore],
  );
  ////////////////////////////////////////////
  return (
    <>
      <ReactionIconAnim
        transition="top"
        css={css`
          position: absolute;
          left: 50%;
          transform: translateX(-${pixel(30)});
          top: ${CreatePostAsFloat ? '-30px' : '-70px'};
          z-index: 100;
        `}>
        <ButtonCirculer
          size={pixel(60)}
          activeOpacity={0.8}
          back={isDark ? 'clr1' : 'back1'}
          onPress={() => {
            navigate('createpost', {target: keyArray});
            dispatch(Actions.type('setBackgroundPost', 0));
          }}
          style={{
            shadowColor: colors['clr3'],
            elevation: 10,
            shadowOpacity: 0.1,
            shadowRadius: 0,
          }}>
          <OuterAnyView
            css={css`
              width: auto;
              margin-bottom: ${pixel(20)};
              align-items: flex-end;
            `}>
            <PlusSvg />
          </OuterAnyView>
        </ButtonCirculer>
      </ReactionIconAnim>
      <FlatScroll
        ref={Scroll}
        isDark={isDark}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        data={DATA_RENDER}
        // decelerationRate={"fast"}
        renderItem={OnePostMainMemo}
        // getItemLayout={LayoutItems}
        onMomentumScrollEnd={onScrollBack}
        keyExtractor={keyExtractor}
        onScrollBeginDrag={onScrollBeginDrag}
        onEndReached={onEndReached}
        horizontal={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={RefreshControlMemo}
        ListFooterComponent={ListFooterComponent}
        initialNumToRender={3}
        maxToRenderPerBatch={7}
        windowSize={7}
      />
    </>
  );
};
export default memo(RenderHome);
