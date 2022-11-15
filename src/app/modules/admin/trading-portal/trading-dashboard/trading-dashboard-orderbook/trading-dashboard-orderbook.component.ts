import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MBOData, MBPData } from 'app/modules/admin/dashboard/oder-book/order-book';
import { WebSocketService } from 'app/services/socket/web-socket.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { AppConstants } from 'app/app.utility';


@Component({
    selector: 'trading-dashboard-orderbook',
    templateUrl: './trading-dashboard-orderbook.component.html',
    styleUrls: ['./trading-dashboard-orderbook.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TradingDashboardOrderBookComponent implements OnInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    mboDataSource: MatTableDataSource<any> = new MatTableDataSource();
    mboDataColumns: string[] = ['price', 'amount', 'total'];
    recentTransactionsTableColumnsForDividends: string[] = ['date', 'name'];
    selectedAssetClass: string = 'equities';
    buyColor: any;
    sellColor: any;
    colorByType: string;

    mboDataArr: MBOData[] = new Array();
    mbpDataArr: MBPData[] = new Array();

    mboBuyDataSource: MatTableDataSource<any> = new MatTableDataSource();
    mboSellDataSource: MatTableDataSource<any> = new MatTableDataSource();
    mboBuyBoldDataSource: MatTableDataSource<any> = new MatTableDataSource();

    dummyMboDataArr = [{
        price: 10,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 30,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 40,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 50,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 60,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 70,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 80,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }, {
        price: 90,
        amount: 6.78,
        type: "buy",
        colorByType: ""
    }, {
        price: 20,
        amount: 6.78,
        type: "sell",
        colorByType: ""
    }]

    buyArr: Array<any> = []
    buyBoldArr: Array<any> = []
    sellArr: Array<any> = []
    buySellArr: Array<any> = []


    constructor(
        private socket: WebSocketService
    ) {
        this.buyColor = AppConstants.buyColor;
        this.sellColor = AppConstants.sellColor;
    }

    onFetchMBOData(): void {
        this.socket.onFetchDataFromChannel('best_orders').subscribe((data: any) => {
            let mboArrIndex = 0;
            this.mboDataArr = new Array<MBOData>();
            //this.mboData = <MBOData> data; 
            let mboData = null;

            // mbo buy_orders 
            if (data.buy_orders != null && data.buy_orders !== undefined && Array.isArray(data.buy_orders)) {
                data.buy_orders.forEach(element => {
                    mboData = new MBOData();
                    mboData.buy_volume = element.volume;
                    mboData.buy_price = element.price;
                    this.mboDataArr.push(mboData);
                });
            }

            // mbo sell_orders 
            if (data.sell_orders != null && data.sell_orders !== undefined && Array.isArray(data.sell_orders)) {
                data.sell_orders.forEach(element => {
                    mboData = new MBOData();
                    mboData.sell_volume = element.volume;
                    mboData.sell_price = element.price;
                    this.mboDataArr[mboArrIndex] = mboData;
                    ++mboArrIndex;
                });
            }

            this.mboDataSource.data = this.mboDataArr;
        });

    }

    ngOnInit(): void {
        // this.mboDataSource.data = this.mboDataArr; 
        this.colorOnBuySell()
        this.mboDataSource.data = this.dummyMboDataArr
        this.onFetchMBOData();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    colorOnBuySell() {
        for (let i = 0; i < this.dummyMboDataArr.length; i++) {
            if (this.dummyMboDataArr[i].type == "buy") {
                this.dummyMboDataArr[i].colorByType = this.buyColor
                this.buyArr.push(this.dummyMboDataArr[i])
            }
            else {
                this.dummyMboDataArr[i].colorByType = this.sellColor
                this.sellArr.push(this.dummyMboDataArr[i])
            }
        }
        this.buyBoldArr.unshift(this.buyArr[0])
        this.mboBuyBoldDataSource.data = this.buyBoldArr
        this.buyArr.shift()
        this.mboBuyDataSource.data = this.buyArr
        this.mboSellDataSource.data = this.sellArr

        // for (let i = 0; i < this.sellArr.length; i++) {
        //     this.buyArr.unshift(this.sellArr[i])
        // }
        this.dummyMboDataArr = this.buyArr
    }
  
}