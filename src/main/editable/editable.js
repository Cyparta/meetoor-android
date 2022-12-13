import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import FetchBlob from 'rn-fetch-blob';
import { replaceMentionValues } from 'react-native-controlled-mentions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useDispatch, useSelector } from 'react-redux';
import { CloseSvg, SendSvg } from '../../icons/all';
import Actions from '../../reducer/actions';
import MicRecorder from './mic-recorder';
import { OtherControls, BarUploadFile, InputTextMemo } from "./helper";
import { ToastAndroid, Vibration } from 'react-native';
import { RenderFileHTMLNorm } from '../renderfile/renderfile';
import {
    OuterInputEditable, OuterInputTextArea, OuterTextArea,
    OuterButtonIcon, OuterOtherControl,
    PartFilesLoad, OuterButtonClose
} from './editablecss';
import { moderateScale } from 'react-native-size-matters';
import { RenderMentionsUint } from '../helpertextarea';
//////////////////////////////////////////////////////////
const AudioRecord = new AudioRecorderPlayer();
//////////////////////////////////////////////////////////
const ContentEditableMain = ({ callBack, editableRef, disabled = false,
    onkeydown = () => { }, onfocus = () => { }, onblur = () => { },
    idName = "editable", allowRecord = true, allowFile = true, forceDark = false,
    placehold = "type some thing..", isStillFillSend = false, typeFile = "All",
    maxSize = 50, progress = null, space = 10, css, autoFocus = true
}) => {
    const { placeholder, schema } = useSelector(state => state.sign.langData);
    const replyWin = useSelector(state => state.main.replyWin);
    const isDark = useSelector(state => state.sign.isDark);
    const windowSize = useSelector(state => state.sign.windowSize);
    const dispatch = useDispatch();
    const [file, setFiles] = useState(null);
    const [openRecord, setOpenRecord] = useState(false);
    const [recordFile, setRecordFile] = useState(null);
    const EditableRef = useRef(null);
    const [isOut, setIsOut] = useState(true);
    const [currentText, setCurrentText] = useState("");
    const [record, setRecord] = useState(false);
    const [otherIconsWidth] = useState(() => {
        if (allowFile && allowRecord) return (2 * 35) + (space + 8);
        else if (allowFile || allowRecord) return 35 + (space + 4);
        else return space;
    });
    const maxContent = 3000;
    const [textAreaHeight, setTextAreaHeight] = useState(35);
    const [outerAreaWidth, setOuterAreaWidth] = useState(`${windowSize.width - moderateScale(otherIconsWidth)}px`);
    ///////////////////////////////////////////////////////
    useEffect(() => {
        setOuterAreaWidth(`${windowSize.width - (isOut ? moderateScale(otherIconsWidth) : moderateScale(space + 18))}px`);
    }, [isOut, windowSize]);
    ///////////////////////////////////////////////////////
    const setFilesBack = useCallback((para = null) => setFiles(para), []);
    ///////////////////////////////////////////////////
    const sendChatByButton = useCallback(() => {
        if (isStillFillSend) return;
        if (currentText.length < 1 && !file && !recordFile) {
            ToastAndroid.show(`${placeholder.someThing}\n${schema.valid.char1}`, ToastAndroid.LONG);
            return;
        }
        let parseText = replaceMentionValues(currentText, ({ name }) => `@${name}`);
        callBack(parseText, file, recordFile || null, replyWin?.refId || 0, replyWin?.obj || 0);
        setFilesBack();
        setRecordFile(null);
        setOpenRecord(false);
        replyWin && dispatch(Actions.type("setReplyWin", false));
        EditableRef.current.clear();
        setCurrentText("");
        setTextAreaHeight(35);
        !recordFile && EditableRef.current.focus();
    }, [
        EditableRef.current, currentText, callBack, recordFile,
        isStillFillSend, replyWin, file
    ]);
    ///////////////////////////////////////////////////////
    useEffect(() => {
        editableRef && editableRef(EditableRef)
    }, [editableRef]);
    ///////////////////////////////////////////////////////
    const startRecord = useCallback(async () => {
        EditableRef.current.clear();
        setTextAreaHeight(35);
        Vibration.vibrate(70);
        setOpenRecord(true);
        const path = FetchBlob?.fs?.dirs;
        await AudioRecord.startRecorder(`${path.CacheDir}/record.mp3`);
        setRecord(true);
    }, [AudioRecord, EditableRef.current, FetchBlob]);
    ///////////////////////////////////////////////////////
    const stopRecord = useCallback(async () => {
        setRecord(false);
        Vibration.vibrate(70);
        let audioFile = await AudioRecord.stopRecorder();
        console.log("stopRecord ~ audioFile", audioFile)
        setRecordFile({
            uri: audioFile,//`file://${audioFile.path}`,
            type: 'audio/mp3',
            name: audioFile.split('/').pop()
        });
    }, [AudioRecord]);
    ///////////////////////////////////////////////////////
    const clearRecordAction = useCallback(() => {
        setRecordFile(null);
        setOpenRecord(false);
    }, []);
    ///////////////////////////////////////////////////////
    useEffect(() => {
        if (EditableRef?.current) {
            EditableRef.current.clear();
            setFilesBack();
            setRecordFile(null);
            setOpenRecord(false);
            dispatch(Actions.type("setReplyWin", false));
        }
    }, [EditableRef, idName]);
    const darkByForce = useMemo(() => forceDark ? true : isDark, [forceDark, isDark]);
    ///////////////////////////////////////////////////////
    return (<>
        {replyWin ? <PartFilesLoad isDark={darkByForce}>
            {replyWin.html}
            <OuterButtonClose rgba
                onPress={() => dispatch(Actions.type("setReplyWin", false))}>
                <CloseSvg size={moderateScale(13)} />
            </OuterButtonClose>
        </PartFilesLoad> : null}

        {file ? <PartFilesLoad isDark={darkByForce}>
            <RenderFileHTMLNorm file={file} />
            <OuterButtonClose onPress={() => setFilesBack()}>
                <CloseSvg size={moderateScale(13)} />
            </OuterButtonClose>
        </PartFilesLoad> : null}

        {idName === "chat" ? null : <RenderMentionsUint style={{ position: "relative", marginBottom: moderateScale(5) }} />}

        <OuterInputEditable multi={textAreaHeight > 45} css={css}>
            <OuterOtherControl>
                <OtherControls allowFile={allowFile} typeFile={typeFile}
                    allowRecord={allowRecord} setFilesBack={setFilesBack}
                    isStillFillSend={isStillFillSend} maxSize={maxSize} isDark={darkByForce}
                    startRecord={startRecord} stopRecord={stopRecord} record={record}
                    setIsOut={() => setIsOut(true)} isOut={isOut}
                    clearRecord={clearRecordAction} />
            </OuterOtherControl>

            <OuterInputTextArea width={outerAreaWidth}
                multi={textAreaHeight > 45} transition="width">
                <OuterTextArea multi={textAreaHeight > 45} isDark={darkByForce}>
                    {allowRecord ? openRecord ? <MicRecorder handleRecord={recordFile}
                        clearRecord={clearRecordAction} record={record} isDark={darkByForce} /> : null : null}
                    {progress !== null && <BarUploadFile progress={progress} />}
                    <InputTextMemo textAreaHeight={textAreaHeight} EditableRef={EditableRef}
                        disabled={disabled} autoFocus={autoFocus} isDark={darkByForce}
                        currentText={currentText} setIsOut={setIsOut}
                        setTextAreaHeight={setTextAreaHeight}
                        setCurrentText={setCurrentText} maxContent={maxContent}
                        onblur={onblur} onkeydown={onkeydown}
                        placehold={placehold} onfocus={onfocus} />
                </OuterTextArea>

                <OuterButtonIcon onPress={sendChatByButton} >
                    <SendSvg color="clr2" size={moderateScale(20)} />
                </OuterButtonIcon>
            </OuterInputTextArea>
        </OuterInputEditable>
    </>)
}

export default memo(ContentEditableMain);