import React, {
    memo, useCallback,
    useState, useMemo, useEffect
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SharedSvg, CommentSvg } from '../../../../icons/all';
import { HandelNumber } from '../../../../reducer/helper';
import { AnyText } from '../../../home/helperprefernce';
import { ButtonCirculer } from '../../../home/sliderroom/helperroomcss';
import { likeSound } from '../../../../sounds/sound';
import Actions from '../../../../reducer/actions';
import { css } from 'styled-components';
import { colors, pixel, Rgba } from '../../../../styles/basecss';
import {
    ReactSectionBottom,
    OuterPostTop, ReactSectionTop,
    OuterReactBotSection
} from './helperpostcss';
import { GetIconNotice } from '../../../home/helpernotification/converter';
import { ReactionIconAnim } from '../../../../icons/reaction';
import { HeartSvg } from '../../../../icons/reacts';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////////
const OnePostBottom = ({
    comments,
    keyArray,
    postId,
    likes,
    likeType,
    isliked,
    refId,
    clones,
    isUser,
    isCloned,
    openPostView,
    asView,
    isCopy,
    openLikesPostView,
    fromVideo = false,
    clonedUsername
}) => {
    const dispatch = useDispatch();
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const { messages } = useSelector(state => state.sign.langData);
    const mainSocket = useSelector(state => state.main.socket);
    const [like, setLikeType] = useState(likeType);
    const [isLiked, setIsLiked] = useState(isliked);
    const [numLikes, setNumLikes] = useState(likes);
    const [animLikes, setAnimLikes] = useState(null);
    const [animButtonLikes, setAnimButtonLikes] = useState(null);
    ///////////////////////////////////////////////
    const reactLike = useCallback(() => {
        setIsLiked((prev) => {
            let current = null;
            if (prev) {
                setNumLikes(nums => nums - 1);
                setAnimLikes("rubberBand");
                current = false;
            } else {
                setNumLikes(nums => nums + 1);
                setAnimLikes("rubberBand");
                current = true;
                likeSound();
            }
            setLikeType("heart");
            setAnimButtonLikes("rubberBand");
            return current;
        });
        mainSocket.emit("onLike", {
            "postid": postId,
            "likeType": "heart",
            "clonedUsername": clonedUsername
        });
    }, [postId, clonedUsername, likeSound]);
    ///////////////////////////////////////////////
    const setReactLike = useCallback((likeType = "heart") => {
        setLikeType((prevLike) => {
            let currntLike = "";
            if (prevLike === likeType) {
                setIsLiked(false);
                mainSocket.emit("onLike", {
                    "postid": postId,
                    "likeType": likeType,
                    "clonedUsername": clonedUsername
                });
                currntLike = null;
            } else {
                setIsLiked(true);
                mainSocket.emit("onLike", {
                    "postid": postId,
                    "likeType": likeType,
                    "action": true,
                    "clonedUsername": clonedUsername
                });
                currntLike = likeType;
            }
            setAnimButtonLikes("rubberBand");
            return currntLike;
        });
    }, [postId, clonedUsername]);
    ///////////////////////////////////////////////
    useEffect(() => {
        setNumLikes((lastNum) => {
            if (likes === lastNum) return likes;
            else {
                setAnimLikes("rubberBand");
                return likes;
            }
        });
    }, [likes]);
    ///////////////////////////////////////////////
    useEffect(() => {
        setIsLiked((last) => {
            if (isliked === last) return isliked;
            else return isliked;
        });
    }, [isliked]);
    ///////////////////////////////////////////////
    useEffect(() => {
        setLikeType((last) => {
            if (likeType === last) return likeType;
            else return likeType;
        });
    }, [likeType]);
    const forceDark = useMemo(() => fromVideo ? true : isDark, [fromVideo, isDark]);
    ///////////////////////////////////////////////
    return (refId ? null : <>
        <OuterPostTop isRTL={isRTL} isDark={forceDark}
            css={css`border-top-width: ${pixel(fromVideo ? 0 : 1)};
                padding: ${pixel(2)};margin-top: ${pixel(10)};
                border-color: ${Rgba(colors["clr3"], isDark ? 0.85 : 0.075)};
                ${fromVideo ? "border-radius: 0;" : null};`}>
            <ButtonCirculer size={pixel(32)} back={"trans"}
                borderColor="back2" css={css`margin: 0px;border-width: 0;`}
                onPress={reactLike} activeOpacity={0.9}
                delayLongPress={200}
                onLongPress={({ nativeEvent }) => {
                    dispatch(Actions.type("setOpenReacts", {
                        type: true,
                        active: like,
                        position: parseInt(nativeEvent.pageY - moderateScale(70)),
                        onLike: setReactLike
                    }));
                }}>
                {isLiked ? <ReactionIconAnim
                    animation={animButtonLikes}
                    easing="linear"
                    iterationCount={1}
                    duration={750}
                    onAnimationEnd={() => setAnimButtonLikes(null)}>
                    {GetIconNotice(like, moderateScale(27))}
                </ReactionIconAnim> : <HeartSvg color={forceDark ? "back2" : "clr4"} size={moderateScale(24)} />}
            </ButtonCirculer>
            <ReactSectionBottom isRTL={isRTL}
                css={css`height: ${pixel(26)};flex: 1;padding: 0 ${pixel(4)};`}>
                <ReactSectionTop isRTL={isRTL} css={css`width: auto;height: ${pixel(26)};`}
                    activeOpacity={0.9} onPress={openLikesPostView}>
                    <ReactionIconAnim
                        animation={animLikes} easing="linear"
                        iterationCount={1} duration={550}
                        onAnimationEnd={() => setAnimLikes(null)}>
                        <AnyText isRTL={isRTL} size={moderateScale(13)}
                            color={forceDark ? "back2" : "clr2"} lineH={pixel(16)} lower>
                            {HandelNumber(numLikes, 0, true)}
                        </AnyText>
                    </ReactionIconAnim>
                    <AnyText lineH={pixel(16)}>{" "}</AnyText>
                    <AnyText isRTL={isRTL} size={moderateScale(13)}
                        color={forceDark ? "back2" : "clr4"} lineH={pixel(16)} lower>
                        {messages.likeThisPost}
                    </AnyText>
                </ReactSectionTop>
                <OuterReactBotSection isRTL={isRTL} css={css`height: ${pixel(26)};`}>
                    <ReactSectionTop isRTL={isRTL} activeOpacity={0.9}
                        css={css`width: auto;height: ${pixel(26)};margin: 0 ${pixel(10)};`}
                        onPress={() => openPostView({ toComments: true })}>
                        <CommentSvg color={forceDark ? "back2" : "clr4"} size={moderateScale(20)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)}
                            color={forceDark ? "back2" : "clr2"} lineH={pixel(16)} autoMargin={pixel(4)}>
                            {comments}
                        </AnyText>
                    </ReactSectionTop>
                    {fromVideo || !isUser ? null : <ReactSectionTop isRTL={isRTL} activeOpacity={0.9}
                        css={css`width: auto;height: ${pixel(26)};`}
                        onPress={() => dispatch(Actions.
                            type("setCurrentModalWithNav", {
                                key: "postclone",
                                refId: postId,
                                keyArray, isCopy
                            }))}>
                        <SharedSvg color={isDark ? "back2" : "clr4"} active={isCopy} size={moderateScale(19)} />
                        <AnyText isRTL={isRTL} size={moderateScale(13)}
                            color={isDark ? "back2" : "clr2"} lineH={pixel(16)} autoMargin={pixel(4)}>
                            {clones}
                        </AnyText>
                    </ReactSectionTop>}
                </OuterReactBotSection>
            </ReactSectionBottom>
        </OuterPostTop>
    </>);
}
//////////////////////////////////////////////////////
export default memo(OnePostBottom);