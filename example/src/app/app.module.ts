/*
 * <<licensetext>>
 */

import { CommonModule } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DocgeniTemplateModule } from '@docgeni/template';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxGanttModule } from 'ngx-gantt';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThyCheckboxModule } from 'ngx-tethys/checkbox';
import { ThyDatePickerModule } from 'ngx-tethys/date-picker';
import { setPrintErrorWhenIconNotFound } from 'ngx-tethys/icon';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyNavModule } from 'ngx-tethys/nav';
import { ThyNotifyModule } from 'ngx-tethys/notify';
import { ThySwitchModule } from 'ngx-tethys/switch';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppExampleComponentsComponent } from './components/components.component';
import { AppGanttFlatComponent } from './gantt-advanced/component/flat.component';
import { AppGanttAdvancedExampleComponent } from './gantt-advanced/gantt-advanced.component';
import { AppGanttGroupsExampleComponent } from './gantt-groups/gantt-groups.component';
import { AppGanttRangeExampleComponent } from './gantt-range/gantt-range.component';
import { AppGanttExampleComponent } from './gantt/gantt.component';
import { CreateEventComponent } from './modals/create-event/create-event-modal.component';
import { EchartComponent } from './modals/echart/echart-modal.component';
import { AsPipe } from './pipes/as.pipe';
import { EventService } from './services/event.service';
import { FormService } from './services/form.service';
import { GanttService } from './services/gantt.service';
import { ModalService } from './services/modal.service';

const antdModule = [
    NzRadioModule,
    NzButtonModule,
    NzFormModule,
    NzMessageModule,
    NzModalModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzTimePickerModule
];
@NgModule({
    declarations: [
        AppComponent,
        AppExampleComponentsComponent,
        AppGanttExampleComponent,
        AppGanttAdvancedExampleComponent,
        AppGanttGroupsExampleComponent,
        AppGanttRangeExampleComponent,
        AppGanttFlatComponent,
        AsPipe,
        CreateEventComponent,
        EchartComponent
    ],
    imports: [
        ReactiveFormsModule,
        ...antdModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        DocgeniTemplateModule,
        NgxGanttModule,
        AppRoutingModule,
        RouterModule.forRoot([]),
        ThyButtonModule,
        ThyNavModule,
        ThyLayoutModule,
        ThyCheckboxModule,
        ThyNotifyModule,
        ThySwitchModule,
        ThyDatePickerModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })
    ],
    exports: [ReactiveFormsModule, ...antdModule, AsPipe],
    providers: [
        GanttService,
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: NZ_I18N, useValue: en_US },
        ModalService,
        AsPipe,
        FormService,
        EventService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        setPrintErrorWhenIconNotFound(false);
    }
}
