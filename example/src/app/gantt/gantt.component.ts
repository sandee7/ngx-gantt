/*
 * <<licensetext>>
 */

import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { EChartsOption } from 'echarts';
import {
    GanttBarClickEvent,
    GanttBaselineItem,
    GanttDate,
    GanttDragEvent,
    GanttGroup,
    GanttGroupInternal,
    GanttItem,
    GanttItemInternal,
    GanttLineClickEvent,
    GanttLoadOnScrollEvent,
    GanttSelectedEvent,
    GanttView,
    GanttViewType,
    NgxGanttComponent
} from 'ngx-gantt';
import { uniqBy } from 'ngx-gantt/utils/helpers';
import { of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { random, randomItems } from '../helper';

@Component({
    selector: 'app-gantt-example',
    templateUrl: './gantt.component.html'
    // providers: [GanttPrintService]
})
export class AppGanttExampleComponent implements OnInit, AfterViewInit {
    @ViewChild('gantt')
    gantt!: NgxGanttComponent;

    refreshItems: Subject<boolean> = new Subject<boolean>();

    public view: GanttView;
    zoomIndex = 0;

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

    viewType: GanttViewType = GanttViewType.month;

    isBaselineChecked = false;

    groups: GanttGroup[] = [
        { id: '000000', title: 'nullás group' },
        { id: '000001', title: 'egyes group' }
    ];

    items: GanttItem[] = [
        { id: '000000', title: 'Task 0', start: 1627729997, end: 1628421197, expandable: true, group_id: '000000' },
        { id: '000001', title: 'Task 1', start: 1617361997, end: 1629544397, expandable: true, group_id: '000001' },
        { id: '000002', title: 'Task 2', start: 1610536397, end: 1610622797, color: '#ba9472', group_id: '000001' },
        { id: '000003', title: 'Task 3', start: 1628507597, end: 1633345997, expandable: true },
        { id: '000004', title: 'Task 4', start: 1624705997, expandable: true },
        { id: '000005', title: 'Task 5', start: 1628075597, end: 1629544397, color: '#709dc1', group_id: '000001' },
        { id: '000006', title: 'Task 6', start: 1641121997, end: 1645528397 },
        { id: '000007', title: 'Task 7', start: 1639393997, end: 1640862797, group_id: '000001' },
        { id: '000008', title: 'Task 8', end: 1628783999, color: '#709dc1' },
        { id: '000009', title: 'Task 9', start: 1639307597, end: 1640344397, group_id: '000001' },
        { id: '0000010', title: 'Task 10', start: 1609067597, end: 1617275597, group_id: '000001' },
        { id: '0000011', title: 'Task 11', start: 1611918797, end: 1611918797, group_id: '000001' },
        { id: '0000012', title: 'Task 12', start: 1627816397, end: 1631358797, group_id: '000001' },
        { id: '0000013', title: 'Task 13', start: 1625051597, end: 1630667597, group_id: '000001' },
        { id: '0000014', title: 'Task 14', start: 1627920000, end: 1629129599, group_id: '000001' },
        { id: '0000015', title: 'Task 15', start: 1633259597, end: 1639480397, group_id: '000001' },
        { id: '00000115', title: 'Task 15', start: 1633259597, end: 1639480397, group_id: '000001' },
        { id: '0000016', title: 'Task 16', start: 1624965197, end: 1627211597, group_id: '000001' },
        { id: '0000017', title: 'Task 17', start: 1641035597, end: 1649157197, group_id: '000001' },
        { id: '0000018', title: 'Task 18', start: 1637061197, end: 1642677197, group_id: '000001' },
        { id: '0000019', title: 'Task 19', start: 1637925197, end: 1646305997 },
        { id: '0000020', title: 'Task 20', start: 1628334797, end: 1629889997 },
        { id: '0000021', title: 'Task 21', start: 1622891597, end: 1627643597 },
        { id: '0000022', title: 'Task 22', start: 1616238797, end: 1620731597 },
        { id: '0000023', title: 'Task 23', start: 1626693197, end: 1630149197 },
        { id: '0000024', title: 'Task 24', start: 1626174797, end: 1626952397 },
        { id: '0000025', title: 'Task 25', start: 1631013197, end: 1637493197 },
        { id: '0000026', title: 'Task 26', start: 1635937997, end: 1643886797 },
        { id: '0000027', title: 'Task 27', start: 1637665997, end: 1644059597 },
        { id: '0000028', title: 'Task 28', start: 1611400397, end: 1615547597 },
        { id: '0000029', title: 'Task 29', start: 1618053197, end: 1619176397 }
    ];

    baselineItems: GanttBaselineItem[] = [];

    options = {
        viewType: GanttViewType.day
    };

    viewOptions = {
        dateFormat: {
            month: 'M'
        }
    };

    chartOption: EChartsOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'pie'
            }
        ]
    };

    @HostBinding('class.gantt-example-component') class = true;

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        event.preventDefault();
        const zoomIn = event.deltaY < 0;
        const currentViewTypeIndex = this.views.findIndex((view) => view.value === this.viewType);
        if (zoomIn) {
            if (this.zoomIndex < 2) {
                this.zoomIndex++;
            } else if (this.views[currentViewTypeIndex + 1]) {
                this.zoomIndex = 0;
                this.viewType = this.views[currentViewTypeIndex + 1].value;
            }
        } else {
            if (this.zoomIndex > 0) {
                this.zoomIndex--;
            } else if (this.views[currentViewTypeIndex - 1]) {
                this.zoomIndex = 2;
                this.viewType = this.views[currentViewTypeIndex - 1].value;
            }
        }
        this.cdr.detectChanges();
    }

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    childrenResolve = (item: GanttItem) => {
        const children = randomItems(random(1, 5), item);
        return of(children).pipe(delay(1000));
    };

    constructor(/*private printService: GanttPrintService*/ private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        console.log(this.gantt);
    }

    barClick(event: GanttBarClickEvent) {
        // this.thyNotify.info('Event: barClick', `你点击了 [${event.item.title}]`);
    }

    lineClick(event: GanttLineClickEvent) {
        // this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
    }

    dragMoved(event: GanttDragEvent) {}

    dragEnded(event: GanttDragEvent) {
        // this.thyNotify.info('Event: dragEnded', `修改了 [${event.item.title}] 的时间`);
        this.items = [...this.items];
    }

    selectedChange(event: GanttSelectedEvent) {
        // this.thyNotify.info(
        //     'Event: selectedChange',
        //     `当前选中的 item 的 id 为 ${(event.selectedValue as GanttItem[]).map((item) => item.id).join('、')}`
        // );
    }

    // print(name: string) {
    //     this.printService.print(name);
    // }

    scrollToToday() {
        this.ganttComponent.scrollToToday();
    }

    switchChange() {
        if (this.isBaselineChecked) {
            this.baselineItems = [
                { id: '000000', start: 1627728888, end: 1628421197 },
                { id: '000001', start: 1617361997, end: 1625483597 },
                { id: '000002', start: 1610536397, end: 1610622797 },
                { id: '000003', start: 1628507597, end: 1633345997 },
                { id: '000004', start: 1624705997 }
            ];
        } else {
            this.baselineItems = [];
        }
    }

    loadOnScroll(event: GanttLoadOnScrollEvent) {
        // if it is a future scroll
        if (new Date(event.end * 1000) <= new Date(this.gantt.view.end$.value.value)) {
            const newViewOptionEndDate = new GanttDate(
                this.gantt.view.secondaryDatePoints[this.gantt.view.secondaryDatePoints.length - 1].start.addMonths(4).value
            );
            this.gantt.view.options.max = newViewOptionEndDate;
        }
        console.log(this.gantt);
        this.refreshItems.next(true);
    }

    createEvent(event: GanttItem) {
        event.id = Math.floor(100000 + Math.random() * 900000).toString();
        const groupIds = this.getGroupIds();
        const randomIndex = Math.floor(Math.random() * groupIds.length);
        event.group_id = groupIds[randomIndex];
        this.items = [event, ...this.items];
    }

    getGroupIds(): string[] {
        return this.groups.map((group) => group.id);
    }
}
