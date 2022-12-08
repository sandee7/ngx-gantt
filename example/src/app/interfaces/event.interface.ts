/*
 * <<licensetext>>
 */

import { EChartsOption } from 'echarts';

/*
 * <<licensetext>>
 */
export interface Event {
    timestamp: Date;
    id: string;
    name: string;
    description?: string;
    action?: string;
    eventTypeName: string;
    eventTypeVersion: number;
    startTime: Date;
    endTime: Date;
    state: State;
    relations: Relation;
}

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
