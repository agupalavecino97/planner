import * as moment from "moment";
import { Moment } from "moment";

export class Activity {
    activityId!: number;
    title?: string;
    type?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    status?: string | null;
    startHour?: string | null;
    endHour?: string | null;
    editable?: boolean = false;
    startDateMoment?: Moment | null;
    endDateMoment?: Moment | null;

    static parseItemDB(raw: any): Activity {
        const activity = new Activity();
        activity.activityId = raw.activityId ? raw.activityId : null;
        activity.title = raw.title ? raw.title : null;
        activity.type = raw.type ? raw.type: null;
        if (raw.startDate) {
            let d = raw.startDate.split(' ');
            activity.startHour = d[1].substring(0, d[1].length - 3);
            let new_date = d[0].split('-');
            activity.startDate = new Date(new_date[0], new_date[1] - 1, new_date[2]);
            activity.startDateMoment = moment(activity.startDate);
        } else {
            activity.startHour = null;
            activity.startHour = null;
        }
        if (raw.endDate) {
            let d = raw.endDate.split(' ');
            activity.endHour = d[1].substring(0, d[1].length - 3);
            let new_date = d[0].split('-');
            activity.endDate = new Date(new_date[0], new_date[1] - 1, new_date[2]);
            activity.endDateMoment = moment(activity.endDate);
        } else {
            activity.endDate = null;
            activity.endHour = null;
        }
        activity.status = raw.status ? raw.status : null;
        activity.editable = raw.editable ? raw.editable : false;
        return activity;
    }

    static parseItem(raw: any): Activity {
        const activity = new Activity();
        activity.activityId = raw.activityId ? raw.activityId : null;
        activity.title = raw.title ? raw.title : null;
        activity.type = raw.type ? raw.type: null;
        activity.startDate = raw.startDate ? raw.startDate : null;
        activity.endDate = raw.endDate ? raw.endDate : null;
        activity.startDateMoment = raw.startDateMoment ? raw.startDateMoment : null;
        activity.endDateMoment = raw.endDateMoment ? raw.enendDateMomentdDate : null;
        activity.startHour = raw.startHour ? raw.startHour : null;
        activity.endHour = raw.endHour ? raw.endHour : null ;
        activity.status = raw.status ? raw.status : null;
        activity.editable = raw.editable ? raw.editable : false;
        return activity;
    }
    
    static parseArray(raws: Array<any>): Activity[] {
        if (!raws || !raws.length) {
            return [];
        }
        return raws.map((raw: any) => Activity.parseItemDB(raw));
    }
}