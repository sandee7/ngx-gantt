/*
 * <<licensetext>>
 */

import { Component, EventEmitter, HostBinding, Inject, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { GanttService } from 'example/src/app/services/gantt.service';
import { GanttBarClickEvent, GanttGroup, GanttGroupInternal, GanttItemInternal, GanttMainClickEvent } from '../../class';
import { GanttUpper, GANTT_UPPER_TOKEN } from '../../gantt-upper';

@Component({
    selector: 'gantt-main',
    templateUrl: './gantt-main.component.html'
})
export class GanttMainComponent implements OnInit, OnChanges {
    @Input() groups: GanttGroupInternal[];

    @Input() items: GanttItemInternal[];

    @Input() groupHeaderTemplate: TemplateRef<any>;

    @Input() itemTemplate: TemplateRef<any>;

    @Input() barTemplate: TemplateRef<any>;

    @Input() rangeTemplate: TemplateRef<any>;

    @Input() dragCreationInProgress: boolean = false;

    @Output() newEventClick = new EventEmitter<GanttMainClickEvent>();

    // @Output() override lineClick = new EventEmitter<GanttLineClickEvent>();

    @HostBinding('class.gantt-main-container') ganttMainClass = true;

    firstChange = true;

    constructor(@Inject(GANTT_UPPER_TOKEN) public ganttUpper: GanttUpper, public ganttService: GanttService) {
        // super();
    }

    ngOnInit(): void {
        // this.groups.map((group) => group.items.map((item) => (item.type = GanttItemType.custom)));
        this.ganttService.getMaxItemSizeWrapper(this.items, this.groups);
    }

    ngOnChanges(): void {
        if (!this.firstChange) {
            this.ganttService.getMaxItemSizeWrapper(this.items, this.groups);
        }
        if (this.firstChange) {
            this.firstChange = false;
        }
    }

    getCurrentMaxItemSize(currentGroup: GanttGroupInternal) {
        if (!this.firstChange) {
            const index = this.groups.findIndex((group) => group.id === currentGroup.id);
            return this.ganttService.getCurrentMaxItemSize(this.items, index);
        }
    }

    trackBy(index: number, item: GanttGroupInternal | GanttItemInternal) {
        return item.id || index;
    }

    createDragEvent($event: PointerEvent, group: GanttGroup) {
        this.newEventClick.emit({ event: $event, group: group });
    }
}
