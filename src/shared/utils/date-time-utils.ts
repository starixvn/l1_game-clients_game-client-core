import moment from "moment";

export namespace DateTimeUtils {
    export const getStringDateByTime = (time: string) => {
        return moment(new Date(time)).format("HH:mm DD/MM/YYYY");
    };

    export const formatDateTime = (time: string) => {
        return moment(new Date(time)).format("HH:mm:ss DD/MM/YYYY");
    };

    export const getStringHourByTime = (time: string) => {
        return moment(new Date(time)).format("HH:mm:ss");
    };

    export const getStringDate = (time: string) => {
        return moment(new Date(time)).format("DD/MM/YYYY");
    };

    export const getStringDateByTimeGMT8 = (time: Date) => {
        return moment(time).utcOffset("+08:00").format("HH:mm DD/MM/YYYY");
    };
}
