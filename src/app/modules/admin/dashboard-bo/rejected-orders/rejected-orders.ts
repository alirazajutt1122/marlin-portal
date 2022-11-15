import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from '@fuse/animations';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { Market } from 'app/models/market';
import { ListingService } from 'app/services-oms/listing-oms.service';



@Component({
    selector: 'rejected-orders',
    templateUrl: './rejected-orders.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class RejectedOrdersComponent implements OnInit, AfterViewInit {
    lang: string;
    tableColumns: string[] = ['Security', 'Account', 'OrderNo', 'DateTime','Price','Value','Volume','RejectionReason'];
    dataLimit = ['Top 5', 'Top 10', 'Top 20'];
    marketList: any[] = []
    data: MatTableDataSource<any> = new MatTableDataSource();

    dummyData: any[] = [
       {security:"BOP" , account: "B16-B/0000658",orderNo:'A-b16-B-2022/09/l',date:'2022-08-22',price:'100',value:'3,000',volume:'2,000',rejectionReason:'Short sell not allowed' },
       {security:"AHL" , account: "A26-B/0000658",orderNo:'B-b16-B-2022/09/l',date:'2022-07-12',price:'200',value:'1,000',volume:'1,000',rejectionReason:'Cash not available' },
       {security:"ACL" , account: "C32-B/0000641",orderNo:'C-b16-B-2022/09/l',date:'2022-06-02',price:'50',value:'2,000',volume:'4,000',rejectionReason:'' },
       {security:"PTC" , account: "G12-B/0000754",orderNo:'D-b16-B-2022/09/l',date:'2022-05-14',price:'70',value:'3,000',volume:'1,000',rejectionReason:'Short sell not allowed' }
    ]
    errorMessage: any;

    constructor(private translate: TranslateService, private listingService: ListingService, private loader: FuseLoaderScreenService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }

    ngOnInit(): void {
        this.populateMarketList()
        this.dummyData.map((a)=>{
            a.src = 'assets/img/settlement.png'
        })
        this.data.data = this.dummyData
    }


    public ngAfterViewInit(): void {

    }

    private populateMarketList() {
        this.loader.show();
        this.listingService.getActiveMarketList()
            .subscribe(
                restData => {
                    this.loader.hide();
                    this.marketList = restData;

                    var market: Market = new Market();
                    market.marketId = AppConstants.PLEASE_SELECT_VAL;
                    market.marketCode = AppConstants.PLEASE_SELECT_STR;
                    this.marketList.unshift(market);
                },
                error => {
                    this.loader.hide();
                    this.errorMessage = <any>error.message
                });
    }


}