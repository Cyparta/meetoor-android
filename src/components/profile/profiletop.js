import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
///////////////////////////////////////////////////
import { css } from 'styled-components';
import Actions from '../../reducer/actions';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { OuterOneView } from '../home/helpernotification/heplernotifycss';
import { AnyText } from '../home/helperprefernce';
import { ButtonCirculer } from '../home/sliderroom/helperroomcss';
import EditImgElement from '../../main/imguploader/editimg';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
///////////////////////////////////////////////////
const RenderTopProfile = ({
    UserPhoto,
    fullName,
    isOwner,
    isSecure,
    isMe,
    sticker
}) => {
    const dispatch = useDispatch();
    const { meetoorOwner } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const isDark = useSelector(state => state.sign.isDark);
    const cdnUrl = useSelector(state => state.main.cdnUrl);
    const User = useSelector(state => state.main.user);
    const currentSticker = cdnUrl + (isMe ? User.sticker : sticker);
    const userPhoto = isMe ? User.UserPhoto : UserPhoto;
    const PhotoSize = pixel(230);
    ////////////////////////////////////////
    return (<OuterOneView activeOpacity={1} isRTL={isRTL} back={isDark ? "clr1" : "back1"}
        css={css`justify-content: center;margin: 0;
        margin-bottom: ${pixel(4)};border-radius: 10px;flex-direction: column;`}>
        {isOwner ? <AnyText lower color="gold" size={moderateScale(21)}
            css={css`margin-top: ${pixel(14)};`}>{meetoorOwner}</AnyText> : null}
        <OuterOneView isRTL={isRTL} activeOpacity={1}
            css={css`width: auto;padding: 0;margin: ${pixel(isOwner ? 24 : 7)} 0;
            justify-content: center;`}>
            {isOwner ? <RenderAnyUserPhoto css={css`position: absolute;background: transparent;
                border-width: 0px;transform: scale(1.22) rotate(200deg);`}
                userPhoto={"https://cdn.meetoor.com/frontend/img/owner.png"} size={PhotoSize} /> : null}
            <OuterOneView activeOpacity={0.8} css={css`width: auto;`}
                onPress={() => dispatch(Actions.type("setPopupImage", {
                    open: true, index: 0, imageUrls: [{ url: userPhoto }], isOwner,
                    userPhoto: userPhoto, userName: fullName, isSecure, noDownload: true
                }))}>
                <RenderAnyUserPhoto userPhoto={userPhoto} size={PhotoSize} />
            </OuterOneView>
            <ButtonCirculer back={isDark ? "clr3" : "back3"} size={pixel(42)}
                css={css`position: absolute;bottom: ${pixel(isOwner ? -13 : -5)};border-width: 0px;`}
                activeOpacity={isMe ? 0.8 : 1} onPress={() => {
                    isMe && dispatch(Actions.type("setCurrentModalWithNav", {
                        key: "setsticker",
                        sticker: currentSticker
                    }))
                }}>
                <RenderAnyUserPhoto css={css`border-width: 0px;`}
                    userPhoto={currentSticker} size={pixel(36)} alpha={0} />
            </ButtonCirculer>
            {isMe ? <EditImgElement /> : null}
        </OuterOneView>
    </OuterOneView>)
}

export default memo(RenderTopProfile);