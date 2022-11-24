/*
 * <<licensetext>>
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGanttBarComponent } from './components/bar/bar.component';
import { NgxGanttBaselineComponent } from './components/baseline/baseline.component';
import { GanttCalendarComponent } from './components/calendar/calendar.component';
import { GanttDragBackdropComponent } from './components/drag-backdrop/drag-backdrop.component';
import { GanttIconComponent } from './components/icon/icon.component';
import { GanttMainComponent } from './components/main/gantt-main.component';
import { NgxGanttRangeComponent } from './components/range/range.component';
import { GanttTableComponent } from './components/table/gantt-table.component';
import { NgxGanttComponent } from './gantt.component';
import { defaultConfig, GANTT_GLOBAL_CONFIG } from './gantt.config';
import { IsGanttBarItemPipe, IsGanttCustomItemPipe, IsGanttRangeItemPipe } from './gantt.pipe';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';

@NgModule({
    imports: [CommonModule, DragDropModule],
    exports: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        NgxGanttRootComponent,
        NgxGanttBarComponent,
        NgxGanttRangeComponent,
        NgxGanttBaselineComponent
    ],
    declarations: [
        NgxGanttComponent,
        NgxGanttTableComponent,
        NgxGanttTableColumnComponent,
        GanttTableComponent,
        GanttMainComponent,
        GanttCalendarComponent,
        NgxGanttBarComponent,
        GanttIconComponent,
        GanttDragBackdropComponent,
        NgxGanttRangeComponent,
        NgxGanttRootComponent,
        NgxGanttBaselineComponent,
        IsGanttRangeItemPipe,
        IsGanttBarItemPipe,
        IsGanttCustomItemPipe
    ],
    providers: [
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: defaultConfig
        }
    ]
})
export class NgxGanttModule {}
