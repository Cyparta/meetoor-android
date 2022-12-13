// import React, { memo, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RenderBodyModal, TopModalOuter, UserInfoModal } from '../../home/sliderroom/helperroomcss';
// import { RenderAnyUserPhoto } from '../../home/helperhome';
// import { AnyText, OuterUserName } from '../../home/helperprefernce';
// import { OuterItemModal } from './helpercreatepostcss';
// import { EditPenSvg, PhotoSvg } from '../../../icons/all';
// import Actions from '../../../reducer/actions';
// import { pixel } from '../../../styles/basecss';
// import { moderateScale } from 'react-native-size-matters';
// ////////////////////////////////////////////
// const CreatePostModal = ({ target, teamid }) => {
//     const dispatch = useDispatch();
//     const { placeholder, badges } = useSelector(state => state.sign.langData);
//     const User = useSelector(state => state.main.user);
//     const { navigate } = useSelector(state => state.modal.navigation);
//     const isRTL = useSelector(state => state.sign.isRTL);
//     const modalizeWithNav = useSelector(state => state.modal.modalizeWithNav);
//     ////////////////////////////////////////
//     const GoToPage = useCallback(({ isMedia }) => {
//         navigate("createpost", { isMedia, target, teamid });
//         dispatch(Actions.type("setBackgroundPost", 0));
//         modalizeWithNav.close();
//     }, [navigate, modalizeWithNav, teamid, target]);
//     ////////////////////////////////////////
//     return (<RenderBodyModal>
//         <TopModalOuter>
//             <UserInfoModal>
//                 <RenderAnyUserPhoto userPhoto={User.UserPhoto} size={pixel(45)} />
//                 <OuterUserName>
//                     <AnyText isRTL={isRTL} size={moderateScale(13)} color="clr2">{User.fullName}</AnyText>
//                     <AnyText isRTL={isRTL} color="clr1" lower target lineH={pixel(15)}>
//                         {badges.createpost}
//                     </AnyText>
//                 </OuterUserName>
//             </UserInfoModal>
//         </TopModalOuter>

//         <OuterItemModal isRTL={isRTL}
//             onPress={() => GoToPage({ isMedia: false })}>
//             <EditPenSvg color="clr2" size={moderateScale(18)} />
//             <AnyText isRTL={isRTL} size={moderateScale(13)}
//                 autoMargin={pixel(7)} color="clr2">
//                 {placeholder.addText}
//             </AnyText>
//         </OuterItemModal>

//         <OuterItemModal isRTL={isRTL}
//             onPress={() => GoToPage({ isMedia: true })}>
//             <PhotoSvg color="clr2" size={moderateScale(18)} />
//             <AnyText isRTL={isRTL} size={moderateScale(13)}
//                 autoMargin={pixel(7)} color="clr2">
//                 {placeholder.addImgVideo}
//             </AnyText>
//         </OuterItemModal>

//     </RenderBodyModal>)
// }

// export default memo(CreatePostModal)
