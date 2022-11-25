/*
 * <<licensetext>>
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DocgeniTemplateModule } from '@docgeni/template';
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
import { GanttService } from './services/gantt.service';

@NgModule({
    declarations: [
        AppComponent,
        AppExampleComponentsComponent,
        AppGanttExampleComponent,
        AppGanttAdvancedExampleComponent,
        AppGanttGroupsExampleComponent,
        AppGanttRangeExampleComponent,
        AppGanttFlatComponent
    ],
    imports: [
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
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
        ThyDatePickerModule
    ],
    providers: [GanttService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        setPrintErrorWhenIconNotFound(false);
    }
}
