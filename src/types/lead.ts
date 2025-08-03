export type LeadInsertData = {
  currency: string;
  documentDate: Date;
  customerCompanyName: string;
  contactPerson: string;
  designation: string;
  mobileNo: string;
  address: string;
  emailId: string;
  product: string;
  leadSource: string;
  competition: string;
  timeFrame: string;
  leadRemindDate: Date;
  customerApplication: string;
  customerExistingMachine: string;
  leadNote: string;
  attachments: Array<{ uri: string; mimeType: string; name: string }>;
};

export type LeadUpdateData = {
  currency: string;
  customerCompanyName: string;
  contactPerson: string;
  designation: string;
  mobileNo: string;
  address: string;
  emailId: string;
  product: string;
  leadSource: string;
  competition: string;
  timeFrame: string;
  leadRemindDate: Date;
  customerApplication: string;
  customerExistingMachine: string;
  leadNote: string;
};

export type LeadData = {
  DocumentDate: string;
  DocumentNo: number;
  CategoryName: string;
  CurrencyName: string;
  UserName: string;
  UserCode: string;
  ReferenceTransaction_2361UDFId: number;
  ReferenceTransaction_2361Id: number;
  UDF_CompanyName_2361: string;
  UDF_ContactPerson_2361: string;
  UDF_Designation_2361: string;
  UDF_MobileNo_2361: string;
  UDF_CustomerAdd_2361: string;
  UDF_EmailId_2361: string;
  UDF_Product_2361: string;
  UDF_LeadSource_2361: string;
  UDF_CompetitionWith_2361: string;
  UDF_TimeFrame_2361: string;
  UDF_LeadRemindDate_2361: Date;
  UDF_CustomerApplication_2361: string;
  UDF_CustomerExistingMachine_2361: string;
  UDF_LeadNotes_2361: string;
  UDF_InquiryStatus_2361: number;
  ImageName: string;
  UDF_Year_0: number;
  UDF_Month_0: number;
  UDF_Category_0: string;
};

export type LeadFilterData = {
  UserIdentification: string;
  UserCode: string;
  CategoryName: string;
};

export type LeadReminderData = {
  UserIdentification: string;
  UserCode: string;
  ReferenceTransaction_2361FollowupId: number;
  NextVisitDateTime: Date;
  FollowupStatus: string;
  FollowupDateTime: Date;
  FollowupDetails: string;
  CloseReason: string;
  ModeofContact: string;
  DetailDescription: string;
  VisitTo: string;
  LeadId: number;
  CompanyName: string;
};

export type LeadUpdate = {
  ReferenceTransaction_2361FollowupId: number;
  ReferenceTransaction_2361Id: number;
  NextVisitDateTime: Date;
  FollowupStatus: string;
  FollowupDateTime: Date;
  FollowupDetails: string;
  CloseReason: string;
  ModeofContact: string;
  DetailDescription: string;
  VisitTo: string;
  VisitorPerson: string;
  EntryDateTime: Date;
};

export type LeadUpdateInsert = {
  ReferenceTransactionId: number;
  NextVisitDateTime: Date;
  FollowupStatus: string;
  FollowupDetails: string;
  FollowupDateTime: Date;
  CloseReason: string;
  ModeOfContact: string;
  DetailDescription: string;
  VisitTo: string;
  VisitorPerson: string;
}; 