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
const BottomSectionView = ({ postId, keyArray }) => {
    const dispatch = useDispatch();
    const isDark = useSelector(state => state.sign.isDark);
    const mainSocket = useSelector(state => state.main.socket);
    const User = useSelector(state => state.main.user);
    const { placeholder } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    //////////////////////////////////////////////
    const HandelSendComment = useCallback(async (text, file, recordFile, virId) => {
        if (file) {
            let data = new FormData();
            data.append('CommentFile', file);
            data.append('postid', postId);
            //////////////////////////////////////////
            const response = await Axios.post("commentFile/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const commentFileId = response.data.commentid;
            if (commentFileId) mainSocket.emit("onComment", {
                commentText: text,
                commentid: commentFileId,
                postid: postId, virId
            });
        } else if (recordFile) {
            let data = new FormData();
            data.append('CommentFile', recordFile);
            data.append('postid', postId);
            //////////////////////////////////////////
            const response = await Axios.post("commentFile/", data, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            const commentFileId = response.data.commentid;
            if (commentFileId) mainSocket.emit("onComment", {
                commentText: text,
                commentid: commentFileId,
                postid: postId, virId
            });
        }
        else {
            mainSocket.emit("onComment", {
                "commentText": text,
                "postid": postId,
                virId
            });
        }
    }, [postId, mainSocket]);
    //////////////////////////////////////////////
    const sendComment = useCallback((text, file, recordFile) => {
        let virId = Math.random().toString(36).substr(2, 9);
        const commentFile = (file || recordFile) ? {
            base: file ? file.uri : recordFile ? recordFile.uri : null,
            name: file ? file.name : recordFile ? recordFile.name : ""
        } : null
        //////////////////////////////////////////
        const commentTemp = {
            commentText: recordFile ? "$record$" : text,
            commentFile,
            commentid: virId,
            date: Date.now(),
            fullName: User.fullName,
            isOwner: User.isOwner,
            isSecure: User.isSecure,
            numLikes: 0,
            numReplays: 0,
            userPhoto: User.UserPhoto,
            userid: User.userid,
            username: User.username,
            stillSend: true,
        }

        comonSound();
        dispatch(Actions.type("setComments", {
            type: 'add',
            data: {
                key: keyArray,
                val: commentTemp
            }
        }));
        HandelSendComment(recordFile ? "$record$" : text, file, recordFile, virId);
    }, [postId, mainSocket, keyArray]);
    ///////////////////////////////////////////////
    return (<TabBarBottom isDark={isDark} height="auto"
        css={css`padding: ${pixel(2)};border-width: 0px;flex-direction: column;`}>
        <ContentEditableMain
            callBack={sendComment}
            idName={"comments"}
            placehold={placeholder.addComment}
            allowRecord={true}
            allowFile={true}
            typeFile="Photos"
            autoFocus={false}
        />
    </TabBarBottom>)
}

export default memo(BottomSectionView);