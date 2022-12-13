import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal, UserImageRoom } from '../../home/sliderroom/helperroomcss';
import { OuterBackgrounds, OuterOneBackground } from './helpercreatepostcss';
import Actions from '../../../reducer/actions';
import { pixel } from '../../../styles/basecss';
////////////////////////////////////////////
const ChoosePostBackModal = () => {
    const dispatch = useDispatch();
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const setPostState = useCallback((back) => {
        dispatch(Actions.type("setBackgroundPost", back))
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterBackgrounds>
            {[...Array(15)].map((v, i) => (<OuterOneBackground key={i + "_back"}
                activeOpacity={0.8} onPress={() => setPostState(i + 1)}>
                <UserImageRoom source={{
                    uri: `https://cdn.meetoor.com/frontend/img/postsback/${i + 1}.png`
                }} sizeImage={pixel(145)} />
            </OuterOneBackground>))}
        </OuterBackgrounds>
    </RenderBodyModal>)
}

export default memo(ChoosePostBackModal);
