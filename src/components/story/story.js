import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OneStoryMeetoor from "./onestory";
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { FlatScroll } from '../home/helperprefernce';
import { moderateScale } from 'react-native-size-matters';
import { WaveIndicator } from 'react-native-indicators';
import { OuterLazy } from '../home/helperhome';
import { View } from 'react-native';
import { AvoidSoftInput } from "react-native-avoid-softinput";
////////////////////////////////////////////
const StoryViewerMeetoor = ({ activeIdx }) => {
    const dispatch = useDispatch();
    ////////////////////////////////////////
    const story = useSelector(state => state.main.myStory);
    const currentStories = useSelector(state => state.main.currentStories);
    ////////////////////////////////////////
    const [activeStory, setActiveStory] = useState(activeIdx === -1 ? 0 : story ? activeIdx + 1 : activeIdx);
    const [layout, setLayout] = useState({ height: 0, width: 0 });
    ////////////////////////////////////////
    const Scroll = useRef(null);
    const indexRef = useRef(activeStory);
    indexRef.current = activeStory;
    const DATA_RENDER = (story ? [story, ...currentStories] : currentStories)
    ////////////////////////////////////////
    useEffect(() => {
        dispatch(Actions.type("setStatusBarDark", true));
        AvoidSoftInput.setAdjustNothing();
        // AvoidSoftInput.setEnabled(true);
        return () => {
            dispatch(Actions.type("setStatusBarDark", false));
            AvoidSoftInput.setAdjustResize();
        }
    }, []);
    ////////////////////////////////////////
    useEffect(() => {
        let renderIndex = 0;
        if (Scroll.current) {
            renderIndex = setTimeout(() => {
                let index = activeIdx === -1 ? 0 : story ? activeIdx + 1 : activeIdx;
                Scroll.current.scrollToIndex({ index })
            }, 1000);
        }
        return () => clearTimeout(renderIndex);
    }, [activeIdx, Scroll]);
    ////////////////////////////////////////
    const OnePostMainMemo = useMemo(() => ({ item, index }) => {
        return (<View style={{ flex: 1, width: '100%', height: layout.height, backgroundColor: "green" }}>
            <OneStoryMeetoor active={activeStory === index} {...item} owen={activeIdx === -1} />
        </View>);
    }, [activeStory, layout]);
    const onScrollEnd = useCallback(({ nativeEvent }) => {
        const slideSize = nativeEvent.layoutMeasurement.height;
        const index = nativeEvent.contentOffset.y / slideSize;
        const roundIndex = Math.round(index);
        const distance = Math.abs(roundIndex - index);
        const isNoMansLand = 0.4 < distance;
        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setActiveStory(roundIndex);
        }
    }, []);
    const keyExtractor = useCallback((item) => item.storyId + "_story", []);
    const onLayout = useCallback(({ nativeEvent: { layout } }) => {
        setLayout({
            width: layout.width,
            height: layout.height
        });
    }, []);
    const getItemLayout = useCallback((_, index) => ({ length: layout.height, offset: layout.height * index, index }), [layout]);
    ////////////////////////////////////////
    return (<>
        <FlatScroll initialScrollIndex={activeStory} back={colors["clr1"]}
            pagingEnabled snapToAlignment={"start"} ref={Scroll}
            data={DATA_RENDER} bounces={false} renderItem={OnePostMainMemo}
            ListEmptyComponent={<OuterLazy back={"clr1"} height={pixel(300)}>
                <WaveIndicator size={moderateScale(140)}
                    color={colors["back3"]} />
            </OuterLazy>}
            legacyImplementation={false}
            onLayout={onLayout}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            onScroll={onScrollEnd}
            scrollEventThrottle={16}
        />

    </>)
}

export default memo(StoryViewerMeetoor);