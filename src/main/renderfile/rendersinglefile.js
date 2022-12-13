import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';
import { ViewOuterCirculerAnimation } from '../video/mainplayer';
import { css } from 'styled-components';
import { PlayControlSvg } from '../../icons/all';
import { OuterFitImageTouch } from '../../components/home/createstatus/helpercreatestatuscss';
import FitFastImage from './fit-fast-image';
import { pixel } from '../../styles/basecss';
/////////////////////////////////////////////////
const RenderSingleFile = memo(({ dataFile, userPhoto, width,
    userName, isSecure, isOwner, noHeader, maxHeight = 280 }) => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const { base, name } = dataFile;
    const isVideo = !name?.match(/\.jpg|\.png|\.jpeg|\.gif/gi);
    //////////////////////////////////////////////
    return (<OuterFitImageTouch activeOpacity={0.9} back="clr1"
        css={css`border-radius: 5px;min-height: 40px;overflow: hidden;
            ${width ? `width: ${width}` : null};max-height: ${pixel(maxHeight)};`}
        onPress={() => {
            if (isVideo) {
                navigate("video", { uri: base, poster: base })
            } else {
                dispatch(Actions.type("setPopupImage", {
                    open: true, noHeader, index: 0,
                    imageUrls: [{ url: base }],
                    userPhoto, userName, isSecure, isOwner
                }));
            }
        }}>
        <FitFastImage maxHeight={maxHeight} uri={base} type="contain">
            {isVideo ? <ViewOuterCirculerAnimation
                back="clr2" size={pixel(50)} css={css`margin: 0px;`}>
                <PlayControlSvg color="back3" type={false} />
            </ViewOuterCirculerAnimation> : null}
        </FitFastImage>
    </OuterFitImageTouch>)
});

export default memo(RenderSingleFile);