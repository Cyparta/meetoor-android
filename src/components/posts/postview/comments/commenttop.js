import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../../reducer/actions';
import { colors, pixel } from '../../../../styles/basecss';
import { UIActivityIndicator } from 'react-native-indicators';
import { AnyText, OuterUserName } from '../../../home/helperprefernce';
import {
    InnerPadgesPost, OnePadgePost,
    OuterPadgesPost, OuterPostTop
} from '../../posts/post/helperpostcss';
import RenderCommentBody from './commentbody';
import { ButtonCirculer, UserInfoModalTouch, ViewOuterCirculer } from '../../../home/sliderroom/helperroomcss';
import { RenderAnyUserPhoto, OuterLazy } from '../../../home/helperhome';
import { EditPenSvg, MoreSvg, SecureSvg, StarSvg } from '../../../../icons/all';
import { OuterNameContent } from '../../../home/helpernotification/heplernotifycss';
import { css } from 'styled-components';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderCommentTop = ({
    username,
    userPhoto,
    fullName,
    commentid,
    date,
    postId,
    keyArray,
    commentText,
    isOwner,
    isSecure = false,
    isEdit,
    isMyPost,
    isMe,
    commentFile,
    stillSend = false
}) => {
    const dispatch = useDispatch();
    const lang = useSelector(state => state.sign.lang);
    const isDark = useSelector(state => state.sign.isDark);
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    const Time = useSelector(state => state.main.time);
    const localTime = Time.setDate(date, lang);
    ///////////////////////////////////////////////
    const GoToProfile = useCallback(() => {
        navigate("profile", { username });
    }, [navigate, username]);
    ///////////////////////////////////////////////
    return (<OuterPostTop isRTL={isRTL} css={css`border: 0px;width: 100%;margin-top: ${pixel(10)};`}>
        <UserInfoModalTouch isRTL={isRTL} onPress={GoToProfile}
            activeOpacity={0.8} css={css`width: auto;align-items:flex-start;`}>
            <OuterLazy css={css`width: auto;overflow: visible;`} height="auto">
                <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(35)}
                    renderBadge={isSecure ? <ViewOuterCirculer size={pixel(20)} back="clr1"
                        css={css`position: absolute;left: ${pixel(0)};bottom: ${pixel(-5)};`}>
                        {(isOwner) ?
                            <StarSvg color="back3" size={moderateScale(12)} /> :
                            <SecureSvg color="back3" size={moderateScale(12)} />}
                    </ViewOuterCirculer> : null} />
            </OuterLazy>
            <OuterUserName isRTL={isRTL} css={css`padding: 0 ${pixel(8)};`}>
                <OuterNameContent isRTL={isRTL}>
                    <AnyText isRTL={isRTL} size={moderateScale(12)} lower
                        color={isDark ? "back3" : "clr1"} lineH={pixel(15)}>{fullName}</AnyText>
                    <AnyText isRTL={isRTL} size={moderateScale(9)}
                        color="clr2" lineH={pixel(10)} lower>
                        {" - "}
                    </AnyText>
                    <AnyText isRTL={isRTL} size={moderateScale(9)}
                        color="clr2" lineH={pixel(10)} lower>
                        {localTime.ago}
                    </AnyText>
                </OuterNameContent>
                <OuterNameContent isRTL={isRTL}>
                    <RenderCommentBody
                        commentFile={commentFile}
                        isOwner={isOwner}
                        isSecure={isSecure}
                        userPhoto={userPhoto}
                        fullName={fullName}
                        commentText={commentText} />
                    <OuterPadgesPost css={css`bottom: ${pixel(-8)};`}>
                        <InnerPadgesPost>
                            {stillSend ? <OnePadgePost>
                                <UIActivityIndicator color={colors["back3"]}
                                    size={moderateScale(13)} />
                            </OnePadgePost> : null}
                            {isEdit ? <OnePadgePost>
                                <EditPenSvg color="back3" size={moderateScale(13)} />
                            </OnePadgePost> : null}
                        </InnerPadgesPost>
                    </OuterPadgesPost>
                </OuterNameContent>
            </OuterUserName>
        </UserInfoModalTouch>
        <ButtonCirculer isRTL={isRTL} size={pixel(20)} activeOpacity={0.8}
            onPress={() => dispatch(Actions.
                type("setCurrentModalWithNav", {
                    key: "commentmore", isMe, commentText,
                    keyArray, commentid, isMyPost, postId
                }))}
            css={css`flex: 1;background: transparent;border-width: 0px;margin: 0px;`}>
            <MoreSvg size={moderateScale(13)} rot={90} />
        </ButtonCirculer>
    </OuterPostTop>)
}

export default memo(RenderCommentTop);