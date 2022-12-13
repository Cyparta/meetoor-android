import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Actions from '../../../reducer/actions';
import { pixel } from '../../../styles/basecss';
import { OuterBackgrounds, OuterOneBackground } from '../../posts/createpost/helpercreatepostcss';
import { RenderBodyModal, UserImageRoom } from '../sliderroom/helperroomcss';
////////////////////////////////////////////
const ChooseStatusBackModal = () => {
    const dispatch = useDispatch();
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    ////////////////////////////////////////
    const setPostState = useCallback((back) => {
        dispatch(Actions.type("setBackgroundStatus", back))
        modalizeWithNav.close();
    }, [modalizeWithNav]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        <OuterBackgrounds>
            {[...Array(19)].map((v, i) => (<OuterOneBackground key={i + "_back"}
                activeOpacity={0.8} onPress={() => setPostState(i + 1)}>
                <UserImageRoom source={{
                    uri: `https://cdn.meetoor.com/frontend/img/statusback/st_${i + 1}.jpeg`
                }} sizeImage={pixel(90)} heightSize={pixel(130)} />
            </OuterOneBackground>))}
        </OuterBackgrounds>
    </RenderBodyModal>)
}

export default memo(ChooseStatusBackModal);
