import React, { memo, useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { OuterBackgrounds, OuterOneBackground } from '../components/posts/createpost/helpercreatepostcss';
import { RenderBodyModal, UserImageRoom, ViewOuterCirculer } from '../components/home/sliderroom/helperroomcss';
import { AnyText } from '../components/home/helperprefernce';
import { pixel } from '../styles/basecss';
import { css } from 'styled-components';
////////////////////////////////////////////
const ChooseRollModal = ({ callback }) => {
    const { badges } = useSelector(state => state.sign.langData);
    const windowSize = useSelector(state => state.sign.windowSize);
    const modalizeOutside = useSelector(state => state.modal.modalizeOutside);
    const cameraRoll = useSelector(state => state.sign.cameraRoll);
    const rollKeys = useSelector(state => state.sign.rollKeys);
    const size = pixel(((windowSize.width / 2) - 30));
    ////////////////////////////////////////
    const setRollKey = useCallback((roll) => {
        callback && callback(roll)
        modalizeOutside.close();
    }, [modalizeOutside, callback]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterBackgrounds>
            <OuterOneBackground activeOpacity={0.8}
                css={css`margin: 0px;`} onPress={() => setRollKey("all")}>
                <ViewOuterCirculer backrgba="clr3" radius={pixel(0)}
                    css={css`max-width: auto;max-height: auto;width: ${size};height: ${size};`}>
                    <AnyText color="back3" size={moderateScale(24)} lineH={pixel(50)}>
                        {badges.all}
                    </AnyText>
                </ViewOuterCirculer>
            </OuterOneBackground>
            {rollKeys.map((rollKey, i) => {
                let currentRoll = cameraRoll[rollKey];
                if (!currentRoll.length) return null;
                return (<OuterOneBackground activeOpacity={0.8} key={rollKey + "_roll" + i}
                    css={css`margin: 0px;`} onPress={() => setRollKey(rollKey)}>
                    <UserImageRoom source={{ uri: currentRoll[0].uri }} sizeImage={size} />
                    <ViewOuterCirculer backrgba="clr3" backAlpha={0.8} radius={pixel(12)}
                        css={css`position: absolute;right: ${pixel(4)};
                            bottom: ${pixel(4)};max-width: auto;max-height: auto;
                            width: auto;height: auto;padding: ${pixel(7)} ${pixel(7)};`}>
                        <AnyText color="back3" size={moderateScale(14)} lineH={pixel(14)}>
                            {rollKey}
                        </AnyText>
                    </ViewOuterCirculer>
                </OuterOneBackground>)
            })}
        </OuterBackgrounds>
    </RenderBodyModal>)
}

export default memo(ChooseRollModal)


