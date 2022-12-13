import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../../reducer/actions';
import { AnyText } from '../../../home/helperprefernce';
import {
    OuterPostTop, OuterReactBotSection,
    ReactSectionBottom, ReactSectionTop
} from '../../posts/post/helperpostcss';
import { ButtonCirculer } from '../../../home/sliderroom/helperroomcss';
import { ReplySvg } from '../../../../icons/all';
import { css } from 'styled-components';
import { ReactionIconAnim } from '../../../../icons/reaction';
import { HeartSvg } from '../../../../icons/reacts';
import { likeSound } from '../../../../sounds/sound';
import { GetIconNotice } from '../../../home/helpernotification/converter';
import { pixel } from '../../../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
import { HandelNumber } from '../../../../reducer/helper';
///////////////////////////////////////////////////
const RenderCommentBottom = ({
    commentid,
    isliked,
    keyArray,
    numReplays,
    numLikes,
    likeType = "heart",
    openLikesCommentView,
    openCommentView
}) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const mainSocket = useSelector(state => state.main.socket);
    const [like, setLikeType] = useState(likeType);
    const [isLiked, setIsLiked] = useState(isliked);
    const [Likes, setNumLikes] = useState(numLikes);
    const [animButtonLikes, setAnimButtonLikes] = useState(null);
    const { messages } = useSelector(state => state.sign.langData);
    ///////////////////////////////////////////////
    const reactLike = useCallback(() => {
        setIsLiked((prev) => {
            let current;
            if (prev) {
                setNumLikes(nums => nums - 1);
                current = false;
            } else {
                setNumLikes(nums => nums + 1);
                current = true;
                likeSound();
            }
            setLikeType("heart");
            setAnimButtonLikes("rubberBand");
            return current;
        });
        mainSocket.emit("onLikeComment", {
            commentid,
            likeType: "heart"
        });
    }, [commentid, likeSound]);
    ///////////////////////////////////////////////
    const setReactLike = useCallback((likeType = "heart") => {
        setLikeType((prevLike) => {
            let currntLike = "";
            if (prevLike === likeType) {
                setIsLiked(false);
                mainSocket.emit("onLikeComment", {
                    commentid,
                    likeType
                });
                currntLike = null;
            } else {
                setIsLiked(true);
                mainSocket.emit("onLikeComment", {
                    commentid,
                    likeType,
                    action: true
                });
                currntLike = likeType;
            }
            setAnimButtonLikes("rubberBand");
            return currntLike;
        });
    }, [commentid]);
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
    ///////////////////////////////////////////////
    useEffect(() => {
        setNumLikes(numLikes);
    }, [numLikes]);
    ///////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL} css={css`border: 0px;padding: 0 ${pixel(20)};`}>
        <ButtonCirculer size={pixel(30)} back={"trans"}
            borderColor="back2" css={css`margin: 0px;border-width: 0;`}
            onPress={reactLike} activeOpacity={0.9}
            delayLongPress={200} onLongPress={({ nativeEvent }) => {
                dispatch(Actions.type("setOpenReacts", {
                    type: true,
                    active: like,
                    position: parseInt(nativeEvent.pageY - moderateScale(60)),
                    onLike: setReactLike
                }));
            }}>
            {isLiked ? <ReactionIconAnim
                animation={animButtonLikes}
                easing="linear"
                iterationCount={1}
                duration={750}
                onAnimationEnd={() => setAnimButtonLikes(null)}>
                {GetIconNotice(like, moderateScale(25))}
            </ReactionIconAnim> : <HeartSvg color={isDark ? "back2" : "clr4"} size={moderateScale(22)} />}
        </ButtonCirculer>
        <ReactSectionBottom isRTL={isRTL} css={css`width: auto;max-width: ${pixel(160)};
            max-height: ${pixel(20)};flex: 1;padding: 0 ${pixel(4)};`}>
            <OuterReactBotSection isRTL={isRTL} css={css`max-height: ${pixel(20)};`}>
                <ReactSectionTop isRTL={isRTL}
                    css={css`width: auto;max-height: ${pixel(20)};`} activeOpacity={0.9}
                    onPress={openLikesCommentView}>
                    <AnyText isRTL={isRTL} size={moderateScale(12)}
                        color={isDark ? "back2" : "clr2"} lineH={pixel(15)} lower>
                        {HandelNumber(Likes, 0, true)}
                    </AnyText>
                    <AnyText lineH={pixel(15)}>{" "}</AnyText>
                    <AnyText isRTL={isRTL} size={moderateScale(12)}
                        color={isDark ? "back2" : "clr4"} lineH={pixel(15)} lower>
                        {messages.likeThisPost}
                    </AnyText>
                </ReactSectionTop>

                <ReactSectionTop isRTL={isRTL} activeOpacity={0.9} onPress={openCommentView}
                    css={css`width: auto;max-height: ${pixel(20)};margin: 0 ${pixel(10)};`}>
                    <ReplySvg color={isDark ? "back2" : "clr4"} size={pixel(15)} />
                    <AnyText isRTL={isRTL} size={moderateScale(12)}
                        color={isDark ? "back2" : "clr2"} lineH={pixel(14)} autoMargin={pixel(4)}>
                        {numReplays}
                    </AnyText>
                </ReactSectionTop>
            </OuterReactBotSection>
        </ReactSectionBottom>
    </OuterPostTop>)
}

export default memo(RenderCommentBottom);