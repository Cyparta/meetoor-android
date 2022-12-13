
import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from './reducer/actions';
import { Modalize } from 'react-native-modalize';
/////////////////////////////////////////////////
import { ModalBody, ModalHeader } from './helperapp';
import { colors } from './styles/basecss';
import { moderateScale } from 'react-native-size-matters';
/////////////////////////////////////////////////
let CreateRoomMeetoorModal = null;
let AlertMeetoorModal = null;
let DateMeetoorModal = null;
/////////////////////////////////////////////////
let ChoosePostCloneModal = null;
let ChoosePostBackModal = null;
let ChoosePostSatetModal = null;
let ChooseStoryMoreModal = null;
let CreateStatusModal = null;
let ChooseStatusBackModal = null;
/////////////////////////////////////////////////
let ChoosePostMoreModal = null;
let ChooseCommentMoreModal = null;
let ChooseReplyMoreModal = null;
let MainStickersModal = null;
let InputTextChangeModal = null;
/////////////////////////////////////////////////
let RenderTeamPhotoUploader = null;
let RenderImgUploader = null;
let ChooseProfileMoreModal = null;
let MessageMoreModal = null;
let ChatMoreModal = null;
let MessageTeamMoreModal = null;
/////////////////////////////////////////////////
let UpdateMeetoorModal = null;
/////////////////////////////////////////////////
const RenderModalize = () => {
    const dispatch = useDispatch();
    const currentModalWithNav = useSelector(state => state.modal.currentModalWithNav);
    ///////////////////////////////////////////////
    const RenderModal = useCallback(() => {
        switch (currentModalWithNav?.key) {
            case "createroom":
                if (CreateRoomMeetoorModal === null) {
                    CreateRoomMeetoorModal = require('./components/home/sliderroom/createroommodal').default;
                }
                return <CreateRoomMeetoorModal {...currentModalWithNav} />
            // case "createpost":
            //     if (CreatePostModal === null) {
            //         CreatePostModal = require('./components/posts/createpost/createpostmodal').default;
            //     }
            //     return <CreatePostModal {...currentModalWithNav} />
            case "storymore":
                if (ChooseStoryMoreModal === null) {
                    ChooseStoryMoreModal = require('./components/story/storymoremodal').default;
                }
                return <ChooseStoryMoreModal {...currentModalWithNav} />
            case "poststate":
                if (ChoosePostSatetModal === null) {
                    ChoosePostSatetModal = require('./components/posts/createpost/choosepostsate').default;
                }
                return <ChoosePostSatetModal {...currentModalWithNav} />
            case "postbacks":
                if (ChoosePostBackModal === null) {
                    ChoosePostBackModal = require('./components/posts/createpost/choosepostback').default;
                }
                return <ChoosePostBackModal {...currentModalWithNav} />
            case "createstatus":
                if (CreateStatusModal === null) {
                    CreateStatusModal = require('./components/home/sliderstatus/createstatusmodal').default;
                }
                return <CreateStatusModal {...currentModalWithNav} />
            case "postmore":
                if (ChoosePostMoreModal === null) {
                    ChoosePostMoreModal = require('./components/posts/posts/postmoremodal').default;
                }
                return <ChoosePostMoreModal {...currentModalWithNav} />
            case "commentmore":
                if (ChooseCommentMoreModal === null) {
                    ChooseCommentMoreModal = require('./components/posts/postview/commentmoremodal').default;
                }
                return <ChooseCommentMoreModal {...currentModalWithNav} />
            case "replymore":
                if (ChooseReplyMoreModal === null) {
                    ChooseReplyMoreModal = require('./components/posts/commentview/replymoremodal').default;
                }
                return <ChooseReplyMoreModal {...currentModalWithNav} />
            case "postclone":
                if (ChoosePostCloneModal === null) {
                    ChoosePostCloneModal = require('./components/posts/posts/postclonemodal').default;
                }
                return <ChoosePostCloneModal {...currentModalWithNav} />
            case "statusbacks":
                if (ChooseStatusBackModal === null) {
                    ChooseStatusBackModal = require('./components/home/createstatus/choosestatusback').default;
                }
                return <ChooseStatusBackModal {...currentModalWithNav} />
            case "setsticker":
                if (MainStickersModal === null) {
                    MainStickersModal = require('./components/profile/choosestickermodal').default;
                }
                return <MainStickersModal {...currentModalWithNav} />
            case "uploadimg":
                if (RenderImgUploader === null) {
                    RenderImgUploader = require('./main/imguploader/imguploader').default;
                }
                return <RenderImgUploader {...currentModalWithNav} />
            case "uploadimg-team":
                if (RenderTeamPhotoUploader === null) {
                    RenderTeamPhotoUploader = require('./components/team/uploadteamphoto').default;
                }
                return <RenderTeamPhotoUploader {...currentModalWithNav} />
            case "profilemore":
                if (ChooseProfileMoreModal === null) {
                    ChooseProfileMoreModal = require('./components/profile/rendercontrol/profilemoremodal').default;
                }
                return <ChooseProfileMoreModal {...currentModalWithNav} />
            case "inputtextmodal":
                if (InputTextChangeModal === null) {
                    InputTextChangeModal = require('./components/settings/inputtextmodal').default;
                }
                return <InputTextChangeModal {...currentModalWithNav} />
            case "alert":
                if (AlertMeetoorModal === null) {
                    AlertMeetoorModal = require('./main/meetooralertmodal').default;
                }
                return <AlertMeetoorModal {...currentModalWithNav} />
            case "datepicker":
                if (DateMeetoorModal === null) {
                    DateMeetoorModal = require('./main/meetoordatemodal').default;
                }
                return <DateMeetoorModal {...currentModalWithNav} />
            case "messagemore":
                if (MessageMoreModal === null) {
                    MessageMoreModal = require('./components/chatmessage/messagemoremodal').default;
                }
                return <MessageMoreModal {...currentModalWithNav} />
            case "msgteammore":
                if (MessageTeamMoreModal === null) {
                    MessageTeamMoreModal = require('./components/chatteam/msgteammoremodal').default;
                }
                return <MessageTeamMoreModal {...currentModalWithNav} />
            case "chatmore":
                if (ChatMoreModal === null) {
                    ChatMoreModal = require('./components/chatmessage/chatmoremodal').default;
                }
                return <ChatMoreModal {...currentModalWithNav} />
            case "newupdate":
                if (UpdateMeetoorModal === null) {
                    UpdateMeetoorModal = require('./meetoorupdatemodal').default;
                }
                return <UpdateMeetoorModal {...currentModalWithNav} />
            default:
                return null;
        }
    }, [currentModalWithNav]);
    ///////////////////////////////////////////////
    return (<Modalize ref={(ref) => {
        dispatch(Actions.type("setModalizeWithNav", ref));
    }}
        // snapPoint={300}
        modalStyle={{ backgroundColor: colors['back3'] }}
        handleStyle={{
            width: moderateScale(110),
            height: moderateScale(5),
            backgroundColor: colors["clr2"]
        }}
        // modalHeight={900}
        // alwaysOpen={true}
        scrollViewProps={{ keyboardShouldPersistTaps: 'handled' }}
        onClose={() => dispatch(Actions.type("setCurrentModalWithNav", null))}
        handlePosition="inside"
        avoidKeyboardLikeIOS={true}
        disableScrollIfPossible={false}
        adjustToContentHeight
        keyboardAvoidingBehavior="height"
        HeaderComponent={<ModalHeader />}>
        <ModalBody>
            <RenderModal />
        </ModalBody>
    </Modalize>);
}

export default memo(RenderModalize);