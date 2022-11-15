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
import { SymbolAddDialogComponentService } from 'app/modules/common-components/symbol-add-dialog/symbol-add-dialog.component.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppConstants } from 'app/app.utility';
import { MatDialog } from '@angular/material/dialog';
import { TradingDashboardBuySellComponent } from '../trading-dashboard-buysell/trading-dashboard-buysell.component';
import { BehaviorSubject } from 'rxjs';




@Component({
    selector: 'trading-dashboard-favourite',
    templateUrl: './trading-dashboard-favourite.component.html',
    styleUrls: ['../trading-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TradingDashboardFavouriteComponent implements OnInit {

    menu: string[] = ['Symbol', 'Sell', 'Buy', 'Spread', 'Change','buysell'];
    userid: Number;
    favouriteSymbolsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    selectedAssetClass: string = 'equities';
    equitySymbols$ = new BehaviorSubject<any>([]);
    cryptoSymbols$ = new BehaviorSubject<any>([]);
    commoditySymbols$ = new BehaviorSubject<any>([]);
    realEstateSymbols$ = new BehaviorSubject<any>([]);
    spread=0

    
    constructor(
        private _symbolService: SymbolAddDialogComponentService,
        private toast: ToastrService,
        private sanitizer: DomSanitizer,
        private _router: Router,
        private _matDialog: MatDialog,
       ) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userid = user.id;
       }

    ngOnInit(): void {
        this.getWatchListSymbols()
    }
    getWatchListSymbols() {
        let equitySymbols=[]
        let cryptoSymbols=[]
        let commoditySymbols=[]
        let realEstateSymbols=[]


        this._symbolService.getFavourites(this.userid, AppConstants.exchangeCode).subscribe((data) => {
            data.map(a => {
                let objectURL = 'data:image/png;base64,' + a.securityImage;
                a.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                a.bidPrice = a.bestMarketDTO[0].bidPrice
                a.offerPrice = a.bestMarketDTO[0].offerPrice
                a.dir = a.securityStatsDTO[0]?.change.startsWith('-') ? 'down' : a.dir = 'up';
                a.securityStatsDTO.change = a.securityStatsDTO[0]?.change

                if(a.assetClass.assetCode=="EQTY"){
                    equitySymbols.push(a)
                }
                else if(a.assetClass.assetCode=="CRYPTO"){
                    cryptoSymbols.push(a)
                }
                else if(a.assetClass.assetCode=="CMDTY"){
                    commoditySymbols.push(a)
                }
                else if(a.assetClass.assetCode=="REALES"){
                    realEstateSymbols.push(a)
                }
            });
             
            this.equitySymbols$.next(equitySymbols)
            this.cryptoSymbols$.next(cryptoSymbols)
            this.commoditySymbols$.next(commoditySymbols)
            this.realEstateSymbols$.next(realEstateSymbols)
            
            this.favouriteSymbolsDataSource.data = this.equitySymbols$.value
        
        }, (error => {
            this.toast.error('Something Went Wrong', 'Error')
        }));
    }
    buySellDialogue(buySell: any,transaction:any) {
        this._matDialog.open(TradingDashboardBuySellComponent, {
            autoFocus: false,
            position: { top: '8%' },
            width: "400px",
            data: {
                action: buySell,
                symbolCode: transaction.securityCode,
                marketCode:transaction.marketCode,
                exchangeCode:transaction.exchangeCode,
                price:transaction.securityStatsDTO[transaction.securityStatsDTO.length-1].currentPrice

                },

            }).afterClosed().subscribe((data) => {

        });
    }

    assetClassSelected(assetClass:any){
        this.selectedAssetClass=assetClass
        
        if(this.selectedAssetClass=='equities'){
            this.favouriteSymbolsDataSource.data = this.equitySymbols$.value
        }
        else if(this.selectedAssetClass=='crypto'){
            this.favouriteSymbolsDataSource.data = this.cryptoSymbols$.value
        }
        else if(this.selectedAssetClass=='commodities'){
            this.favouriteSymbolsDataSource.data = this.commoditySymbols$.value
        }
        else if(this.selectedAssetClass=='realestate'){
            this.favouriteSymbolsDataSource.data = this.realEstateSymbols$.value
        }
    }

    onClickSymbol(element) {
        this._router.navigate([`/trading-portal/trading-graph/${element.exchangeCode}/${element.marketCode}/${element.securityCode}`])
    }
   


  
}