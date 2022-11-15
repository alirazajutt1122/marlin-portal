import {Route} from '@angular/router';
import {TradingDashboardComponent} from "./trading-dashboard.component";
import {TradingDashboardResolvers} from "./trading-dashboard.resolvers";
import {TradingDashboardGraphComponent} from "./trading-dashboard-graph/trading-dashboard-graph.component";

export const TradingDashboardRouting: Route[] = [
    // {
    //     path: '',
    //     component: TradingDashboardComponent,
    //     resolve: {
    //         data: TradingDashboardResolvers
    //     }
    // },
    {
        path: 'trading-graph/:exchange/:marketCode/:symbolCode',
        component: TradingDashboardGraphComponent
    }
];
