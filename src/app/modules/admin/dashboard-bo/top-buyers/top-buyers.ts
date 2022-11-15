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
    selector: 'top-buyers',
    templateUrl: './top-buyers.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class TopBuyersComponent implements OnInit, AfterViewInit {
    lang: string;
    dataLimit = ['Top 5', 'Top 10', 'Top 20'];
    dataSort = ['Value', 'Volume']
    tableColumns: string[] = ['Code', 'Name', 'Value', 'Volume'];

    data: MatTableDataSource<any> = new MatTableDataSource();

    dummyData: object[] = [
        { code: '001', name: 'John', value: 3000, volume: 2000 },
        { code: '002', name: 'Amber', value: 2500, volume: 1700 },
        { code: '032', name: 'Neison', value: 1725, volume: 2400 },
        { code: '041', name: 'Amber', value: 1124, volume: 1176 }
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
    }


    public ngAfterViewInit(): void {

    }



}