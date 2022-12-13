import AsyncStorage from '@react-native-community/async-storage';
import React, { memo, useEffect, useState } from 'react';
// import { NativeModules } from 'react-native';
import RNRestart from 'react-native-restart';
import { DotIndicator } from 'react-native-indicators';
import { moderateScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { DeleteSvg } from '../../icons/all';
import Actions from '../../reducer/actions';
import { colors, flexDisplay, font, pixel, Rgba } from '../../styles/basecss';
////////////////////////////////////////////////
const OuterAccountsTag = styled.View`
    width: 100%;
    height: auto;
    margin: auto;
    ${() => flexDisplay({
    dir: "column",
    align: "flex-start",
    justify: "flex-start",
})};
`;
////////////////////////////////////////////////
export const HeaderAccounts = styled.Text`
    ${flexDisplay};
    width: ${pixel(270)};
    height: ${pixel(42)};
    min-height: ${pixel(42)};
    margin: auto;
    ${(props) => font({ size: pixel(14), line: pixel(42), isAr: props.isRTL, align: "center" })};
    text-transform: capitalize;
    border-radius: ${pixel(10)};
    color: ${colors["clr1"]};
    background: ${colors["back3"]};
`;
////////////////////////////////////////////////
const BodyAccounts = styled.View`
    width: 100%;
    height: auto;
    ${() => flexDisplay({
    dir: "column",
    align: "flex-start",
    justify: "flex-start",
})};
`;
////////////////////////////////////////////////
const AccountTag = styled.TouchableOpacity`
    width: 100%;
    height: ${pixel(42)};
    overflow: hidden;
    position: relative;
    border-radius: ${pixel(10)};
    ${() => flexDisplay({
    justify: "flex-start",
})};
    background: ${colors["back1"]};
    border-width: ${pixel(1)};
    border-style: solid;
    border-color: ${() => Rgba(colors["clr3"], 0.1)};
    ${(props) => props.last ? "margin-bottom: 0px;" : `margin-bottom: ${pixel(6)};`};
`;
////////////////////////////////////////////////
const InfoAccounts = styled.Text`
    ${flexDisplay};
    width: 100%;
    height: ${pixel(42)};
    min-height: ${pixel(42)};
    margin: auto;
    ${(props) => font({ size: pixel(14), line: pixel(42), isAr: props.isRTL, align: "center" })};
    color: ${colors["clr2"]};
    padding: 0px ${pixel(6)};
`;
////////////////////////////////////////////////
const DelAccount = styled.TouchableOpacity`
    background: ${colors["back3"]};
    border-radius: ${pixel(4)};
    width: ${pixel(28)};
    height: ${pixel(28)};
    position: absolute;
    ${flexDisplay};
    ${(props) => props.isRTL ? `left: ${pixel(5)};` : `right: ${pixel(5)};`};
    border-width: ${pixel(1)};
    border-color: ${() => Rgba(colors["clr3"], 0.2)};
`;
/////////////////////////////////////////////////
const OneAccounts = memo(({ last, setAccounts, password, username, signin, reload, index }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const { errors } = useSelector(state => state.sign.langData);
    const modalizeOutside = useSelector(state => state.modal.modalizeOutside);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);
    /////////////////////////////////////////////
    return (<AccountTag last={last}
        onPress={() => signin({
            password,
            username, dispatch,
            errors, setLoad,
            callback: () => {
                // dispatch(Actions.type("setPosts", {
                //     type: 'reset', data: {}
                // }));
                // dispatch(Actions.type("setComments", {
                //     type: 'reset', data: {}
                // }));
                console.log("OneAccounts ~ reload", reload);
                reload && RNRestart.Restart(); //NativeModules.DevSettings.reload();
                modalizeOutside.close();
            }
        })}>
        {!load ? <>
            <InfoAccounts isRTL={isRTL}>
                {username}
            </InfoAccounts>
            <DelAccount isRTL={isRTL}
                onPress={() => setAccounts(null, dispatch, parseInt(index))}>
                <DeleteSvg className="red" size={moderateScale(19)} />
            </DelAccount>
        </>
            : <DotIndicator size={moderateScale(5)} count={7} color={colors["clr2"]} />}
    </AccountTag>)
});
/////////////////////////////////////////////////
const OuterAccounts = ({ signin, setAccounts, reload = false }) => {
    const isRTL = useSelector(state => state.sign.isRTL);
    const accounts = useSelector(state => state.sign.accounts);
    const { signinData } = useSelector(state => state.sign.langData);
    const dispatch = useDispatch();
    /////////////////////////////////////////////
    useEffect(() => {
        const GetAccounts = async () => {
            const accounts = await AsyncStorage.getItem("@accounts");
            accounts && dispatch(Actions.type("setAccounts", JSON.parse(accounts)));
        }
        GetAccounts();
    }, [])
    /////////////////////////////////////////////
    return (<OuterAccountsTag>
        <BodyAccounts>
            {accounts.length ? accounts
                .map((account, i) => <OneAccounts
                    key={account.password + i}
                    last={i === accounts.length - 1}
                    username={account.username}
                    password={account.password}
                    setAccounts={setAccounts} index={i}
                    signin={signin} reload={reload} />)
                :
                <AccountTag enabled={false} last>
                    <InfoAccounts isRTL={isRTL}>
                        {signinData.noAcc}
                    </InfoAccounts>
                </AccountTag>}
        </BodyAccounts>
    </OuterAccountsTag>)
}

export default memo(OuterAccounts);