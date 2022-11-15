import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'app/app.utility';
import { Market } from 'app/models/market';
import { ListingService } from 'app/services-oms/listing-oms.service';



@Component({
    selector: 'delivery-obligation',
    templateUrl: './delivery-obligation.html',
    styleUrls: ['../../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
})




export class DeliveryObligationComponent implements OnInit, AfterViewInit {
    lang: string;
    marketList: any[] = []
    errorMessage: any;
    marketId: number
    data: MatTableDataSource<any> = new MatTableDataSource();
    tableColumns:string[]=['security','buy_volume','sell_volume','net_volume']

    dummyData: any[] = [
        { security: 'BOP', buy_volume: '1000', sell_volume: 250, net_volume: 750 },
        { security: 'AHL', buy_volume: '1000', sell_volume: 250, net_volume: 750 },
        { security: 'ACL', buy_volume: '1000', sell_volume: 250, net_volume: 750 },
        { security: 'PTC', buy_volume: '1000', sell_volume: 250, net_volume: 750 }
    ]

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