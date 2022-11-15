'use strict';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';
import * as wjcInput from '@grapecity/wijmo.input';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from 'app/app.service';
import { AppConstants, AppUtility } from 'app/app.utility';
import { Agent } from 'app/models/agent';
import { Bank } from 'app/models/bank';
import { BankBranch } from 'app/models/bank-branches';
import { Beneficiary } from 'app/models/beneficiary';
import { ChartOfAccount } from 'app/models/chart-of-account';
import { City } from 'app/models/city';
import { Client } from 'app/models/client';
import { ClientAppliedLevy } from 'app/models/client-applied-levy';
import { ClientBankAccount } from 'app/models/client-bank-account';
import { ClientCustodian } from 'app/models/client-custodian';
import { ClientDocument } from 'app/models/client-document';
import { ClientExchange } from 'app/models/client-exchange';
import { ClientJointAccount } from 'app/models/client-joint-account';
import { ClientLevieMaster } from 'app/models/client-levy-master';
import { ClientMarket } from 'app/models/client-market';
import { CommissionSlabMaster } from 'app/models/commission-slab-master';
import { ContactDetail } from 'app/models/contact-detail';
import { Country } from 'app/models/country';
import { Exchange } from 'app/models/exchange';
import { ExchangeMarket } from 'app/models/exchange-market';
import { IdentificationType } from 'app/models/identification-type';
 
import { IncomeSource } from 'app/models/income-source';
import { Industry } from 'app/models/industry';
import { Participant } from 'app/models/participant';
import { ParticipantBranch } from 'app/models/participant-branches';
import { ParticipantExchange } from 'app/models/participant-exchanges';
import { Profession } from 'app/models/profession';
import { Provinces } from 'app/models/Province';
import { Relation } from 'app/models/relation';
import { User } from 'app/models/user';
import { AuthService2 } from 'app/services/auth2.service';
import { ListingService } from 'app/services/listing.service';
import { PasswordStrengthMeasurer } from 'app/util/PasswordStrengthMeasurer';
import { DialogCmp } from '../../user-site/dialog/dialog.component';
import { CollectionView, SortDescription, IPagedCollectionView, } from '@grapecity/wijmo';
import { DocumentType } from 'app/models/document-type';
import { PasswordValidators } from 'ng2-validators';
import { FuseLoaderScreenService } from '@fuse/services/splash-screen';

var downloadAPI = require('../../../../../scripts/download-document');
import { AccountCategory } from 'app/models/account-category';
import { AccountType } from 'app/models/account-type';
import { ClientRegistration } from './client-registration';
import { InvCDCStatus } from 'app/models/inv-cdc-status';

declare var jQuery: any;
// import 'slim_scroll/jquery.slimscroll.js';


@Component({
  selector: 'client-page',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './client-page.html',
})
export class ClientPage implements OnInit {
  public myForm: FormGroup;

  @Input() isDashBoard: string;

  public bankDetailForm: FormGroup;
  public beneficiaryForm: FormGroup;
  public jointAccountForm: FormGroup;
  public clientExchangeForm: FormGroup;
  public documentForm: FormGroup;
  public allowedMarketForm: FormGroup;
  public clientCustodianForm: FormGroup;
  itemsList: wjcCore.CollectionView;
  itemsBanAccountList: wjcCore.CollectionView;
  itemsBeneficiaryList: wjcCore.CollectionView;
  itemsJointAccountList: wjcCore.CollectionView;
  itemsClientExchangeList: wjcCore.CollectionView;
  itemsDocumentList: wjcCore.CollectionView;
  itemsAllowedMarketList: wjcCore.CollectionView;
  itemsClientCustodianList: wjcCore.CollectionView;

  selectedItem: Client;
  selectedBankAccountItem: ClientBankAccount;
  selectedJointAccountItem: ClientJointAccount;
  selectedClientDocument: ClientDocument;
  selectedClientExchange: ClientExchange;
  errorMessage: string;
  selectedIndex: number = 0;

  commissionSlabList: any[];
  participantBranchList: any[];
  agentList: any[];
  documentTypes: any[];
  exchangeList: any[];
  marketList: any[];
  custodianList: any[];
  clientMarket: any[];
  clientCustodian: any[];

  genderList: any[];
  residenceStatusList: any[];
  riskList: any[];
  identificationTypeList: any[];
  professionList: any[];
  industryList: any[];
  countryList: any[];
  cityList: any[];
  bankList: any[];
  bankBranchList: any[];
  leviesList: any[] = [];
  selectedLevies: any[];
  itemsLeviesList: wjcCore.CollectionView;
  today: Date = new Date();
  incomeSourceList: any[];
  relationList: any[];
  provinceList: any[];
  //  districtList: any[];
  beneficiaryList: any[];
  selectedBeneficiaryItem: Beneficiary;
  selectedFileName: any


  public showForm = false;
  public isSubmitted = false;
  public isSubmittedBankAccount = false;
  public isSubmittedJointAccount = false;
  public isSubmittedDocumentForm = false;
  public isSubmittedClientExchange = false;
  public isSubmittedBeneficiary: boolean = false;
  public fileSizeExceed = false;
  public fileSelectionMsgShow = false;
  public marginPerExceed = true;

  public isEditing: boolean;
  public isEditingBankDetail: boolean;
  public isEditingBeneficiaryDetail: boolean;
  public isEditingClientExchange = false;

  public searchClientCode: string = "";
  public searchClientName: string = "";
  public glCodeLength_: number = 25;
  public incomeSourcee: string = "";

  public showIndividual = false;
  public showCorporate = false;
  public showJoint = false;
  public showOnlineAccess = false;

  public glCode_: String = "";
  public coaCode_: String = "";
  private clientControlChartOfAccountCode_: String = "";
  public coaId_: Number;
  private _pageSize = 0;
  public confirmPassword_: String = "";
  public currentTab_ = "BI";

  private file_srcs: string[] = [];
  accountCategoryList: any[];

  public fileName_: String = "";
  private fileContentType_: String = "";
  //claims: any;
  public selectedCityId: number
  public selectedProvinceId: number
  public deleteClientExchangeAction: boolean = false;
  //public selectedProvinceId: number;
  //public selectedDistrictId: number;
  public selectedRelationId: number;
  public bCnicValid: Boolean = true;
  public accountTypeInvestorList : any[];
  public sharedClientId : Number = null;
  public invCDCStatus : any[];

  @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild('bankAccountGrid') bankAccountGrid: wjcGrid.FlexGrid;
  @ViewChild('documentGrid') documentGrid: wjcGrid.FlexGrid;
  @ViewChild('flexCustodian') flexCustodian: wjcGrid.FlexGrid;
  @ViewChild('flexAllowedMarket') flexAllowedMarket: wjcGrid.FlexGrid;
  @ViewChild('jointAccountGrid') jointAccountGrid: wjcGrid.FlexGrid;
  @ViewChild('clientExchangeGrid') clientExchangeGrid: wjcGrid.FlexGrid;
  @ViewChild('beneficiaryGrid') beneficiaryGrid: wjcGrid.FlexGrid;
  @ViewChild('cmbCityId') cmbCityId: wjcInput.ComboBox;
  @ViewChild('clientCode') clientCode: wjcInput.InputMask;
  @ViewChild('reference') reference: wjcInput.InputMask;
  @ViewChild('commissionSlabId') commissionSlabId: wjcInput.ComboBox;
  @ViewChild('cmbLevy') cmbLevy: wjcInput.MultiSelect;
  //@ViewChild('cmbDistrictId') cmbDistrictId: wjcInput.ComboBox;
  @ViewChild('cmbRelationId') cmbRelationId: wjcInput.ComboBox;

  @ViewChild('BIAnchorTag') BIAnchorTag: ElementRef;
  @ViewChild('CONAnchorTag') CONAnchorTag: ElementRef;
  @ViewChild('SAAnchorTag') SAAnchorTag: ElementRef;
  @ViewChild('JAAnchorTag') JAAnchorTag: ElementRef;
  @ViewChild('CRSAnchorTag') CRSAnchorTag: ElementRef;
  @ViewChild('AMAnchorTag') AMAnchorTag: ElementRef;
  @ViewChild('CUAnchorTag') CUAnchorTag: ElementRef;
  @ViewChild('BAAnchorTag') BAAnchorTag: ElementRef;
  @ViewChild('DOCAnchorTag') DOCAnchorTag: ElementRef;
  @ViewChild('BENAnchorTag') BENAnchorTag: ElementRef;
  @ViewChild('dialogCmp') dialogCmp: DialogCmp;
  @ViewChild('active1') active1: ElementRef;
  @ViewChild('clientType') clientType: ElementRef;
  @ViewChild('accountType') accountType: ElementRef;

  @ViewChild(ClientRegistration) clientRegistration : ClientRegistration;

  //@ViewChild('progressBar') progressBar:ElementRef;
  private fileInput_: any;

  private changePasswordError: string;
  private measurer: PasswordStrengthMeasurer = new PasswordStrengthMeasurer();
  private passwordStrength = 0;
  lang: string;
  public isNewActionForm : boolean = false;

  public tabFocusChanged1() {
    this.active1.nativeElement.focus();
  }

  public tabFocusChanged2() {
    this.commissionSlabId.focus();
  }

  public tabFocusChanged3() {
    this.clientType.nativeElement.focus();
  }

  public tabFocusChanged4() {
    this.reference.focus();
  }

  public tabFocusChanged5() {
    this.accountType.nativeElement.focus();
  }
  constructor(private appState: AppState, private changeDetectorRef: ChangeDetectorRef, private listingService: ListingService, private _fb: FormBuilder, 
    public userService: AuthService2, private translate: TranslateService, private loader: FuseLoaderScreenService) {
    //this.claims = authService.claims;
    this.clearFields();
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.isEditingBankDetail = false;
    this.isSubmittedBankAccount = false;
    this.isSubmittedJointAccount = false;
    this.isSubmittedDocumentForm = false;
    this.isSubmittedClientExchange = false;
    this.isEditingClientExchange = false;
    this.isSubmittedBeneficiary = false;
    this.isEditingBeneficiaryDetail = false;
    this.itemsList = new wjcCore.CollectionView();
    //_______________________________for ngx_translate_________________________________________

    this.lang = localStorage.getItem("lang");
    if (this.lang == null) { this.lang = 'en' }
    this.translate.use(this.lang)
    //______________________________for ngxtranslate__________________________________________

  }

  ngOnInit() {

    // Get GL Code Length
    // this.getGLCodeLength_();
    // populate Levy
    this.onSearchAction();
    this.populateAccountTypeInvestor();
    this.loadLeveisByParticipant();

    // populate Commission slab
    this.populateCommissionSlabList();

    // populate Participant Branch
    this.populateParticipantBranchList();

    // populate Participant Branch
    this.populateAgentList();

    //populate exchanges
    this.populateExchangeList();

    //Populate Account Categories List
    this.populateAccountCategoryList();

    //populate relation
    this.populateRelationList();

    // Poppulate Market
    //this.populateMarketList(null);

    //Populate Custodian
    //this.populateCustodianList(null);

    // Populate Document type
    this.populateDocumentTypes();

    // Populate Client Control account
    this.populateClientControlAccount();

    //populate allowed Markets
    this.populateAllowedMarkets(null, null);

    this.changePasswordError = undefined;
    this.passwordStrength = 0;
    //populate Custodians
    this.populateCustodians(null, null);

    switch (this.lang) {
      case 'en':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
        this.residenceStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Resident Pakistani", "code": "RP" }, { "name": "Resident Foreigner", "code": "RF" }, { "name": "Non Resident Pakistani", "code": "FNRP" }, { "name": "Non Resident Forignor", "code": "FNR" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]
        break;
      case 'pt':
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Macho", "code": "M" }, { "name": "Fêmea", "code": "F" }]
        this.residenceStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Residente Paquistanês", "code": "RP" }, { "name": "Residente Estrangeiro", "code": "RF" }, { "name": "Não Residente Paquistanês", "code": "FNRP" }, { "name": "Não Residente Estrangeiro", "code": "FNR" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Alta", "code": "H" }, { "name": "Média", "code": "M" }, { "name": "Baixo", "code": "L" }]
        break;
      default:
        this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
        this.residenceStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Resident Pakistani", "code": "RP" }, { "name": "Resident Foreigner", "code": "RF" }, { "name": "Non Resident Pakistani", "code": "FNRP" }, { "name": "Non Resident Forignor", "code": "FNR" }]
        this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]
    }

    this.populateIdentificationTypeList();
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateCountryList();

    this.populateIncomeSourceList();

    // Populate Bank List in DropDown.
    this.populateBankList(AppConstants.participantId, true);

    // Add form Validations
    this.addFromValidations();

    if (this.isDashBoard) {
      this.searchClientCode = '';
      this.searchClientName = '';
      this.populateItemGrid();
    }
  }

  ngAfterViewInit() {
    var self = this;
    $('#add_new').on('shown.bs.modal', function (e) {
      if (self.cityList.length > 1) {
        //self.selectedItem.contactDetail.cityId = self.cityId;
      }
      self.clientCode.focus();
    });

 

  }
 
  /*********************************
   *      Public & Action Methods
   *********************************/



  public onNewActionShowForm = () => {  
    this.isNewActionForm = true;
    this.clientRegistration.clearFields();
    this.clientRegistration.showIndividual = false;
    this.clientRegistration.showJoint = false;
    this.clientRegistration.showCorporate = false;
    this.clientRegistration.itemsBeneficiaryList = new wjcCore.CollectionView();
    this.clientRegistration.itemsBanAccountList = new wjcCore.CollectionView();
    this.clientRegistration.itemsJointAccountList = new wjcCore.CollectionView();
    this.clientRegistration.itemsDocumentList = new wjcCore.CollectionView();
 
  }





  public onRefreshCDCStatus = () => {
    this.loader.show();
    let cdcRecordForFilter = this.itemsList.items;

    this.invCDCStatus = []; 
    if(!AppUtility.isEmptyArray(cdcRecordForFilter)){
      let a = 0;
      for(let i=0; i<cdcRecordForFilter.length; i++) {
       
        if(cdcRecordForFilter[i].statusCode === AppConstants.INV_STATUS_PENDING) {
       
          this.invCDCStatus[a] = new InvCDCStatus();
          this.invCDCStatus[a].participant_Code = cdcRecordForFilter[i].participant.participantCode;
          this.invCDCStatus[a].ref_No = String(cdcRecordForFilter[i].clientId) + "C";
          a++;
        }
      
      }
    }
   this.listingService.getInvestorCDCStatusesForClients(this.invCDCStatus).subscribe((restData : any)=> {
    this.onSearchAction();
    this.isNewActionForm = false;
    this.loader.hide();
    
    
   }, (error) => {
     
    this.loader.hide();
    this.errorMessage = <any>error.message;
    this.dialogCmp.statusMsg = this.errorMessage;
    this.dialogCmp.showAlartDialog('Error');
   })
   

}





   public onChangeAccountTypeInvestor = (event) => {

    if (AppUtility.isValidVariable(event)) {
      if (event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_ID || event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_INSTITUTIONAL_ID
        || event === AppConstants.ACCOUNT_TYPE_INDIVIDUAL_ITF_ID) {

        this.showIndividual = true;
        this.showCorporate = false;
        this.showJoint = false;
        this.selectedItem.accountType = event;
        this.selectedItem.clientType = 'I';
      }

      else if (event === AppConstants.ACCOUNT_TYPE_CORPORATE_ID || event === AppConstants.ACCOUNT_TYPE_CORPORATE_INSTITUTIONAL_ID
        || event === AppConstants.ACCOUNT_TYPE_COLLECTIVE_INVESTMENT_ID) {
        this.showIndividual = false;
        this.showCorporate = true;
        this.showJoint = false;
        this.selectedItem.clientType = 'C';
        this.selectedItem.accountType = event;
      }
      else if (event === AppConstants.ACCOUNT_TYPE_JOINT_ID) {
        debugger
        this.showIndividual = false;
        this.showCorporate = false;
        this.showJoint = true;
        this.selectedItem.clientType = 'I';
        this.selectedItem.accountType = event; //joint
      }
    }
  }



  private populateAccountTypeInvestor() {

    this.loader.show();
    this.listingService.getAccountTypeInvestorList().subscribe(restData => {
  
      this.loader.hide();
      if (AppUtility.isEmpty(restData)) {
        this.accountTypeInvestorList = [];
      } else {
        this.accountTypeInvestorList = restData;
      }
      var at: AccountType = new AccountType();
      at.accTypeId = AppConstants.PLEASE_SELECT_VAL;
      at.description = AppConstants.PLEASE_SELECT_STR;
      this.accountTypeInvestorList.unshift(at);

      if (!AppUtility.isEmptyArray(this.accountTypeInvestorList)) {
        this.selectedItem.accountTypeNew.accTypeId = this.accountTypeInvestorList[0].accTypeId;

      }
    },
      error => { this.loader.hide(); this.errorMessage = <any>error });
  }




  
  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(value: number) {
    if (this._pageSize != value) {
      this._pageSize = value;
      if (this.flex) {
        (<IPagedCollectionView><unknown>this.flex.collectionView).pageSize = value;
      }
    }
  }

  public onCancelAction() {
    this.clearFields();
    this.showForm = false;
  }

  public onNewAction() {
    this.clearFields();
    this.populateClientType();
    this.populateClientControlAccount();
    this.showForm = true;
    this.BIAnchorTag.nativeElement.click();
    this.currentTab_ = "BI";

    for (let i = 0; i < this.leviesList.length; i++) {
      this.leviesList[i].selected = false;
      this.leviesList[i].$checked = false;
    }
  }

  onNewPasswordChange(newValue) {
    this.changePasswordError = undefined;
    this.passwordStrength = this.measurer.measure(newValue);
  }

  public onNextAction() {
    //this.progressBar.nativeElement.style.width="50";
    var isValid: boolean = true;
    this.isSubmitted = true;
    this.selectedItem.chartOfAccount.glCode = this.coaCode_;
    if (this.currentTab_ == "BI") {
      isValid = this.validateBasicInfo();
      if (isValid) {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }
    else if (this.currentTab_ == "CON") {
      isValid = this.validateContactDetail();
      if (isValid) {
        if (this.selectedItem.onlineClient == true) {
          this.SAAnchorTag.nativeElement.click();
          this.currentTab_ = "SA";
        } else if (this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE && this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
          this.JAAnchorTag.nativeElement.click();
          this.currentTab_ = "JA";
        } else {
          this.BENAnchorTag.nativeElement.click();
          this.currentTab_ = "BEN";

        }
      }
    }
    else if (this.currentTab_ == "SA") {
      isValid = this.validateSystemAccess();
      if (isValid) {
        if (this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE && this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
          this.JAAnchorTag.nativeElement.click();
          this.currentTab_ = "JA";
        } else {
          this.BENAnchorTag.nativeElement.click();
          this.currentTab_ = "BEN";

        }
      }
    }
    else if (this.currentTab_ == "JA") {
      isValid = this.validateJointAccount();
      if (isValid) {
        this.BENAnchorTag.nativeElement.click();
        this.currentTab_ = "BEN";
      }
    }
    else if (this.currentTab_ == "BEN") {
      isValid = this.validateBeneficiary();
      if (isValid) {
        this.CRSAnchorTag.nativeElement.click();
        this.currentTab_ = "CRS";
      }
    }
    else if (this.currentTab_ == "CRS") {
      isValid = this.validateCRS();
      if (isValid) {
        this.AMAnchorTag.nativeElement.click();
        this.currentTab_ = "AM";
      }
    }
    else if (this.currentTab_ == "AM") {
      isValid = this.validateAllowedMarkets();
      if (isValid) {
        this.CUAnchorTag.nativeElement.click();
        this.currentTab_ = "CU";
      }
    }
    else if (this.currentTab_ == "CU") {
      isValid = this.validateBankAccount();
      if (isValid) {
        this.BAAnchorTag.nativeElement.click();
        this.currentTab_ = "BA";
      }
    }
    else if (this.currentTab_ == "BA") {
      isValid = this.validateBankAccount();
      if (isValid) {
        this.DOCAnchorTag.nativeElement.click();
        this.currentTab_ = "DOC";
      }
    }
  }

  public onPreviousAction() {
    if (this.currentTab_ == "CON") {
      this.BIAnchorTag.nativeElement.click();
      this.currentTab_ = "BI";
    }
    else if (this.currentTab_ == "SA") {
      this.CONAnchorTag.nativeElement.click();
      this.currentTab_ = "CON";
    }
    else if (this.currentTab_ == "JA") {
      if (this.selectedItem.onlineClient == true) {
        this.SAAnchorTag.nativeElement.click();
        this.currentTab_ = "SA";
      } else {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }
    else if (this.currentTab_ == "BEN") {
      if (this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE && this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
        this.JAAnchorTag.nativeElement.click();
        this.currentTab_ = "JA";
      } else if (this.selectedItem.onlineClient == true) {
        this.SAAnchorTag.nativeElement.click();
        this.currentTab_ = "SA";
      } else {
        this.CONAnchorTag.nativeElement.click();
        this.currentTab_ = "CON";
      }
    }
    else if (this.currentTab_ == "CRS") {
      this.BENAnchorTag.nativeElement.click();
      this.currentTab_ = "BEN";
    }
    else if (this.currentTab_ == "AM") {
      this.CRSAnchorTag.nativeElement.click();
      this.currentTab_ = "CRS";
    }
    else if (this.currentTab_ == "CU") {
      this.AMAnchorTag.nativeElement.click();
      this.currentTab_ = "AM";
    }
    else if (this.currentTab_ == "BA") {
      this.CUAnchorTag.nativeElement.click();
      this.currentTab_ = "CU";
    } else if (this.currentTab_ == "DOC") {
      this.BAAnchorTag.nativeElement.click();
      this.currentTab_ = "BA";
    }
  }

  public onSearchAction() {
    this.populateItemGrid();
  }

  public onCommissioSlabChangeEvent(comSlbId: any) {
    if (!AppUtility.isEmpty(this.commissionSlabList)) {
      this.selectedItem.commissionSlabMaster.slabNameDisplay_ = this.commissionSlabList.filter(
        function (obj) { return obj.commissionSlabId == comSlbId; })[0].slabNameDisplay_;
    }
  }
  public onNewBankAccountAction() {
    this.clearBankAccountFields();
  }

  public onEditBankAccountAction() {
    this.isEditingBankDetail = true;
  }

  public onDeleteBankAccountAction() {
    this.itemsBanAccountList.remove(this.itemsBanAccountList.currentItem);
  }

  public onDeleteBeneficiaryAction() {
    this.itemsBeneficiaryList.remove(this.itemsBeneficiaryList.currentItem);
  }

  public onDeleteDocumentAction() {
    this.isSubmittedDocumentForm = false;
    this.itemsDocumentList.remove(this.itemsDocumentList.currentItem);
  }

  public onDeleteJointAccountAction() {
    this.itemsJointAccountList.remove(this.itemsJointAccountList.currentItem);
  }

  public onDownloadDocumentAction() {
    this.isSubmittedDocumentForm = false;

    if (!AppUtility.isEmpty(this.itemsDocumentList.currentItem)) {
      var base64Data = this.itemsDocumentList.currentItem.documentBase64_;
      var contentType = this.itemsDocumentList.currentItem.contentType;
      var fileName = this.itemsDocumentList.currentItem.documentName;
      downloadAPI(base64Data, fileName, contentType);
    }
  }





  public onGetClientClientId = () => {
    debugger
    this.selectedIndex = this.flex.selection.row;
    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    this.sharedClientId = item.clientId;
    this.isNewActionForm = true;
    if(this.sharedClientId !== null) {
      this.clientRegistration.onGetClientByID(this.sharedClientId);
    }
  }









  public onEditAction() {
    debugger
    this.BIAnchorTag.nativeElement.click();
    this.currentTab_ = "BI";
    this.clearFields();
    this.selectedIndex = this.flex.selection.row;
    debugger
    var item = JSON.parse(JSON.stringify(this.flex.rows[this.selectedIndex].dataItem));
    if (!AppUtility.isEmpty(item)) {
      this.showForm = true;
      this.isEditing = true;
      // this.selectedItem = this.itemsList.currentItem;
      // this.itemsList.editItem(this.selectedItem);

      this.listingService.getClientById(AppConstants.participantId, item.clientId)
        .subscribe(
          restData => {
            debugger
            this.fillClientFromJson(this.selectedItem, restData);
            // this.fillClientFromJson_Test(this.selectedItem, restData);
            this.coaCode_ = this.selectedItem.chartOfAccount.glCode;
            AppUtility.printConsole('coaCode: ' + this.coaCode_);
            this.populateClientLeveis(this.selectedItem.clientId);
            this.populateClientType();
            this.populateAccountType();
            this.populateOnlineAccess();
            this.populateClientExchangeGrid();
            this.populateClientJointAccountGrid();
            this.populateClientBankAccountGrid();
            this.populateClientBeneficiaryGrid();
            this.populateClientDocuemntsGrid();
            this.populateAllowedMarkets(null, null);
            this.populateCustodians(null, null);
           
            

            this.glCode_ = "dummy";
            if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID && this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE) {
              this.showJoint = true
            } else {
              this.showJoint = false;
            }
            this.selectedItem.contactDetail.firstName = restData.contactDetail.firstName;
            /*
                        this.myForm.get('firstName').setValue(restData.contactDetail.firstName);
                        this.myForm.get('lastName').setValue(restData.contactDetail.lastName);
                        this.myForm.get('gender').setValue(restData.contactDetail.gender);
                        this.myForm.get('identificationTypeId').setValue(restData.contactDetail.identificationTypeId);
                        this.myForm.get('identificationType').setValue(restData.contactDetail.identificationType);
                        this.myForm.get('issuePlaceId').setValue(restData.contactDetail.issuePlaceId);
            */
            this.loader.hide();
          },
          error => {
            this.appState.showLoader = false
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            AppUtility.printConsole('errorMessage: ' + this.errorMessage);
            this.dialogCmp.showAlartDialog('Error');
          });
    }

  }

  public onEditClientExchangeAction() {
    this.clearClientExchangeFields();
    if (!AppUtility.isEmpty(this.itemsClientExchangeList.currentItem)) {
      this.clearClientExchangeFields();
      //this.selectedClientExchange = this.itemsClientExchangeList.currentItem;
      //this.itemsClientExchangeList.editItem(this.selectedClientExchange);
      this.fillClientExchangeFromJSON(this.selectedClientExchange, this.itemsClientExchangeList.currentItem);
    }
    this.isEditingClientExchange = true;
  }

  public onDeleteClientExchangeAction() {
    this.deleteClientExchangeAction = true;
    if (AppUtility.isValidVariable(this.itemsClientExchangeList)) {
      this.itemsClientExchangeList.currentItem;
      const index = this.itemsClientExchangeList.items.findIndex(item => item.exchangeId == this.itemsClientExchangeList.currentItem.exchangeId);
      this.itemsClientExchangeList.items.splice(index, 1);
      var arr: any[] = JSON.parse(JSON.stringify(this.itemsClientExchangeList.items));
      this.itemsClientExchangeList = new wjcCore.CollectionView(arr);
    }
  }

  public onCancelClientExchangeAction() {
    this.clearClientExchangeFields();
    if (AppUtility.isValidVariable(this.itemsClientExchangeList)) {
      this.itemsClientExchangeList.cancelEdit();
      this.itemsClientExchangeList.cancelNew();
    }
  }

  public clearClientDocuemnt() {
    if (AppUtility.isValidVariable(this.documentForm)) {
      this.documentForm.markAsPristine();
    }
    this.isSubmittedDocumentForm = false;
    this.selectedClientDocument = new ClientDocument();
    this.selectedClientDocument.documentType.documentTypeId = null;
    this.fileSizeExceed = false;
    if (!AppUtility.isEmpty(this.fileInput_)) {
      this.fileInput_.value = "";
    }
    this.file_srcs = [];
    this.fileName_ = "";
    this.fileContentType_ = "";
    this.fileSelectionMsgShow = false;
  }

  public clearJointAccountFields() {
    if (AppUtility.isValidVariable(this.jointAccountForm)) {
      this.jointAccountForm.markAsPristine();
    }
    this.isSubmittedJointAccount = false;
    this.selectedJointAccountItem = new ClientJointAccount();
    //this.selectedJointAccountItem.contactDetail = new ContactDetail;
    this.selectedJointAccountItem.contactDetail.firstName = "";
    this.selectedJointAccountItem.contactDetail.middleName = null;
    this.selectedJointAccountItem.contactDetail.lastName = "";
    this.selectedJointAccountItem.contactDetail.fatherHusbandName = null;
    this.selectedJointAccountItem.contactDetail.gender = null;
    //this.selectedJointAccountItem.contactDetail.residenceStatus = null;
    this.selectedJointAccountItem.contactDetail.identificationTypeId = null;
    this.selectedJointAccountItem.contactDetail.identificationType = "";
    this.selectedJointAccountItem.contactDetail.registrationNo = null;
    this.selectedJointAccountItem.contactDetail.professionId = null;
    this.selectedJointAccountItem.contactDetail.phone1 = null;
    this.selectedJointAccountItem.contactDetail.cellNo = null;
    this.selectedJointAccountItem.contactDetail.email = null;
    this.selectedJointAccountItem.contactDetail.dob = new Date();
    this.selectedJointAccountItem.contactDetail.postalCode = null;
    this.selectedJointAccountItem.contactDetail.address1 = null;
    this.selectedJointAccountItem.contactDetail.address2 = null;
    this.selectedJointAccountItem.contactDetail.address3 = null;
    this.selectedJointAccountItem.contactDetail.companyName = null;
    this.selectedJointAccountItem.contactDetail.industryId = null;

  }

  public clearBankAccountFields() {
    if (AppUtility.isValidVariable(this.bankDetailForm)) {
      this.bankDetailForm.markAsPristine();
    }
    this.isSubmittedBankAccount = false;
    this.isEditingBankDetail = false;
    this.selectedBankAccountItem = new ClientBankAccount();
    this.selectedBankAccountItem.bankBranch.bank.bankId = null;

  }

  public clearBeneficiaryFields() {
    debugger
    if (AppUtility.isValidVariable(this.beneficiaryForm)) {
      this.beneficiaryForm.markAsPristine();
    }
    this.isSubmittedBeneficiary = false;
    this.isEditingBeneficiaryDetail = false;
    this.selectedBeneficiaryItem = new Beneficiary();
    this.selectedBeneficiaryItem.relation.relationId = null;
    //this.selectedBeneficiaryItem.isBeneficiarySubmit = "false";
  }

  public clearClientExchangeFields() {
    if (AppUtility.isValidVariable(this.clientExchangeForm)) {
      this.clientExchangeForm.markAsPristine();
    }
    this.isSubmittedClientExchange = false;
    this.isEditingClientExchange = false;
    this.selectedClientExchange = new ClientExchange();
    this.marginPerExceed = false;
  }

  public clearFields() {

    this.selectedProvinceId = null;
    this.selectedCityId = null;
    this.selectedLevies = null;

    if (AppUtility.isValidVariable(this.myForm)) {
      this.myForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.bankDetailForm)) {
      this.bankDetailForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.beneficiaryForm)) {
      this.beneficiaryForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.jointAccountForm)) {
      this.jointAccountForm.markAsPristine();
    }
    if (AppUtility.isValidVariable(this.documentForm)) {
      this.documentForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.clientExchangeForm)) {
      this.clientExchangeForm.markAsPristine();
    }

    if (AppUtility.isValidVariable(this.itemsList)) {
      this.itemsList.cancelEdit();
      this.itemsList.cancelNew();
    }
    this.showForm = false;
    this.isSubmitted = false;
    this.isEditing = false;
    this.showOnlineAccess = false;

    this.glCode_ = "";
    this.confirmPassword_ = "";
    this.coaCode_ = "";
    this.selectedItem = new Client();
    this.selectedItem.clientId = null;
    this.selectedItem.accountTypeNew.accTypeId = AppConstants.PLEASE_SELECT_VAL;
    this.selectedItem.active = false;
    this.selectedItem.allowShortSell = false;
    this.selectedItem.bypassCrs = false;
    this.selectedItem.clientCode = "";
    this.selectedItem.depositoryAccountNo = "";
    this.selectedItem.risk = "";
    this.selectedItem.sendEmail = false;
    this.selectedItem.sendMail = false;
    this.selectedItem.proprietaryAccount = false;
    this.selectedItem.sendSms = false;
    this.selectedItem.generateKits = false;
    this.selectedItem.margin = 0;
    this.selectedItem.onlineClient = false;
    this.selectedItem.openPositionStatus = false;
    this.selectedItem.reference = "";
    this.selectedItem.clientType = AppConstants.INDIVIDUAL_TYPE;
    this.selectedItem.displayName_ = "";
    this.selectedItem.glCodeLength_ = 0;
    this.selectedItem.chartOfAccount = new ChartOfAccount;
    this.selectedItem.chartOfAccount.chartOfAccountId = null;
    this.selectedItem.chartOfAccount.glCode = "";
    this.selectedItem.chartOfAccount.glDesc = "";

    this.selectedItem.agent = new Agent;
    this.selectedItem.agent.agentId = null;
    this.selectedItem.agent.agentCode = "";

    this.selectedItem.participant = new Participant;
    this.selectedItem.participant.participantId = null;
    this.selectedItem.participant.participantCode = "";
    this.selectedItem.participant.participantName = "";

    this.selectedItem.contactDetail = new ContactDetail();
    if (!AppUtility.isEmptyArray(this.countryList)) {
      this.selectedItem.contactDetail.country = '';
      this.selectedItem.contactDetail.countryId = null;
    }
    this.selectedItem.contactDetail.cityId = null
    this.selectedItem.contactDetail.city = '';

    //this.selectedProvinceId = null;
    this.selectedItem.contactDetail.provinceId = null
    this.selectedItem.contactDetail.province = '';

    //this.selectedDistrictId = null;
    //this.selectedItem.contactDetail.districtId = null
    //this.selectedItem.contactDetail.district = '';
    // if (!AppUtility.isEmptyArray(this.cityList)) {
    //   this.selectedItem.contactDetail.city = this.cityList[0].city;
    //   this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
    // }

    this.selectedRelationId = null;

    this.selectedItem.contactDetail = new ContactDetail;
    this.selectedItem.contactDetail.firstName = "";
    this.selectedItem.contactDetail.middleName = "";
    this.selectedItem.contactDetail.lastName = "";
    this.selectedItem.contactDetail.fatherHusbandName = "";
    this.selectedItem.contactDetail.ntnNo = "";
    this.selectedItem.contactDetail.gender = null;
    this.selectedItem.contactDetail.residenceStatus = null;
    this.selectedItem.contactDetail.identificationTypeId = null;
    this.selectedItem.contactDetail.identificationType = "";
    this.selectedItem.contactDetail.registrationNo = "";
    this.selectedItem.contactDetail.professionId = null;
    this.selectedItem.contactDetail.phone1 = "";
    this.selectedItem.contactDetail.cellNo = "";
    this.selectedItem.contactDetail.email = "";
    this.selectedItem.contactDetail.dob = new Date();
    this.selectedItem.contactDetail.postalCode = "";
    this.selectedItem.contactDetail.address1 = "";
    this.selectedItem.contactDetail.address2 = "";
    this.selectedItem.contactDetail.address3 = "";
    this.selectedItem.contactDetail.companyName = "";
    this.selectedItem.contactDetail.industryId = null;

    this.selectedItem.contactDetail.idExpDate = new Date();
    this.selectedItem.contactDetail.idIssueDate = new Date();
    this.selectedItem.contactDetail.issuePlaceId = null;

    this.selectedItem.commissionSlabMaster = new CommissionSlabMaster;
    this.selectedItem.commissionSlabMaster.commissionSlabId = null;
    this.selectedItem.commissionSlabMaster.slabName = "";


    this.selectedItem.participantBranch = new ParticipantBranch;
    this.selectedItem.participantBranch.branchId = null;
    this.selectedItem.participantBranch.branchCode = "";

    this.selectedItem.accountCategory = new AccountCategory;
    this.selectedItem.accountCategory.accountCategoryId = null;
    this.selectedItem.accountCategory.name = "";


    this.selectedItem.user = new User;
    this.selectedItem.user.userId = null;
    this.selectedItem.user.email = "";
    this.selectedItem.user.password = "";
    this.selectedItem.user.status = "";
    this.selectedItem.user.active = false;
    this.selectedItem.user.userName = "";

    this.selectedItem.user.participant = new Participant;
    this.selectedItem.user.participant.participantId = null;


    this.clearClientExchangeFields();
    this.selectedItem.clientExchange = [];
    this.selectedClientExchange = new ClientExchange();
    this.populateClientExchangeGrid();


    this.clearBankAccountFields();
    this.selectedItem.bankAccount = [];
    this.selectedBankAccountItem = new ClientBankAccount();
    this.populateClientBankAccountGrid();

    this.clearBeneficiaryFields();
    this.selectedItem.beneficiary = [];
    this.selectedBeneficiaryItem = new Beneficiary();
    //this.selectedBeneficiaryItem.isBeneficiarySubmit = "false";
    this.populateClientBeneficiaryGrid();

    this.selectedItem.appliedLevy = [];

    this.clearJointAccountFields();
    this.selectedItem.jointAccount = [];
    this.populateClientJointAccountGrid();


    this.clearClientDocuemnt();
    this.selectedItem.clientDocuments = [];
    this.populateClientDocuemntsGrid();

    this.itemsAllowedMarketList = new wjcCore.CollectionView();
    this.populateAllowedMarkets(null, null);

    this.itemsClientCustodianList = new wjcCore.CollectionView();
    this.populateCustodians(null, null);

    this.selectedItem.annualGrossIncome = 0;
    this.selectedItem.incomeSource = new IncomeSource();
    this.selectedItem.incomeSource.incomeSourceId = null;
    this.selectedItem.incomePercentage = 0;


    console.log("Selected Values : ", this.selectedItem);


  }

  public fileChangeEvent(fileInput: any) {
    if (AppUtility.isEmpty(fileInput)) {
      this.fileSelectionMsgShow = true;
      return;
    } else {
      this.fileSelectionMsgShow = false;
    }
    if (!AppUtility.isEmpty(fileInput.files[0])) {
      if (fileInput.files[0].size > 2000000) {
        this.fileSizeExceed = true;
        return;
      } else {
        this.fileSizeExceed = false;
        this.fileContentType_ = fileInput.files[0].type;
      }
    } else {
      this.file_srcs = [];
      return;
    }
    var fullPath = fileInput.value;
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
      this.fileName_ = filename;
    }
    var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".doc", ".docx", ".pdf"];
    if (this.fileName_.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (this.fileName_.substr(this.fileName_.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          blnValid = true;
          break;
        }
      }
      if (!blnValid) {
        this.dialogCmp.statusMsg = "Sorry, " + this.fileName_ + " is invalid, allowed extensions are: " + _validFileExtensions.join(", ");
        this.dialogCmp.showAlartDialog('Warning');

        this.fileName_ = "";
        this.fileContentType_ = "";
        fileInput.value = "";
        return;
      }
    }

    this.readFiles(fileInput.files);
    this.fileInput_ = fileInput;
  }

  private selectedAppliedLevy() {
    debugger;
    var items: String[] = [];
    if (this.cmbLevy.checkedItems.length > 0) {
      if (this.cmbLevy.checkedItems[0].leviesMasterId == "-1") {
        for (let i = 1; i < this.leviesList.length; i++) {
          items.push(this.leviesList[i].leviesMasterId);
        }
      }
      else {
        for (let selectedAppLevies of this.cmbLevy.checkedItems) {
          items.push(selectedAppLevies.leviesMasterId);
        }
      }
    }
    this.selectedLevies = items
  }

  /***
   * Save / Update Action
   */
  public onSaveAction(model: any, isValid: boolean) {
    debugger
    this.isSubmitted = true;
    // if(isValid){

    this.selectedItem.chartOfAccount.glCode = this.coaCode_;
    this.selectedItem.participant = new Participant();
    this.selectedItem.participant.participantId = AppConstants.participantId;
    this.selectedItem.user.participant.participantId = AppConstants.participantId;
    if (!(AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0)) {
      this.selectedItem.bankAccount = this.itemsBanAccountList.items;
    } else {
      this.selectedItem.bankAccount = null;
    }

    if (!(AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0)) {
      this.selectedItem.beneficiary = this.itemsBeneficiaryList.items;
    } else {
      this.selectedItem.beneficiary = null;
    }
    this.selectedAppliedLevy(); 
    this.selectedItem.appliedLevy = [];
    for (let j = 0; j < this.selectedLevies.length; j++) {
      var cal = new ClientAppliedLevy();
      cal.clientAppliedLevyId = null;
      cal.clientId = this.selectedItem.clientId;
      cal.levyMasterId = this.selectedLevies[j];
      this.selectedItem.appliedLevy[j] = cal;
 
    }

    if (this.showIndividual && this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      if (!(AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0)) {
        this.selectedItem.jointAccount = [];
        var itemFound = false;
        for (let i = 0; i < this.itemsJointAccountList.items.length; i++) {
          this.selectedItem.jointAccount[i] = this.itemsJointAccountList.items[i];
          itemFound = true;
        }
        if (itemFound == false) {
          this.selectedItem.jointAccount = null;
        }
      } else {
        this.selectedItem.jointAccount = null;
      }
    } else {
      this.selectedItem.jointAccount = null;
    }
    if (!(AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0)) {
      this.selectedItem.clientDocuments = this.itemsDocumentList.items;
    } else {
      this.selectedItem.clientDocuments = null;
    }
    if (!(AppUtility.isEmpty(this.itemsClientExchangeList) || this.itemsClientExchangeList.itemCount == 0)) {
      this.selectedItem.clientExchange = this.itemsClientExchangeList.items;
    } else {
      this.selectedItem.clientExchange = null;
    }
    this.selectedItem.clientMarkets = [];
    for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
      for (let k = 0; k < this.itemsAllowedMarketList.items[j].marketList.length; k++) {
        if (this.itemsAllowedMarketList.items[j].marketList[k].selected == true) {
          var clientMarket = new ClientMarket();
          clientMarket.clientMarketId = null;
          clientMarket.clientId = this.selectedItem.clientId;
          clientMarket.exchangeMarketId = null;
          clientMarket.marketId = this.itemsAllowedMarketList.items[j].marketList[k].marketId;
          clientMarket.marketCode = "";
          clientMarket.exchangeId = this.itemsAllowedMarketList.items[j].exchange.exchangeId;
          clientMarket.exchangeName = "";
          clientMarket.active = true;
          this.selectedItem.clientMarkets[this.selectedItem.clientMarkets.length + 1] = clientMarket;
        }
      }
    }

    this.selectedItem.clientCustodiands = [];
    var itemFound = false;
    for (let j = 0; j < this.itemsClientCustodianList.itemCount; j++) {
      for (let k = 0; k < this.itemsClientCustodianList.items[j].participantList.length; k++) {
        if ((this.itemsClientCustodianList.items[j].participantList[k].selected == true)) {
          var clientCustodian = new ClientCustodian();
          clientCustodian.clientCustodianId = null;
          clientCustodian.custodian.participantId = this.itemsClientCustodianList.items[j].participantList[k].participantId;
          clientCustodian.client.clientId = this.selectedItem.clientId;
          clientCustodian.active = true;
          this.selectedItem.clientCustodiands[this.selectedItem.clientCustodiands.length + 1] = clientCustodian;
          itemFound = true;
        }
      }
    }
    if (itemFound == false) {

      this.selectedItem.clientCustodiands = null;
    }
    if (this.isEditing) {
      debugger;
      if (!AppUtility.isEmpty(this.currentTab_)) {
        if (this.currentTab_ == "BI") {
          debugger;
          isValid = this.validateBasicInfo();

          if (isValid) {
            this.loader.show();
            this.listingService.updateClientBasicInfo(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields(); //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');
              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "CON") {
          isValid = this.validateContactDetail();

          if (isValid) {
            this.loader.show();
            this.listingService.updateClientContatDetail(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');
              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "SA") {
          isValid = this.validateSystemAccess();

          if (isValid) {
            this.loader.show();
            this.listingService.updateClientSystemAccess(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "JA") {
          isValid = this.validateJointAccount();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientJointAccount(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }

        else if (this.currentTab_ == "CRS") {
          isValid = this.validateCRS();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientExchanges(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "BEN") {
          isValid = this.validateBeneficiary();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientBeneficiary(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "BA") {
          isValid = this.validateBankAccount();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientBankAccount(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }

        }
        else if (this.currentTab_ == "DOC") {
          isValid = this.validateDocument();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientDocuments(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "AM") {
          isValid = this.validateAllowedMarkets();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientMarkets(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
        else if (this.currentTab_ == "CU") {
          isValid = this.validateCustodians();
          if (isValid) {
            this.loader.show();
            this.listingService.updateClientCustodians(this.selectedItem).subscribe(
              data => {
                this.loader.hide();
                // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
                this.onSearchAction();
                this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
                this.dialogCmp.showAlartDialog('Success');

              },
              err => {
                this.loader.hide();
                this.errorMessage = err.message;
                this.dialogCmp.statusMsg = this.errorMessage;
                this.dialogCmp.showAlartDialog('Error');
              }
            );
          }
        }
      } else {
        isValid = false;
      }
    } else {

      console.log("current tab is... " + this.currentTab_);
      if (!AppUtility.isEmpty(this.currentTab_)) {
        isValid = this.validateBasicInfo();
        if (this.currentTab_ == "BI" && isValid == false) {
          return;
        }
        if (this.currentTab_ != "BI" && isValid == false) {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Basic tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return;
        }
        isValid = this.validateContactDetail();
        if (this.currentTab_ != "CON" && isValid == false) {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for Contact tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return;
        }
        if (this.currentTab_ == "CON" && isValid == false) {
          return;
        }
        isValid = this.validateSystemAccess();
        if (isValid == false) {

          return;
        }
        isValid = this.validateJointAccount();
        if (isValid == false) {
          return;
        }
        isValid = this.validateCRS();
        if (isValid == false) {
          return;
        }
        isValid = this.validateAllowedMarkets();
        if (isValid == false) {
          return;
        }
        isValid = this.validateCustodians();
        if (isValid == false) {
          return;
        }
        isValid = this.validateBankAccount();
        if (isValid == false) {
          return;
        }
        isValid = this.validateBeneficiary();
        if (isValid == false) {
          return;
        }
        isValid = this.validateDocument();
        if (isValid == false) {
          return;
        }

      } else {
        isValid = false;
      }
      if (isValid) {
        this.loader.show();
        this.listingService.saveClient(this.selectedItem).subscribe(
          data => {
            this.loader.hide();
            if (AppUtility.isEmpty(this.itemsList))
              this.itemsList = new wjcCore.CollectionView;
            // this.clearFields();  //  Defect id: 606 @ 03/APRIL/2017 - Sahib Yar
            this.onSearchAction();
            this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_SAVED;
            this.dialogCmp.showAlartDialog('Success');

          },
          err => {
            this.loader.hide();
            if(err.message){
              this.errorMessage = err.message;
            }
            else
            {
              this.errorMessage = err;
            }
         
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          }
        );
      }
    }
    // }
    //else
    //{
    ///console.log("Incomplete data");
    //       return;
    ///this.onCancelAction();


    //  }
  }

  public onSaveJointAccountAction(model: any, isValid: boolean) {
    this.isSubmittedJointAccount = true;
    if (AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.firstName) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.lastName) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.gender) ||
      //AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.residenceStatus) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.identificationTypeId) ||
      AppUtility.isEmpty(this.selectedJointAccountItem.contactDetail.identificationType)) {
      return false;
    }

    if (isValid) {
      var cba: ClientJointAccount = this.itemsJointAccountList.addNew();
      cba.clientId = this.selectedItem.clientId;
      cba.clientJointAccountId = null;
      cba.contactDetail = new ContactDetail();
      cba.contactDetail.contactDetailId = null;
      cba.contactDetail.firstName = this.selectedJointAccountItem.contactDetail.firstName;
      cba.contactDetail.middleName = this.selectedJointAccountItem.contactDetail.middleName;
      cba.contactDetail.lastName = this.selectedJointAccountItem.contactDetail.lastName;
      cba.contactDetail.fatherHusbandName = this.selectedJointAccountItem.contactDetail.fatherHusbandName;
      cba.contactDetail.gender = this.selectedJointAccountItem.contactDetail.gender;
      //cba.contactDetail.residenceStatus = this.selectedJointAccountItem.contactDetail.residenceStatus;
      cba.contactDetail.identificationTypeId = this.selectedJointAccountItem.contactDetail.identificationTypeId;
      cba.contactDetail.identificationType = this.selectedJointAccountItem.contactDetail.identificationType;
      cba.contactDetail.dob = this.selectedJointAccountItem.contactDetail.dob;
      cba.contactDetail.professionId = this.selectedJointAccountItem.contactDetail.professionId;
      this.itemsJointAccountList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsJointAccountList);
      this.dialogCmp.statusMsg = 'Record added successfully';
      this.dialogCmp.showAlartDialog('LocalSuccess');
      this.clearJointAccountFields();
    }
  }

  public onChangeMarginEvent(e) {
    if (e.target.value > 100) {
      this.marginPerExceed = true;
    } else {
      this.marginPerExceed = false;
    }
  }

  public onSaveClientExchangesAction(model: any, isValid: boolean) {
    debugger;
    if (!this.deleteClientExchangeAction) {
      this.isSubmittedClientExchange = true;
      if (AppUtility.isEmpty(this.selectedClientExchange.exchangeId) ||
        AppUtility.isEmpty(this.selectedClientExchange.margin)) {
        return false;
      } else if (this.selectedClientExchange.margin > 100) {
        this.marginPerExceed = true;
        return false;
      }
      else {
        isValid = true;
      }
      if (isValid) {
        if (this.isEditingClientExchange) {
          for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
            if (this.selectedClientExchange.exchangeId == this.itemsClientExchangeList.items[i].exchangeId) {
              this.fillClientExchangeFromJSON(this.itemsClientExchangeList.items[i], this.selectedClientExchange);
            }
          }
          this.itemsClientExchangeList.commitEdit();
          this.itemsClientExchangeList.refresh();
          this.dialogCmp.statusMsg = AppConstants.MSG_RECORD_UPDATED;
          this.dialogCmp.showAlartDialog('LocalSuccess');
          if (!this.isEditing) {
            this.populateAllowedMarkets(this.selectedClientExchange.exchangeId, this.selectedClientExchange.exchangeName);
            this.populateCustodians(this.selectedClientExchange.exchangeId, this.selectedClientExchange.exchangeName);
          }
        } else {
          for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
            if (this.selectedClientExchange.exchangeId == this.itemsClientExchangeList.items[i].exchangeId) {
              this.dialogCmp.statusMsg = this.itemsClientExchangeList.items[i].exchangeName + " already exist.";
              this.dialogCmp.showAlartDialog('Warning');
              return;
            }
          }
          var cba: ClientExchange = this.itemsClientExchangeList.addNew();
          cba.clientExchangeId = this.selectedClientExchange.clientExchangeId;
          cba.clientId = this.selectedItem.clientId;
          cba.active = this.selectedClientExchange.active;
          cba.allowShortSell = this.selectedClientExchange.allowShortSell;
          cba.bypassCrs = this.selectedClientExchange.bypassCrs;
          cba.openPositionStatus = this.selectedClientExchange.openPositionStatus;
          cba.margin = this.selectedClientExchange.margin;
          cba.exchangeId = this.selectedClientExchange.exchangeId;
          for (let i = 0; i < this.exchangeList.length; i++) {
            if (this.exchangeList[i].exchangeId == this.selectedClientExchange.exchangeId) {
              cba.exchangeName = this.exchangeList[i].exchangeName;
              this.selectedClientExchange.exchangeName = cba.exchangeName;
              break;
            }
          }
          cba.participantExchangeId = this.selectedClientExchange.participantExchangeId;
          this.itemsClientExchangeList.commitNew();
          AppUtility.moveSelectionToLastItem(this.itemsClientExchangeList);
          if (!this.isEditing) {
            this.populateAllowedMarkets(cba.exchangeId, cba.exchangeName);
            this.populateCustodians(cba.exchangeId, cba.exchangeName);
          }
          this.dialogCmp.statusMsg = "Record added successfully";
          this.dialogCmp.showAlartDialog('LocalSuccess');
        }
        this.clearClientExchangeFields();
      }
    } else {
      this.deleteClientExchangeAction = false;
    }
  }

  public onAddDocument(model: any, isValid: boolean) {
    this.isSubmittedDocumentForm = true;
    if (AppUtility.isEmpty(this.file_srcs) || AppUtility.isEmpty(this.file_srcs)[0]) {
      this.fileSelectionMsgShow = true;
    } else {
      this.fileSelectionMsgShow = false;
    }
    if (AppUtility.isEmpty(this.selectedClientDocument.documentType.documentTypeId) ||
      AppUtility.isEmpty(this.file_srcs) || AppUtility.isEmpty(this.file_srcs)[0] ||
      this.fileSizeExceed) {
      return false;
    }
    else {
      isValid = true;
    }
    if (isValid) {
      if (!AppUtility.isEmpty(this.itemsDocumentList) && this.itemsDocumentList.itemCount == 5) {
        this.dialogCmp.statusMsg = "Maximum 5 documents are allowed.";
        this.dialogCmp.showAlartDialog('Warning');
        return;
      }
      var cba: ClientDocument = this.itemsDocumentList.addNew();
      cba.clientDocumentId = this.selectedClientDocument.clientDocumentId;
      cba.clientId = this.selectedItem.clientId;
      //application/vnd.openxmlformats-officedocument.wordprocessingml.document  ==> for DOCX file type
      cba.contentType = this.fileContentType_;
      cba.documentName = this.fileName_;
      cba.documentBase64_ = (this.file_srcs[0]);
      cba.documentType = new DocumentType();
      cba.documentType.documentTypeId = this.selectedClientDocument.documentType.documentTypeId;
      for (let i = 0; i < this.documentTypes.length; i++) {
        if (this.selectedClientDocument.documentType.documentTypeId == this.documentTypes[i].documentTypeId) {
          cba.documentType.type = this.documentTypes[i].type;
          break;
        }
      }
      this.itemsDocumentList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsDocumentList);
      this.clearClientDocuemnt();
      this.dialogCmp.statusMsg = "Record added successfully.";
      this.dialogCmp.showAlartDialog('LocalSuccess');
    }
  }

  public onSaveBankDetailAction(model: any, isValid: boolean) {
    this.isSubmittedBankAccount = true;
    if (AppUtility.isEmpty(this.selectedBankAccountItem.bankBranch.bank.bankId) ||
      AppUtility.isEmpty(this.selectedBankAccountItem.bankBranch.bankBranchId) ||
      AppUtility.isEmpty(this.selectedBankAccountItem.bankAccountNo)) {
      return false;
    }
    if (isValid) {
      var cba: ClientBankAccount = this.itemsBanAccountList.addNew();
      cba.clientId = this.selectedItem.clientId;
      cba.bankBranch = new BankBranch();
      cba.bankBranch.bankBranchId = this.selectedBankAccountItem.bankBranch.bankBranchId;
      for (let i = 0; i < this.bankBranchList.length; i++) {
        if (this.bankBranchList[i].bankBranchId == cba.bankBranch.bankBranchId) {
          cba.bankBranch.branchName = this.bankBranchList[i].branchName;
          break;
        }
      }
      cba.bankBranch.bank = new Bank();
      cba.bankBranch.bank.bankId = this.selectedBankAccountItem.bankBranch.bank.bankId;
      for (let i = 0; i < this.bankList.length; i++) {
        if (this.bankList[i].bankId == cba.bankBranch.bank.bankId) {
          cba.bankBranch.bank.bankName = this.bankList[i].bankName;
          break;
        }
      }
      cba.bankAccountNo = this.selectedBankAccountItem.bankAccountNo;
      this.itemsBanAccountList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsBanAccountList);
      this.dialogCmp.statusMsg = "Record added successfully.";
      this.dialogCmp.showAlartDialog('LocalSuccess');
      this.clearBankAccountFields();
    }
  }

  public onSaveBeneficiaryAction(model: any, isValid: boolean) {

    this.isSubmittedBeneficiary = true;
    /*(this.selectedBeneficiaryItem.isBeneficiarySubmit = "true";
    this.beneficiaryForm.get('beneficiarySubmitted').setValue(this.selectedBeneficiaryItem.isBeneficiarySubmit);*/
    if (AppUtility.isEmpty(this.selectedBeneficiaryItem.beneficiaryName) ||
      AppUtility.isEmpty(this.selectedBeneficiaryItem.relation.relationId)) {
      return false;
    }
    if (!AppUtility.validateCNIC(this.selectedBeneficiaryItem.beneficiaryCNIC) && !AppUtility.isEmpty(this.selectedBeneficiaryItem.beneficiaryCNIC)) {
      this.dialogCmp.statusMsg = "Invalid CNIC";
      AppUtility.printConsole('errorMessage: ' + this.errorMessage);
      this.dialogCmp.showAlartDialog('Error');
      return false;
    }
    if (isValid) {
      var cba: Beneficiary = this.itemsBeneficiaryList.addNew();
      cba.client = new Client();
      cba.client.clientId = this.selectedItem.clientId;
      cba.relation = new Relation();
      cba.relation.relationId = this.selectedBeneficiaryItem.relation.relationId;
      for (let i = 0; i < this.relationList.length; i++) {
        if (this.relationList[i].relationId == cba.relation.relationId) {
          cba.relation.relationDesc = this.relationList[i].relationDesc;
          break;
        }
      }

      cba.beneficiaryName = this.selectedBeneficiaryItem.beneficiaryName;
      cba.beneficiaryCNIC = this.selectedBeneficiaryItem.beneficiaryCNIC;
      this.itemsBeneficiaryList.commitNew();
      AppUtility.moveSelectionToLastItem(this.itemsBeneficiaryList);
      this.dialogCmp.statusMsg = "Record added successfully.";
      this.dialogCmp.showAlartDialog('LocalSuccess');
      this.clearBeneficiaryFields();
    }
  }

  public onTabChangeEvent(currentTab) {
    this.currentTab_ = currentTab;
    if (this.currentTab_ == "AM") {
      this.flexAllowedMarket.invalidate();
    }
    if (this.currentTab_ == "CU") {
      this.flexCustodian.invalidate();
    }
    if (this.currentTab_ == "BA") {
      this.bankAccountGrid.invalidate();
    }
    if (this.currentTab_ == "DOC") {
      this.documentGrid.invalidate();
    }
    if (this.currentTab_ == "JA") {
      this.jointAccountGrid.invalidate();
    }
    if (this.currentTab_ == "CRS") {
      this.clientExchangeGrid.invalidate();
    }
    if (this.currentTab_ == "BEN") {
      this.beneficiaryGrid.invalidate();
    }
  }

  public onClientTypeChangeEvent(selectedClientType) {
    this.selectedItem.clientType = selectedClientType;
    this.populateClientType();
  }

  public onAccountTypeChangeEvent(selectedAccountType) {
    this.selectedItem.accountType = selectedAccountType;
    this.populateAccountType();
  }

  public onGLCodeChangeEvent(e) {
    // if (e.target.value.length > this.glCodeLength_) {
    // e.target.value = e.target.value.substring(0, this.glCodeLength_);
    this.glCode_ = e.target.value;
    // }
    this.coaCode_ = this.clientControlChartOfAccountCode_ + "" + this.glCode_;
  }

  public onOnlineAccessEvent(e) {
    if (e.target.checked) {
      this.selectedItem.onlineClient = false;
    } else {
      this.selectedItem.onlineClient = false;
    }
    this.populateOnlineAccess();
  }

  public hideModal() {
    jQuery("#add_new").modal("hide");   //hiding the modal on save/updating the record
  }

  public onBankChangeEvent(slectedBankId): void {
    this.populateBranchListByBank(slectedBankId);
  }

  // public onCountryChangeEvent(slectedCountryId): void {
  //   this.populateCityListByCountry(slectedCountryId);
  // }

  public onCountryChangeEvent(slectedCountryId): void {
    this.populateProvinceListByCountry(slectedCountryId);
  }

  public onProvinceChangeEvent(selectedProvinceId): void {
    this.populateCityListByProvince(selectedProvinceId);
  }

  public onExchangeChangeEvent(selectedId): void {
    /*this.populateMarketList(selectedId);
    this.populateCustodianList(selectedId);*/
  }

  public allowMarketCheckBoxEvent(exchangeId, marketId, state) {
    if (!AppUtility.isEmpty(exchangeId) && !AppUtility.isEmpty(marketId)) {
      for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
        for (let k = 0; k < this.itemsAllowedMarketList.items[j].marketList.length; k++) {
          if ((this.itemsAllowedMarketList.items[j].marketList[k].marketId == marketId)
            &&
            (this.itemsAllowedMarketList.items[j].exchange.exchangeId == exchangeId)) {
            if (state.target.checked)
              this.itemsAllowedMarketList.items[j].marketList[k].selected = true;
            else
              this.itemsAllowedMarketList.items[j].marketList[k].selected = false;
            break;
          }
        }
      }

    }
  }

  public chustodianCheckBoxEvent(exchangeId, custodianId, state) {
    if (!AppUtility.isEmpty(exchangeId) && !AppUtility.isEmpty(custodianId)) {
      for (let j = 0; j < this.itemsClientCustodianList.itemCount; j++) {
        for (let k = 0; k < this.itemsClientCustodianList.items[j].participantList.length; k++) {
          if ((this.itemsClientCustodianList.items[j].participantList[k].participantId == custodianId)) {
            if (state.target.checked)
              this.itemsClientCustodianList.items[j].participantList[k].selected = true;
            else
              this.itemsClientCustodianList.items[j].participantList[k].selected = false;
          }
        }
      }
    }
  }
  /***************************************
   *          Private Methods
   **************************************/

  //   private fillClientFromJson_Test(c: Client, data: any) {
  //     debugger;
  //     c.clientId = data.clientId;
  //     c.accountType = data.accountType;
  //     c.active = data.active;
  //     c.allowShortSell = data.allowShortSell;
  //     c.bypassCrs = data.bypassCrs;
  //     c.clientCode = data.clientCode;
  //     c.depositoryAccountNo = data.depositoryAccountNo;
  //     c.risk = data.risk;
  //     c.sendEmail = data.sendEmail;
  //     c.sendMail = data.sendMail;
  //     c.proprietaryAccount = data.proprietaryAccount;
  //     c.sendSms = data.sendSms;
  //     c.generateKits = data.generateKits;
  //     c.margin = data.margin;
  //     c.onlineClient = false;//data.onlineClient;
  //     c.openPositionStatus = data.openPositionStatus;
  //     c.reference = data.reference;
  //     c.clientType = data.clientType;
  //     c.displayName_ = data.displayName_;
  //     c.glCodeLength_ = data.glCodeLength_;

  //     c.chartOfAccount = new ChartOfAccount;
  //     c.chartOfAccount.chartOfAccountId = data.chartOfAccount.chartOfAccountId;
  //     c.chartOfAccount.glCode = data.chartOfAccount.glCode;
  //     AppUtility.printConsole('data.chartOfAccount.glCode: ' + data.chartOfAccount.glCode);
  //     c.chartOfAccount.glDesc = data.chartOfAccount.glDesc;

  //     c.agent = new Agent;
  //     c.agent.agentId = data.agent.agentId;
  //     c.agent.agentCode = data.agent.agentCode;

  //     c.participant = new Participant;
  //     c.participant.participantId = data.participant.participantId;
  //     c.participant.participantCode = data.participant.participantCode;
  //     c.participant.participantName = data.participant.participantName;
  // //first mark

  // c.contactDetail = new ContactDetail;
  // c.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
  // c.contactDetail.country = data.contactDetail.country;
  // c.contactDetail.countryId = data.contactDetail.countryId;
  // c.contactDetail.province = data.contactDetail.province;
  // c.contactDetail.provinceId = data.contactDetail.provinceId;
  // c.contactDetail.city = data.contactDetail.city;
  // c.contactDetail.cityId = data.contactDetail.cityId;
  // c.contactDetail.firstName = data.contactDetail.firstName;
  // c.contactDetail.middleName = data.contactDetail.middleName;
  // c.contactDetail.lastName = data.contactDetail.lastName;
  // c.contactDetail.fatherHusbandName = data.contactDetail.fatherHusbandName;
  // c.contactDetail.gender = data.contactDetail.gender;
  // if (AppUtility.isEmpty(c.contactDetail.gender))
  //   c.contactDetail.gender = "M";
  // c.contactDetail.residenceStatus = data.contactDetail.residenceStatus;
  // c.contactDetail.ntnNo = data.contactDetail.ntnNo;
  // c.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
  // c.contactDetail.identificationType = data.contactDetail.identificationType;
  // c.contactDetail.registrationNo = data.contactDetail.registrationNo;
  // c.contactDetail.professionId = data.contactDetail.professionId;
  // c.contactDetail.phone1 = data.contactDetail.phone1;
  // c.contactDetail.cellNo = data.contactDetail.cellNo;
  // c.contactDetail.email = data.contactDetail.email;
  // if (!AppUtility.isEmpty(data.contactDetail.dob)) {
  //   c.contactDetail.dob = data.contactDetail.dob;
  // } else {
  //   c.contactDetail.dob = new Date();
  // }

  // if (!AppUtility.isEmpty(data.contactDetail.idExpDate)) {
  //   c.contactDetail.idExpDate = data.contactDetail.idExpDate;
  // } else {
  //   c.contactDetail.idExpDate = new Date();
  // }

  // if (!AppUtility.isEmpty(data.contactDetail.idIssueDate)) {
  //   c.contactDetail.idIssueDate = data.contactDetail.idIssueDate;
  // } else {
  //   c.contactDetail.idIssueDate = new Date();
  // }
  // c.contactDetail.issuePlaceId = data.contactDetail.issuePlaceId;


  // c.contactDetail.postalCode = data.contactDetail.postalCode;
  // c.contactDetail.address1 = data.contactDetail.address1;
  // c.contactDetail.address2 = data.contactDetail.address2;
  // c.contactDetail.address3 = data.contactDetail.address3;
  // c.contactDetail.companyName = data.contactDetail.companyName;
  // c.contactDetail.industryId = data.contactDetail.industryId;
  // //2nd  mark
  // if (data.contactDetail.provinceId > 0) {
  //   this.selectedProvinceId = data.contactDetail.provinceId;
  //   this.populateProvinceListByCountry(data.contactDetail.countryId);
  // }

  // if (data.contactDetail.cityId > 0) {
  //   this.selectedCityId = data.contactDetail.cityId;
  //   this.populateCityListByProvince(data.contactDetail.provinceId);
  // }

  // c.commissionSlabMaster = new CommissionSlabMaster;
  // c.commissionSlabMaster.commissionSlabId = data.commissionSlabMaster.commissionSlabId;
  // c.commissionSlabMaster.slabName = data.commissionSlabMaster.slabName;


  // c.participantBranch = new ParticipantBranch;
  // c.participantBranch.branchId = data.participantBranch.branchId;
  // c.participantBranch.branchCode = data.participantBranch.branchCode;
  // //3rd  mark
  // c.user = new User;
  // c.user.userId = data.user.userId;
  // c.user.email = data.user.email;
  // c.user.password = data.user.password;
  // c.user.status = data.user.status;
  // c.user.active = data.user.active;
  // c.user.userName = data.user.userName;
  // /*
  // c.user.participant = new Participant;
  // c.user.participant.participantId = data.user.participant.participantId;
  // */
  // c.bankAccount = data.bankAccount;
  // c.jointAccount = data.jointAccount;

  // c.incomeSource = new IncomeSource();
  // c.incomeSource.incomeSourceId = (data.incomeSource!=null)?data.incomeSource.incomeSourceId:null;
  // c.incomeSource.incomeSourceDesc = (data.incomeSource!=null)?data.incomeSource.incomeSourceDesc:null;
  // c.annualGrossIncome = data.annualGrossIncome;
  // c.incomePercentage = data.incomePercentage;

  //   }
  private fillClientFromJson(c: Client, data: any) {
    c.accountCategory = data.accountCategory;
    c.clientId = data.clientId;
    c.accountType = data.accountType;
    c.active = data.active;
    c.allowShortSell = data.allowShortSell;
    c.bypassCrs = data.bypassCrs;
    c.clientCode = data.clientCode;
    c.depositoryAccountNo = data.depositoryAccountNo;
    c.risk = data.risk;
    c.sendEmail = data.sendEmail;
    c.sendMail = data.sendMail;
    c.proprietaryAccount = data.proprietaryAccount;
    c.sendSms = data.sendSms;
    c.generateKits = data.generateKits;
    c.margin = data.margin;
    c.onlineClient = false;//data.onlineClient;
    c.openPositionStatus = data.openPositionStatus;
    c.reference = data.reference;
    c.clientType = data.clientType;
    c.displayName_ = data.displayName_;
    c.glCodeLength_ = data.glCodeLength_;

    c.chartOfAccount = new ChartOfAccount;
    c.chartOfAccount.chartOfAccountId = data.chartOfAccount.chartOfAccountId;
    c.chartOfAccount.glCode = data.chartOfAccount.glCode;
    AppUtility.printConsole('data.chartOfAccount.glCode: ' + data.chartOfAccount.glCode);
    c.chartOfAccount.glDesc = data.chartOfAccount.glDesc;
    ;
    c.chartOfAccount.crSecpAccount = data.chartOfAccount.crSecpAccount;
    AppUtility.printConsole('c.chartOfAccount.crSecpAccount: ' + c.chartOfAccount.crSecpAccount?.Id);
    c.chartOfAccount.dbSecpAccount = data.chartOfAccount.dbSecpAccount;
    c.agent = new Agent;
    c.agent.agentId = data.agent.agentId;
    c.agent.agentCode = data.agent.agentCode;

    c.participant = new Participant;
    c.participant.participantId = data.participant.participantId;
    c.participant.participantCode = data.participant.participantCode;
    c.participant.participantName = data.participant.participantName;


    c.contactDetail = new ContactDetail;
    c.contactDetail.contactDetailId = data.contactDetail.contactDetailId;
    c.contactDetail.country = data.contactDetail.country;
    c.contactDetail.countryId = data.contactDetail.countryId;
    c.contactDetail.province = data.contactDetail.province;
    c.contactDetail.provinceId = data.contactDetail.provinceId;
    c.contactDetail.city = data.contactDetail.city;
    c.contactDetail.cityId = data.contactDetail.cityId;
    c.contactDetail.firstName = data.contactDetail.firstName;
    c.contactDetail.middleName = data.contactDetail.middleName;
    c.contactDetail.lastName = data.contactDetail.lastName;
    c.contactDetail.fatherHusbandName = data.contactDetail.fatherHusbandName;
    c.contactDetail.gender = data.contactDetail.gender;
    if (AppUtility.isEmpty(c.contactDetail.gender))
      debugger
    c.contactDetail.gender = "M";
    c.contactDetail.residenceStatus = Number(data.contactDetail.residenceStatus);
    c.contactDetail.ntnNo = data.contactDetail.ntnNo == null ? "0" : data.contactDetail.ntnNo;
    c.contactDetail.identificationTypeId = data.contactDetail.identificationTypeId;
    c.contactDetail.identificationType = data.contactDetail.identificationType;
    c.contactDetail.registrationNo = data.contactDetail.registrationNo;
    c.contactDetail.professionId = data.contactDetail.professionId == null ? -1 : data.contactDetail.professionId;
    c.contactDetail.phone1 = data.contactDetail.phone1;
    c.contactDetail.cellNo = data.contactDetail.cellNo;
    c.contactDetail.email = data.contactDetail.email;
    if (!AppUtility.isEmpty(data.contactDetail.dob)) {
      c.contactDetail.dob = data.contactDetail.dob;
    } else {
      c.contactDetail.dob = new Date();
    }

    if (!AppUtility.isEmpty(data.contactDetail.idExpDate)) {
      c.contactDetail.idExpDate = data.contactDetail.idExpDate;
    } else {
      c.contactDetail.idExpDate = new Date();
    }

    if (!AppUtility.isEmpty(data.contactDetail.idIssueDate)) {
      c.contactDetail.idIssueDate = data.contactDetail.idIssueDate;
    } else {
      c.contactDetail.idIssueDate = new Date();
    }
    c.contactDetail.issuePlaceId = data.contactDetail.issuePlaceId;


    c.contactDetail.postalCode = data.contactDetail.postalCode;
    c.contactDetail.address1 = data.contactDetail.address1;
    c.contactDetail.address2 = data.contactDetail.address2;
    c.contactDetail.address3 = data.contactDetail.address3;
    c.contactDetail.companyName = data.contactDetail.companyName;
    c.contactDetail.industryId = data.contactDetail.industryId == null ? null : data.contactDetail.industryId;

    //this.populateCityListByCountry(data.contactDetail.countryId);
    // c.contactDetail.cityId = this.selectedCityId;
    // this.cmbCityId.invalidate();

    if (data.contactDetail.provinceId > 0) {
      this.selectedProvinceId = data.contactDetail.provinceId;
      this.populateProvinceListByCountry(data.contactDetail.countryId);
    }

    if (data.contactDetail.cityId > 0) {
      this.selectedCityId = data.contactDetail.cityId;
      this.populateCityListByProvince(data.contactDetail.provinceId);
    }

    c.commissionSlabMaster = new CommissionSlabMaster;
    c.commissionSlabMaster.commissionSlabId = data.commissionSlabMaster.commissionSlabId;
    c.commissionSlabMaster.slabName = data.commissionSlabMaster.slabName;


    c.participantBranch = new ParticipantBranch;
    c.participantBranch.branchId = data.participantBranch.branchId;
    c.participantBranch.branchCode = data.participantBranch.branchCode;

    c.user = new User;
    c.user.userId = data.user.userId;
    c.user.email = data.user.email;
    c.user.password = data.user.password;
    c.user.status = data.user.status;
    c.user.active = data.user.active;
    c.user.userName = data.user.userName;

    c.user.participant = new Participant;
    c.user.participant.participantId = data.user.participant.participantId;

    c.bankAccount = data.bankAccount;
    c.jointAccount = data.jointAccount;

    c.incomeSource = new IncomeSource();
    c.incomeSource.incomeSourceId = (data.incomeSource != null) ? data.incomeSource.incomeSourceId : null;
    c.incomeSource.incomeSourceDesc = (data.incomeSource != null) ? data.incomeSource.incomeSourceDesc : null;
    c.annualGrossIncome = data.annualGrossIncome == null ? 0 : data.annualGrossIncome;
    c.incomePercentage = data.incomePercentage == null ? 0 : data.incomePercentage;

  }

  private fillClientExchangeFromJSON(c: ClientExchange, data: any) {
    c.clientExchangeId = data.clientExchangeId;
    c.active = data.active;
    c.allowShortSell = data.allowShortSell;
    c.bypassCrs = data.bypassCrs;
    c.margin = data.margin;
    c.openPositionStatus = data.openPositionStatus;
    c.clientId = data.clientId;
    c.exchangeId = data.exchangeId;
    c.exchangeName = data.exchangeName;
    c.participantExchangeId = data.participantExchangeId;

  }

  private populateItemGrid() {

  this.loader.show();
    if (AppUtility.isEmpty(this.searchClientCode) && AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBroker(AppConstants.participantId, false)
        .subscribe(
          restData => {
            this.loader.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchClientCode) && AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCode(AppConstants.participantId, encodeURIComponent(this.searchClientCode))
        .subscribe(
          restData => {
            this.loader.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (AppUtility.isEmpty(this.searchClientCode) && !AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientName(AppConstants.participantId, encodeURIComponent(this.searchClientName))
        .subscribe(
          restData => {
            this.loader.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    } else if (!AppUtility.isEmpty(this.searchClientCode) && !AppUtility.isEmpty(this.searchClientName)) {
      this.listingService.getClientListByBrokerAndClientCodeAndClientName(AppConstants.participantId, encodeURIComponent(this.searchClientCode), encodeURIComponent(this.searchClientName))
        .subscribe(
          restData => {
            this.loader.hide();
            this.itemsList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }

  loadLeveisByParticipant(): void {
    this.listingService.getLeviesByBroker(AppConstants.participantId).subscribe(
      data => {
        if (data != null) {
          this.leviesList = data;
          var levy: ClientLevieMaster = new ClientLevieMaster();
          levy.leviesMasterId = AppConstants.ALL_VAL;
          levy.levyCode = AppConstants.ALL_STR;
          this.leviesList.unshift(levy);
        }
      },
      error => { this.loader.hide(); this.errorMessage = <any>error.message; },
    )
  }

  private populateClientLeveis(clientId: Number) {
    this.loader.show();
    this.selectedLevies = null;
    this.listingService.getLeviesByClient(clientId)
      .subscribe(
        restData => {
          this.loader.hide();
          this.selectedLevies = restData;

          if (!AppUtility.isEmptyArray(this.selectedLevies)) {
            for (let i = 0; i < this.leviesList.length; i++) {
              for (let j = 0; j < this.selectedLevies.length; j++) {
                if (this.leviesList[i].leviesMasterId == this.selectedLevies[j].leviesMasterId) {
                  this.leviesList[i].selected = true;
                  this.leviesList[i].$checked = true;
                }
              }
            }

            if (AppUtility.isValidVariable(this.cmbLevy) && !this.cmbLevy.containsFocus())
              this.cmbLevy.refresh();
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  private populateCommissionSlabList() {
    this.loader.show();
    this.listingService.getCommissionSlabList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.commissionSlabList = [];
          } else {
            this.commissionSlabList = restData;
          }
          var csm: CommissionSlabMaster = new CommissionSlabMaster();
          csm.commissionSlabId = AppConstants.PLEASE_SELECT_VAL;
          csm.slabNameDisplay_ = AppConstants.PLEASE_SELECT_STR;
          this.commissionSlabList.unshift(csm);
          if (!AppUtility.isEmptyArray(this.commissionSlabList)) {
            this.selectedItem.commissionSlabMaster.commissionSlabId = this.commissionSlabList[0].commissionSlabId;
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  private populateParticipantBranchList() {
    this.loader.show();
    this.listingService.getParticipantBranchList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.participantBranchList = [];
          } else {
            this.participantBranchList = restData;
          }

          var pb: ParticipantBranch = new ParticipantBranch();
          pb.branchId = AppConstants.PLEASE_SELECT_VAL;
          pb.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.participantBranchList.unshift(pb);
          if (!AppUtility.isEmptyArray(this.participantBranchList)) {
            this.selectedItem.participantBranch.branchId = this.participantBranchList[0].branchId;
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  private populateAgentList() {
    this.loader.show();
    this.listingService.getActiveAgentsbyParticipant(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.agentList = [];
          } else {
            this.agentList = restData;
          }
          var ag: Agent = new Agent();
          ag.agentId = AppConstants.PLEASE_SELECT_VAL;
          ag.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.agentList.unshift(ag);
          if (!AppUtility.isEmptyArray(this.agentList)) {
            this.selectedItem.agent.agentId = this.agentList[0].agentId;
          }
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  private populateExchangeList() {
    this.loader.show();
    this.listingService.getParticipantExchangeList(AppConstants.participantId)
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.exchangeList = [];
          } else {
            this.exchangeList = restData;
          }
          var ag: Exchange = new Exchange();
          ag.exchangeId = AppConstants.PLEASE_SELECT_VAL;
          ag.exchangeName = AppConstants.PLEASE_SELECT_STR;
          this.exchangeList.unshift(ag);
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  /*private populateMarketList(exchangeId: number) {
    if (AppUtility.isEmpty(exchangeId)) {
      this.marketList = [];
      return;
    }
    this.listingService.getMarketListByExchange(exchangeId)
      .subscribe(
      restData => {
        this.marketList = restData;
      },
      error => this.errorMessage = <any>error);
  }*/
  /*private populateCustodianList(exchangeId: number) {
    if (AppUtility.isEmpty(exchangeId)) {
      this.custodianList = [];
      return;
    }
    this.listingService.getCustodianByExchange(exchangeId)
      .subscribe(
      restData => {
        this.custodianList = restData;
      },
      error => this.errorMessage = <any>error);
  }*/

  private populateDocumentTypes() {
    this.loader.show();
    this.listingService.getDocumentTypes()
      .subscribe(
        restData => {
          this.loader.hide();
          if (AppUtility.isEmpty(restData)) {
            this.documentTypes = [];
          } else {
            this.documentTypes = restData;
          }
          var ag: DocumentType = new DocumentType();
          ag.documentTypeId = AppConstants.PLEASE_SELECT_VAL;
          ag.type = AppConstants.PLEASE_SELECT_STR;
          this.documentTypes.unshift(ag);
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; });
  }

  private populateRelationList() {
    this.listingService.getBeneficiaryRelationList()
      .subscribe(
        restData => {
          this.relationList = restData;

          let relation: Relation = new Relation();
          relation.relationId = AppConstants.PLEASE_SELECT_VAL;
          relation.relationDesc = AppConstants.PLEASE_SELECT_STR;
          this.relationList.unshift(relation);

          this.selectedBeneficiaryItem.relation.relationId = this.relationList[0].relationId;

        },
        error => {
          this.errorMessage = <any>error.message;
        });
  }

  private populateClientType() {
    if (AppUtility.isEmpty(this.selectedItem.clientType)) {
      this.showIndividual = false;
      this.showCorporate = false;
      this.showJoint = false;
    }
    else if (this.selectedItem.clientType == AppConstants.INDIVIDUAL_TYPE) {
      this.showIndividual = true;
      this.showCorporate = false;
      this.populateAccountType();
    }
    else {
      this.showIndividual = false;
      this.showCorporate = true;
      this.showJoint = false;
    }
  }

  private populateAccountType() {
    if (AppUtility.isEmpty(this.selectedItem.accountType)) {
      this.showJoint = false;
    }
    else if (this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
      this.showJoint = true;
    }
    else {
      this.showJoint = false;
    }
  }

  private populateOnlineAccess() {
    if (AppUtility.isEmpty(this.selectedItem.onlineClient)) {
      this.showOnlineAccess = false;
    }
    else if (this.selectedItem.onlineClient == true) {
      this.showOnlineAccess = true;
      if (AppUtility.isEmpty(this.selectedItem.clientId)) {
        this.selectedItem.user = new User();
      } else {
        this.listingService.getClientUser(this.selectedItem.clientId)
          .subscribe(
            restData => {
              if (AppUtility.isValidVariable(restData) && !AppUtility.isEmpty(restData)) {
                var userObj: any = restData;
                this.selectedItem.user = userObj;
              }
            },
            error => {
              this.errorMessage = <any>error.message;
              this.dialogCmp.statusMsg = this.errorMessage;
              this.dialogCmp.showAlartDialog('Error');
            });

      }
    }
    else {
      this.showOnlineAccess = false;
    }
  }

  private populateIdentificationTypeList() {
    this.loader.show();
    this.listingService.getIdentificationTypeList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.identificationTypeList = restData;

          var identificationType: IdentificationType = new IdentificationType();
          identificationType.identificationTypeId = AppConstants.PLEASE_SELECT_VAL;
          identificationType.identificationType = AppConstants.PLEASE_SELECT_STR;
          this.identificationTypeList.unshift(identificationType);
          this.selectedItem.contactDetail.identificationTypeId = this.identificationTypeList[0].identificationTypeId;
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; },
        );
  }

  private populateProfessionList() {
    this.loader.show();
    this.listingService.getProfessionList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.professionList = restData;

          var profession: Profession = new Profession();
          profession.professionId = AppConstants.PLEASE_SELECT_VAL;
          profession.professionCode = AppConstants.PLEASE_SELECT_STR;
          this.professionList.unshift(profession);
          this.selectedItem.contactDetail.professionId = this.professionList[0].professionId;
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; },
        );
  }

  private populateIncomeSourceList() {
    this.loader.show();
    var incomeSource: IncomeSource = new IncomeSource();
    incomeSource.incomeSourceId = AppConstants.PLEASE_SELECT_VAL;
    incomeSource.incomeSourceDesc = AppConstants.PLEASE_SELECT_STR;
    this.incomeSourceList = [];
    this.incomeSourceList.unshift(incomeSource);
    this.listingService.getIncomeSourceList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.incomeSourceList = restData;


          this.selectedItem.incomeSource.incomeSourceId = this.incomeSourceList[0].incomeSourceId;
          this.incomeSourceList.unshift(incomeSource);
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; },
      );

  }

  private populateIndustryList() {
    this.loader.show();
    this.listingService.getIndustryList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.industryList = restData;

          var industry: Industry = new Industry();
          industry.industryId = AppConstants.PLEASE_SELECT_VAL;
          industry.industryName = AppConstants.PLEASE_SELECT_STR;
          this.industryList.unshift(industry);
          this.selectedItem.contactDetail.industryId = this.industryList[0].industryId;
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; },
        );
  }

  private populateCountryList() {
    this.loader.show();
    this.listingService.getCountryList()
      .subscribe(
        restData => {
          this.loader.hide();
          this.countryList = restData;

          var country: Country = new Country();
          country.countryId = AppConstants.PLEASE_SELECT_VAL;
          country.countryName = AppConstants.PLEASE_SELECT_STR;
          this.countryList.unshift(country);

          this.selectedItem.contactDetail.countryId = this.countryList[0].countryId;
          //  if (this.countryList[0].countryId != null)
          //  this.populateCityListByCountry(this.countryList[0].countryId);
        },
        error => { this.loader.hide(); this.errorMessage = <any>error.message; },
        );
  }

  private populateCustodians(exchangeId: Number, exchangeName: String) {
    debugger
    if (!AppUtility.isEmpty(exchangeId)) {
      if (!AppUtility.isEmpty(this.itemsClientCustodianList) && this.itemsClientCustodianList.itemCount > 0) {
        for (let i = 0; i < this.itemsClientCustodianList.itemCount; i++) {
          if (this.itemsClientCustodianList.items[i].exchange.exchangeId == exchangeId) {
            return;
          }
        }
      }
      this.listingService.getCustodianByExchange(exchangeId)
        .subscribe(
          restData => {
            if (!AppUtility.isEmpty(restData)) {
              var participantExchange = new ParticipantExchange;
              participantExchange = this.itemsClientCustodianList.addNew();
              participantExchange.exchange = new Exchange();
              participantExchange.exchange.exchangeId = exchangeId;
              participantExchange.exchange.exchangeName = exchangeName;
              participantExchange.participantList = restData;
              for (let i = 0; i < participantExchange.participantList.length; i++) {
                participantExchange.participantList[i].exchange.exchangeName = "";
                participantExchange.participantList[i].exchangeId = exchangeId;
              }
              this.itemsClientCustodianList.commitNew();
              AppUtility.moveSelectionToLastItem(this.itemsClientCustodianList);
              this.flexCustodian.invalidate();
              if (this.isEditing)
                this.loadClientCustodians();
            }
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
          });
    } else {
      // exchange id not provided
    }
  }

  private populateAllowedMarkets(exchangeId: Number, exchangeName: String) {
    if (!AppUtility.isEmpty(exchangeId)) {
      if (!AppUtility.isEmpty(this.itemsAllowedMarketList) && this.itemsAllowedMarketList.itemCount > 0) {
        for (let i = 0; i < this.itemsAllowedMarketList.itemCount; i++) {
          if (this.itemsAllowedMarketList.items[i].exchange.exchangeId == exchangeId) {
            return;
          }
        }
      }
      this.listingService.getMarketListByExchange(exchangeId)
        .subscribe(
          restData => {
            debugger
            if (!AppUtility.isEmpty(restData)) {
              var exchangeMarket = new ExchangeMarket;
              exchangeMarket = this.itemsAllowedMarketList.addNew();
              exchangeMarket.exchange = new Exchange();
              exchangeMarket.exchange.exchangeId = exchangeId;
              exchangeMarket.exchange.exchangeName = exchangeName;
              exchangeMarket.marketList = restData;
              for (let i = 0; i < exchangeMarket.marketList.length; i++) {
                exchangeMarket.marketList[i].exchangeId = exchangeId;
              }
              this.itemsAllowedMarketList.commitNew();
              AppUtility.moveSelectionToLastItem(this.itemsAllowedMarketList);
              this.flexAllowedMarket.invalidate();
              if (this.isEditing)
                this.loadClientMarkets();
            }
          },
          error => {
            this.errorMessage = <any>error.message;
          });
    } else {
      // exchange id not provided
    }
  }

  private populateBankList(_participantid: Number, _active: Boolean) {
    this.listingService.getBanksList(_participantid, _active)
      .subscribe(
        restData => {
          this.bankList = restData;

          let bank: Bank = new Bank();
          bank.bankId = AppConstants.PLEASE_SELECT_VAL;
          bank.displayName_ = AppConstants.PLEASE_SELECT_STR;
          this.bankList.unshift(bank);

          this.selectedBankAccountItem.bankBranch.bank.bankId = this.bankList[0].bankId;
          if (this.bankList[0].bankId != null)
            this.populateBranchListByBank(this.bankList[0].bankId);
        },
        error => {
          this.errorMessage = <any>error.message;
        });
  }

  private populateClientDocuemntsGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsDocumentList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientDocumentsList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsDocumentList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });
    }
  }

  private populateClientBankAccountGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsBanAccountList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientBankAccountList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsBanAccountList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientBeneficiaryGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsBeneficiaryList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientBeneficiaryList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsBeneficiaryList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientExchangeGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsClientExchangeList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientExchangeList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsClientExchangeList = new wjcCore.CollectionView(restData);
            for (let i = 0; i < this.itemsClientExchangeList.itemCount; i++) {
              this.populateAllowedMarkets(this.itemsClientExchangeList.items[i].exchangeId, this.itemsClientExchangeList.items[i].exchangeName);
              this.populateCustodians(this.itemsClientExchangeList.items[i].exchangeId, this.itemsClientExchangeList.items[i].exchangeName);
            }

          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private loadClientCustodians() {
    //AppUtility.printConsole('AppState1: ' + this.appState.state);
    //AppUtility.printConsole('showLoader1: ' + this.appState.showLoader);
    this.clientCustodian = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsClientCustodianList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientCustodian(this.selectedItem.clientId)
        .subscribe(
          restData => {
            //AppUtility.printConsole('AppState2: ' + this.appState.state);
            //AppUtility.printConsole('showLoader2: ' + this.appState.showLoader);

            if (!AppUtility.isEmpty(restData)) {
              this.clientCustodian = restData;
              if (!AppUtility.isEmpty(this.clientCustodian)) {
                for (let i = 0; i < this.clientCustodian.length; i++) {
                  for (let j = 0; j < this.itemsClientCustodianList.itemCount; j++) {
                    for (let k = 0; k < this.itemsClientCustodianList.items[j].participantList.length; k++) {
                      //this.itemsClientCustodianList.items[j].participantList[k].selected = false;
                      if (this.itemsClientCustodianList.items[j].participantList[k].participantId == this.clientCustodian[i].custodian.participantId
                        &&
                        (this.clientCustodian[i].active == true)) {
                        this.itemsClientCustodianList.items[j].participantList[k].selected = true;
                      }
                    }
                  }
                }
              }
            }
            else {
              this.itemsClientCustodianList = new wjcCore.CollectionView();
              this.loader.hide();
            }
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private loadClientMarkets() {
    this.clientMarket = [];
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsAllowedMarketList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientMarketList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            if (!AppUtility.isEmpty(restData)) {
              this.clientMarket = restData;
              if (!AppUtility.isEmpty(this.clientMarket)) {
                for (let i = 0; i < this.clientMarket.length; i++) {
                  for (let j = 0; j < this.itemsAllowedMarketList.itemCount; j++) {
                    for (let k = 0; k < this.itemsAllowedMarketList.items[j].marketList.length; k++) {
                      //this.itemsAllowedMarketList.items[j].marketList[k].selected = false;
                      if ((this.itemsAllowedMarketList.items[j].marketList[k].marketId == this.clientMarket[i].marketId)
                        &&
                        (this.itemsAllowedMarketList.items[j].exchange.exchangeId == this.clientMarket[i].exchangeId)
                        &&
                        (this.clientMarket[i].active == true)) {
                        this.itemsAllowedMarketList.items[j].marketList[k].selected = true;
                        // alert("Allowed Markets are ==> "+this.itemsAllowedMarketList.items[j].marketList[k].marketCode);
                      }
                    }
                  }
                }
              }
            }
          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateClientJointAccountGrid() {
    if (AppUtility.isEmpty(this.selectedItem.clientId)) {
      this.itemsJointAccountList = new wjcCore.CollectionView();
    } else {
      this.listingService.getClientJointAccountList(this.selectedItem.clientId)
        .subscribe(
          restData => {
            this.itemsJointAccountList = new wjcCore.CollectionView(restData);
          },
          error => {
            this.errorMessage = <any>error.message;
            this.dialogCmp.statusMsg = this.errorMessage;
            this.dialogCmp.showAlartDialog('Error');
          });

    }
  }

  private populateBranchListByBank(bankId: Number) {
    var branch: BankBranch = new BankBranch();
    branch.bankBranchId = AppConstants.PLEASE_SELECT_VAL;
    branch.branchName = AppConstants.PLEASE_SELECT_STR;
    const branchCombo: FormControl = (<any>this.bankDetailForm).controls.branchId;
    if (AppUtility.isEmpty(bankId)) {
      this.bankBranchList = [];
      this.bankBranchList.unshift(branch);
      branchCombo.reset();
    } else {
      this.listingService.getBankBranchListByBank(bankId)
        .subscribe(
          restData => {
            if (AppUtility.isEmpty(restData)) {
              this.bankBranchList = [];
              this.selectedBankAccountItem.bankBranch.bankBranchId = null;
              this.selectedBankAccountItem.bankBranch.branchName = null;
            }
            else {
              this.bankBranchList = restData;
              if (!AppUtility.isEmptyArray(this.bankBranchList)) {
                if (!this.isEditing) {
                  this.selectedBankAccountItem.bankBranch.bankBranchId = this.bankBranchList[0].bankBranchId;
                  this.selectedBankAccountItem.bankBranch.branchName = this.bankBranchList[0].branchName;
                }
              }

            }
            this.bankBranchList.unshift(branch);
          },
          error => { this.errorMessage = <any>error.message; },
          () => {
            branchCombo.reset();
          }
        );
    }
  }

  private populateCityListByProvince(provinceId: Number) {
    this.loader.show();
    var city: City = new City();
    city.cityId = AppConstants.PLEASE_SELECT_VAL;
    city.cityName = AppConstants.PLEASE_SELECT_STR;
    this.cityList = [];
    this.cityList.unshift(city);

    if (AppUtility.isEmpty(provinceId)) {
      this.loader.hide();
    } else {
      this.listingService.getCityListByProvince(provinceId)
        .subscribe(
          restData => {
            this.loader.hide();
            if (AppUtility.isEmpty(restData)) {
              this.cityList = [];
              this.selectedItem.contactDetail.cityId = null;
              this.selectedItem.contactDetail.city = null;
            }
            else {
              this.cityList = restData;
              
              setTimeout(() => {
                if (!this.isEditing) {
                  this.selectedItem.contactDetail.cityId = this.cityList[0].cityId;
                  this.selectedItem.contactDetail.city = this.cityList[0].cityName;
                } else {
                  this.selectedItem.contactDetail.cityId = this.selectedCityId;
                }
              }, 150);
            }
          },
          error => {
            this.loader.hide();
            this.errorMessage = <any>error.message;
          },
        );
    }
  }

  private populateProvinceListByCountry(countryId: Number) {
    debugger
    var province: Provinces = new Provinces();
    province.provinceId = AppConstants.PLEASE_SELECT_VAL;
    province.provinceDesc = AppConstants.PLEASE_SELECT_STR;
    this.provinceList = [];
    this.provinceList.unshift(province);
    if (AppUtility.isEmpty(countryId)) {

    } else {
      this.listingService.getProvinceListByCountry(countryId)
        .subscribe(
          restData => {
            debugger
            if (AppUtility.isEmpty(restData)) {
              this.provinceList = [];
              this.selectedItem.contactDetail.provinceId = null;
              this.selectedItem.contactDetail.province = null;
            }
            else {
              this.provinceList = restData;

              setTimeout(() => {
                if (!this.isEditing) {
                  this.selectedItem.contactDetail.provinceId = this.provinceList[0].provinceId;
                  this.selectedItem.contactDetail.province = this.provinceList[0].province;
                } else {
                  this.selectedItem.contactDetail.provinceId = this.selectedProvinceId;
                }
              }, 150);
            }
          },
          error => { this.errorMessage = <any>error.message; },
        );
    }
  }

  private populateClientControlAccount() {
    debugger
    this.listingService.getClientControlAccount(AppConstants.participantId)
      .subscribe(
        restData => {
          debugger
          if (AppUtility.isEmpty(restData)) {
            this.clientControlChartOfAccountCode_ = "";
          } else {
            var hld: ChartOfAccount = new ChartOfAccount();
            hld = restData;
            this.clientControlChartOfAccountCode_ = hld.glCode;
            this.coaCode_ = hld.glCode;
            //this.selectedItem.chartOfAccount = hld;
          }

        },
        error => this.errorMessage = <any>error);
  }

  private validateBasicInfo(): boolean {
    if (this.showIndividual) {
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.firstName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.lastName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.gender) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.residenceStatus) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationTypeId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.identificationType) ||
        AppUtility.isEmpty(this.selectedItem.clientCode) ||
        AppUtility.isEmpty(this.selectedItem.chartOfAccount.glCode) ||
        AppUtility.isEmpty(this.selectedItem.chartOfAccount.glDesc) ||
        AppUtility.isEmpty(this.selectedItem.depositoryAccountNo) ||
        AppUtility.isEmpty(this.selectedItem.risk) ||
        AppUtility.isEmpty(this.selectedItem.commissionSlabMaster.commissionSlabId) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId) ||
        AppUtility.isEmpty(this.selectedItem.incomeSource.incomeSourceId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.issuePlaceId) ||
        AppUtility.isEmpty(this.selectedItem.accountCategory.accountCategoryId)
      ) {
        return false;
      }
      else {

        this.selectedItem.contactDetail.companyName = null;
        this.selectedItem.contactDetail.industryId = null;
        this.selectedItem.contactDetail.registrationNo = null;
        return true;
      }
    } else if (this.showCorporate) {
      if (AppUtility.isEmpty(this.selectedItem.contactDetail.companyName) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.industryId) ||
        AppUtility.isEmpty(this.selectedItem.contactDetail.registrationNo) ||
        AppUtility.isEmpty(this.selectedItem.clientCode) ||
        AppUtility.isEmpty(this.selectedItem.chartOfAccount.glCode) ||
        AppUtility.isEmpty(this.selectedItem.chartOfAccount.glDesc) ||
        AppUtility.isEmpty(this.selectedItem.depositoryAccountNo) ||
        AppUtility.isEmpty(this.selectedItem.risk) ||
        AppUtility.isEmpty(this.selectedItem.incomeSource.incomeSourceId) ||
        AppUtility.isEmpty(this.selectedItem.commissionSlabMaster.commissionSlabId) ||
        AppUtility.isEmpty(this.selectedItem.participantBranch.branchId)) {
        return false;
      }
      else {
        this.selectedItem.contactDetail.firstName = null;
        this.selectedItem.contactDetail.middleName = null;
        this.selectedItem.contactDetail.lastName = null;
        this.selectedItem.contactDetail.fatherHusbandName = null;
        this.selectedItem.contactDetail.gender = null;
        //this.selectedItem.contactDetail.residenceStatus = null;
        this.selectedItem.contactDetail.identificationTypeId = null;
        this.selectedItem.contactDetail.identificationType = null;
        this.selectedItem.contactDetail.dob = new Date();
        this.selectedItem.contactDetail.professionId = null;
        this.selectedItem.contactDetail.ntnNo = null;

        this.selectedItem.contactDetail.idExpDate = new Date();
        this.selectedItem.contactDetail.idIssueDate = new Date();
        this.selectedItem.contactDetail.issuePlaceId = null;

        return true;
      }
    }
    return true;
  }

  private validateContactDetail(): boolean {
    if (AppUtility.isEmpty(this.selectedItem.contactDetail.countryId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.cityId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.provinceId) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.address1) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.postalCode) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.phone1) ||
      AppUtility.isEmpty(this.selectedItem.contactDetail.email)) {
      return false;
    }
    if (!AppUtility.validateEmail("" + this.selectedItem.contactDetail.email))
      return false;
    if (!AppUtility.validateNumberOnly("" + this.selectedItem.contactDetail.phone1))
      return false;
    if (!AppUtility.validateAlphaNumeric("" + this.selectedItem.contactDetail.postalCode))
      return false;


    return true;
  }
  private validateSystemAccess(): boolean {
    if (this.selectedItem.onlineClient && !(<any>this.myForm).controls.password.valid) {
      if (this.currentTab_ != "SA") {
        this.dialogCmp.statusMsg = 'Password strength should be strong.';
        this.dialogCmp.showAlartDialog('Notification');
      }
      return false;
    }
    if (this.selectedItem.onlineClient && !this.isEditing) {
      if (AppUtility.isEmpty(this.selectedItem.user.userName) ||
        AppUtility.isEmpty(this.selectedItem.user.password) ||
        AppUtility.isEmpty(this.confirmPassword_) ||
        AppUtility.isEmpty(this.selectedItem.user.email)) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for User tab.';
          this.dialogCmp.showAlartDialog('Notification');
        }
        return false;
      } else if (this.selectedItem.user.password != this.confirmPassword_) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Password and Confirm Password mismatch.';
          this.dialogCmp.showAlartDialog('Warning');
        }
        return false;
      } else {
        if (!AppUtility.validateEmail("" + this.selectedItem.user.email))
          return false;
      }
    }
    if (this.selectedItem.onlineClient && this.isEditing) {
      if (AppUtility.isEmpty(this.selectedItem.user.userName) ||
        AppUtility.isEmpty(this.selectedItem.user.email)) {
        if (this.currentTab_ != "SA") {
          this.dialogCmp.statusMsg = 'Please fill all mandatory fields for User tab.';
          this.dialogCmp.showAlartDialog('Notification');
        }
        return false;
      } else {
        if (!AppUtility.validateEmail("" + this.selectedItem.user.email))
          return false;
      }
    }

    return true;
  }

  private validateJointAccount(): boolean {
    if (this.isEditing) {
      if (this.showIndividual && this.selectedItem.accountTypeNew.accTypeId == AppConstants.ACCOUNT_TYPE_JOINT_ID) {
        if (AppUtility.isEmpty(this.itemsJointAccountList) || this.itemsJointAccountList.itemCount == 0) {
          this.dialogCmp.statusMsg = 'Please add some account information in Joint tab.';
          this.dialogCmp.showAlartDialog('Notification');
          return false;
        }
      }
    }
    return true;
  }

  private validateCRS(): boolean {
    if (AppUtility.isEmpty(this.itemsClientExchangeList) || this.itemsClientExchangeList.itemCount == 0) {
      this.dialogCmp.statusMsg = 'Please add some records in Risk tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }
    return true;
  }

  private validateBeneficiary(): boolean {
    if (AppUtility.isEmpty(this.itemsBeneficiaryList) || this.itemsBeneficiaryList.itemCount == 0) {
      this.dialogCmp.statusMsg = 'Please add some records in Beneficiary tab.';
      this.dialogCmp.showAlartDialog('Notification');
      return false;
    }
    return true;
  }

  private validateAllowedMarkets(): boolean {
    for (let i = 0; i < this.itemsAllowedMarketList.itemCount; i++) {
      for (let j = 0; j < this.itemsAllowedMarketList.items[i].marketList.length; j++) {
        if (this.itemsAllowedMarketList.items[i].marketList[j].selected == true) {
          return true;
        }
      }
    }
    this.dialogCmp.statusMsg = "Please select some Markets from Market tab.";
    this.dialogCmp.showAlartDialog('Notification');

    return false;
  }

  private validateCustodians(): boolean {
    /*if(this.isEditing){
       for (let i = 0; i < this.itemsClientCustodianList.itemCount; i++) {
         for (let j = 0; j < this.itemsClientCustodianList.items[i].participantList.length; j++) {
           if (this.itemsClientCustodianList.items[i].participantList[j].selected == true) {
             return true;
           }
         }
       }

       alert("Please select some Custodians from Custodian.");
       return false;
    }*/
    return true;
  }

  private validateBankAccount(): boolean {
    if (this.isEditing) {
      if (AppUtility.isEmpty(this.itemsBanAccountList) || this.itemsBanAccountList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some account information in Bank tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
    }
    return true;
  }

  private validateDocument(): boolean {
    if (this.isEditing) {
      if (AppUtility.isEmpty(this.itemsDocumentList) || this.itemsDocumentList.itemCount == 0) {
        this.dialogCmp.statusMsg = 'Please add some documents in Document tab.';
        this.dialogCmp.showAlartDialog('Notification');
        return false;
      }
    }
    return true;
  }

  private readFile(file, reader, callback) {
    // Set a callback funtion to fire after the file is fully loaded
    reader.onload = () => {
      // callback with the results
      callback(reader.result);
    }

    // Read the file
    reader.readAsDataURL(file);
  }

  private readFiles(files, index = 0) {
    // Create the file reader
    let reader = new FileReader();

    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // After the callback fires do:
        //this.file_srcs.push(result);
        this.file_srcs[0] = result;
        this.readFiles(files, index + 1);// Read the next file;
      });
    } else {
      // When all files are done This forces a change detection
      //alert("Total files are :: "+this.file_srcs.length);
      this.changeDetectorRef.detectChanges();
    }
  }

  private addFromValidations() {
    this.myForm = this._fb.group({
      searchClientName: [''],
      searchClientCode: [''],
      active: [''],
      commissionSlab: [''],
      levyId: [''],
      accountCategory: ['', Validators.compose([Validators.required])],
      participantBranch: ['', Validators.compose([Validators.required])],
      agent: [''],
      clientCode: ['', Validators.compose([Validators.required])],
      glCode: ['', Validators.compose([Validators.required])],
      coaCode: [''],
      coaDesc: [''],
      
      sendMail: [''],
      proprietaryAccount: [''],
      sendEmail: [''],
      sendSms: [''],
      generateKits: [''],
      onlineClient: [''],
      commissionSlabId: ['', Validators.compose([Validators.required])],
      agentId: ['', Validators.compose([Validators.required])],
      reference: [''],
      depositoryNumber: ['', Validators.compose([Validators.required])],
      risk: ['', Validators.compose([Validators.required])],
      ntnNo: [''],
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      middleName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      fatherHusbandName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      gender: ['', Validators.compose([Validators.required])],
      residenceStatus: ['', Validators.compose([Validators.required])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
      registrationNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],

      issuePlaceId: ['', Validators.compose([Validators.required])],
      idExpDate: [''],
      idIssueDate: [''],

      branchId: ['', Validators.compose([Validators.required])],
      dob: [''],
      professionId: [''],
      countryId: ['', Validators.compose([Validators.required])],
      cityId: ['', Validators.compose([Validators.required])],
      provinceId: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      address2: [''],
      address3: [''],
      postalCode: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternStringPostalCode)])],
      phone1: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      industryId: ['', Validators.compose([Validators.required])],
      companyName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      cellNo: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternNumeric)])],

      userName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],

      password: ['', Validators.compose([Validators.required, PasswordValidators.repeatCharacterRegexRule(4),
      PasswordValidators.alphabeticalCharacterRule(1),
      PasswordValidators.digitCharacterRule(1),
      PasswordValidators.lowercaseCharacterRule(1),
      PasswordValidators.uppercaseCharacterRule(1)])],

      confirmPassword: ['', Validators.compose([Validators.required])],
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternEmail)])],
      activeUser: [''],
      identificationType: ['', Validators.compose([Validators.required])],
      // incomeSource: [''],
      incomeSourcee: ['', Validators.compose([Validators.required])],
      annualGrossIncome: [''],
      incomePercentage: [''],
    });

    this.bankDetailForm = this._fb.group({
      bankId: ['', Validators.compose([Validators.required])],
      branchId: ['', Validators.compose([Validators.required])],
      accountNo: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
    });

    this.beneficiaryForm = this._fb.group({
      relationId: ['', Validators.compose([Validators.required])],
      beneficiaryName: ['', Validators.compose([Validators.required])],
      beneficiaryCNIC: [''],
    });

    this.jointAccountForm = this._fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      middleName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternString)])],
      fatherHusbandName: ['', Validators.compose([Validators.pattern(AppConstants.validatePatternString)])],
      gender: ['', Validators.compose([Validators.required])],
      residenceStatus: ['', Validators.compose([Validators.required])],
      identificationTypeId: ['', Validators.compose([Validators.required])],
      identificationType: ['', Validators.compose([Validators.required])],
      dob: [''],
      professionId: [''],

    });

    this.clientExchangeForm = this._fb.group({
      exchangeId: ['', Validators.compose([Validators.required])],
      active: [''],
      allowShortSell: [''],
      bypassCrs: [''],
      openPositionStatus: [''],
      margin: ['', Validators.compose([Validators.required, Validators.pattern(AppConstants.validatePatternDecimal)])],
    });
    this.documentForm = this._fb.group({
      documentTypeId: ['', Validators.compose([Validators.required])],
      fileUpload: ['', Validators.compose([Validators.required])],
    });


    this.allowedMarketForm = this._fb.group({
      checkBoxId: [''],
    });
    this.clientCustodianForm = this._fb.group({
      checkBoxId: [''],
    });
  }

  public getNotification(btnClicked) {
    if (btnClicked == 'Success') {
      this.onNewAction();
      this.hideModal();
    }
  }

  private populateAccountCategoryList() {

    this.appState.showLoader = true;
    this.listingService.getAccountCategoryList()
      .subscribe(
        restData => {
          this.appState.showLoader = false;
          this.accountCategoryList = restData;
          var accCategory: AccountCategory = new AccountCategory();
          accCategory.accountCategoryId = AppConstants.PLEASE_SELECT_VAL;
          accCategory.name = AppConstants.PLEASE_SELECT_STR;
          this.accountCategoryList.unshift(accCategory);
          console.log("=======================", this.accountCategoryList);
          this.selectedItem.accountCategory.accountCategoryId = this.accountCategoryList[0].accountCategoryId;
        },
        error => {
          this.appState.showLoader = false; this.errorMessage = <any>error.message;
        });
  }

  private onInitPopulate() {


    this.loadLeveisByParticipant();
    this.populateCommissionSlabList();
    this.populateParticipantBranchList();
    this.populateAgentList();
    this.populateExchangeList();
    this.populateRelationList();
    this.populateDocumentTypes();
    this.populateClientControlAccount();
    this.populateAllowedMarkets(null, null);
    this.populateAccountCategoryList();
    this.populateIdentificationTypeList();
    this.populateProfessionList();
    this.populateIndustryList();
    this.populateCountryList();
    this.populateIncomeSourceList();
    this.populateBankList(AppConstants.participantId, true);
    this.addFromValidations();
    this.populateCustodians(null, null);
    this.changePasswordError = undefined;
    this.passwordStrength = 0;
    //populate Custodians
    this.genderList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Male", "code": "M" }, { "name": "Female", "code": "F" }]
    this.residenceStatusList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "Resident Pakistani", "code": "RP" }, { "name": "Resident Foreigner", "code": "RF" }, { "name": "Non Resident Pakistani", "code": "FNRP" }, { "name": "Non Resident Forignor", "code": "FNR" }]
    this.riskList = [{ "name": AppConstants.PLEASE_SELECT_STR, "code": AppConstants.PLEASE_SELECT_VAL }, { "name": "High", "code": "H" }, { "name": "Medium", "code": "M" }, { "name": "Low", "code": "L" }]

    // Populate Bank List in DropDown.

  }
  public beneficiaryMask = (event) => {
    if (event === "" || event === null || event === undefined) {
      this.bCnicValid = true;
      return;
    }
    else {
      this.bCnicValid = AppUtility.validateCNIC(event);
    }
  }
}
