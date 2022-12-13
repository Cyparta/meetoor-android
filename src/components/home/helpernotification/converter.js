import React, { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from "../../../reducer/actions";
import { ForFriend, ForTeamLive, ForLive, ForTeam } from './assetnotify';
import {
    AskFriendSvg,
    CommentSvg,
    CopySvg,
    FollowersSvg,
    HighFiveSvg,
    LiveSvg,
    NotifySvg,
    PostSvg,
    ReplySvg,
    SharedSvg,
    ShareSvg,
    TeamsSvg,
} from "../../../icons/all";
import ReactsIcons, { listIcons } from '../../../icons/reacts';
import { AnyText } from '../helperprefernce';
import {
    OuterOneImg, OuterOneType,
    OuterOneContent, OuterOneView,
    OuterOneBadges,
    OuterNameContent
} from './heplernotifycss';
import { RenderAnyUserPhoto } from '../helperhome';
import { moderateScale } from 'react-native-size-matters';
import { colors, pixel } from '../../../styles/basecss';
///////////////////////////////////////////////////
export const GetIconNotice = (likeType, size = 18) => {
    listIcons.findIndex(find => find === likeType) < 0 && (likeType = "heart");
    return ReactsIcons[likeType]({ size });
}
///////////////////////////////////////////////////
const Converter = ({
    userPhoto,
    username,
    fullName,
    target,
    likeType = "heart",
    targetid = "{}",
    userid,
    notifyId,
    type,
    isRead = false,
    time,
    extra
}) => {
    console.log("🚀 ~ file: converter.js ~ line 50 ~ target", target)
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const Time = useSelector(state => state.main.time);
    const lang = useSelector(state => state.sign.lang);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const windowSize = useSelector(state => state.sign.windowSize);
    const { notifyData, badges, messages } = useSelector(state => state.sign.langData);
    //////////////////////////////////////////////
    targetid = useMemo(() => (targetid !== null && typeof targetid === "string" && targetid?.startsWith("{")) ? JSON.parse(targetid) : targetid);
    const makeRead = useCallback(() => {
        if (!isRead) {
            mainSocket.emit("updateNotification", {
                notifyId
            });
            dispatch(Actions.type("setNotification", {
                type: 'update', data: {
                    target: notifyId,
                    key: "notifyId",
                    call: (target) => {
                        target.isRead = true;
                    }
                }
            }));
        }
    }, [isRead, notifyId]);
    //////////////////////////////////////////////
    const splitName = useCallback((name = "") => {
        let nameAndNum = name.toString().split("#and");
        if (nameAndNum.length > 1) {
            return `${nameAndNum[0]} ${messages.and} ${nameAndNum[1]} ${messages.others}`;
        } else return name
    }, [messages]);
    //////////////////////////////////////////////
    const data = useMemo(() => {
        return {
            "scheduled-room": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.scheduled} ({target}) {target ? notifyData.scheduledStart : ""} {targetid?.date}
                </AnyText>,
                icon: <LiveSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "scheduledrooms", props: { id: targetid?.roomid } },
                extra: false
            },
            "mention-post": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.mentionPost}
                </AnyText>,
                icon: <NotifySvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "mention-comment": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.mentionComment}
                </AnyText>,
                icon: <NotifySvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid, gotoComment: targetid?.commentid } },
                extra: false
            },
            "mention-reply": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.mentionReply}
                </AnyText>,
                icon: <NotifySvg forceDark size={moderateScale(16)} />,
                herf: { nav: "commentview", props: { commentid: targetid?.commentid, postId: targetid?.postid } },
                extra: false
            },
            "new-post": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.newPost} {target ? notifyData[target] : ""} {target === "newpost-team" ? ` (${targetid?.team || ""})` : ""}
                </AnyText>,
                icon: <PostSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "clone-post": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.clonePost} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: <CopySvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "cloned-post": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.clonedPost} <AnyText small lower color={"clr2"}>
                        {target ? target : ""}
                    </AnyText>
                </AnyText>,
                icon: <SharedSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "like": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.like} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: GetIconNotice(likeType),
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "cloned-like": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.like} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: GetIconNotice(likeType),
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid } },
                extra: false
            },
            "comment": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.comment} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: <CommentSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "postviewasnew", props: { postId: targetid?.postid, gotoComment: targetid?.commentid } },
                extra: false
            },
            "story-like": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.like} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: GetIconNotice(likeType),
                herf: { nav: "seenerstatus", props: { storyId: targetid?.storyid } },
                extra: false
            },
            "on-follow": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>{notifyData.onFollow}</AnyText>,
                icon: <FollowersSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "profile", props: { username } },
                extra: false
            },
            "team-live": {
                info: <ForTeamLive target={target} notifyId={notifyId} To={""} />,
                icon: <LiveSvg size={moderateScale(16)} />,
                extra: true
            },
            "ask-share": {
                info: <ForLive extra={extra} messMain={notifyData.askshare}
                    To={() => navigate("profile", { username })} />,
                icon: <ShareSvg forceDark size={moderateScale(16)} />,
                extra: true
            },
            "ask-live": {
                info: <ForLive extra={extra} To={() => navigate("profile", { username })}
                    messMain={notifyData.asklive} />,
                icon: <LiveSvg color="red2" size={moderateScale(16)} />,
                extra: true
            },
            "like-comment": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.like} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: GetIconNotice(likeType),
                herf: { nav: "commentview", props: { commentid: targetid?.commentid, postId: targetid?.postid } },
                extra: false
            },
            "reply": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>
                    {notifyData.reply} {target ? notifyData[target] : ""}
                </AnyText>,
                icon: <ReplySvg forceDark size={moderateScale(16)} />,
                herf: { nav: "commentview", props: { commentid: targetid?.commentid, postId: targetid?.postid } },
                extra: false
            },
            "act-friend": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>{notifyData.actfriend}</AnyText>,
                icon: <HighFiveSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "profile", props: { username } },
                extra: false
            },
            "ask-friend": {
                info: <ForFriend userid={userid}
                    To={() => navigate("profile", { username })} />,
                icon: <AskFriendSvg forceDark size={moderateScale(16)} />,
                extra: true
            },
            "ask-team": {
                info: <ForTeam userid={userid} target={target}
                    targetid={targetid}
                    To={() => navigate("profile", { username })} />,
                icon: <AskFriendSvg forceDark size={moderateScale(16)} />,
                extra: true
            },
            "remove-team": {
                info: <AnyText small lower color={isDark ? "back2" : "clr3"}>{notifyData.removeteam}</AnyText>,
                icon: <TeamsSvg forceDark size={moderateScale(16)} />,
                extra: true
            },
            "act-team": {
                info: <>
                    <AnyText small lower color={isDark ? "back2" : "clr3"}>{notifyData.actteam}</AnyText>
                    {target && <AnyText small lower color={isDark ? "back2" : "clr3"}> {target} </AnyText>}
                </>,
                icon: <HighFiveSvg forceDark size={moderateScale(16)} />,
                herf: { nav: "team", props: { teamid: targetid?.teamid } },
                extra: false
            }
        }
    }, [target, username, targetid, userid, likeType, extra]);
    ///////////////////////////////////////////////////////
    const fetch = data[type];
    const localTime = time ? Time.setDate(time, lang) : null;
    ///////////////////////////////////////////////////////
    return (<OuterOneView activeOpacity={0.9} isRTL={isRTL}
        // back={colors[isDark ? "clr1" : "back1"]}
        onPress={() => {
            makeRead();
            fetch?.herf && navigate(fetch.herf.nav, fetch.herf.props);
        }}>
        <OuterOneImg>
            <RenderAnyUserPhoto userPhoto={userPhoto} size={pixel(45)} />
            <OuterOneType isRTL={isRTL}>{fetch?.icon}</OuterOneType>
        </OuterOneImg>
        <OuterOneContent isRTL={isRTL}>
            <OuterNameContent isRTL={isRTL}>
                <AnyText target lower color={isDark ? "back1" : "clr1"}> {splitName(fullName)} </AnyText>
                <AnyText target lower>{" "}</AnyText>
                {localTime && <AnyText target lower color="clr2">{localTime.toNow}</AnyText>}
            </OuterNameContent>
            {fetch?.info}
        </OuterOneContent>
        <OuterOneBadges isRead={isRead} isRTL={isRTL} isDark={isDark}
            width={windowSize.width} transation="left">
            <AnyText target lower color={isDark ? "clr1" : "back1"}>{badges.new}</AnyText>
        </OuterOneBadges>
    </OuterOneView>)
}

export default memo(Converter);