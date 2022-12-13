import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//////////////////////////////////////////////////
let RenderHome = null;
let RenderProfile = null;
let RenderPrefrence = null;
let RenderTabs = null;
let RenderChats = null;
let RenderNotifications = null;
let RenderEditProfile = null;
let RenderSettingsMeetoor = null;
let RenderBalanceMeetoor = null;
let RenderAnonyChats = null;
let RenderPostView = null;
let RenderPostViewAsNew = null;
let RenderCommentView = null;
let RenderMeetoorChatMessage = null;
let RenderMeetoorFollowing = null;
let RenderCreateTeam = null;
let RenderMeetoorFollowers = null;
let RenderEditTeam = null;
let RenderMeetoorTeam = null;
let RenderMeetoorChatTeam = null;
let RenderTeamPosts = null;
let VideoPlayerMain = null;
let CreatePostMeetoor = null;
let RenderMeetoorInvites = null;
let EditPostMeetoor = null;
let WriteAnonyChatMeetoor = null;
let EditCommentMeetoor = null;
let ClonePostMeetoor = null;
let ChatTeamSeenerModal = null;
let CreateStatusEditorMeetoor = null;
let StoryViewerMeetoor = null;
let StorySeenerMeetoor = null;
let CameraRollMeetoor = null;
let PostLikesView = null;
let CommentLikesView = null;
let RenderSearchMeetoor = null;
let RenderMeetoorTrends = null;
let RenderMeetoorTrend = null;
let RenderSavedPosts = null;
let RenderMeetoorFriends = null;
let RenderMeetoorBans = null;
let RenderMeetoorFriendsRequest = null;
let RenderMeetoorFriendsReceived = null;
let RenderMeetoorSuggestsFriend = null;
let RenderOneTeamSuggest = null;
let RenderMeetoorTeamsRequest = null;
let RenderMeetoorTeamsReceived = null;
let RenderMeetoorMyTeams = null;
let RenderMeetoorTeamsInside = null;
let RenderMeetoorVideos = null;
let MoneyPrizesMeetoor = null;
let StoryOneViewer = null;
// let StoryReplyModal = null;
let HelpAndLearn = null;
//////////////////////////////////////////////////HelpAndLearnMeetoor
const Stack = createNativeStackNavigator();
class HomeNavigation extends React.PureComponent {
  StackScreenHome = () => {
    if (RenderHome === null) {
      RenderHome = require('./components/home/home').default;
    }
    return <RenderHome />;
  };
  // StoryReplyRender = ({ route: { params } }) => {
  //     if (StoryReplyModal === null) {
  //         StoryReplyModal = require('./components/story/storyreply').default;
  //     }
  //     return (<StoryReplyModal {...params} />)
  // }
  HelpAndLearnMeetoor = ({route: {params}}) => {
    if (HelpAndLearn === null) {
      HelpAndLearn = require('./components/helplearn').default;
    }
    return <HelpAndLearn {...params} />;
  };
  StoryOneViewerRender = ({route: {params}}) => {
    if (StoryOneViewer === null) {
      StoryOneViewer = require('./components/story/view').default;
    }
    return <StoryOneViewer {...params} />;
  };
  StackScreenProfile = ({route: {params}}) => {
    if (RenderProfile === null) {
      RenderProfile = require('./components/profile/profile').default;
    }
    return <RenderProfile {...params} />;
  };
  StackScreenPrefrence = ({route: {params}}) => {
    if (RenderPrefrence === null) {
      RenderPrefrence = require('./components/home/prefernce').default;
    }
    return <RenderPrefrence {...params} />;
  };
  StackScreenTabs = ({route: {params}}) => {
    if (RenderTabs === null) {
      RenderTabs = require('./components/home/tabs').default;
    }
    return <RenderTabs {...params} />;
  };
  StackScreenRenderChats = ({route: {params}}) => {
    if (RenderChats === null) {
      RenderChats = require('./components/home/chats').default;
    }
    return <RenderChats {...params} />;
  };
  StackScreenNotifications = ({route: {params}}) => {
    if (RenderNotifications === null) {
      RenderNotifications = require('./components/home/notifications').default;
    }
    return <RenderNotifications {...params} />;
  };
  StackScreenEditProfile = ({route: {params}}) => {
    if (RenderEditProfile === null) {
      RenderEditProfile =
        require('./components/profile/editprofile/editor').default;
    }
    return <RenderEditProfile {...params} />;
  };
  StackScreenSettingsMeetoor = ({route: {params}}) => {
    if (RenderSettingsMeetoor === null) {
      RenderSettingsMeetoor = require('./components/settings/setting').default;
    }
    return <RenderSettingsMeetoor {...params} />;
  };
  StackScreenBalanceMeetoor = ({route: {params}}) => {
    if (RenderBalanceMeetoor === null) {
      RenderBalanceMeetoor = require('./components/balance').default;
    }
    return <RenderBalanceMeetoor {...params} />;
  };
  StackScreenMoneyPrizes = ({route: {params}}) => {
    if (MoneyPrizesMeetoor === null) {
      MoneyPrizesMeetoor =
        require('./components/money-prizes/money-prizes').default;
    }
    return <MoneyPrizesMeetoor {...params} />;
  };
  StackScreenRenderAnonyChats = ({route: {params}}) => {
    if (RenderAnonyChats === null) {
      RenderAnonyChats = require('./components/home/anonychats').default;
    }
    return <RenderAnonyChats {...params} />;
  };
  StackScreenRenderPostView = ({route: {params}}) => {
    if (RenderPostView === null) {
      RenderPostView = require('./components/posts/postview/postview').default;
    }
    return <RenderPostView {...params} />;
  };
  StackScreenRenderPostViewAsNew = ({route: {params}}) => {
    if (RenderPostViewAsNew === null) {
      RenderPostViewAsNew =
        require('./components/posts/postview/postviewasnew').default;
    }
    return <RenderPostViewAsNew {...params} />;
  };
  StackScreenRenderCommentView = ({route: {params}}) => {
    if (RenderCommentView === null) {
      RenderCommentView =
        require('./components/posts/commentview/commentview').default;
    }
    return <RenderCommentView {...params} />;
  };
  StackScreenChatMessage = ({route: {params}}) => {
    if (RenderMeetoorChatMessage === null) {
      RenderMeetoorChatMessage =
        require('./components/chatmessage/chat').default;
    }
    return <RenderMeetoorChatMessage {...params} />;
  };
  StackScreenFollowers = ({route: {params}}) => {
    if (RenderMeetoorFollowers === null) {
      RenderMeetoorFollowers = require('./components/followers').default;
    }
    return <RenderMeetoorFollowers {...params} />;
  };
  StackScreenFollowing = ({route: {params}}) => {
    if (RenderMeetoorFollowing === null) {
      RenderMeetoorFollowing = require('./components/following').default;
    }
    return <RenderMeetoorFollowing {...params} />;
  };
  StackScreenCreateTeam = ({route: {params}}) => {
    if (RenderCreateTeam === null) {
      RenderCreateTeam = require('./components/team/createteam/create').default;
    }
    return <RenderCreateTeam {...params} />;
  };
  StackScreenEditTeam = ({route: {params}}) => {
    if (RenderEditTeam === null) {
      RenderEditTeam = require('./components/team/createteam/edit').default;
    }
    return <RenderEditTeam {...params} />;
  };
  StackScreenTeam = ({route: {params}}) => {
    if (RenderMeetoorTeam === null) {
      RenderMeetoorTeam = require('./components/team/team').default;
    }
    return <RenderMeetoorTeam {...params} />;
  };
  StackScreenChatTeam = ({route: {params}}) => {
    if (RenderMeetoorChatTeam === null) {
      RenderMeetoorChatTeam = require('./components/chatteam/chat').default;
    }
    return <RenderMeetoorChatTeam {...params} />;
  };
  StackScreenTeamPosts = ({route: {params}}) => {
    if (RenderTeamPosts === null) {
      RenderTeamPosts = require('./components/teamposts').default;
    }
    return <RenderTeamPosts {...params} />;
  };
  StackScreenVideoPlayerMain = ({route: {params}}) => {
    if (VideoPlayerMain === null) {
      VideoPlayerMain = require('./main/video/mainplayer').default;
    }
    return <VideoPlayerMain {...params} pausedPlayer={false} />;
  };
  StackScreenCreatePostMeetoor = ({route: {params}}) => {
    if (CreatePostMeetoor === null) {
      CreatePostMeetoor =
        require('./components/posts/createpost/createpost').default;
    }
    return <CreatePostMeetoor {...params} />;
  };
  StackScreenMeetoorInvites = ({route: {params}}) => {
    if (RenderMeetoorInvites === null) {
      RenderMeetoorInvites = require('./components/inviteuserto').default;
    }
    return <RenderMeetoorInvites {...params} />;
  };
  StackScreenEditPostMeetoor = ({route: {params}}) => {
    if (EditPostMeetoor === null) {
      EditPostMeetoor =
        require('./components/posts/createpost/editpost').default;
    }
    return <EditPostMeetoor {...params} />;
  };
  StackScreenWriteAnonyChatMeetoor = ({route: {params}}) => {
    if (WriteAnonyChatMeetoor === null) {
      WriteAnonyChatMeetoor =
        require('./components/posts/createpost/writeanonychat').default;
    }
    return <WriteAnonyChatMeetoor {...params} />;
  };
  StackScreenEditCommentMeetoor = ({route: {params}}) => {
    if (EditCommentMeetoor === null) {
      EditCommentMeetoor =
        require('./components/posts/createpost/editcomment').default;
    }
    return <EditCommentMeetoor {...params} />;
  };
  StackScreenClonePostMeetoor = ({route: {params}}) => {
    if (ClonePostMeetoor === null) {
      ClonePostMeetoor =
        require('./components/posts/createpost/clonedpost').default;
    }
    return <ClonePostMeetoor {...params} />;
  };
  StackScreenChatTeamSeenerModal = ({route: {params}}) => {
    if (ChatTeamSeenerModal === null) {
      ChatTeamSeenerModal =
        require('./components/chatteam/seenerchatview').default;
    }
    return <ChatTeamSeenerModal {...params} />;
  };
  StackScreenCreateStatusEditor = ({route: {params}}) => {
    if (CreateStatusEditorMeetoor === null) {
      CreateStatusEditorMeetoor =
        require('./components/home/createstatus/createstatus').default;
    }
    return <CreateStatusEditorMeetoor {...params} />;
  };
  StackScreenStoryViewerMeetoor = ({route: {params}}) => {
    if (StoryViewerMeetoor === null) {
      StoryViewerMeetoor = require('./components/story/story').default;
    }
    return <StoryViewerMeetoor {...params} />;
  };
  StackScreenStorySeenerMeetoor = ({route: {params}}) => {
    if (StorySeenerMeetoor === null) {
      StorySeenerMeetoor =
        require('./components/home/sliderstatus/statusseener').default;
    }
    return <StorySeenerMeetoor {...params} />;
  };
  StackScreenCameraRollMeetoor = ({route: {params}}) => {
    if (CameraRollMeetoor === null) {
      CameraRollMeetoor = require('./main/camerarollmeetoor').default;
    }
    return <CameraRollMeetoor {...params} />;
  };
  StackScreenPostLikesView = ({route: {params}}) => {
    if (PostLikesView === null) {
      PostLikesView = require('./components/likes/postlikes').default;
    }
    return <PostLikesView {...params} />;
  };
  StackScreenCommentLikesView = ({route: {params}}) => {
    if (CommentLikesView === null) {
      CommentLikesView = require('./components/likes/commentlikes').default;
    }
    return <CommentLikesView {...params} />;
  };
  StackScreenSearchMeetoor = ({route: {params}}) => {
    if (RenderSearchMeetoor === null) {
      RenderSearchMeetoor = require('./components/search/search').default;
    }
    return <RenderSearchMeetoor {...params} />;
  };
  StackScreenTrends = ({route: {params}}) => {
    if (RenderMeetoorTrends === null) {
      RenderMeetoorTrends = require('./components/trends').default;
    }
    return <RenderMeetoorTrends {...params} />;
  };
  StackScreenTrend = ({route: {params}}) => {
    if (RenderMeetoorTrend === null) {
      RenderMeetoorTrend = require('./components/trend').default;
    }
    return <RenderMeetoorTrend {...params} />;
  };
  StackScreenSavedPosts = ({route: {params}}) => {
    if (RenderSavedPosts === null) {
      RenderSavedPosts = require('./components/savedposts').default;
    }
    return <RenderSavedPosts {...params} />;
  };
  StackScreenMeetoorFriends = ({route: {params}}) => {
    if (RenderMeetoorFriends === null) {
      RenderMeetoorFriends = require('./components/friends').default;
    }
    return <RenderMeetoorFriends {...params} />;
  };
  StackScreenMeetoorBans = ({route: {params}}) => {
    if (RenderMeetoorBans === null) {
      RenderMeetoorBans = require('./components/bans').default;
    }
    return <RenderMeetoorBans {...params} />;
  };
  StackScreenFriendsRequest = ({route: {params}}) => {
    if (RenderMeetoorFriendsRequest === null) {
      RenderMeetoorFriendsRequest =
        require('./components/friendsrequest').default;
    }
    return <RenderMeetoorFriendsRequest {...params} />;
  };
  StackScreenFriendsReceived = ({route: {params}}) => {
    if (RenderMeetoorFriendsReceived === null) {
      RenderMeetoorFriendsReceived =
        require('./components/friendsreceived').default;
    }
    return <RenderMeetoorFriendsReceived {...params} />;
  };
  StackScreenSuggestsFriend = ({route: {params}}) => {
    if (RenderMeetoorSuggestsFriend === null) {
      RenderMeetoorSuggestsFriend =
        require('./components/friendssuggest').default;
    }
    return <RenderMeetoorSuggestsFriend {...params} />;
  };
  StackScreenOneTeamSuggest = ({route: {params}}) => {
    if (RenderOneTeamSuggest === null) {
      RenderOneTeamSuggest = require('./components/teamssuggest').default;
    }
    return <RenderOneTeamSuggest {...params} />;
  };
  StackScreenTeamsRequest = ({route: {params}}) => {
    if (RenderMeetoorTeamsRequest === null) {
      RenderMeetoorTeamsRequest = require('./components/teamsrequest').default;
    }
    return <RenderMeetoorTeamsRequest {...params} />;
  };
  StackScreenTeamsReceived = ({route: {params}}) => {
    if (RenderMeetoorTeamsReceived === null) {
      RenderMeetoorTeamsReceived =
        require('./components/teamsreceived').default;
    }
    return <RenderMeetoorTeamsReceived {...params} />;
  };
  StackScreenMyTeams = ({route: {params}}) => {
    if (RenderMeetoorMyTeams === null) {
      RenderMeetoorMyTeams = require('./components/myteams').default;
    }
    return <RenderMeetoorMyTeams {...params} />;
  };
  StackScreenTeamsInside = ({route: {params}}) => {
    if (RenderMeetoorTeamsInside === null) {
      RenderMeetoorTeamsInside = require('./components/teamsinside').default;
    }
    return <RenderMeetoorTeamsInside {...params} />;
  };
  StackScreenVideos = ({route: {params}}) => {
    if (RenderMeetoorVideos === null) {
      RenderMeetoorVideos = require('./components/videos/videos').default;
    }
    return <RenderMeetoorVideos {...params} />;
  };
  ///////////////////////////////////////////////
  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="home">{this.StackScreenHome}</Stack.Screen>
        <Stack.Screen name="profile">{this.StackScreenProfile}</Stack.Screen>
        <Stack.Screen name="story">{this.StoryOneViewerRender}</Stack.Screen>
        <Stack.Screen name="prefernce">
          {this.StackScreenPrefrence}
        </Stack.Screen>
        <Stack.Screen name="tabsmenu">{this.StackScreenTabs}</Stack.Screen>
        <Stack.Screen name="help-learn">
          {this.HelpAndLearnMeetoor}
        </Stack.Screen>
        <Stack.Screen name="chats">{this.StackScreenRenderChats}</Stack.Screen>
        <Stack.Screen name="notifications">
          {this.StackScreenNotifications}
        </Stack.Screen>
        <Stack.Screen name="editprofile">
          {this.StackScreenEditProfile}
        </Stack.Screen>
        <Stack.Screen name="settings">
          {this.StackScreenSettingsMeetoor}
        </Stack.Screen>
        <Stack.Screen name="balance">
          {this.StackScreenBalanceMeetoor}
        </Stack.Screen>
        <Stack.Screen name="money-prizes">
          {this.StackScreenMoneyPrizes}
        </Stack.Screen>
        <Stack.Screen name="anonychats">
          {this.StackScreenRenderAnonyChats}
        </Stack.Screen>
        <Stack.Screen name="postview">
          {this.StackScreenRenderPostView}
        </Stack.Screen>
        <Stack.Screen name="postviewasnew">
          {this.StackScreenRenderPostViewAsNew}
        </Stack.Screen>
        <Stack.Screen name="commentview">
          {this.StackScreenRenderCommentView}
        </Stack.Screen>
        <Stack.Screen name="chat">{this.StackScreenChatMessage}</Stack.Screen>
        <Stack.Screen name="followers">
          {this.StackScreenFollowers}
        </Stack.Screen>
        <Stack.Screen name="following">
          {this.StackScreenFollowing}
        </Stack.Screen>
        <Stack.Screen name="createteam">
          {this.StackScreenCreateTeam}
        </Stack.Screen>
        <Stack.Screen name="editteam">{this.StackScreenEditTeam}</Stack.Screen>
        <Stack.Screen name="team">{this.StackScreenTeam}</Stack.Screen>
        <Stack.Screen name="teamchat">{this.StackScreenChatTeam}</Stack.Screen>
        <Stack.Screen name="teamposts">
          {this.StackScreenTeamPosts}
        </Stack.Screen>
        <Stack.Screen name="video">
          {this.StackScreenVideoPlayerMain}
        </Stack.Screen>
        <Stack.Screen name="createpost">
          {this.StackScreenCreatePostMeetoor}
        </Stack.Screen>
        <Stack.Screen name="inviteuserto">
          {this.StackScreenMeetoorInvites}
        </Stack.Screen>
        <Stack.Screen name="editpost">
          {this.StackScreenEditPostMeetoor}
        </Stack.Screen>
        <Stack.Screen name="writeanonychat">
          {this.StackScreenWriteAnonyChatMeetoor}
        </Stack.Screen>
        <Stack.Screen name="editcomment">
          {this.StackScreenEditCommentMeetoor}
        </Stack.Screen>
        <Stack.Screen name="clonepost">
          {this.StackScreenClonePostMeetoor}
        </Stack.Screen>
        <Stack.Screen name="chatteamseener">
          {this.StackScreenChatTeamSeenerModal}
        </Stack.Screen>
        <Stack.Screen name="createstatus">
          {this.StackScreenCreateStatusEditor}
        </Stack.Screen>
        <Stack.Screen name="viewstatus">
          {this.StackScreenStoryViewerMeetoor}
        </Stack.Screen>
        <Stack.Screen name="seenerstatus">
          {this.StackScreenStorySeenerMeetoor}
        </Stack.Screen>
        <Stack.Screen name="cameraroll">
          {this.StackScreenCameraRollMeetoor}
        </Stack.Screen>
        <Stack.Screen name="postlikes">
          {this.StackScreenPostLikesView}
        </Stack.Screen>
        <Stack.Screen name="commentlikes">
          {this.StackScreenCommentLikesView}
        </Stack.Screen>
        <Stack.Screen name="search">
          {this.StackScreenSearchMeetoor}
        </Stack.Screen>
        <Stack.Screen name="trends">{this.StackScreenTrends}</Stack.Screen>
        <Stack.Screen name="trend">{this.StackScreenTrend}</Stack.Screen>
        <Stack.Screen name="savedposts">
          {this.StackScreenSavedPosts}
        </Stack.Screen>
        <Stack.Screen name="friends">
          {this.StackScreenMeetoorFriends}
        </Stack.Screen>
        <Stack.Screen name="bans">{this.StackScreenMeetoorBans}</Stack.Screen>
        <Stack.Screen name="friendsrequest">
          {this.StackScreenFriendsRequest}
        </Stack.Screen>
        <Stack.Screen name="friendsreceived">
          {this.StackScreenFriendsReceived}
        </Stack.Screen>
        <Stack.Screen name="friendssuggest">
          {this.StackScreenSuggestsFriend}
        </Stack.Screen>
        <Stack.Screen name="teamssuggest">
          {this.StackScreenOneTeamSuggest}
        </Stack.Screen>
        <Stack.Screen name="teamsrequest">
          {this.StackScreenTeamsRequest}
        </Stack.Screen>
        <Stack.Screen name="teamsreceived">
          {this.StackScreenTeamsReceived}
        </Stack.Screen>
        <Stack.Screen name="myteams">{this.StackScreenMyTeams}</Stack.Screen>
        <Stack.Screen name="teamsinside">
          {this.StackScreenTeamsInside}
        </Stack.Screen>
        <Stack.Screen name="videos">{this.StackScreenVideos}</Stack.Screen>
      </Stack.Navigator>
    );
  }
}

export default HomeNavigation;
