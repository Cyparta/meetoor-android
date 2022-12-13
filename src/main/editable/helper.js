import React, { useCallback, memo, useState, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastAndroid } from 'react-native';
import { ArrowSvg, BackSvg, LockSvg, MicSvg, PhotoSvg } from '../../icons/all';
import {
    OuterButtonIcon,
    OuterBarRecord,
    ProgressInfo,
    ProgressBar,
    FiledInputEditable
} from './editablecss';
import { Animated, PanResponder, Vibration } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { css } from 'styled-components';
import { colors, pixel } from '../../styles/basecss';
import { OuterAnyView } from '../../components/home/helperhome';
import { ReactionIconAnim } from '../../icons/reaction';
import Actions from '../../reducer/actions';
/////////////////////////////////////////////////////////
export const BarUploadFile = ({ progress }) => {
    return (<OuterBarRecord>
        <ProgressInfo>{progress || 0}%</ProgressInfo>
        <ProgressBar progress={progress || 0} />
    </OuterBarRecord>)
}
/////////////////////////////////////////////////////////
export const RenderRecord = memo(({ startRecord, stopRecord, clearRecord, record, isDark }) => {
    const pan = React.useRef(new Animated.ValueXY()).current;
    const [long, setLong] = useState(false);
    const isRecord = React.useRef(record);
    /////////////////////////////////////////////////////
    const [panResponder] = React.useState(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onShouldBlockNativeResponder: () => false,
        onPanResponderTerminationRequest: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dy) > 10;
        },
        onPanResponderStart: () => {
            if (!isRecord.current) {
                clearRecord();
                startRecord();
            }
        },
        onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
        onPanResponderEnd: () => {
            Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false,
            }).start();
            if (Math.abs(parseInt(pan.y._value)) > 65) {
                Vibration.vibrate(70);
                setLong(true);
            } else {
                stopRecord();
                setLong(false);
            }
        }
    }));
    //////////////////////////////////////////////////////
    React.useEffect(() => isRecord.current = record, [record]);
    //////////////////////////////////////////////////////
    return (<OuterAnyView radius={moderateScale(30)} back={isDark ? "clr3" : "back3"}
        css={css`border-width: 0px;height: ${pixel(long ? 30 : record ? 90 : 30)};margin-left: ${pixel(6)};padding: 0;
            width: ${pixel(30)};justify-content: flex-start;align-items:flex-end;overflow: hidden;`}
        {...panResponder.panHandlers}>
        <OuterAnyView back="trans"
            css={css`width: ${pixel(30)};height: ${pixel(30)};
                justify-content: center;position: absolute;top: 0px;`}>
            <LockSvg color={isDark ? "back2" : "clr2"} size={moderateScale(16)} />
        </OuterAnyView>
        <ReactionIconAnim back="trans" duration={1000}
            animation={record ? "slideInUp" : null}
            direction="alternate-reverse" iterationCount={7}
            css={css`width: ${pixel(30)};height: ${pixel(30)};align-items: center;
                justify-content: center;position: absolute;top: ${pixel(20)};`}>
            <BackSvg rot={-90} color={isDark ? "back2" : "blu"} size={moderateScale(15)} />
        </ReactionIconAnim>
        <Animated.View style={{
            transform: [{ translateY: pan.y }]
        }}>
            <OuterAnyView radius={moderateScale(30)} back={isDark ? "clr3" : "back3"}
                css={css`width: ${pixel(30)};height: ${pixel(30)};justify-content: center;`}>
                {long ? <LockSvg color="red2" size={moderateScale(17)} /> : <MicSvg color="clr2" size={moderateScale(17)} />}
            </OuterAnyView>
        </Animated.View>
    </OuterAnyView>)
});
/////////////////////////////////////////////////////////
export const OtherControls = memo(({ isStillFillSend, allowFile, typeFile, record, isDark,
    allowRecord, maxSize, setFilesBack, startRecord, stopRecord, isOut, setIsOut, clearRecord }) => {
    const { errors } = useSelector(state => state.sign.langData);
    const { navigate } = useSelector(state => state.modal.navigation);
    ///////////////////////////////////////////////////////
    const onFileChange = useCallback(async (response) => {
        if (response.clear) {
            setFilesBack(null);
            return;
        }
        const { uri, filename, fileSize } = response;
        if ((fileSize / 1024 / 1024) > maxSize) {
            ToastAndroid.show(`${errors.sizeFile} ${maxSize}MB`, ToastAndroid.LONG);
            return;
        }
        let ext = filename.split('.').pop();
        let typeFile = ["jpg", "jpeg", "png", "gif"].indexOf(ext) !== -1 ? "image" : "video";
        let type = `${typeFile}/${ext}`;
        await setFilesBack({ uri, name: filename, type, typeFile, size: fileSize });
        response.success();
    }, []);
    ///////////////////////////////////////////
    return (isOut ? <>
        {allowFile && <>
            {isStillFillSend ? null : <OuterButtonIcon back isDark={isDark} hide={isStillFillSend}
                onPress={() => navigate("cameraroll", { onFileChange, limit: 1, typeFiles: typeFile })}>
                <PhotoSvg color="clr2" size={moderateScale(17)} />
            </OuterButtonIcon>}
        </>}
        {allowRecord && <RenderRecord record={record} clearRecord={clearRecord}
            startRecord={startRecord} stopRecord={stopRecord} isDark={isDark} />}
    </> : <OuterButtonIcon activeOpacity={1} onPress={setIsOut}
        css={css`border-radius: 0;justify-content: flex-start;z-index: 2;`}>
        <ArrowSvg color="clr2" rot={90} size={moderateScale(17)} />
    </OuterButtonIcon>)
});
/////////////////////////////////////////////////////////
export const InputTextMemo = memo(({ textAreaHeight, EditableRef, disabled, autoFocus, currentText, isDark,
    setIsOut, setTextAreaHeight, setCurrentText, maxContent, onblur, onfocus, onkeydown, placehold }) => {
    const dispatch = useDispatch();
    ////////////////////////////////////////
    const waitType = useRef(0);
    const mainSocket = useSelector(state => state.main.socket);
    const [Keyword, setKeyword] = useState(null);
    console.log("line 137 ~ Keyword", Keyword)
    ////////////////////////////////////////
    useEffect(() => {
        clearTimeout(waitType.current || 0);
        waitType.current = setTimeout(() => {
            if (!Keyword) {
                dispatch(Actions.type("onSuggestionPress", "close"));
                return;
            };
            mainSocket.emit("onSearch", {
                search: Keyword.toLowerCase(),
                forMention: true,
            });
        }, 1200);
        return () => clearTimeout(waitType.current || 0);
    }, [Keyword]);
    ////////////////////////////////////////
    const PATTERN = useMemo(() => ([
        {
            trigger: '@',
            renderSuggestions: ({ keyword, onSuggestionPress }) => {
                if (keyword && keyword.replace("@", '').trim()?.length) {
                    setKeyword(keyword);
                    dispatch(Actions.type("onSuggestionPress", onSuggestionPress));
                } else setKeyword(null);
                return null;
            },
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /#(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!1_(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!2_(\S|_)+/gi,
            textStyle: { color: colors['blu'] },
        },
        {
            pattern: /!3_(\S|_)+/gi,
            textStyle: { color: colors['red2'] },
        },
        {
            pattern: /!4_(\S|_)+/gi,
            textStyle: { color: colors['gold'] },
        },
        {
            pattern: /!١_(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!٢_(\S|_)+/gi,
            textStyle: { color: colors['blu'] },
        },
        {
            pattern: /!٣_(\S|_)+/gi,
            textStyle: { color: colors['red2'] },
        },
        {
            pattern: /!٤_(\S|_)+/gi,
            textStyle: { color: colors['gold'] },
        }
    ]), []);
    ///////////////////////////////////////////
    return (<FiledInputEditable
        maxLength={maxContent}
        multiline
        numberOfLines={4}
        height={textAreaHeight + "px"}
        isDark={isDark}
        placeholderTextColor={colors["clr2"]}
        inputRef={EditableRef}
        autoFocus={autoFocus}
        onBlur={onblur}
        onKeyPress={onkeydown}
        editable={!disabled}
        placeholder={placehold}
        containerStyle={{ width: "100%" }}
        partTypes={PATTERN}
        onFocus={(e) => {
            onfocus(e);
            setIsOut(false);
        }}
        onPressIn={() => setIsOut(false)}
        onEndEditing={(e) => {
            setIsOut(true);
        }}
        onContentSizeChange={(e) => {
            let height = parseInt(e.nativeEvent.contentSize.height);
            if (height <= 45) setTextAreaHeight(35);
            else setTextAreaHeight(height)
        }}
        value={currentText}
        onChange={(text) => {
            setCurrentText(text);
        }}
    />)
});