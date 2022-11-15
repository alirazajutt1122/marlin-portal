import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Inject,
  OnInit, TemplateRef, ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from "rxjs";
import { UserService } from "../../../core/user/user.service";
import { takeUntil } from "rxjs/operators";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { fuseAnimations } from "@fuse/animations";
import { TradingPortalService } from 'app/modules/admin/trading-portal/trading-portal.service';
import { ToastrService } from "ngx-toastr";
import { Navigation } from "../../../core/navigation/navigation.types";
import { AuthService } from 'app/core/auth/auth.service';
import { MatTableDataSource } from "@angular/material/table";
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SymbolAddDialogComponent } from '../symbol-add-dialog/symbol-add-dialog.component';
import { PortfolioDetailComponentService } from '../portfolio-detail/portfolio-detail.component.service';
import { AppConstants } from 'app/app.utility';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent,
} from "ng-apexcharts";

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;

};

@Component({
  selector: 'portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
})
export class PortfolioDetailComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<radialChartOptions>;
  equityBarPercent = new BehaviorSubject<String>("0%");
  equityColor: String = AppConstants.equityColor
  equityPLColor: String = "#FFFFFF"

  cryptoBarPercent = new BehaviorSubject<String>("0%");
  cryptoColor: String = AppConstants.cryptoColor
  cryptoPLColor: String = "#FFFFFF"

  commoditiesBarPercent = new BehaviorSubject<String>("0%");
  commoditiesColor: String = AppConstants.commoditiesColor
  commoditiesPLColor: String = "#FFFFFF"

  realEstateBarPercent = new BehaviorSubject<String>("0%");
  realEstateColor: String = AppConstants.realEstateColor
  realEstatePLColor: String = "#FFFFFF"

  userid: Number;
  profitColor = AppConstants.buyColor
  lossColor = AppConstants.sellColor

  equityTotalValue = new BehaviorSubject<any>('0000.00');
  equityCurrentValue = new BehaviorSubject<any>('0000.00');
  equityVolume = new BehaviorSubject<any>('0');
  equityNetProfitLoss = new BehaviorSubject<any>('0');
  equityProfit: Boolean = false
  equityLoss: Boolean = false

  cryptoTotalValue = new BehaviorSubject<any>('0000.00');
  cryptoCurrentValue = new BehaviorSubject<any>('0000.00');
  cryptoVolume = new BehaviorSubject<any>('0');
  cryptoNetProfitLoss = new BehaviorSubject<any>('0');
  cryptoProfit: Boolean = false
  cryptoLoss: Boolean = false

  commodityTotalValue = new BehaviorSubject<any>('0000.00');
  commodityCurrentValue = new BehaviorSubject<any>('0000.00');
  commodityVolume = new BehaviorSubject<any>('0');
  commodityNetProfitLoss = new BehaviorSubject<any>('0');
  commodityProfit: Boolean = false
  commodityLoss: Boolean = false

  realEstateTotalValue = new BehaviorSubject<any>('0000.00');
  realEstateCurrentValue = new BehaviorSubject<any>('0000.00');
  realEstateVolume = new BehaviorSubject<any>('0');
  realEstateNetProfitLoss = new BehaviorSubject<any>('0');
  realEstateProfit: Boolean = false
  realEstateLoss: Boolean = false

  loading = true
  NoDataFound = false

  constructor(
    public matDialogRef: MatDialogRef<SymbolAddDialogComponent>,
    private _userService: UserService,
    private tradingPortalService: TradingPortalService,
    private toast: ToastrService,
    private _authService: AuthService,
    private sanitizer: DomSanitizer,
    private _router: Router,
    private _portfolioService: PortfolioDetailComponentService,
  ) {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userid = user.id;

    this.chartOptions = {
      series: [0, 0, 0, 0],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "16px",
              offsetY: 150
            },
            value: {
              show: false,
              fontSize: "16px",
              color: '#F44336',
              offsetY: 160,
            },
            total: {
              show: false,
              label: "Total",
              formatter: function (w) {
                return "249";
              }
            }
          }
        }
      },
      labels: ["Commodities", "Equities", "Real Esatate", "Crypto"]
    };

  }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.getUserTradeDetail()
  }

  onCloseDialog() {
    this.matDialogRef.close();
  }

  getUserTradeDetail() {
    let equityVolume = 0
    let cryptoVolume = 0
    let commodityVolume = 0
    let realEstateVolume = 0
    debugger
    this._portfolioService.getUserTrade(this.userid).subscribe((res) => {
      
      let equityCount = 0
      let cryptoCount = 0
      let commodityCount = 0
      let realEstateCount = 0
      let TotalSymbols = res.length

      res?.map((data) => {

        if (data.assetClass.assetCode == "EQTY") {
          equityCount += 1
        }
        else if (data.assetClass.assetCode == "CRYPTO") {
          cryptoCount += 1
        }
        else if (data.assetClass.assetCode == "CMDTY") {
          commodityCount += 1
        }
        else if (data.assetClass.assetCode == "REALES") {
          realEstateCount += 1
        }
      })

      //.........................Percentage Calculation......................
      let equityPercentage = (TotalSymbols==0)? 0 : Number(equityCount) / Number(TotalSymbols) * 100
      debugger
      this.equityBarPercent.next(equityPercentage + "%")

      let cryptoPercentage = (TotalSymbols==0)? 0 : Number(cryptoCount) / Number(TotalSymbols) * 100
      this.cryptoBarPercent.next(cryptoPercentage + "%")

      let commodityPercentage = (TotalSymbols==0)? 0 : Number(commodityCount) / Number(TotalSymbols) * 100
      this.commoditiesBarPercent.next(commodityPercentage + "%")

      let realEstatePercentage = (TotalSymbols==0)? 0 : Number(realEstateCount) / Number(TotalSymbols) * 100
      this.realEstateBarPercent.next(realEstatePercentage + "%")

      if (equityPercentage == 0 && cryptoPercentage==0 && commodityPercentage == 0 && realEstatePercentage == 0) {
        this.loading = false
        this.NoDataFound = true
      }

      if (equityPercentage != 0 || cryptoPercentage != 0 || commodityPercentage != 0 || realEstatePercentage != 0) {
        this.loading = false
      }

      this.chartOptions.series = [commodityPercentage, equityPercentage, realEstatePercentage, cryptoPercentage]

    })

    this._userService.getUserTradeHoldings(this.userid).subscribe((res) => {
      debugger
      console.log(res)
      let equityMarketValue = 0
      let equityTotalCost = 0
      let equityNetProfitLoss = 0

      let cryptoMarketValue = 0
      let cryptoTotalCost = 0
      let cryptoNetProfitLoss = 0

      let commodityMarketValue = 0
      let commodityTotalCost = 0
      let commodityNetProfitLoss = 0

      let realEstateMarketValue = 0
      let realEstateTotalCost = 0
      let realEstateNetProfitLoss = 0
      res?.map((data) => {

        if (data.assetClass.assetCode == "EQTY") {

          equityMarketValue += Number(data.holding * data.securityStatsDTO.currentPrice)
          equityTotalCost += Number(data.totalCost)
          equityVolume += Number(data.holding)
        }
        else if (data.assetClass.assetCode == "CRYPTO") {
          cryptoMarketValue += Number(data.holding * data.securityStatsDTO.currentPrice)
          cryptoTotalCost += Number(data.totalCost)
          cryptoVolume += Number(data.holding)
        }
        else if (data.assetClass.assetCode == "CMDTY") {
          commodityMarketValue += Number(data.holding * data.securityStatsDTO.currentPrice)
          commodityTotalCost += Number(data.totalCost)
          commodityVolume += Number(data.holding)
        }
        else if (data.assetClass.assetCode == "REALES") {
          realEstateMarketValue += Number(data.holding * data.securityStatsDTO.currentPrice)
          realEstateTotalCost += Number(data.totalCost)
          realEstateVolume += Number(data.holding)
        }
      })
      //.........................Asset Class Volumes......................
      this.equityVolume.next(equityVolume)
      this.cryptoVolume.next(cryptoVolume)
      this.commodityVolume.next(commodityVolume)
      this.realEstateVolume.next(realEstateVolume)

      //.........................AssetClasss Total/Current/Net-Profit/Loss.....................
      //.................................equity..............................................
      equityTotalCost = this.roundDownSignificantDigits(equityTotalCost, 3)
      if (equityTotalCost == 0) this.equityTotalValue.next("0000.00")
      else this.equityTotalValue.next(equityTotalCost)

      equityMarketValue = this.roundDownSignificantDigits(equityMarketValue, 3)
      if (equityMarketValue == 0) this.equityCurrentValue.next("0000.00")
      else this.equityCurrentValue.next(equityMarketValue)

      equityNetProfitLoss = equityMarketValue - equityTotalCost
      equityNetProfitLoss = this.roundDownSignificantDigits(equityNetProfitLoss, 3)
      this.equityNetProfitLoss.next(equityNetProfitLoss)

      if (equityNetProfitLoss >= 0) {
        this.equityProfit = true
        this.equityLoss = false
        this.equityPLColor = AppConstants.buyColor
      }
      else {
        this.equityLoss = true
        this.equityProfit = false
        this.equityPLColor = AppConstants.sellColor
      }

      //.................................crypto..............................................
      cryptoTotalCost = this.roundDownSignificantDigits(cryptoTotalCost, 3)
      if (cryptoTotalCost == 0) this.cryptoTotalValue.next("0000.00")
      else this.cryptoTotalValue.next(cryptoTotalCost)

      cryptoMarketValue = this.roundDownSignificantDigits(cryptoMarketValue, 3)
      if (cryptoMarketValue == 0) this.cryptoCurrentValue.next("0000.00")
      else this.cryptoCurrentValue.next(cryptoMarketValue)

      cryptoNetProfitLoss = cryptoMarketValue - cryptoTotalCost
      cryptoNetProfitLoss = this.roundDownSignificantDigits(cryptoNetProfitLoss, 3)
      this.cryptoNetProfitLoss.next(cryptoNetProfitLoss)

      if (cryptoNetProfitLoss >= 0) {
        this.cryptoProfit = true
        this.cryptoLoss = false
        this.cryptoPLColor = AppConstants.buyColor
      }
      else {
        this.cryptoLoss = true
        this.cryptoProfit = false
        this.cryptoPLColor = AppConstants.sellColor
      }

      //.................................commodity..............................................
      commodityTotalCost = this.roundDownSignificantDigits(commodityTotalCost, 3)
      if (commodityTotalCost == 0) this.commodityTotalValue.next("0000.00")
      else this.commodityTotalValue.next(commodityTotalCost)

      commodityMarketValue = this.roundDownSignificantDigits(commodityMarketValue,3)
      if (commodityMarketValue == 0) this.commodityCurrentValue.next("0000.00")
      else this.commodityCurrentValue.next(commodityMarketValue)

      commodityNetProfitLoss = commodityMarketValue - commodityTotalCost
      commodityNetProfitLoss = this.roundDownSignificantDigits(commodityNetProfitLoss,3)
      this.commodityNetProfitLoss.next(commodityNetProfitLoss)

      if (commodityNetProfitLoss >= 0) {
        this.commodityProfit = true
        this.commodityLoss = false
        this.commoditiesPLColor = AppConstants.buyColor
      }
      else {
        this.commodityLoss = true
        this.commodityProfit = false
        this.commoditiesPLColor = AppConstants.sellColor
      }

      //.................................realEstate..............................................
      realEstateTotalCost = this.roundDownSignificantDigits(realEstateTotalCost,3)
      if (realEstateTotalCost == 0) this.realEstateTotalValue.next("0000.00")
      else this.realEstateTotalValue.next(realEstateTotalCost)


      realEstateMarketValue = this.roundDownSignificantDigits(realEstateMarketValue,3)
      if (realEstateMarketValue == 0) this.realEstateCurrentValue.next("0000.00")
      else this.realEstateCurrentValue.next(realEstateMarketValue)

      realEstateNetProfitLoss = realEstateMarketValue - realEstateTotalCost
      realEstateNetProfitLoss = this.roundDownSignificantDigits(realEstateNetProfitLoss,3)
      this.realEstateNetProfitLoss.next(realEstateNetProfitLoss)

      if (realEstateNetProfitLoss >= 0) {
        this.realEstateProfit = true
        this.realEstateLoss = false
        this.realEstatePLColor = AppConstants.buyColor
      }
      else {
        this.realEstateLoss = true
        this.realEstateProfit = false
        this.realEstatePLColor = AppConstants.sellColor
      }

    })
  }

  roundDownSignificantDigits(number, decimals) {
    let significantDigits = (parseInt(number.toExponential().split('e-')[1])) || 0;
    let decimalsUpdated = (decimals || 0) + significantDigits - 1;
    decimals = Math.min(decimalsUpdated, number.toString().length);

    return (Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals));
  }

}
