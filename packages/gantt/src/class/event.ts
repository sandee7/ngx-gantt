/*
 * <<licensetext>>
 */

import { QueryList } from '@angular/core';
import { NgxGanttTableColumnComponent } from '../table/gantt-column.component';
import { GanttGroup } from './group';
import { GanttItem } from './item';

export class GanttDragEvent<T = unknown> {
    item: GanttItem<T>;
}

export class GanttTableEvent {
    columns: QueryList<NgxGanttTableColumnComponent>;
}

export class GanttLoadOnScrollEvent {
    start: number;
    end: number;
}

export class GanttLineClickEvent<T = unknown> {
    event: MouseEvent;
    source: GanttItem<T>;
    target: GanttItem<T>;
}

export class GanttBarClickEvent<T = unknown> {
    event: Event;
    item: GanttItem<T>;
}

export class GanttSelectedEvent<T = unknown> {
    event: Event;
    selectedValue: GanttItem<T> | GanttItem<T>[];
}

export class GanttMainClickEvent<T = unknown> {
    event: PointerEvent;
    group: GanttGroup<T>;
}

export class GanttMainMoveEvent<T = unknown> {
    event: MouseEvent;
    group: GanttGroup<T>;
}
