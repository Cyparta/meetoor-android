import { useCallback } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';
////////////////////////////////////////////
let clickCountToBack = 0;
const useGoBack = () => {
    const { placeholder } = useSelector(state => state.sign.langData);
    const { goBack, canGoBack } = useSelector(state => state.modal.navigation);
    ////////////////////////////////////////
    const handleBack = useCallback(() => {
        if (canGoBack()) {
            goBack();
        } else {
            setTimeout(() => {
                clickCountToBack = 0;
            }, 2000);
            if (clickCountToBack === 0) {
                clickCountToBack += 1;
                ToastAndroid.show(placeholder.exit, ToastAndroid.SHORT);
            } else if (clickCountToBack === 1) {
                BackHandler.exitApp();
            };
        }
    }, [canGoBack, goBack, clickCountToBack, placeholder.exit]);
    ////////////////////////////////////////
    return handleBack;
};

export default useGoBack;