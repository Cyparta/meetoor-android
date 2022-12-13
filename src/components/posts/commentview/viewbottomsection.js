import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../reducer/actions';
import { TabBarBottom } from '../../home/helperhome';
import ContentEditableMain from '../../../main/editable/editable';
import { css } from 'styled-components';
import { comonSound } from '../../../sounds/sound';
import Axios from '../../../main/Axios';
import { pixel } from '../../../styles/basecss';
///////////////////////////////////////////////////
const BottomSectionView = ({ commentId, keyArray }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const User = useSelector(state => state.main.user);
    const { placeholder } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    //////////////////////////////////////////////
    const HandelSendReply = useCallback(async (text, file, recordFile, virId) => {
        if (file) {
            let data = new FormData();
            data.append('ReplayFile', file);
            data.append('commentid', commentId);
            //////////////////////////////////////////
            const response = await Axios.post("replayFile/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const replyFileId = response.data.replayid;
            if (replyFileId) mainSocket.emit("onReply", {
                replayText: text,
                replayid: replyFileId,
                commentid: commentId,
                virId
            });
        } else if (recordFile) {
            let data = new FormData();
            data.append('ReplayFile', recordFile);
            data.append('commentid', commentId);
            //////////////////////////////////////////
            const response = await Axios.post("replayFile/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const replyFileId = response.data.replayid;
            if (replyFileId) mainSocket.emit("onReply", {
                replayText: text,
                replayid: replyFileId,
                commentid: commentId, virId
            });
        }
        else {
            mainSocket.emit("onReply", {
                "replayText": text,
                "commentid": commentId,
                virId
            });
        }
    }, [commentId, mainSocket]);
    //////////////////////////////////////////////
    const sendReply = useCallback((text, file, recordFile) => {
        let virId = Math.random().toString(36).substr(2, 9);
        const replayFile = (file || recordFile) ? {
            base: file ? file.uri : recordFile ? recordFile.uri : null,
            name: file ? file.name : recordFile ? recordFile.name : ""
        } : null
        //////////////////////////////////////////
        const replyTemp = {
            replayText: recordFile ? "$record$" : text,
            replayFile,
            replayid: virId,
            date: Date.now(),
            fullName: User.fullName,
            isOwner: User.isOwner,
            isSecure: User.isSecure,
            userPhoto: User.UserPhoto,
            userid: User.userid,
            username: User.username,
            stillSend: true,
        }

        comonSound();
        dispatch(Actions.type("setReplys", {
            type: 'add',
            data: {
                key: keyArray,
                val: replyTemp
            }
        }));
        HandelSendReply(recordFile ? "$record$" : text, file, recordFile, virId);
    }, [commentId, mainSocket, keyArray]);
    ///////////////////////////////////////////////
    return (<TabBarBottom isDark={isDark} height="auto"
        css={css`padding: ${pixel(2)};border-width: 0px;
            flex-direction: column;`}>
        <ContentEditableMain
            callBack={sendReply}
            idName={"replys"}
            placehold={placeholder.addReply}
            allowRecord={true}
            allowFile={true}
            typeFile="Photos"
            autoFocus={false}
        />
    </TabBarBottom>)
}

export default memo(BottomSectionView);