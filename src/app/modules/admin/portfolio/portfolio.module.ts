import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PortfolioComponent } from './portfolio.component';
import { PortfolioRoutingModule } from './portfolio.routing';
import { OrderNewModule } from '../oms/order/order.module';


@NgModule({
    declarations: [
        PortfolioComponent
    ],
    imports: [
        RouterModule.forChild(PortfolioRoutingModule),
        CommonModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        OrderNewModule
    ],
    exports: [
        PortfolioComponent
    ]
})
export class PortfolioModule {
}