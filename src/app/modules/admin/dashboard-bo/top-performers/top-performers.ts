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
    selector: 'top-performers',
    templateUrl: './top-performers.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class TopPerformersComponent implements OnInit, AfterViewInit {
    lang: string;
    tableColumns: string[] = ['Security', 'Value', 'Volume'];
    dataLimit = ['Top 5', 'Top 10', 'Top 20'];
    marketList: any[] = []
    data: MatTableDataSource<any> = new MatTableDataSource();

    dummyData: any[] = [
        { security: "Nestle", value: 20000, volume: 1900 },
        { security: "MCB", value: 45000, volume: 4900 },
        { security: "SHELL", value: 56000, volume: 14900 },
        { security: "PSO", value: 11000, volume: 900 }
    ]
    errorMessage: any;
    chartData: any[];

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
        this.chartData = this.dummyData
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