/*
 * <<licensetext>>
 */

import { coerceCssPixelValue } from '@angular/cdk/coercion';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { Event } from 'example/src/app/interfaces/event.interface';
import { EventService } from 'example/src/app/services/event.service';
import { GanttService } from 'example/src/app/services/gantt.service';
import { ModalService } from 'example/src/app/services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { from, fromEvent, Observable, Subject } from 'rxjs';
import { finalize, startWith, take, takeUntil } from 'rxjs/operators';
import { GanttItem, GanttItemInternal, GanttLineClickEvent, GanttMainClickEvent, GanttSelectedEvent } from './class';
import { defaultColumnWidth } from './components/table/gantt-table.component';
import { GANTT_ABSTRACT_TOKEN } from './gantt-abstract';
import { GanttUpper, GANTT_UPPER_TOKEN } from './gantt-upper';
import { GanttGlobalConfig, GANTT_GLOBAL_CONFIG } from './gantt.config';
import { sideWidth } from './gantt.styles';
import { NgxGanttRootComponent } from './root.component';
import { NgxGanttTableColumnComponent } from './table/gantt-column.component';
import { NgxGanttTableComponent } from './table/gantt-table.component';
import { GanttDate } from './utils/date';
@Component({
    selector: 'ngx-gantt',
    templateUrl: './gantt.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: GANTT_UPPER_TOKEN,
            useExisting: NgxGanttComponent
        },
        {
            provide: GANTT_ABSTRACT_TOKEN,
            useExisting: forwardRef(() => NgxGanttComponent)
        }
    ]
})
export class NgxGanttComponent extends GanttUpper implements OnInit, AfterViewInit, OnChanges {
    @Input() maxLevel = 2;

    @Input() async: boolean;

    @Input() childrenResolve: (GanttItem) => Observable<GanttItem[]>;

    @Input() refreshItems: Observable<boolean>;

    @Input() zoomIndex: number;

    @Input() isChartClicked: boolean;

    @Output() lineClick = new EventEmitter<GanttLineClickEvent>();

    @Output() selectedChange = new EventEmitter<GanttSelectedEvent>();

    @Output() newEventCreation = new EventEmitter<{ event?: Event; groupId?: string; deleteTemporaryEvent?: boolean }>();

    @ContentChild(NgxGanttTableComponent) table: NgxGanttTableComponent;

    @ContentChildren(NgxGanttTableColumnComponent, { descendants: true }) columns: QueryList<NgxGanttTableColumnComponent>;

    @ContentChild('tableEmpty', { static: true }) tableEmptyTemplate: TemplateRef<any>;

    @ViewChild('ganttRoot') ganttRoot: NgxGanttRootComponent;

    @ViewChild('gantt')
    gantt!: NgxGanttComponent;

    private ngUnsubscribe$ = new Subject();

    public sideTableWidth = sideWidth;

    constructor(
        elementRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        ngZone: NgZone,
        @Inject(GANTT_GLOBAL_CONFIG) config: GanttGlobalConfig,
        ganttService: GanttService,
        nzMessageService: NzMessageService,
        private modalService: ModalService,
        private eventService: EventService
    ) {
        super(elementRef, cdr, ngZone, config, ganttService, nzMessageService);
    }

    override ngOnInit() {
        super.ngOnInit();
        // Note: the zone may be nooped through `BootstrapOptions` when bootstrapping the root module. This means
        // the `onStable` will never emit any value.
        const onStable$ = this.ngZone.isStable ? from(Promise.resolve()) : this.ngZone.onStable.pipe(take(1));
        this.refreshItems.pipe(takeUntil(this.unsubscribe$)).subscribe((loadOnScrollEmitted) => {
            this.refreshItemsByScroll$.next(loadOnScrollEmitted);
        });
    }

    ngAfterViewInit() {
        this.columns.changes.pipe(startWith(true), takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.columns.forEach((column) => {
                if (!column.columnWidth) {
                    column.columnWidth = coerceCssPixelValue(defaultColumnWidth);
                }
            });
            this.cdr.detectChanges();
        });
    }

    override ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (!this.firstChange) {
            if (changes.viewType) {
                this.createView();
            }
            if (changes.zoomIndex) {
                this.modifyViewZoom();
                this.computeRefs();
            }
        }
    }

    expandChildren(item: GanttItemInternal) {
        if (!item.expanded) {
            item.setExpand(true);
            if (this.async && this.childrenResolve && item.children.length === 0) {
                item.loading = true;
                this.childrenResolve(item.origin)
                    .pipe(
                        take(1),
                        finalize(() => {
                            item.loading = false;
                            this.expandChange.emit();
                            this.cdr.detectChanges();
                        })
                    )
                    .subscribe((items) => {
                        item.addChildren(items);
                        this.computeItemsRefs(...item.children);
                    });
            } else {
                this.computeItemsRefs(...item.children);
                this.expandChange.emit();
            }
        } else {
            item.setExpand(false);
            this.expandChange.emit();
        }
    }

    selectItem(selectEvent: GanttSelectedEvent) {
        if (!this.selectable) {
            return;
        }
        const { event, selectedValue } = selectEvent;
        this.selectionModel.toggle((selectedValue as GanttItem).id);

        const selectedIds = this.selectionModel.selected;
        if (this.multiple) {
            const _selectedValue = this.getGanttItems(selectedIds).map((item) => item.origin);
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        } else {
            const _selectedValue = this.getGanttItem(selectedIds[0])?.origin;
            this.selectedChange.emit({ event, selectedValue: _selectedValue });
        }
    }

    scrollToToday() {
        this.ganttRoot.scrollToToday();
    }

    scrollToDate(date: number | GanttDate) {
        this.ganttRoot.scrollToDate(date);
    }

    startDragToCreate(event: GanttMainClickEvent) {
        // If it was a left click
        if (event.event.button === 0) {
            const clickedX = event.event.offsetX;
            const clickedDate = this.view.getDateByXPoint(clickedX);
            this.nzMessageService.info(`The clicked point is at: ${clickedDate.value}`);

            const dragToSelectEvent = this.eventService.createEventFromDrag(clickedDate.value);
            this.newEventCreation.emit({ event: dragToSelectEvent, groupId: event.group.id });

            fromEvent(document, 'mousemove')
                .pipe(takeUntil(fromEvent(document, 'mouseup')))
                .subscribe((mouseMoveEvent: MouseEvent) => {
                    const movedX = mouseMoveEvent.offsetX;
                    const movedEvent = this.view.getDateByXPoint(movedX);
                    dragToSelectEvent.endTime = movedEvent.value;
                    this.newEventCreation.emit({ event: dragToSelectEvent, groupId: event.group.id });
                    this.scrollToTemporaryEvent();
                })
                .add(() => {
                    this.scrollToTemporaryEvent();
                    this.modalService.createEventModal(
                        dragToSelectEvent.startTime,
                        (result) => {
                            this.newEventCreation.emit({ event: result, deleteTemporaryEvent: true });
                        },
                        () => {
                            this.newEventCreation.emit({ deleteTemporaryEvent: true });
                            console.log('Modal closed.');
                        },
                        dragToSelectEvent.endTime,
                        event.group.title
                    );
                });
        }
    }

    scrollToTemporaryEvent() {
        const element = document.getElementById('temporaryEvent');
        if (element && !this.checkElementIsInView(element)) {
            // todo: scroll with offset
            element.scrollIntoView();
        }
    }

    checkElementIsInView(element: Element) {
        let rect = element.getBoundingClientRect();
        let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }

    modifyViewZoom() {
        this.view.modifyCellWidth(this.zoomIndex);
    }
}
