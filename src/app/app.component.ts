import {Component} from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import { AppState } from './app.service';
import { CommissionSlabDetail } from './models/commission-slab-detail';
wjcCore.setLicenseKey('192.168.36.141|202.59.76.218|192.168.36.186|192.168.36.242|40.67.224.72|go.marlinpro.com|psx.marlinpro.com|192.168.36.82|192.168.36.117|192.168.36.121|192.168.36.51|192.168.36.15|192.168.36.105|192.168.36.245,932953992636939#B0e2mjL6MjL8YTMuITOxIiOiMXbEJCLig6YlR7bm9WSiojIh94QiwiI9MTO6MjNykTOzUTOyMTOiojIklkIs4XXbpjInxmZiwiIxYnMyAjMiojIyVmdiwSZzxWYmpjIyNHZisnOiwmbBJye0ICRiwiI34zdRFWQRBFdSdEcJ9ETvF5Uil7Y6dzM7kFa4Z4LtdGcjZzQYV5U0tSe9MXQqVHewQEW6YlcvoVNq9WVH3SYTZUYTt6ZJFWR8ZlemhWZGJlSWplZuNzd0N6Yo3SM7pHcwYTYs5UWDBDRwN6Lr54LGFkYPFja4E7d0Z6Mjhldw4GU8QzVMtiaaJkdVh4bht6VNNzdwp7TN9UNIBHZLZjaEJ5chlkWyc4UwADOrZzNwUUaJdzVid4LzMTa9JUeaJFa9Q6ZaJDcH5EeD36UKVnVNdDW6cmZQxEcDt6RvcVT92WWSVUeFdHS7FlR9smQH3Sekx4S7Q5QVZzM4ZmbzJUa0plenlDMIhWURpncBp5dY3SVzV4dpdTYxhHcFpFN9AlTNJkSWZDMQFVQ8ZFdzRVeS5kQQNjdodmWoZXZXFUbrUDTr9WVEFmZVp4c4syQs34Q7JUWK3kUzolI0IyUiwiICJTOBFjMEZjI0ICSiwSMzQjN9ETOzITM0IicfJye&Qf35VfikEMyIlI0IyQiwiIu3Waz9WZ4hXRgACdlVGaThXZsZEIv5mapdlI0IiTisHL3JSNJ9UUiojIDJCLi86bpNnblRHeFBCIyV6dllmV4J7bwVmUg2Wbql6ViojIOJyes4nILdDOIJiOiMkIsIibvl6cuVGd8VEIgc7bSlGdsVXTg2Wbql6ViojIOJyes4nI4YkNEJiOiMkIsIibvl6cuVGd8VEIgAVQM3EIg2Wbql6ViojIOJyes4nIzMEMCJiOiMkIsISZy36Qg2Wbql6ViojIOJyes4nIVhzNBJiOiMkIsIibvl6cuVGd8VEIgQnchh6QsFWaj9WYulmRg2Wbql6ViojIOJyebpjIkJHUiwiIxUDMwIDMgYDM9AjMyAjMiojI4J7QiwiI5QjMuYzMugjNx8iM9EDL5ATMuYzMugjNx8iM9EDL5EjL6MjL8YTMuITOxwSM58iNz8CO6EjLykTMsEjMx8iNz8CO6EjLykTMscTMx8iNz8CO6EjLykTMsIDOuYzMugjNx8iM9EDLt36Yu2mcw9WasJXYt9CezBHLt36Yu2mcw9WasJXYt9ybnxiM78CNyIjL7YjLwQDLyQjMuYzMugjNx8iM9EDL6gTMuYzMugjNx8iM9EDL8EjMuYzNukTNuIDWymS');


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],

})
export class AppComponent {
    constructor(public appState: AppState,) {



    }




}
