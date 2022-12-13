import { useState, useCallback, useRef } from 'react';
////////////////////////////////////////////////////////
const useTypingMeetoor = ({ down, up }) => {
    const [writen, setWriten] = useState(false);
    const timeRef = useRef(0);
    ///////////////////////////////////////////
    const onTyping = useCallback(() => {
        if (!writen) {
            setWriten(true);
            down();
        }
        clearTimeout(timeRef.current);
        timeRef.current = setTimeout(() => {
            setWriten(false);
            up();
        }, 3000);
    }, [writen]);
    ///////////////////////////////////////////
    return onTyping;
};

export default useTypingMeetoor;