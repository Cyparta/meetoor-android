import { PermissionsAndroid } from 'react-native';
/////////////////////////////////////////////////////
export const WritePermission = async (callback) => {
  try {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

    if (!permission) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      callback && callback();
    }
  } catch (err) {
    console.warn(err);
  }
}
export const ReadPermission = async (callback = null) => {
  try {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

    if (!permission) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

      WritePermission(callback);
    } else {
      WritePermission();
    }
  } catch (err) {
    console.warn(err);
  }
}
export const ContactPermission = async () => {
  try {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);

    if (!permission) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      ReadPermission();
    } else {
      ReadPermission();
    }
  } catch (err) {
    console.warn(err);
  }
}
export const CameraPermission = async () => {
  try {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

    if (!permission) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

      ContactPermission();
    } else {
      ContactPermission();
    }
  } catch (err) {
    console.warn(err);
  }
}
export const RecordPermission = async () => {
  try {
    let permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

    if (!permission) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

      CameraPermission();
    } else {
      CameraPermission();
    }

  } catch (err) {
    console.warn(err);
  }
}

// export const RateMeetoorOnMarket = async () => {
//   try {
//     InAppReview.isAvailable();
//     InAppReview.RequestInAppReview()
//       .then((hasFlowFinishedSuccessfully) => {
//         // when return true in android it means user finished or close review flow
//         console.log('InAppReview in android', hasFlowFinishedSuccessfully);

//         // when return true in ios it means review flow lanuched to user.
//         console.log(
//           'InAppReview in ios has launched successfully',
//           hasFlowFinishedSuccessfully,
//         );

//         // 1- you have option to do something ex: (navigate Home page) (in android).
//         // 2- you have option to do something,
//         // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

//         // 3- another option:
//         if (hasFlowFinishedSuccessfully) {
//           // do something for ios
//           // do something for android
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   } catch (err) {
//     console.warn(err);
//   }
// }