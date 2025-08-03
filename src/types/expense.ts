export type ExpenseItem = {
  type: string;
  amount: string;
  description: string;
  attachment: File | null;
};

export type ExpenseForm = {
  customerCompany: string;
  visitDate: Date;
  expenseItems: ExpenseItem[];
};

export type ExpenseObject = {
  UnqSirId: number;
  AccountMasterId: string;
  ExpDate: string;
  CustomerName: string;
  ExpType: string;
  ExpDesc: string;
  ExpAmount: number;
  ExpImage: string;
  DBName: string;
  Status: string | null;
  Entrydatetime: string;
}; 