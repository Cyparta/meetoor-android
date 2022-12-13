// import EN from '../lang/EN.json';
// import AR from '../lang/AR.json';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastAndroid } from 'react-native';
///////////////////////////////////////////////////////
const BinarySearch = ({ org, target, start, end, key, callback }) => {
    const mid = Math.floor((start + end) / 2);
    if (target === org[mid][key]) return callback(org[mid], mid);
    if (end - 1 === start) return Math.abs(org[start][key] - target) > Math.abs(org[end][key] - target) ? org[end] : org[start];
    if (target > org[mid][key]) return BinarySearch({ org, target, start: mid, end, key, callback });
    if (target < org[mid][key]) return BinarySearch({ org, target, start, end: mid, key, callback });
}
export const LinearSearch = ({ org, target, start, end, key, callback }) => {
    for (var i = start; i < end; i++) {
        if (target === org[i][key]) {
            return callback(org[i], i);
        }
    }
}
///////////////////////////////////////////////////////
export const HandelNumber = (num1, num2, type = false) => {
    let num = (num1 || 0) + (num2 || 0);
    num = type ? num : num + 1;
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}
///////////////////////////////////////////////////////
export const copyToClipboard = (url, copied = "تم النسخ") => {
    try {
        Clipboard.setString(url);
        ToastAndroid.show(copied, ToastAndroid.LONG);
    } catch (error) {
        console.log('Error =>', error);
    }
};
////////////////////////////////////////////////////////
export const shareTo = async (url) => {
    const shareOptions = {
        title: 'Share your Link - MEETOOR',
        url: url,
        failOnCancel: false,
    };
    try {
        await Share.open(shareOptions);
    } catch (error) {
        console.log('Error =>', error);
    }
};
///////////////////////////////////////////////////////
export const setTitle = (type, data, org) => {
    switch (type) {
        case "set":
            return data;

        case "update":
            return data + org;
        default:
            break;
    }
}
export const setNotifyNumber = (type, data, org) => {
    switch (type) {
        case "set":
            return data;

        case "update":
            return org + data;
        default:
            break;
    }
}
const createPathServer = (server) => {
    const prt = ['80', '3478', '80', '3478', '443', '5349'];
    const trans = ["transport=udp", "transport=udp", "transport=tcp", "transport=tcp", "transport=tcp", "transport=tcp"];
    const servers = [];
    prt.forEach((pr, i) => {
        servers.push(`turn:${server}:${pr}?${trans[i]}`);
    });
    return servers;
}
export const convertToTime = seconds => {
    const m = parseInt(seconds % (60 * 60) / 60);
    const s = parseInt(seconds % 60);
    return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
};
///////////////////////////////////////////////////////
export const createServer = (runer) => {
    let server = 'rtc.meetoor.com';
    let order = runer.split(':');
    return {
        run: [{
            username: order[0],
            credential: order[1],
            urls: createPathServer(server)
        }],
        server: runer
    };
}
////////////////////////////////////////////////////////
export const setUser = (type, data, org) => {
    org = Object.assign({}, org);
    switch (type) {
        case "set":
            return data;

        case "update":
            org[data.key] = data.val;
            return org;

        case "updateGroup":
            return { org, ...data };
        default:
            break;
    }
}
////////////////////////////////////////////////////////
export const update = (type, data, org) => {
    org = Object.assign([], org || []);
    let found = false;
    switch (type) {
        case "set":
            // renew = data ? data : org;
            return data ? data : org;

        case "add":
            org.unshift(data);
            return org;

        case "push":
            return [...org, ...data];

        case "addGroup":
            return [...data, ...org];

        case "update":
            org && LinearSearch({
                org: org,
                target: data.target,
                start: 0,
                end: org.length,
                key: data.key,
                callback: (target, index) => data.call(target, index, org)
            });
            return org;

        case "replace":
            LinearSearch({
                org: org,
                target: data?.target,
                start: 0,
                end: org?.length,
                key: data?.key,
                callback: (index) => {
                    org[index] = data.replace;
                }
            });
            return org;

        case "replace_up":
            LinearSearch({
                org: org,
                target: data?.target,
                start: 0,
                end: org?.length,
                key: data?.key,
                callback: (target, index) => {
                    org?.splice(index, 1);
                }
            });
            org.unshift(data.replace);
            return org;

        case "check":
            org && LinearSearch({
                org: org,
                target: data.target,
                start: 0,
                end: org.length,
                key: data.key,
                callback: (target, index) => {
                    found = true;
                    data.call(target, index);
                }
            });
            !found && data.call(null, 0, org);
            return org;

        case "updateAll":
            org.forEach((item) => {
                data.call(item);
            })
            return org;

        case "delete":
            LinearSearch({
                org,
                target: data.target,
                start: 0,
                end: org.length,
                key: data.key,
                callback: (target, index) => {
                    data.callback && data.call(target, index, org);
                    org.splice(index, 1);
                }
            });
            return org;

        default:
            break;
    }
}
///////////////////////////////////////////////////////////
export const reobject = (type, data, org) => {
    org = Object.assign({}, org);
    switch (type) {
        case "add":
            org[data.key] = data.val;
            return org;

        case "update":
            let Key = org[data.key];
            if (!Key) return org;
            data.call(org[data.key]);
            org = Object.assign({}, org);
            return org;

        case "updateArray":
            LinearSearch({
                org: org[data.keyArray]?.members,
                target: data.target,
                start: 0,
                end: org[data.keyArray]?.members.length,
                key: data.key,
                callback: (target, index) => {
                    data.call(target, index, org[data.keyArray]?.members);
                }
            });
            return org;

        case "delete":
            delete org[data.key];
            return org;

        default:
            break;
    }
}
///////////////////////////////////////////////////////////
export const updateObj = (type, data, org) => {
    org = Object.assign({}, org);
    let arrInOrg = [];
    let found = false;
    switch (type) {
        case "set":
            org[data.key] = data.val;
            return org;
        case "reset":
            return data;

        case "getToUpdate":
            org[data.key] && data.call(org[data.key]);
            org[data.key] = [...org[data.key]]
            return org;

        case "add":
            org[data.key] ? org[data.key].push(data.val) : org[data.key] = [data.val];
            org[data.key] = [...org[data.key]]
            return org;

        case "update":
            org[data.key] ? org[data.key].unshift(data.val) : org[data.key] = [data.val];
            org[data.key] = [...org[data.key]]
            return org;

        case "addGroup":
            let addVals = org[data.key];
            if (addVals) org[data.key] = [...addVals, ...data.val];
            else org[data.key] = data.val;
            return org;

        case "pushGroup":
            let pushVals = org[data.key];
            if (pushVals) org[data.key] = [...data.val, ...pushVals];
            else org[data.key] = data.val;
            return org;


        case "pop":
            org[data] && org[data].pop();
            return org;

        case "updates":
            data?.keysArray?.forEach((keyArray) => {
                org[keyArray] && org[keyArray].unshift(data.val);
            });
            return org;

        case "updateWithCall":
            if (!org[data.keyArray]) return org;
            arrInOrg = org[data.keyArray];
            LinearSearch({
                org: arrInOrg,
                target: data.target,
                start: 0,
                end: arrInOrg.length,
                key: data.key,
                callback: (target, index) => {
                    data.call(target, index);
                }
            });
            org[data.keyArray] = [...arrInOrg];
            return org;

        case "check":
            if (!org[data.keyArray]) return org;
            arrInOrg = org[data.keyArray];
            LinearSearch({
                org: arrInOrg,
                target: data.target,
                start: 0,
                end: arrInOrg.length,
                key: data.key,
                callback: (target, index) => {
                    found = true;
                    data.call(target, index);
                }
            });
            !found && data.call(null, 0, arrInOrg);
            org[data.keyArray] = [...arrInOrg];
            return org;

        case "getLast":
            if (!org[data.keyArray]) return org;
            arrInOrg = org[data.keyArray];
            // arrInOrg.length - 1
            data.call(arrInOrg[arrInOrg.length - 1]);
            org[data.keyArray] = [...arrInOrg];
            return org;

        case "deleteOne":
            if (!org[data.keyArray]) return org;
            LinearSearch({
                org: org[data.keyArray],
                target: data.target,
                start: 0,
                end: org[data.keyArray].length,
                key: data.key,
                callback: (target, index) => {
                    org[data.keyArray].splice(index, 1);
                }
            });
            return org;

        case "deletesOne":
            data?.keysArray?.forEach((keyArray) => {
                let Key = org[keyArray];
                Key && LinearSearch({
                    org: Key,
                    target: data.target,
                    start: 0,
                    end: Key.length,
                    key: data.key,
                    callback: (target, index) => {
                        Key.splice(index, 1);
                    }
                });
            });
            org = Object.assign({}, org);
            return org;

        case "updatesWithCall":
            data?.keysArray?.forEach((keyArray) => {
                let Key = org[keyArray];
                Key && LinearSearch({
                    org: Key,
                    target: data.target,
                    start: 0,
                    end: Key.length,
                    key: data.key,
                    callback: (target, index) => {
                        data.call(target, index);
                    }
                });
            });
            org = Object.assign({}, org);
            return org;

        case "updateAllWithCall":
            Object.values(org)?.forEach((value) => {
                LinearSearch({
                    org: value,
                    target: data.target,
                    start: 0,
                    end: value.length,
                    key: data.key,
                    callback: (target, index) => {
                        data.call(target, index);
                    }
                });
            });
            org = Object.assign({}, org);
            return org;

        case "delete":
            delete org[data.key];
            return org;

        default:
            break;
    }
}
///////////////////////////////////////////////////////////
export const setGetData = (type, data, org) => {
    switch (type) {
        case "set":
            return data;

        case "update":
            return org + data;

        default:
            break;
    }
}
//////////////////////////////////////////////////////////////
export const getDataForLang = (lang = "AR") => {
    const renderLang = {
        "AR": require('../lang/AR'),
        "EN": require('../lang/EN')
    }
    return renderLang[lang];
}
