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
import { Event, EventType, State } from '../interfaces/event.interface';
import { EventService } from '../services/event.service';

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
            name: 'Year',
            value: GanttViewType.year
        },
        {
            name: 'Month',
            value: GanttViewType.month
        },
        {
            name: 'Week',
            value: GanttViewType.week
        },
        {
            name: 'Day',
            value: GanttViewType.day
        }
    ];

    viewType: GanttViewType = GanttViewType.month;

    isBaselineChecked = false;

    eventTypes: EventType[] = [];
    groups: GanttGroup[] = [{ id: '000000', title: 'groupless' }];
    groupIds: string[] = [];

    items: GanttItem[] = [
        {
            id: '000000',
            name: 'Task 0',
            start: 1627729997,
            end: 1628421197,
            expandable: true,
            group_id: '',
            eventTypeName: '',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '000001',
            name: 'Task 1',
            start: 1617361997,
            end: 1629544397,
            expandable: true,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '000002',
            name: 'Task 2',
            start: 1610536397,
            end: 1610622797,
            color: '#ba9472',
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '000003',
            name: 'Task 3',
            start: 1628507597,
            end: 1633345997,
            expandable: true,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000004',
            name: 'Task 4',
            start: 1624705997,
            expandable: true,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000005',
            name: 'Task 5',
            start: 1628075597,
            end: 1629544397,
            color: '#709dc1',
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000006',
            name: 'Task 6',
            start: 1641121997,
            end: 1645528397,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000007',
            name: 'Task 7',
            start: 1639393997,
            end: 1640862797,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000008',
            name: 'Task 8',
            end: 1628783999,
            color: '#709dc1',
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '000009',
            name: 'Task 9',
            start: 1639307597,
            end: 1640344397,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000010',
            name: 'Task 10',
            start: 1609067597,
            end: 1617275597,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000011',
            name: 'Task 11',
            start: 1611918797,
            end: 1611918797,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000012',
            name: 'Task 12',
            start: 1627816397,
            end: 1631358797,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000013',
            name: 'Task 13',
            start: 1625051597,
            end: 1630667597,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000014',
            name: 'Task 14',
            start: 1627920000,
            end: 1629129599,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000015',
            name: 'Task 15',
            start: 1633259597,
            end: 1639480397,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '00000115',
            name: 'Task 15',
            start: 1633259597,
            end: 1639480397,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.DELETED
        },
        {
            id: '0000016',
            name: 'Task 16',
            start: 1624965197,
            end: 1627211597,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000017',
            name: 'Task 17',
            start: 1641035597,
            end: 1649157197,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000018',
            name: 'Task 18',
            start: 1637061197,
            end: 1642677197,
            group_id: '',
            eventTypeName: 'Production Line',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000019',
            name: 'Task 19',
            start: 1637925197,
            end: 1646305997,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000020',
            name: 'Task 20',
            start: 1628334797,
            end: 1629889997,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.MODIFIED
        },
        {
            id: '0000021',
            name: 'Task 21',
            start: 1622891597,
            end: 1627643597,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000022',
            name: 'Task 22',
            start: 1616238797,
            end: 1620731597,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000023',
            name: 'Task 23',
            start: 1626693197,
            end: 1630149197,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.DELETED
        },
        {
            id: '0000024',
            name: 'Task 24',
            start: 1626174797,
            end: 1626952397,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000025',
            name: 'Task 25',
            start: 1631013197,
            end: 1637493197,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000026',
            name: 'Task 26',
            start: 1635937997,
            end: 1643886797,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000027',
            name: 'Task 27',
            start: 1637665997,
            end: 1644059597,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000028',
            name: 'Task 28',
            start: 1611400397,
            end: 1615547597,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        },
        {
            id: '0000029',
            name: 'Task 29',
            start: 1618053197,
            end: 1619176397,
            group_id: '',
            eventTypeName: 'Meeting',
            eventTypeVersion: 1,
            state: State.CREATED
        }
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
        if (event.ctrlKey) {
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
    }

    @ViewChild('gantt') ganttComponent: NgxGanttComponent;

    childrenResolve = (item: GanttItem) => {
        const children = randomItems(random(1, 5), item);
        return of(children).pipe(delay(1000));
    };

    constructor(/*private printService: GanttPrintService*/ private cdr: ChangeDetectorRef, private eventService: EventService) {}

    ngOnInit(): void {
        this.eventTypes = this.eventService.getEventTypes();
        this.setGroups();
        this.setItemsToGroups();
    }

    ngAfterViewInit() {
        console.log(this.gantt);
    }

    setGroups() {
        this.eventTypes.map((eventType) => {
            if (!this.groups.some((group) => group.title === eventType.name)) {
                const id = this.generateRandomNumber().toString();
                this.groups.push({ id, title: eventType.name });
                this.groupIds.push(id);
            }
        });
    }

    setItemsToGroups() {
        this.items.map((item) => {
            const group = this.groups.find((group) => group.title === item.eventTypeName);
            if (group) {
                item.group_id = group.id;
            } else {
                item.group_id = this.groups[0].id;
            }
        });
    }

    generateRandomNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    barClick(event: GanttBarClickEvent) {
        // this.thyNotify.info('Event: barClick', `你点击了 [${event.item.name}]`);
    }

    lineClick(event: GanttLineClickEvent) {
        // this.thyNotify.info('Event: lineClick', `你点击了 ${event.source.title} 到 ${event.target.title} 的关联线`);
    }

    dragMoved(event: GanttDragEvent) {}

    dragEnded(event: GanttDragEvent) {
        // this.thyNotify.info('Event: dragEnded', `修改了 [${event.item.name}] 的时间`);
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

    createEvent(event: Event) {
        let item: GanttItem = event;
        item.id = this.generateRandomNumber().toString();
        const group = this.groups.find((group) => group.title === event.eventTypeName);
        if (group) {
            item.group_id = group.id;
        } else {
            item.group_id = this.groups[0].id;
        }
        this.items = [item, ...this.items];
        console.log(item);
    }
}
