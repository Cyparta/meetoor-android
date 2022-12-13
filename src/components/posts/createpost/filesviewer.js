import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { DeleteSvg } from '../../../icons/all';
import VideoPlayerLocal from '../../../main/video/player';
import { pixel } from '../../../styles/basecss';
import { ButtonCirculer, UserImageRoom } from '../../home/sliderroom/helperroomcss';
import { OuterOneViewerCTR } from './helpercreatepostcss';
/////////////////////////////////////////////////
const ViewerSliderFiles = ({ filesBack, setFilesBack }) => {
    /////////////////////////////////////////////
    return (<ScrollView horizontal={true}>
        {filesBack?.length ? filesBack
            .map(({ uri, name, typeFile }) => (<OuterOneViewerCTR key={name + "_" + typeFile}>
                <ButtonCirculer activeOpacity={0.8} style={{
                    position: 'absolute', right: 0,
                    top: moderateScale(7), zIndex: 2,
                }}
                    onPress={() => setFilesBack(files => {
                        return files.filter(file => file.name !== name);
                    })} close>
                    <DeleteSvg size={moderateScale(18)} />
                </ButtonCirculer>
                {typeFile === 'image' ? <UserImageRoom source={{ uri }} sizeImage={pixel(140)} /> :
                    <VideoPlayerLocal uri={uri} width={pixel(140)} height={pixel(140)} />}
            </OuterOneViewerCTR>)) : null}
    </ScrollView>)
}

export default memo(ViewerSliderFiles)
