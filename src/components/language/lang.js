import React, { memo, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../reducer/actions';
import {
    MeetoorLang, MeetoorOuterLangs, BuildLangComponnet
} from "./helper"
////////////////////////////////////////////////
const MainLanguage = () => {
    const dispatch = useDispatch();
    const langs = useSelector(state => state.sign.langs);
    const Lang = useSelector(state => state.sign.lang);
    const isRTL = useSelector(state => state.sign.isRTL);
    const modalizeOutside = useSelector(state => state.modal.modalizeOutside);
    const mainSocket = useSelector(state => state.main.socket);
    const [selected, setSelected] = useState(Lang);
    const [Langs, setLangs] = useState([]);
    const [LangsName, setLangsName] = useState([]);
    const [loaded, setLoad] = useState(false);
    ///////////////////////////////////////////
    const saveLanguage = useCallback(async (lang) => {
        setSelected(lang);
        try {
            setLoad(true);
            if (mainSocket.connect) mainSocket.emit("onChangeLang", { lang });
            else {
                dispatch(Actions.type("setMeetoorLang", lang));
            }
        }
        catch (e) {
            console.log("saveLanguage ~ e", e)
        }
        setTimeout(() => {
            setLoad(false);
            modalizeOutside.close();
        }, 500);
    }, [modalizeOutside]);
    ///////////////////////////////////////////
    useEffect(() => {
        let langNames = [];
        let langKeys = [];
        for (const key in langs) {
            if (Object.hasOwnProperty.call(langs, key)) {
                const lang = langs[key];
                langNames.push(lang.name);
                langKeys.push(lang.key);
            }
        }
        setLangsName(langNames);
        setLangs(langKeys);
    }, [langs]);
    ///////////////////////////////////////////
    return (<MeetoorLang isRTL={isRTL}>
        <MeetoorOuterLangs isRTL={isRTL}>
            {LangsName?.map((name, i) => {
                return (<BuildLangComponnet
                    current={selected} key={i + name}
                    nameLang={name} keyLang={Langs[i]}
                    setSelected={saveLanguage}
                    loaded={loaded}
                    isLast={i === 1} />)
            })}
        </MeetoorOuterLangs>
    </MeetoorLang>)
}

export default memo(MainLanguage);

