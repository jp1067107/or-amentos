export type CategoryName = 'Custos fixos' | 'Conforto' | 'Metas' | 'Prazeres' | 'Liberdade financeira' | 'Conhecimento';

export interface CategoryInfo {
  name: CategoryName;
  color: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  value: number;
}

export interface AutoFillItem {
  id: string;
  name: string;
  defaultVal: number;
}

export interface BudgetData {
  income: number;
  expenses: Record<CategoryName, number>;
  expenseItems: Record<CategoryName, ExpenseItem[]>;
  goals: Record<CategoryName, number>;
  autoFill: Record<CategoryName, AutoFillItem[]>;
  month: string;
}
