/*
 * <<licensetext>>
 */

import { EChartsOption } from 'echarts';

export enum State {
    CREATED = 'Created',
    MODIFIED = 'Modified',
    DELETED = 'Deleted'
}

export interface Relation {
    timestamp: Date;
    calendarEventId: string;
    name: string;
    value: string;
}

export interface EventType {
    timestamp: Date;
    name: string;
    version: number;
    actions: string[];
    relationsMap: Map<string, string | number | boolean>;
}

export interface Options {
    echart: EChartsOption;
}
