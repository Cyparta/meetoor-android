import React, {memo, useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ToastAndroid} from 'react-native';
// import DocumentPicker from 'react-native-document-picker'
import {DeleteSvg, PaintSvg, PhotoSvg, PostSvg} from '../../../icons/all';
import Actions from '../../../reducer/actions';
import {AnyText} from '../helperprefernce';
import {colors, pixel} from '../../../styles/basecss';
import Axios from '../../../main/Axios';
import {
  ButtonPostCTR,
  OuterControlPostSticky,
} from '../../posts/createpost/helpercreatepostcss';
import {moderateScale} from 'react-native-size-matters';
/////////////////////////////////////////////
export const PrivateCreateStatus = async ({
  postText,
  background,
  File,
  secure,
  token,
}) => {
  /////////////////////////////////////////
  try {
    let data = new FormData();
    data.append('secure', secure);
    data.append('background', background);

    File &&
      data.append('storyFile', {
        uri: File.uri,
        type: File.type,
        name: File.name,
      });

    data.append('storyText', postText);
    //////////////////////////////////////////
    const response = await Axios.post('createStory/', data, {
      headers: {
        Authorization: `Token ${token}`,
      }
    });
    return response.data;
  } catch (e) {
    console.log('signin -> catch', e);
  }
};
////////////////////////////////////////////
const RenderCTRStatus = ({
  setFileBack,
  miunsMax,
  isMedia,
  restoreText,
  createStatus,
  openType = 'Photos',
}) => {
  const dispatch = useDispatch();
  const {buttons, errors} = useSelector(state => state.sign.langData);
  const {navigate} = useSelector(state => state.modal.navigation);
  const isRTL = useSelector(state => state.sign.isRTL);
  ///////////////////////////////////////////////////////
  const onFileChange = useCallback(async response => {
    if (response.clear) {
      setFileBack(null);
      return;
    }
    const {uri, filename, fileSize} = response;
    if (fileSize / 1024 / 1024 > 120) {
      ToastAndroid.show(`${errors.sizeFile} ${50}MB`, ToastAndroid.LONG);
      return;
    }
    let ext = filename.split('.').pop();
    let typeFile =
      ['jpg', 'jpeg', 'png', 'gif'].indexOf(ext) !== -1 ? 'image' : 'video';
    let type = `${typeFile}/${ext}`;
    await setFileBack({uri, name: filename, type, typeFile, size: fileSize});
    response.success();
  }, []);
  ////////////////////////////////////////
  useEffect(() => {
    isMedia &&
      navigate('cameraroll', {onFileChange, limit: 1, typeFiles: openType});
  }, []);
  ////////////////////////////////////////
  return (
    <OuterControlPostSticky>
      {isMedia ? (
        <ButtonPostCTR
          isRTL={isRTL}
          activeOpacity={0.8}
          onPress={() =>
            navigate('cameraroll', {
              onFileChange,
              limit: 1,
              typeFiles: openType,
            })
          }
          style={{
            backgroundColor: colors['back3'],
            width: moderateScale(30),
            height: moderateScale(30),
            borderRadius: moderateScale(30),
          }}>
          <PhotoSvg color="clr2" />
        </ButtonPostCTR>
      ) : (
        <>
          <ButtonPostCTR
            isRTL={isRTL}
            activeOpacity={0.8}
            onPress={() =>
              dispatch(
                Actions.type('setCurrentModalWithNav', {key: 'statusbacks'}),
              )
            }>
            <PaintSvg color="back3" />
          </ButtonPostCTR>
          <ButtonPostCTR
            isRTL={isRTL}
            style={{minWidth: moderateScale(55)}}
            activeOpacity={0.8}
            back="back3"
            enabled={false}
            onPress={restoreText}>
            <DeleteSvg size={moderateScale(17)} />
            <AnyText
              autoMargin={pixel(5)}
              isRTL={isRTL}
              size={moderateScale(15)}
              lineH={pixel(25)}
              color={'clr2'}
              lower>
              {miunsMax}
            </AnyText>
          </ButtonPostCTR>
        </>
      )}
      <ButtonPostCTR
        isRTL={isRTL}
        activeOpacity={0.8}
        back="clr1"
        onPress={createStatus}>
        <PostSvg size={moderateScale(17)} color="back3" />
        <AnyText
          autoMargin={pixel(5)}
          isRTL={isRTL}
          size={moderateScale(15)}
          color={'back3'}
          lower>
          {buttons.post}
        </AnyText>
      </ButtonPostCTR>
    </OuterControlPostSticky>
  );
};

export default memo(RenderCTRStatus);
