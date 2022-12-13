import React, { useCallback, memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { css } from 'styled-components';
import ImagePicker from 'react-native-image-crop-picker';
import { ButtonCirculer } from '../../components/home/sliderroom/helperroomcss';
import { PhotoSvg } from '../../icons/all';
import Actions from '../../reducer/actions';
import { pixel } from '../../styles/basecss';
/////////////////////////////////////////////////////////
const EditImgElement = memo(() => {
    const dispatch = useDispatch();
    const { navigate } = useSelector(state => state.modal.navigation);
    const [fileBack, setFileBack] = useState(null);
    ///////////////////////////////////////////////////////
    const onFileChange = useCallback((response) => {
        if (response.clear) {
            return;
        }
        const { uri, filename } = response;
        response.success();
        ImagePicker.openCropper({
            path: uri,
            width: 500,
            height: 500
        }).then(({ path, mime }) => {
            setFileBack({ uri: path, name: filename, type: mime });
        });
    }, []);
    /////////////////////////////////////////////////
    useEffect(() => {
        fileBack && dispatch(Actions.type("setCurrentModalWithNav", {
            key: "uploadimg",
            file: fileBack
        }))
    }, [fileBack]);
    ///////////////////////////////////////////
    return (<ButtonCirculer backrgba="clr1" activeOpacity={0.8}
        css={css`position: absolute;left: ${pixel(-10)};`}
        size={pixel(35)}
        onPress={() => navigate("cameraroll", {
            onFileChange, limit: 1, typeFiles: "Photos"
        })}>
        <PhotoSvg color="back3" />
    </ButtonCirculer>);
});

export default EditImgElement;