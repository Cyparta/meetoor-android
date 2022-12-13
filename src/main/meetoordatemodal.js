import React, { memo } from 'react';
import { RenderBodyModal } from '../components/home/sliderroom/helperroomcss';
import DatePicker from 'react-native-date-picker';
import { css } from 'styled-components';
import { colors } from '../styles/basecss';
////////////////////////////////////////////
const DateMeetoorModal = ({ mode = "date", date, callback }) => {
    ////////////////////////////////////////
    return (<RenderBodyModal back="back1"
        css={css`border-radius: 5px;overflow: hidden;`}>
        <DatePicker
            mode={mode}
            date={date}
            onDateChange={(e) => {
                callback && callback(e)
            }}
            textColor={colors["clr2"]}
        />
    </RenderBodyModal>)
}

export default memo(DateMeetoorModal)
