/*
 * <<licensetext>>
 */

import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { GanttGroup, GanttItem } from 'ngx-gantt';
import { EventType, State } from '../interfaces/event.interface';

export const productionLine1EventType: EventType = {
    timestamp: new Date(),
    name: 'Production Line',
    version: 1,
    actions: ['break', 'work', 'repair'],
    relationsMap: new Map(Object.entries({ lineId: 2, floorId: 5 }))
};

export const productionLine2EventType: EventType = {
    timestamp: new Date(),
    name: 'Production Line',
    version: 2,
    actions: ['break', 'repair'],
    relationsMap: new Map(Object.entries({ lineId: 2, floorId: 5 }))
};

export const meetingEventType: EventType = {
    timestamp: new Date(),
    name: 'Meeting',
    version: 1,
    actions: ['brainstorming', 'demo', 'team building'],
    relationsMap: new Map(Object.entries({ roomId: 2, floorId: 5 }))
};

export const firstGroupEventType: EventType = {
    timestamp: new Date(),
    name: 'First group',
    version: 1,
    actions: ['playing', 'sleeping', 'doing some exercise'],
    relationsMap: new Map()
};

export const eventTypes: EventType[] = [firstGroupEventType, productionLine1EventType, productionLine2EventType, meetingEventType];

@UntilDestroy()
@Injectable()
export class EventService {
    constructor() {}

    getEventType(name: string, version: number): EventType {
        return eventTypes.find((eventType) => eventType.name === name && eventType.version === version);
    }

    getEventTypes(): EventType[] {
        return eventTypes;
    }

    createEvent(event: GanttItem, groups: GanttGroup[]) {
        let item: GanttItem = event;
        item.id = this.generateRandomNumber().toString();
        const group = groups.find((group) => group.title === event.eventTypeName);
        if (group) {
            item.group_id = group.id;
        } else {
            item.group_id = groups[0].id;
        }

        return item;
    }

    createEventFromDrag(start: Date): GanttItem {
        return {
            timestamp: new Date(),
            id: this.generateRandomNumber().toString(),
            name: '',
            eventTypeName: '',
            eventTypeVersion: 0,
            start: start.getTime(),
            state: State.CREATED,
            meta: {
                temporaryEvent: true
            }
        };
    }

    generateRandomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
