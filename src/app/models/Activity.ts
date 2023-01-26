export class Activity {
    activityId?: number;
    title?: string;
    type?: string;
    startDate?: string | null;
    endDate?: string | null;
    status?: string | null;
    startHour?: string | null;
    endHour?: string | null;
    editable?: boolean = false;
    sDate?: Date | null;
    eDate?: Date | null;

    static parseItem(raw: any): Activity {
        const actividad = new Activity();
        actividad.activityId = raw.activityId ? raw.activityId : null;
        actividad.title = raw.title ? raw.title : null;
        actividad.type = raw.type ? raw.type: null;
        actividad.startDate = raw.startDate ? raw.startDate : null;
        actividad.endDate = raw.endDate ? raw.endDate : null;
        actividad.status = raw.status ? raw.status : null;
        actividad.startHour = raw.startHour ? raw.startHour : null;
        actividad.endHour = raw.endHour ? raw.endHour : null;
        actividad.editable = raw.editable ? raw.editable : false;
        return actividad;
    }

    
    static parseArray(raws: any): Activity[] {
        if (!raws || !raws.length) {
            return [];
        }
        return raws.map((raw: any) => Activity.parseItem(raw));
    }
}