import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import * as wijmo from '@grapecity/wijmo';
import * as chart from '@grapecity/wijmo.chart';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'dashboard-bo-client',
    templateUrl: './dashboard-bo-client.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
})




export class DashboardBoClientComponent implements OnInit, AfterViewInit {

    trades: string = "100,000"
    total: number = 200
    active: number = 150
    inActive: number = 50

    Wjdata: any[];
    lang: string;

    getData() {
        return [
            { type: 'InActive', trade: this.inActive },
            { type: 'Active', trade: this.active },

        ];
    }

    constructor(private translate: TranslateService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
        this.Wjdata = this.getData();
    }

    ngOnInit(): void {
    }


    public ngAfterViewInit(): void {

    }

    getLabelContent = (ht: chart.HitTestInfo) => {
        return wijmo.format('{name} {val}', { val: ht.value });
    }


}