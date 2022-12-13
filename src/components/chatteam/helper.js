import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { AnyText } from '../home/helperprefernce';
import RenderSingleFile from '../../main/renderfile/rendersinglefile';
import SoundPlayerMain from '../../main/sound/player';
import { moderateScale } from 'react-native-size-matters';
//////////////////////////////////////////////////
export const RefChatElement = memo(({ text, file }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    ////////////////////////////////////////////
    const isRecord = text?.startsWith("$record$");
    const isDelete = text?.startsWith("$delete$");
    const Text = text?.replace("$file$", "");
    //////////////////////////////////////////////
    if (isDelete) return null;
    return (<>
        {isRecord ? null : text && text !== "" ?
            <AnyText isRTL={isRTL} size={moderateScale(14)} lower
                color="back2">{Text}</AnyText> : null}
        {file ? isRecord ? <SoundPlayerMain uri={file.base} /> :
            <RenderSingleFile dataFile={file} noHeader={true}
                width={moderateScale(100)} height={moderateScale(100)} /> : null}
    </>);
});
//////////////////////////////////////////////////
export const RenderChatElement = memo(({ text, file, isRecord }) => {
    return (<>
        {isRecord ? null : text && text !== "" ? text : null}
        {file ? isRecord ? <SoundPlayerMain uri={file.base} /> :
            <RenderSingleFile dataFile={file} noHeader={true} height={moderateScale(280)} /> : null}
    </>);
});