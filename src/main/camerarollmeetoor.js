import React, { memo, useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../reducer/actions';
import { ReadPermission } from '../../helper/permissionsforandroid';
import { getPhotosRoll } from '../helperhome';
import {
    ButtonPostCTR, OuterOneBackground, OuterItemModal
} from '../components/posts/createpost/helpercreatepostcss';
import { UserImageRoom, ViewOuterCirculer } from '../components/home/sliderroom/helperroomcss';
import CameraRoll from '@react-native-community/cameraroll';
import { WaveIndicator } from 'react-native-indicators';
import { OuterLazy } from '../components/home/helperhome';
import { AnyText, FlatScroll } from '../components/home/helperprefernce';
import { colors, pixel } from '../styles/basecss';
import { ArrowSvg, CamSvg, CorrectSvg, PhotoSvg } from '../icons/all';
import { css } from 'styled-components';
import { RefreshControl, Vibration } from 'react-native';
import { convertToTime } from '../reducer/helper';
import useGoBack from "../main/goback";
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////
const RenderOneRoll = memo(({ uri, duration, filename, fileSize,
    size, onFileChange, enabledMulti, handleBack }) => {
    const [selected, setSelected] = useState(false);
    return (<OuterOneBackground activeOpacity={0.8}
        onPress={async () => {
            if (enabledMulti) {
                if (selected) {
                    onFileChange({ uri, remove: true });
                    setSelected(false);
                } else await onFileChange({
                    uri, duration, filename, fileSize,
                    success: async (success) => {
                        Vibration.vibrate(success ? 70 : [50, 200, 50, 200]);
                        setSelected(success);
                    }
                });
            } else {
                onFileChange({
                    uri, duration, filename, fileSize,
                    success: (close = true) => {
                        Vibration.vibrate(70);
                        close && handleBack();
                    }
                })
            }
        }} css={css`margin: 0px;`}>
        <UserImageRoom source={{ uri }} sizeImage={size} />
        <ViewOuterCirculer backrgba="clr3" size="30px" radius="12px"
            css={css`position: absolute;right: 2px;top: 2px;`}>
            {duration ? <CamSvg color="yel" size={moderateScale(14)} /> :
                <PhotoSvg color="back3" size={moderateScale(14)} />}
        </ViewOuterCirculer>
        {duration ? <ViewOuterCirculer backrgba="clr3" radius={pixel(20)}
            css={css`position: absolute;right: ${pixel(4)};
            bottom: ${pixel(4)};max-width: auto;max-height: auto;
            width: ${pixel(65)};height: auto;padding: ${pixel(5)};`}>
            <AnyText color="back3" size={moderateScale(13)} lineH={pixel(13)}>
                {duration}
            </AnyText>
        </ViewOuterCirculer> : null}
        {selected ? <ViewOuterCirculer size="100%"
            backrgba="clr1" radius={pixel(4)}
            css={css`position: absolute;border-width: 0px;`}>
            {<CorrectSvg color="yel" size={moderateScale(22)} />}
        </ViewOuterCirculer> : null}
    </OuterOneBackground>)
});
/////////////////////////////////////////////
const RollMeetoorModal = ({ limit = 1, onFileChange, typeFiles = "All" }) => {
    const dispatch = useDispatch();
    const handleBack = useGoBack();
    const isRTL = useSelector(state => state.sign.isRTL);
    const { buttons } = useSelector(state => state.sign.langData);
    const windowSize = useSelector(state => state.sign.windowSize);
    const cameraRoll = useSelector(state => state.sign.cameraRoll);
    const [enabledMulti] = useState(limit > 1);
    const [type] = useState(typeFiles === "All" ? 1 : typeFiles === "Photos" ? 2 : 3);
    const [refreshing, setRefreshing] = useState(false);
    const [rollKey, setRollKey] = useState("all");
    const DATA_RENDER = useMemo(() => {
        if (rollKey === "all") {
            const rolls = [];
            for (const key in cameraRoll) {
                let roll = cameraRoll[key];
                if (roll.length) rolls.push(...roll);
            }
            return rolls.slice(0, 700);
        }
        else return cameraRoll[rollKey] || []
    }, [cameraRoll, rollKey]);
    ////////////////////////////////////////
    const updatePhotosRoll = useCallback(async () => {
        try {
            const AlbumsRoll = await CameraRoll.getAlbums()
            AlbumsRoll.map(async ({ _, title }) => {
                console.log("line 97 ~ AlbumsRoll.map ~ title", title)
                const filesRoll = await CameraRoll.getPhotos({
                    first: 5, groupName: title, assetType: "All",
                    include: ["fileSize", "playableDuration", "filename"]
                });
                let newRoll = filesRoll.edges ? filesRoll.edges?.length
                    ? filesRoll.edges.map(({ node: {
                        image: { uri, playableDuration, filename, fileSize }
                    } }) => {
                        let size = fileSize ? fileSize : 0;
                        let duration = playableDuration !== null ? convertToTime(playableDuration) : null;
                        return { uri, duration, filename, fileSize: size };
                    }).filter(({ filename }) => filename.match(/\.tif/gi) ? false : true) : [] : [];
                cameraRoll[title]?.slice(0, 5).forEach(oldRoll => {
                    newRoll.forEach((roll, i) => (roll.filename === oldRoll.filename) && newRoll.splice(i, 1));
                });
                dispatch(Actions.type("setCameraRoll", {
                    type: "pushGroup", data: { key: title, val: newRoll }
                }));
            });
            return;
        }
        catch (e) {
            console.log(e)
        }
    }, [cameraRoll]);
    ////////////////////////////////////////
    const OneRollView = useMemo(() => ({ item }) => {
        let size = ((windowSize.width / 2) - 2) + "px";
        return (<RenderOneRoll {...item} size={size}
            onFileChange={onFileChange}
            enabledMulti={enabledMulti}
            handleBack={handleBack}
        />);
    }, [windowSize, enabledMulti, handleBack]);
    ////////////////////////////////////////
    useEffect(() => {
        onRefresh();
        dispatch(Actions.type("setCurrentModalOutside", {
            key: "chooseroll", callback: setRollKey
        }));
        onFileChange({ clear: true });
        ReadPermission(() => dispatch(getPhotosRoll()));
    }, []);
    /////////////////////////////////////////
    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            await updatePhotosRoll();
            setRefreshing(false);
        } catch (e) {
            console.log("Dashbord -> error.data", e)
        }
    }, [cameraRoll]);
    ////////////////////////////////////////
    const RealDataRoll = useMemo(() => {
        switch (type) {
            case 1:
                return DATA_RENDER;
            case 2:
                return DATA_RENDER.filter(({ duration }) => duration === null)
            case 3:
                return DATA_RENDER.filter(({ duration }) => typeof duration === "string")
            default:
                break;
        }
    }, [type, DATA_RENDER]);
    ////////////////////////////////////////
    const ListHeaderComponent = useCallback(() => (<OuterItemModal
        isRTL={isRTL} activeOpacity={1}
        css={css`min-height: ${pixel(45)};justify-content: space-between;
                padding:0 ${pixel(14)}; margin-bottom: ${pixel(6)};`}>
        <AnyText onPress={() => dispatch(Actions.
            type("setCurrentModalOutside", {
                key: "chooseroll", callback: setRollKey
            }))} size={moderateScale(14)}
            color="clr2" numberOfLines={1}
            css={css`max-width: ${pixel(200)};`}>
            <ArrowSvg size={moderateScale(12)} color="clr2" />
            {" "}
            {rollKey}
        </AnyText>
        {enabledMulti ? <ButtonPostCTR activeOpacity={0.8}
            onPress={() => handleBack()}
            back="clr1" css={css`border-radius: ${pixel(8)};`}>
            <AnyText color="back3">{buttons.next}</AnyText>
        </ButtonPostCTR> : null}
    </OuterItemModal>), [isRTL, rollKey, enabledMulti, buttons]);
    ////////////////////////////////////////
    const ListEmptyComponent = useCallback(() => (<OuterLazy
        background="transparent" height={pixel(200)}>
        <WaveIndicator size={moderateScale(140)} color={colors["clr2"]} />
    </OuterLazy>), []);
    ////////////////////////////////////////
    const KeyExtractor = useCallback((item) => item.filename + "_cameraroll", []);
    ////////////////////////////////////////
    return (<FlatScroll stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        refreshControl={<RefreshControl
            colors={[colors["clr2"]]}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        data={RealDataRoll} numColumns={2}
        renderItem={OneRollView}
        keyExtractor={KeyExtractor}
        initialNumToRender={5}
        maxToRenderPerBatch={7}
        windowSize={11}
    />);
}

export default memo(RollMeetoorModal);