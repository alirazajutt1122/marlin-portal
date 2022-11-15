import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';



@Component({
    selector: 'cash-obligation',
    templateUrl: './cash-obligation.html',
    styleUrls: ['../../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class CashObligationComponent implements OnInit, AfterViewInit {
    lang: string;
    tableColumns: string[] = ['Market', 'Side', 'Value', 'NetCash'];
    data: MatTableDataSource<any> = new MatTableDataSource();
    totalCash: number = 0

    dummyData: any[] = [
        { market: 'REG', side: 'Buy', value: 10000, netCash: 1000 },
        { market: '', side: 'Sell', value: 9000 },
        { market: 'BOND', side: 'Buy', value: 70000, netCash: 20000 },
        { market: '', side: 'Sell', value: 50000 },
        { market: '', side: '', total: 'Net Obligation', totalCash: '' },
    ]

    constructor(private translate: TranslateService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }

    ngOnInit(): void {
        this.data.data = this.dummyData

        this.dummyData.forEach((a) => {
            if (a.netCash != undefined)
                this.totalCash += a.netCash
        })

        this.dummyData[this.dummyData.length - 1].totalCash = this.totalCash


    }

    public ngAfterViewInit(): void {

    }



}