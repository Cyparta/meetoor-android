export default function useSortChat(chatsData, TIME, userid, lang) {
    const reorderChat = [];
    const newArr = {};
    chatsData.forEach((curr, i) => {
        const prevTime = TIME.setDate(curr.date, lang).agoMinute;
        const prev = chatsData[(i - 1) < 0 ? 0 : (i - 1)];
        prev.showAvatar = false;
        curr.isLast = false;
        if (i === (chatsData.length - 1)) curr.isLast = true;
        if (newArr[prevTime]) newArr[prevTime].push(curr);
        else newArr[prevTime] = [curr];
    });
    for (const key in newArr) {
        if (Object.hasOwnProperty.call(newArr, key)) {
            const blocks = newArr[key].map((block, i, all) => {
                let isLast = i === (all.length - 1);
                let isNotMe = block.userid !== userid;
                if (isLast && isNotMe) block.showAvatar = true;
                return block;
            }).reverse();
            reorderChat.push({ date: key, data: blocks });
        }
    }

    return reorderChat.reverse();
}