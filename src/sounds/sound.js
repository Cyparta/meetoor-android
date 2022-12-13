import SoundReactNative from "react-native-sound";
//////////////////////////////////////////////////////////
const buildSound = (type, loop = false, volume = 1) => {
    try {
        const Sound = new SoundReactNative(`${type}.mp3`,
            SoundReactNative.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed loading', error);
                    return;
                }
                Sound.play((success) => {
                    if (success) {
                        console.log('successfully finished');
                    } else {
                        console.log('playback failed');
                    }
                    Sound.release();
                });
            });
        Sound.setCurrentTime(0);
        Sound.setVolume(volume);
        if (loop) Sound.setNumberOfLoops(-1);
    } catch (e) {
        console.log("buildSound ~ e", e)
    }
}
//////////////////////////////////////////////////////////
export const likeSound = () => buildSound('heart');
//////////////////////////////////////////////////////////
export const chatSound = () => buildSound('message');
//////////////////////////////////////////////////////////
export const notifySound = () => buildSound('notification');
//////////////////////////////////////////////////////////
// export const openLikeSound = () => buildSound('openlike', false, 0.0);
//////////////////////////////////////////////////////////
export const comonSound = () => buildSound('comeon');
//////////////////////////////////////////////////////////
export const callingSound = () => buildSound('oncalling', true);
//////////////////////////////////////////////////////////
export const onCallSound = () => buildSound('calling', true);
//////////////////////////////////////////////////////////
export const notAvilable = () => buildSound('none', true);