/*
 * <<licensetext>>
 */

import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { GanttViewType, GanttItem, GanttGroup, NgxGanttComponent } from 'ngx-gantt';
import { randomGroupsAndItems } from '../helper';

@Component({
    selector: 'app-gantt-groups-example',
    templateUrl: './gantt-groups.component.html'
})
export class AppGanttGroupsExampleComponent implements OnInit {
    views = [
        {
            name: 'Day',
            value: GanttViewType.day
        },
        {
            name: 'Week',
            value: GanttViewType.week
        },
        {
            name: 'Month',
            value: GanttViewType.month
        },
        {
            name: 'Quarter',
            value: GanttViewType.quarter
        },
        {
            name: 'Year',
            value: GanttViewType.year
        }
    ];

    viewType: GanttViewType = GanttViewType.quarter;

    items: GanttItem[] = [];

    groups: GanttGroup[] = [];

    expanded = true;

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    @HostBinding('class.gantt-example-component') class = true;

    constructor() {}

    ngOnInit(): void {
        const { groups, items } = randomGroupsAndItems(10);
        this.groups = groups;
        this.items = items;
    }

    expandAllGroups() {
        if (this.expanded) {
            this.expanded = false;
            this.ganttComponent.collapseAll();
        } else {
            this.expanded = true;
            this.ganttComponent.expandAll();
        }
    }
}
