import React, { memo, useCallback, useEffect, useState } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { css } from 'styled-components';
import Axios from '../../main/Axios';
import Actions from '../../reducer/actions';
import { pixel } from '../../styles/basecss';
import { RenderAnyUserPhoto } from '../home/helperhome';
import { ButtonCirculer, RenderBodyModal } from '../home/sliderroom/helperroomcss';
import { OuterBackgrounds } from '../posts/createpost/helpercreatepostcss';
//////////////////////////////////////////////
const BuildStickerComponnet = memo(({ cdnUrl, url, sticker, saveSticker }) => {
    let active = sticker.includes(url);
    let back = active ? "red2" : "clr1";
    ///////////////////////////////////////////
    return (<ButtonCirculer back={back} size={pixel(40)} css={css`margin: ${pixel(3)};`}
        activeOpacity={0.8} onPress={() => saveSticker(url)} >
        <RenderAnyUserPhoto userPhoto={cdnUrl + url}
            size={pixel(active ? 34 : 36)} alpha={0} />
    </ButtonCirculer>);
});
/////////////////////////////////////////////////
const MainStickersModal = ({ sticker }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const stickers = useSelector(state => state.main.stickers);
    const cdnUrl = useSelector(state => state.main.cdnUrl);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    /////////////////////////////////////////////
    const [selected] = useState(sticker);
    const [stickersLazy, setStickers] = useState(stickers.slice(0, 27));
    /////////////////////////////////////////////
    const saveSticker = useCallback(async (url) => {
        try {
            let data = new FormData();
            data.append("sticker", url);

            const response = await Axios.post("user/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            dispatch(Actions.type("setUser", {
                type: 'set',
                data: response.data.user
            }));
        } catch (e) {
            console.log("signin -> catch", e)
        }
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    /////////////////////////////////////////////
    useEffect(() => {
        let set = setTimeout(() => setStickers(stickers), 0);
        return () => clearTimeout(set);
    }, [])
    /////////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterBackgrounds>
            {stickersLazy.map((item, i) => (<BuildStickerComponnet
                key={i + item.sticker} url={item.sticker}
                sticker={selected} cdnUrl={cdnUrl}
                saveSticker={saveSticker} />))}
        </OuterBackgrounds>
    </RenderBodyModal>);
}

export default memo(MainStickersModal);