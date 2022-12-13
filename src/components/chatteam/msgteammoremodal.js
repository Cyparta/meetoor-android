import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RenderBodyModal, OuterButtonControl, ButtonNormal } from '../home/sliderroom/helperroomcss';
import { CopySvg, ReplySvg } from '../../icons/all';
import { copyToClipboard } from '../../reducer/helper';
import { css } from 'styled-components';
import { AnyText, OuterUserName } from '../home/helperprefernce';
import { colors, pixel } from '../../styles/basecss';
import Actions from '../../reducer/actions';
import { RefChatElement } from './helper';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const MessageMoreModal = ({ msgid, text, file, date, justSeen }) => {
    const dispatch = useDispatch();
    const { placeholder, buttons, messages } = useSelector(state => state.sign.langData);
    const lang = useSelector(state => state.sign.lang);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
    const Time = useSelector(state => state.main.time);
    ////////////////////////////////////////
    const onReply = useCallback(() => {
        dispatch(Actions.type("setReplyWin", {
            html: <OuterUserName isRTL={isRTL}
                css={css`width: auto;margin-bottom: ${pixel(2)};padding: 0px;`}>
                <RefChatElement text={text} file={file} />
            </OuterUserName>,
            obj: { text, file },
            refId: msgid
        }));
        modalizeWithNav.close();
    }, [modalizeWithNav, text, msgid, file]);
    ////////////////////////////////////////
    const onCopy = useCallback(() => {
        copyToClipboard(text, messages.copied);
        modalizeWithNav.close();
    }, [modalizeWithNav, text, messages]);
    ////////////////////////////////////////
    return (<RenderBodyModal>
        {justSeen ? null : <OuterButtonControl
            css={css`width: 100%;max-width: 100%;`}>
            {/* {isMe ? <ButtonNormal onPress={onDelete}
                css={css`border: 0px;`} isRTL={isRTL}>
                <DeleteSvg size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color="red2" autoMargin={pixel(6)}>{buttons.delete}</AnyText>
            </ButtonNormal> : null} */}
            <ButtonNormal onPress={onReply}
                css={css`border: 0px;`} isRTL={isRTL}>
                <ReplySvg color="clr2" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color="clr2" autoMargin={pixel(6)}>{buttons.reply}</AnyText>
            </ButtonNormal>
            <ButtonNormal onPress={onCopy} css={css`border: 0px;`} isRTL={isRTL}>
                <CopySvg color="clr3" size={moderateScale(18)} />
                <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                    color="clr2" autoMargin={pixel(6)}>{buttons.copy}</AnyText>
            </ButtonNormal>
        </OuterButtonControl>}
        <OuterButtonControl
            css={css`width: 100%;max-width: 100%;border-top-width: 1px;
                border-color: ${colors["clr2"]};padding-top: ${pixel(8)};margin-top: ${pixel(4)};`}>
            <AnyText isRTL={isRTL} size={moderateScale(13)} lower
                color="clr2">{justSeen ? placeholder.seenAt : null} {Time.setDate(date,lang).toDay}</AnyText>
        </OuterButtonControl>
    </RenderBodyModal>)
}

export default memo(MessageMoreModal);