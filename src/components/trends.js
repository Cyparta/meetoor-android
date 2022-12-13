import React, { memo } from 'react';
import { useSelector } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import { colors, pixel } from '../styles/basecss';
import { OuterOneView } from './home/helpernotification/heplernotifycss';
import { AnyText, ScrollBar } from './home/helperprefernce';
import { TrendResult } from './search/results';
///////////////////////////////////////////////
const RenderMeetoorTrends = () => {
    const { tabsData } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const trends = useSelector(state => state.posts.trends);
    console.log("RenderMeetoorTrends ~ trends", trends.length);
    ////////////////////////////////////////
    return (<ScrollBar back={colors[isDark ? "clr1" : "back1"]} padd="4px">
        <OuterOneView activeOpacity={1} isRTL={isRTL}
            back={isDark ? "clr3" : "back3"}
            css={css`margin: 0;padding: ${pixel(6)};flex-direction: column;
                margin-bottom: ${pixel(4)};border-radius: ${pixel(8)};`}>
            <OuterOneView activeOpacity={1} isRTL={isRTL}
                css={css`margin: 0;padding: 0px;justify-content: center;
                    background: transparent;`}>
                <AnyText color={isDark ? "back2" : "clr1"} lower>
                    {tabsData.trends}
                </AnyText>
            </OuterOneView>
        </OuterOneView>
        {trends?.length ? trends.map((data, i) => {
            return (<TrendResult key={data.num + data.hastag + i}
                number={data.num} hashtag={data.hastag} addNum={i + 1} />)
        }) : null}
    </ScrollBar>)
}

export default memo(RenderMeetoorTrends);