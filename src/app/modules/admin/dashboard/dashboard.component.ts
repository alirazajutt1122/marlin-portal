import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { UserService } from 'app/core/user/user.service';
import { FuseLoaderScreenService, FuseSplashScreenService } from '@fuse/services/splash-screen';
import { AppState } from 'app/app.service';
import { ListingService } from 'app/services/listing.service';
import { AppConstants, AppUtility } from 'app/app.utility';
@Component({
    selector: 'finance',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public investorProfileStatus : String = "";
    userType: string;
    isParticipant: boolean = false

    constructor(private _fuseMediaWatcherService: FuseMediaWatcherService, private userService : UserService , private splash : FuseLoaderScreenService, private appState : AppState,private listingService:ListingService) {
        this.userService.selectedOC$.subscribe((value) => {
            if (this.drawerOpened === true) {
                this.drawerOpened = false;
            }
            else {
                this.drawerOpened = true;
            }
        });

        this.userType = AppConstants.userType;
         
        if(AppConstants.participantId !== null) {
            this.isParticipant = true
        }
    }

    ngOnInit(): void {

        this.splash.hide();
        this.getUserProfileStatus();
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                matchingAliases.includes('md') ? this.drawerMode = 'side' : this.drawerMode = 'over';
            });

        this.appState.showLoader = false;


    }





    public getUserProfileStatus = () => {
         
        this.listingService.getInvestorProfileStatus(AppConstants.userId).subscribe((restData:any)=>{
             
             if(!AppUtility.isEmptyArray(restData)) {
                 
                   this.investorProfileStatus = restData[0].statusCode;
                   console.log("Status Code of Investor" , this.investorProfileStatus);
             }
             else
             {
                this.investorProfileStatus = "";
             }
        }, error => {
             
               console.log(error);
        })
    }


}
