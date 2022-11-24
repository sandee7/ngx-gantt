/*
 * <<licensetext>>
 */

import { EventEmitter, Inject, Injectable } from '@angular/core';
import { GanttDragEvent } from './class/event';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';

export enum InBarPosition {
    start = 'start',
    finish = 'finish'
}

@Injectable()
export class GanttDragContainer {
    dragStarted = new EventEmitter<GanttDragEvent>();

    dragMoved = new EventEmitter<GanttDragEvent>();

    dragEnded = new EventEmitter<GanttDragEvent>();

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper) {}
}
