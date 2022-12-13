import React, { memo, useState, useEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import { DeleteSvg } from '../../icons/all';
import { OuterBarRecord, ButtonDeleteRecord, RecordTimeInfo } from './editablecss';
//////////////////////////////////////
const MicRecorder = ({ record, handleRecord, clearRecord }) => {
    const [timer, setTimer] = useState("");
    //////////////////////////////////
    useEffect(() => {
        if (record) {
            const secondsToHms = (time) => {
                let hr = Math.floor(time / 3600);
                let min = Math.floor((time - (hr * 3600)) / 60);
                let sec = Math.floor(time - (hr * 3600) - (min * 60));
                if (hr < 10) {
                    hr = '0' + String(hr);
                }
                if (min < 10) {
                    min = '0' + String(min);
                }
                if (sec < 10) {
                    sec = '0' + String(sec);
                }
                time = `${(hr < 1) ? '' : `${hr} : `}${min} : ${sec}`;
                setTimer(time);
            }
            let count = 1;
            secondsToHms(0);
            var downloadTimer = setInterval(function () {
                secondsToHms(count++);
            }, 1000);
        }
        return (e) => {
            clearInterval(downloadTimer);
        }
    }, [record]);
    //////////////////////////////////
    return (<OuterBarRecord>
        <RecordTimeInfo>{timer}</RecordTimeInfo>
        {handleRecord ? <ButtonDeleteRecord onPress={clearRecord}>
            <DeleteSvg className="red" size={moderateScale(15)} />
        </ButtonDeleteRecord> : null}
    </OuterBarRecord>)
}

export default memo(MicRecorder);
