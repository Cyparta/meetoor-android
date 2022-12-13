import moment from 'moment-timezone';
const arabicFormat = {
    "seconds": "حالاً",
    "minute": "منذ دقيقة",
    "minutes": "دقائق",
    "hour": "منذ ساعة",
    "hours": "ساعات",
    "day": "منذ يوم",
    "days": "ايام",
    "month": "منذ شهر",
    "months": "شهور",
    "year": "منذ سنه",
    "years": "سنوات"
}
/////////////////////////////////////
class CreateTime {
    constructor() {
        this.utc = "";
        this.format = "";
        this.timeZone = moment.tz.guess();
    }
    translate(unit) {
        if (this.lang === "EN") return unit;
        else {
            unit = unit.split(" ");
            let number = parseInt(unit[0]);
            unit = unit.pop();
            unit = arabicFormat[unit];
            return `${isNaN(number) ? "" : number} ${unit}`;
        }
    }
    setDate(utc, lang = 'EN', format = "DD/MM/YYYY-HH:mm:ss") {
        this.format = format;
        this.lang = lang;
        this.localTime = moment.utc(utc).tz(this.timeZone).format(this.format);
        this.fromNow = moment(this.localTime, this.format).fromNow();
        this.dateSML = moment(this.localTime, this.format).format("MMM DD_hh:mm A").replace('_', ' at ');
        this.dateTime = moment(this.localTime, this.format).format("hh:mm A").replace('_', ' at ');
        this.dateBIG = moment(this.localTime, this.format).format("dddd, MMM DD, YYYY_hh:mm A").replace('_', ' at ');
        return this;
    }

    get ago() {
        let timeAgo = this.fromNow.replace(" ago", "");
        return this.translate(timeAgo);
    }

    get agoMinute() {
        switch (true) {
            case this.fromNow.includes('second'):
            case this.fromNow.includes('minute'):
                return "minutes";
            default:
                return this.fromNow;
        }
    }

    get toNow() {
        switch (true) {
            case this.fromNow.includes('second'):
            case this.fromNow.includes('minute'):
            case this.fromNow.includes('hour'):
                return this.ago;
            default:
                return this.dateSML;
        }
    }

    get toDay() {
        switch (true) {
            case this.fromNow.includes('second'):
            case this.fromNow.includes('minute'):
            case this.fromNow.includes('hour'):
                return this.dateTime;
            default:
                return this.dateBIG;
        }
    }

    get fullDate() {
        return this.dateBIG;
    }
}

export default new CreateTime();