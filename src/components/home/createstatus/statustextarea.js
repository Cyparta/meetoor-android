import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import FitImage from 'react-native-fit-image';
import { GetColorToStatus, pixel } from '../../../styles/basecss';
import { TextAreaInput } from '../../posts/createpost/helpercreatepostcss';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const StatusTextArea = ({ maxContent, detectMax, setCurrentText, currentText, background }) => {
    const { placeholder } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    return (<FitImage originalWidth={moderateScale(300)} originalHeight={moderateScale(600)}
        source={{ uri: `https://cdn.meetoor.com/frontend/img/statusback/st_${background}.jpeg` }}>
        <TextAreaInput
            back="back2"
            maxLength={maxContent}
            multiline
            isDark={isDark}
            placeholderTextColor={GetColorToStatus(background)}
            placeholder={placeholder.someThing}
            autoFocus={true}
            line={pixel(30)}
            align="center"
            size={pixel(18)}
            colorStatus={background}
            defaultValue={currentText}
            onChangeText={(text) => {
                setCurrentText(text);
                detectMax && detectMax(text.length)
            }}
        />
    </FitImage>);
}

export default memo(StatusTextArea);