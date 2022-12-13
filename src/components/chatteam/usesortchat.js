export default function useSortChatTeam(chatsData, TIME, lang) {
    const reorderChat = [];
    const newArr = {};
    chatsData.forEach((curr) => {
        const prevTime = TIME.setDate(curr.date, lang).agoMinute;
        if (newArr[prevTime]) newArr[prevTime].push(curr);
        else newArr[prevTime] = [curr];
    });
    for (const key in newArr) {
        if (Object.hasOwnProperty.call(newArr, key)) {
            const blocks = newArr[key].reverse();
            reorderChat.push({ date: key, data: blocks });
        }
    }

    return reorderChat.reverse();
}