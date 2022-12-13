import React, { useCallback, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { OuterAnyView, RenderAnyUserPhoto } from '../../components/home/helperhome';
import { TopNavigateOuter } from '../../components/posts/createpost/helpercreatepostcss';
import { ButtonCirculer, OuterButtonControl, UserInfoModal } from '../../components/home/sliderroom/helperroomcss';
import { AnyText, OuterUserName } from '../../components/home/helperprefernce';
import { CorrectSvg, FriendsSvg, LockSvg, PublickSvg } from '../../icons/all';
import { css } from 'styled-components';
import Axios from '../Axios';
import Actions from '../../reducer/actions';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////////////
const RenderImgUploader = memo(({ file }) => {
    const dispatch = useDispatch();
    const { placeholder } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isRTL = useSelector(state => state.sign.isRTL);
    const User = useSelector(state => state.main.user);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    const avatarState = useSelector(state => state.sign.avatarState);
    //////////////////////////////////////////
    const uploadImg = useCallback(async () => {
        try {
            let data = new FormData();
            data.append("UserPhoto", file);
            data.append("secure", avatarState);
            ToastAndroid.show(placeholder.posting, ToastAndroid.LONG);
            modalizeWithNav.close();
            const response = await Axios.post(`user/`, data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            dispatch(Actions.type("setUser", {
                type: 'set', data: response.data.user
            }));
            ToastAndroid.show(placeholder.posted, ToastAndroid.LONG);
        } catch (e) {
            console.log("signin -> catch", e)
        }
    }, [avatarState, file, modalizeWithNav]);
    ////////////////////////////////////////
    const currentStateIcon = useMemo(() => {
        switch (avatarState) {
            case 0:
                return <LockSvg color="clr2" />;
            case 1:
                return <PublickSvg color="clr2" />;
            case 2:
                return <FriendsSvg color="clr2" />;
            default:
                return <LockSvg color="clr2" />;
        }
    }, [avatarState]);
    ///////////////////////////////////////////ref={ref}
    return (<OuterAnyView css={css`flex-direction: column;`}>
        <TopNavigateOuter css={css`padding: 0px;margin-bottom: ${pixel(6)};`}
            isDark={false}>
            <UserInfoModal>
                <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
                <OuterUserName>
                    <AnyText isRTL={isRTL} size={moderateScale(14)} lineH={pixel(16)}
                        color={"clr3"}>{User.fullName}</AnyText>
                </OuterUserName>
            </UserInfoModal>
            <OuterButtonControl>
                <ButtonCirculer activeOpacity={0.8} isRTL={isRTL} isDark={false}
                    onPress={() => dispatch(Actions.type("setCurrentModalOutside", { key: "avatarstate" }))}>
                    {currentStateIcon}
                </ButtonCirculer>
                <ButtonCirculer activeOpacity={0.8} isRTL={isRTL}
                    isDark={false} onPress={uploadImg}>
                    <CorrectSvg color="clr2" size={moderateScale(18)} />
                </ButtonCirculer>
            </OuterButtonControl>
        </TopNavigateOuter>
        <RenderAnyUserPhoto userPhoto={file.uri} sizeImage={pixel(260)} />
    </OuterAnyView>)
});

export default RenderImgUploader;