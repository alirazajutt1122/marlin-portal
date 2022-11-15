import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';



@Component({
    selector: 'top-sellers',
    templateUrl: './top-sellers.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class TopSellersComponent implements OnInit, AfterViewInit {
    lang: string;
    dataLimit = ['Top 5', 'Top 10', 'Top 20'];
    dataSort = ['Value', 'Volume']
    tableColumns: string[] = ['Code', 'Name', 'Value', 'Volume'];

    data: MatTableDataSource<any> = new MatTableDataSource();

    dummyData: object[] = [
        { code: '004', name: 'James', value: 11500, volume: 2000 },
        { code: '022', name: 'David', value: 9900, volume: 700 },
        { code: '026', name: 'Dawson', value: 11140, volume: 1100 },
        { code: '042', name: 'Daniel', value: 1124, volume: 1176 }
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