import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextAreaEditor, TextAreaInput } from './helpercreatepostcss';
import FitImage from 'react-native-fit-image';
import { colors, GetColorToBacks, pixel, Rgba } from '../../../styles/basecss';
import Actions from '../../../reducer/actions';
import { moderateScale } from 'react-native-size-matters';
////////////////////////////////////////////
const PostTextArea = ({ maxContent, detectMax, autoFocus = false,
    setCurrentText, currentText, background }) => {
    const dispatch = useDispatch();
    const { placeholder } = useSelector(state => state.sign.langData);
    const isDark = useSelector(state => state.sign.isDark);
    ////////////////////////////////////////
    const waitType = useRef(0);
    const mainSocket = useSelector(state => state.main.socket);
    const [Keyword, setKeyword] = useState(null);
    ////////////////////////////////////////
    useEffect(() => {
        clearTimeout(waitType.current || 0);
        waitType.current = setTimeout(() => {
            if (!Keyword) {
                dispatch(Actions.type("onSuggestionPress", "close"));
                return;
            };
            mainSocket.emit("onSearch", {
                search: Keyword.toLowerCase(),
                forMention: true,
            });
        }, 1200);
        return () => clearTimeout(waitType.current || 0);
    }, [Keyword]);
    ////////////////////////////////////////
    const PATTERN = useMemo(() => ([
        {
            trigger: '@',
            renderSuggestions: ({ keyword, onSuggestionPress }) => {
                if (keyword && keyword.replace("@", '').trim()?.length) {
                    setKeyword(keyword);
                    dispatch(Actions.type("onSuggestionPress", onSuggestionPress));
                } else setKeyword(null);
                return null;
            },
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /#(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!1_(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!2_(\S|_)+/gi,
            textStyle: { color: colors['blu'] },
        },
        {
            pattern: /!3_(\S|_)+/gi,
            textStyle: { color: colors['red2'] },
        },
        {
            pattern: /!4_(\S|_)+/gi,
            textStyle: { color: colors['gold'] },
        },
        {
            pattern: /!١_(\S|_)+/gi,
            textStyle: { color: colors['clr2'] },
        },
        {
            pattern: /!٢_(\S|_)+/gi,
            textStyle: { color: colors['blu'] },
        },
        {
            pattern: /!٣_(\S|_)+/gi,
            textStyle: { color: colors['red2'] },
        },
        {
            pattern: /!٤_(\S|_)+/gi,
            textStyle: { color: colors['gold'] },
        }
    ]), []);
    ////////////////////////////////////////
    if (background) return (<FitImage
        source={{ uri: `https://cdn.meetoor.com/frontend/img/postsback/${background}.png` }}
        originalWidth={500} originalHeight={400}>
        <TextAreaEditor
            back="back2"
            maxLength={maxContent}
            multiline
            isDark={isDark}
            placeholderTextColor={GetColorToBacks(background)}
            placeholder={placeholder.someThing}
            autoFocus={autoFocus}
            line={pixel(32)}
            align="center"
            onPressIn={() => {
                setCurrentText(text => text.replace(/[\s\uFEFF\xA0]+$/g, ''));
            }}
            size={pixel(20)}
            colorBacks={background}
            containerStyle={{ width: "100%" }}
            value={currentText}
            onChange={(text) => {
                setCurrentText(text);
                detectMax && detectMax(text.length)
            }}
            partTypes={PATTERN}
        />
    </FitImage>)
    else return (<TextAreaEditor
        isDark={isDark}
        value={currentText}
        onChange={(text) => {
            setCurrentText(text);
            detectMax && detectMax(text.length);
        }}
        containerStyle={{
            width: "100%"
        }}
        onPressIn={() => {
            setCurrentText(text => text.replace(/[\s\uFEFF\xA0]+$/g, ''));
        }}
        maxLength={maxContent}
        placeholderTextColor={colors["clr2"]}
        placeholder={placeholder.someThing}
        autoFocus={autoFocus}
        partTypes={PATTERN}
        multiline={true}
    />)
}
export default memo(PostTextArea);