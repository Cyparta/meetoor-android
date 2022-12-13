import React, {memo, useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import styled, {css} from 'styled-components';
import {
  BlockSvg,
  InboxSvg,
  ProfileSvg,
  RequestSvg,
  RoomsSvg,
  SavedSvg,
  SuggestSvg,
  CamSvg,
  TeamsSvg,
  TrendSvg,
  SearchSvg,
  FriendsSvg,
} from '../../icons/all';
import RenderPrayer from './prayer';
import RenderTrends from './trends';
import {colors, Rgba, flexDisplay, font, pixel} from '../../styles/basecss';
import {RefreshControl} from 'react-native';
import {OuterOneView} from './helpernotification/heplernotifycss';
import {AnyText, ScrollBar} from './helperprefernce';
import {moderateScale} from 'react-native-size-matters';
//////////////////////////////////////////////////
const OuterTabsAll = styled.View`
  width: 100%;
  height: auto;
`;
//////////////////////////////////////////////////
const OuterSharedCss = css`
  width: 100%;
  height: auto;
  ${props =>
    flexDisplay({
      justify: 'flex-start',
      dir: props.isRTL ? 'row-reverse' : 'row',
    })};
  overflow: hidden;
  position: relative;
  padding: 0 ${pixel(8)};
  margin-bottom: ${props => pixel(props.trends ? 0 : 1)};
  background: ${props =>
    colors[props.back ? props.back : props.isDark ? 'clr1' : 'back1']};
  ${props => {
    let style = '';
    if (props.trends || props.nested)
      style += `
            padding: ${pixel(4)} ${pixel(16)};
            background: ${Rgba(colors[props.isDark ? 'clr3' : 'back3'], 0.75)};
        `;
    if (props.column)
      style += `
            flex-direction: column;
            align-items: ${props.isRTL ? 'flex-end' : 'flex-start'}
        `;
    if (props.nested)
      style += `
            padding: 0px ${pixel(16)};
        `;
    return style;
  }}
`;
export const OuterTabs = styled.TouchableOpacity`
  ${OuterSharedCss}
`;
const OuterTabsWithoutAction = styled.View`
  ${OuterSharedCss}
`;
/////////////////////////////////////////////////
export const TabText = styled.Text`
  width: auto;
  height: auto;
  position: relative;
  padding: ${pixel(8)};
  ${() => flexDisplay({justify: 'flex-start'})};
  ${props => font({size: pixel(14), line: pixel(25), isAr: props.isRTL})};
  text-transform: uppercase;
  color: ${props => colors[props.isDark ? 'back2' : 'clr3']};
  ${props => {
    let style = ``;
    if (props.trends)
      style += `
            font-size: ${pixel(12)};
            padding: ${pixel(1)} ${pixel(4)};
            line-height: ${pixel(16)};
            color: ${colors['clr2']};
        `;
    if (props.numberIn)
      style += `
            font-size: ${pixel(12)};
            padding: ${pixel(1)} ${pixel(4)};
            line-height: ${pixel(16)};
            color: ${Rgba(colors[props.isDark ? 'back2' : 'clr3'], 0.5)};
        `;
    if (props.nested)
      style += `
            color: ${colors['clr2']};
            line-height: ${pixel(21)};
        `;
    return style;
  }}
`;
/////////////////////////////////////////////////////
const RenderTabs = () => {
  const {navigate} = useSelector(state => state.modal.navigation);
  const isRTL = useSelector(state => state.sign.isRTL);
  const isDark = useSelector(state => state.sign.isDark);
  const settingsMeetoor = useSelector(state => state.profile.settings);
  const {tabsData, badges, placeholder} = useSelector(
    state => state.sign.langData,
  );
  const User = useSelector(state => state.main.user);
  ////////////////////////////////////////////
  const GoToProfile = useCallback(
    () => navigate('profile', {username: User.username}),
    [User],
  );
  ////////////////////////////////////////////
  const [refreshing, setRefreshing] = useState(false);
  /////////////////////////////////////////////
  return (
    <ScrollBar
      isDark={isDark}
      refreshControl={
        <RefreshControl
          colors={[colors['clr2']]}
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }>
      {settingsMeetoor?.isPrayer ? <RenderPrayer /> : null}

      <OuterTabs isRTL={isRTL} isDark={isDark} activeOpacity={1}>
        <OuterOneView
          activeOpacity={1}
          isRTL={isRTL}
          css={css`
            justify-content: center;
            margin: ${pixel(8)} 0;
            padding: 0px;
          `}>
          <OuterOneView
            activeOpacity={0.8}
            isRTL={isRTL}
            back={isDark ? 'clr3' : 'back3'}
            onPress={() => navigate('search')}
            css={css`
              margin: 0;
              padding: ${pixel(8)};
              border-radius: ${pixel(30)};
            `}>
            <SearchSvg size={moderateScale(19)} />
            <AnyText
              lower
              isRTL={isRTL}
              size={moderateScale(13.5)}
              autoMargin={pixel(8)}
              color={isDark ? 'back2' : 'clr3'}>
              {placeholder.search}
            </AnyText>
          </OuterOneView>
        </OuterOneView>
      </OuterTabs>
      <OuterTabsAll isDark={isDark}>
        <OuterTabs
          isRTL={isRTL}
          activeOpacity={0.9}
          isDark={isDark}
          onPress={() => navigate('trends')}>
          <TrendSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.trends}
          </TabText>
        </OuterTabs>
        <RenderTrends
          short
          refreshing={refreshing}
          setRefreshing={setRefreshing}
        />
      </OuterTabsAll>
      {/*  */}
      <OuterTabs
        isRTL={isRTL}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={GoToProfile}>
        <ProfileSvg size={moderateScale(19)} />
        <TabText isDark={isDark} isRTL={isRTL}>
          {tabsData.profile}
        </TabText>
      </OuterTabs>
      <OuterTabs
        isRTL={isRTL}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={() => navigate('friends', {username: User.username})}>
        <FriendsSvg size={moderateScale(19)} />
        <TabText isDark={isDark} isRTL={isRTL}>
          {tabsData.friends}
        </TabText>
      </OuterTabs>
      <OuterTabs
        isRTL={isRTL}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={() => navigate('videos')}>
        <CamSvg size={moderateScale(19)} />
        <TabText isDark={isDark} isRTL={isRTL}>
          {tabsData.videos}
        </TabText>
      </OuterTabs>
      <OuterTabs
        isRTL={isRTL}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={() => navigate('savedposts')}>
        <SavedSvg size={moderateScale(19)} />
        <TabText isDark={isDark} isRTL={isRTL}>
          {tabsData.savedPosts}
        </TabText>
      </OuterTabs>

      <OuterTabs
        isRTL={isRTL}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={() => navigate('bans')}>
        <BlockSvg size={moderateScale(19)} />
        <TabText isDark={isDark} isRTL={isRTL}>
          {tabsData.bans}
        </TabText>
      </OuterTabs>
      {/*  */}
      <OuterTabsAll isDark={isDark}>
        <OuterTabsWithoutAction isRTL={isRTL} isDark={isDark}>
          <RoomsSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.rooms}
          </TabText>
        </OuterTabsWithoutAction>
        <OuterTabs isRTL={isRTL} isDark={isDark} nested activeOpacity={0.9}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.createRoom}
          </TabText>
        </OuterTabs>
        <OuterTabs isRTL={isRTL} isDark={isDark} nested activeOpacity={0.9}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.scheduledRoom}
          </TabText>
        </OuterTabs>
        <OuterTabs isRTL={isRTL} isDark={isDark} nested activeOpacity={0.9}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.currentRoom}
          </TabText>
        </OuterTabs>
        <OuterTabs isRTL={isRTL} isDark={isDark} nested activeOpacity={0.9}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.scheduledRooms}
          </TabText>
        </OuterTabs>
      </OuterTabsAll>
      {/*  */}
      <OuterTabsAll isDark={isDark}>
        <OuterTabsWithoutAction isDark={isDark} isRTL={isRTL}>
          <TeamsSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.teams}
          </TabText>
        </OuterTabsWithoutAction>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          activeOpacity={0.9}
          nested
          onPress={() => navigate('createteam')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.createTeam}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('myteams')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.myTeams}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('teamsinside')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.joinTeams}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('teamssuggest')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.teamSuggest}
          </TabText>
        </OuterTabs>
      </OuterTabsAll>
      {/*  */}
      <OuterTabsAll isDark={isDark}>
        <OuterTabsWithoutAction isDark={isDark} isRTL={isRTL}>
          <SuggestSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.suggestions}
          </TabText>
        </OuterTabsWithoutAction>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() =>
            navigate('friendssuggest', {apiType: 'suggestFollow/'})
          }>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.friendSuggest}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('friendssuggest', {apiType: 'myContacts/'})}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {badges.yourContacts}
          </TabText>
        </OuterTabs>
      </OuterTabsAll>
      {/*  */}
      <OuterTabsAll isDark={isDark}>
        <OuterTabsWithoutAction isDark={isDark} isRTL={isRTL}>
          <InboxSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.received}
          </TabText>
        </OuterTabsWithoutAction>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('friendsreceived')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.friendRequest}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('teamsreceived')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.teamRequest}
          </TabText>
        </OuterTabs>
      </OuterTabsAll>
      {/*  */}
      <OuterTabsAll isDark={isDark}>
        <OuterTabsWithoutAction isDark={isDark} isRTL={isRTL}>
          <RequestSvg size={moderateScale(19)} />
          <TabText isDark={isDark} isRTL={isRTL}>
            {tabsData.pending}
          </TabText>
        </OuterTabsWithoutAction>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('friendsrequest')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.friendRequest}
          </TabText>
        </OuterTabs>
        <OuterTabs
          isDark={isDark}
          isRTL={isRTL}
          nested
          activeOpacity={0.9}
          onPress={() => navigate('teamsrequest')}>
          <TabText isDark={isDark} isRTL={isRTL} nested>
            {tabsData.teamRequest}
          </TabText>
        </OuterTabs>
      </OuterTabsAll>
    </ScrollBar>
  );
};

export default memo(RenderTabs);
