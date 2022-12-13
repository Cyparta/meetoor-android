import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastAndroid } from 'react-native';
import {
    CloseSvg, DeleteSvg,
    PaintSvg, PhotoSvg, PostSvg
} from '../../../icons/all';
import Actions from '../../../reducer/actions';
import { OuterControlPostSticky, ButtonPostCTR } from './helpercreatepostcss';
import { colors, pixel } from '../../../styles/basecss';
import Axios from '../../../main/Axios';
import { moderateScale } from 'react-native-size-matters';
import { AnyText } from '../../home/helperprefernce';
import { RenderMentionsUint } from '../../../main/helpertextarea';
////////////////////////////////////////////
export const PrivateCreatePost = async ({ postText,
    background, Files = [], teamid = null, secure, token }) => {
    /////////////////////////////////////////
    try {
        let data = new FormData();
        if (teamid !== null) data.append('teamid', teamid);
        data.append('secure', secure);
        data.append('background', background);

        if (Files.length) {
            Files.forEach(({ uri, type, name }) => {
                data.append('postFile', { uri, type, name });
            });
        }
        data.append('postText', postText);
        //////////////////////////////////////////
        const response = await Axios.post("creatPost/", data, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.log("signin -> catch", e)
    }
}
////////////////////////////////////////////
const RenderCTRPost = ({ setFilesBack, miunsMax, isClone = false, titlePost, isAnony = false,
    isEditable = false, isBack, restoreText, createPost, limit = 10 }) => {
    const dispatch = useDispatch();
    const { buttons, errors } = useSelector(state => state.sign.langData);
    const isRTL = useSelector(state => state.sign.isRTL);
    const { navigate } = useSelector(state => state.modal.navigation);
    ///////////////////////////////////////////////////////
    const onFileChange = useCallback(async (response) => {
        console.log("line 50 ~ onFileChange ~ response", response)
        if (response.clear) {
            setFilesBack([]);
            return;
        }
        if (response.remove) {
            setFilesBack((files) => files.filter(file => file.uri !== response.uri));
            return;
        }

        setFilesBack((files) => {
            if (files.length >= 10) {
                ToastAndroid.show(errors.moreSeven, ToastAndroid.LONG);
                response.success(false);
                return files;
            }

            const { uri, filename, fileSize } = response;

            if ((fileSize / 1024 / 1024) > 120) {
                ToastAndroid.show(`${errors.sizeFile} ${120}MB`, ToastAndroid.LONG);
                return files;
            }

            success = true;
            let ext = filename.split('.').pop();
            let typeFile = ["jpg", "jpeg", "png", "gif"].indexOf(ext) !== -1 ? "image" : "video";
            let type = `${typeFile}/${ext}`;
            response.success(true);
            return [...files, { uri, name: filename, type, typeFile, size: fileSize }]
        });
    }, []);
    ////////////////////////////////////////
    return (<OuterControlPostSticky>
        {isClone ? null : isAnony ? null :
            <ButtonPostCTR isRTL={isRTL} activeOpacity={0.8}
                onPress={() => dispatch(Actions.type("setCurrentModalWithNav", { key: "postbacks" }))}>
                <PaintSvg color="back3" />
            </ButtonPostCTR>}
        {isClone ? null : isBack ? <ButtonPostCTR isRTL={isRTL}
            activeOpacity={0.8}
            onPress={() => dispatch(Actions.type("setBackgroundPost", 0))}
            style={{
                backgroundColor: colors["back3"],
                width: moderateScale(30),
                height: moderateScale(30),
                borderRadius: moderateScale(30),
            }}>
            <CloseSvg size={moderateScale(15)} />
        </ButtonPostCTR> :
            isEditable ? null :
                <ButtonPostCTR isRTL={isRTL} activeOpacity={0.8}
                    onPress={() => navigate("cameraroll", { onFileChange, limit })}>
                    <PhotoSvg color="back3" />
                </ButtonPostCTR>}
        <ButtonPostCTR isRTL={isRTL} style={{ minWidth: moderateScale(55) }}
            activeOpacity={0.8} back="back3" enabled={false}
            onPress={restoreText}>
            <DeleteSvg size={moderateScale(17)} />
            <AnyText autoMargin={pixel(5)} isRTL={isRTL}
                size={moderateScale(15)}
                lineH={pixel(25)} color={"clr2"} lower>
                {miunsMax}
            </AnyText>
        </ButtonPostCTR>
        <ButtonPostCTR isRTL={isRTL}
            activeOpacity={0.8} back="clr1"
            onPress={() => {
                createPost();
            }}>
            <PostSvg size={moderateScale(17)} color="back3" />
            <AnyText autoMargin={pixel(5)} isRTL={isRTL}
                size={moderateScale(15)} color={"back3"} lower>
                {titlePost || buttons.post}
            </AnyText>
        </ButtonPostCTR>
        {isAnony ? null : <RenderMentionsUint />}
    </OuterControlPostSticky>)
}

export default memo(RenderCTRPost);
