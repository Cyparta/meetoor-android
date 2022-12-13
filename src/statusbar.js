import React, { useMemo } from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux';
import { colors } from './styles/basecss';
///////////////////////////////////////
const StatusBarControl = () => {
    const isDark = useSelector(state => state.sign.isDark);
    const statusBarDark = useSelector(state => state.sign.statusBarDark);
    const popupImageWindow = useSelector(state => state.main.popupImageWindow);
    const handleDark = useMemo(() => {
        switch (true) {
            case statusBarDark:
            case popupImageWindow.open:
                return true;

            default:
                return isDark;
        }
    }, [popupImageWindow.open, statusBarDark, isDark]);
    ///////////////////////////////////
    const barStyle = handleDark ? "light-content" : "dark-content";
    const backgroundColor = colors[handleDark ? "clr1" : "back1"];
    ///////////////////////////////////
    return (<StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />)
}

export default StatusBarControl;
