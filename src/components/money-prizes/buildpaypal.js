import React, { useState } from 'react'
import { Modal } from 'react-native';
import { useSelector } from 'react-redux';
import { css } from 'styled-components';
import { pixel } from '../../styles/basecss';
import { AnyText } from '../home/helperprefernce';
import { WebView } from 'react-native-webview';
import { ButtonNormal } from '../home/sliderroom/helperroomcss';
// import PayPal from 'react-native-paypal-wrapper';
// import { requestOneTimePayment } from 'react-native-paypal';
// import RNPaypalSdk from "react-native-paypal-bridge-sdk";
// مشكلة reset password
// انشاء لينك خارجى لصراحه
// تحسين جزء اللايكات
///////////////////////////////////////////////////////
export default function BuildPayPal({ prizeInfo, callback }) {
    const { prize } = useSelector(state => state.sign.langData);
    const token = useSelector(state => state.sign.token);
    const isDark = useSelector(state => state.sign.isDark);
    const [open, setOpen] = useState(false);
    const uri = `https://meetoor.com/paypal/?amount=${prizeInfo.price}&token=${token}&prizeId=${prizeInfo.prizeid}&clientId=${prizeInfo.clientId}`;
    ////////////////////////////////////////
    return (<>
        <AnyText color={isDark ? "back2" : "clr1"}
            css={css`margin-bottom: ${pixel(2)};`}>
            {prize.mes1}
        </AnyText>
        <AnyText color={isDark ? "back2" : "clr1"}
            css={css`margin-bottom: ${pixel(2)};`}>
            {prize.mes2}
        </AnyText>
        <ButtonNormal radius={pixel(4)} back="clr2"
            css={css`margin: ${pixel(2)} 0;`}
            activeOpacity={0.8}
            onPress={() => setOpen(true)}>
            <AnyText color="back3">
                {`${prize.subscribe} ${prizeInfo.price}$`}
            </AnyText>
        </ButtonNormal>
        <Modal onRequestClose={() => {
            setOpen(false);
            callback && callback();
        }} animationType="fade" visible={open}>
            <WebView
                allowFileAccess={true}
                sharedCookiesEnabled={true}
                thirdPartyCookiesEnabled={true}
                allowUniversalAccessFromFileURLs={true}
                mediaPlaybackRequiresUserAction={false}
                mixedContentMode={'always'}
                allowsInlineMediaPlayback={true}
                originWhitelist={['https://*']}
                onLoadProgress={({ nativeEvent }) => {
                    let isEnd = nativeEvent.url.split("?").pop();
                    isEnd = isEnd.split("&")[0] === "done";
                    isEnd && setTimeout(() => {
                        setOpen(false);
                        callback && callback();
                    }, 1000);
                }}
                javaScriptEnabledAndroid={true}
                source={{ uri }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
                startInLoadingState={true}
                cacheEnabled={true}
                automaticallyAdjustContentInsets={true}
            />
        </Modal>
    </>)
}
