export class Activity {
    activityId!: number;
    title!: string;
    type!: string;
    startDate?: string | null;
    endDate?: string | null;
    status?: string;

    static parseItem(raw: any): Activity {
        const banda = new Activity();
        banda.activityId = raw.activityId ? raw.activityId : undefined;
        banda.title = raw.title ? raw.title : undefined;
        banda.type = raw.type ? raw.type: undefined;
        banda.startDate = raw.startDate ? raw.startDate : undefined;
        banda.endDate = raw.endDate ? raw.endDate : undefined;
        banda.status = raw.status ? raw.status : undefined;
        return banda;
    }

    
    static parseArray(raws: any): Activity[] {
        if (!raws || !raws.length) {
            return [];
        }
        return raws.map((raw: any) => Activity.parseItem(raw));
    }
}