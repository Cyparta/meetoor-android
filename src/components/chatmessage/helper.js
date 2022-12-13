import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { css } from 'styled-components';
import { CallCancelSvg, PhoneSvg } from '../../icons/all';
import { OuterMessageContent } from '../home/helpernotification/heplernotifycss';
import { AnyText } from '../home/helperprefernce';
import RenderSingleFile from '../../main/renderfile/rendersinglefile';
import SoundPlayerMain from '../../main/sound/player';
import { moderateScale } from 'react-native-size-matters';
import { pixel } from '../../styles/basecss';
//////////////////////////////////////////////////
export const RefChatElement = memo(({ text, file }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    ////////////////////////////////////////////
    const isRecord = text?.startsWith("$record$");
    const isDelete = text?.startsWith("$delete$");
    const Text = text?.replace("$file$", "").replace("$story$", "");
    //////////////////////////////////////////////
    if (isDelete) return null;
    return (<>
        {isRecord ? null : Text && Text !== "" ?
            <AnyText isRTL={isRTL} size={moderateScale(14)} lower
                color="back2">{Text}</AnyText> : null}
        {file ? isRecord ? <SoundPlayerMain uri={file.base} /> :
            <RenderSingleFile dataFile={file} noHeader={true}
                width={pixel(100)} maxHeight={100} /> : null}
    </>);
});
//////////////////////////////////////////////////
export const RenderCallElement = memo(({ call, isMe, name, color }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { callData } = useSelector(state => state.sign.langData);
    //////////////////////////////////////////////
    return (<>
        <AnyText isRTL={isRTL} size={16} lower
            color={color}>
            {isMe ? `${callData.youCalled} ${name?.split(' ')[0]}` :
                `${name?.split(' ')[0]} ${callData.calledYou}`}
        </AnyText>
        <OuterMessageContent isRTL={isRTL} call={call}
            css={css`margin: 0px;margin-top: ${pixel(4)};`}>
            {call ?
                <>
                    <PhoneSvg size={moderateScale(20)} color="back3" />
                    <AnyText small target lower color="back3"> {callData.callEnded} </AnyText>
                </>
                :
                <>
                    <CallCancelSvg size={moderateScale(20)} color="back3" />
                    <AnyText small target lower color="back3"> {callData.notAnswer} </AnyText>
                </>
            }
        </OuterMessageContent>
    </>);
});
//////////////////////////////////////////////////
export const RenderChatElement = memo(({ text, file, isRecord }) => {
    return (<>
        {isRecord ? null : text && text !== "" ? text : null}
        {file ? isRecord ? <SoundPlayerMain uri={file.base} /> :
            <RenderSingleFile dataFile={file} noHeader={true} width="auto" maxHeight={280} /> : null}
    </>);
});