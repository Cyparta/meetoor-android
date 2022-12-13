import React, { memo, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { DeleteSvg, EyeSvg } from '../../../icons/all';
import Axios from '../../../main/Axios';
import Actions from '../../../reducer/actions';
import { HandelNumber } from '../../../reducer/helper';
import { ButtonPostCTR } from '../../posts/createpost/helpercreatepostcss';
import { AnyText } from '../helperprefernce';
import StatusBodyMeetoor from './bodystatus';
import { ButtonCirculer, RoomBadgeCreate } from '../sliderroom/helperroomcss';
import { StatusContentOuter, StatusHeaderOuter } from './helperstatuscss';
import { WaveIndicator } from 'react-native-indicators';
import { colors, pixel } from '../../../styles/basecss';
import { useCallback } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
////////////////////////////////////////////
const MyStatusMeetoor = ({ story }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    const [deleting, setDeleting] = useState(false);
    const statusSeener = useMemo(() => HandelNumber(story?.views, 0, true), [story?.views]);
    const { navigate } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const GoToStatus = useCallback(() => {
        navigate("viewstatus", { activeIdx: -1 });
    }, [navigate, story]);
    /////////////////////////////////////////
    return (<StatusContentOuter
        width={pixel(60)} height={pixel(105)}
        activeOpacity={0.9}
        isDark={isDark}
        onPress={GoToStatus}>
        {story && <StatusBodyMeetoor {...story} />}
        <RoomBadgeCreate isDark={isDark} top={pixel(40)}>
            <ButtonCirculer size={pixel(27)} activeOpacity={0.8}
                onPress={() => {
                    dispatch(Actions.type("setCurrentModalWithNav", {
                        key: "alert",
                        YesFunc: async () => {
                            try {
                                setDeleting(true);
                                await Axios.delete(`createStory/?id=${story?.storyId}`, {
                                    headers: {
                                        'Authorization': `Token ${token}`
                                    }
                                });
                                setDeleting(false);
                                dispatch(Actions.type("setMyStory", { type: "set", data: null }));
                            } catch (e) {
                                console.log("Dashbord -> error.data", e)
                            }
                        }
                    }));
                }}>
                {deleting ? <WaveIndicator size={moderateScale(27)} color={colors["red2"]} />
                    : <DeleteSvg size={moderateScale(16)} />}
            </ButtonCirculer>
        </RoomBadgeCreate>
        <StatusHeaderOuter height={45}>
            <ButtonPostCTR activeOpacity={0.8} back="clr2" css={css`margin: 0;`}
                onPress={() => navigate("seenerstatus", { storyId: story.storyId })}
                style={{ minWidth: moderateScale(60), maxWidth: moderateScale(60), height: moderateScale(27) }}>
                <EyeSvg size={moderateScale(14)} color="back3" />
                <AnyText autoMargin={pixel(3)} size={moderateScale(13)}
                    color={"back3"} lower>
                    {statusSeener}
                </AnyText>
            </ButtonPostCTR>
        </StatusHeaderOuter>
    </StatusContentOuter>)
}

export default memo(MyStatusMeetoor)
