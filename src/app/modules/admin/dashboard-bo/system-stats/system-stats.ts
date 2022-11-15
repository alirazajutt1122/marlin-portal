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
    selector: 'system-stats',
    templateUrl: './system-stats.html',
    styleUrls: ['../dashboard-bo.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})




export class SystemStatsComponent implements OnInit, AfterViewInit {
    lang: string;
    loggedIn: number = 60
    totalAttempts: number = 70
    loggedOut: number = 10
    wrongPasswordAttemtps: any = '02'
    totalPAsswordReset: any = '01'



    constructor(private translate: TranslateService) {
        //_______________________________for ngx_translate_________________________________________

        this.lang = localStorage.getItem("lang");
        if (this.lang == null) { this.lang = 'en' }
        this.translate.use(this.lang)
        //______________________________for ngxtranslate__________________________________________
    }

    ngOnInit(): void {

    }


    public ngAfterViewInit(): void {

    }


}