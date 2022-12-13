import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';
import VideoPlayerLocal from '../video/player';
import SoundPlayerMain from '../sound/player';
import { FileAsCreateDownload, FileImage, FileImageUri } from './renderfilecss';
import { pixel } from '../../styles/basecss';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////////////
const FileAsImg = ({ uri }) => {
    const dispatch = useDispatch();
    const windowSize = useSelector(state => state.sign.windowSize);
    const openImageAsBig = (urlImg) => {
        dispatch(Actions.type("setPopupImage", {
            index: 0,
            urls: [urlImg]
        }));
    }
    /////////////////////////////////////////////////////
    return (<FileImage onPress={() => openImageAsBig(uri)}>
        <FileImageUri source={{ uri }} style={{
            resizeMode: 'contain',
            flex: 1,
            aspectRatio: 1, // Your aspect ratio
            width: windowSize.width,
            maxHeight: moderateScale(200)
        }} />
    </FileImage>)
}
///////////////////////////////////////////////////////////
export const RenderFileHTMLNorm = memo(({ file }) => {
    if (file.name.match(/\.jpg|\.png|\.jpeg|\.gif/gi)) {
        return (<FileAsCreateDownload>
            <FileAsImg uri={file.uri} name={file.name} down={false} />
        </FileAsCreateDownload>);
    }
    else if (file.name.match(/\.mp4|\.m4a|\.avi|\.mov|\.wmv|\.m4p|\.m4v|\.webm|\.mpeg|\.flv|\.avchd|\.mkv/gi)) {
        return (<FileAsCreateDownload>
            <VideoPlayerLocal uri={file.uri} width="100%" height={pixel(200)} />
        </FileAsCreateDownload>);
    }
    else if (file.name.match(/\.wav|\.mp3|\.aac|\.ogg/gi)) {
        return (<FileAsCreateDownload>
            <SoundPlayerMain uri={file.uri} />
        </FileAsCreateDownload>);
    }
    return (null);
});