import { CategoryInfo, BudgetData } from './types';

export const CATEGORY_INFO: CategoryInfo[] = [
  { name: 'Custos fixos', color: '#3b82f6' }, // blue-500
  { name: 'Conforto', color: '#10b981' }, // emerald-500
  { name: 'Metas', color: '#eab308' }, // yellow-500
  { name: 'Prazeres', color: '#a855f7' }, // purple-500
  { name: 'Liberdade financeira', color: '#ef4444' }, // red-500
  { name: 'Conhecimento', color: '#f97316' }, // orange-500
];

export const DEFAULT_GOALS = {
  'Custos fixos': 30,
  'Conforto': 10,
  'Metas': 20,
  'Prazeres': 10,
  'Liberdade financeira': 25,
  'Conhecimento': 5,
};

export const DEFAULT_BUDGET: BudgetData = {
  income: 5331,
  expenses: {
    'Custos fixos': 1599.3,
    'Conforto': 799.7,
    'Metas': 799.7,
    'Prazeres': 533.1,
    'Liberdade financeira': 1332.83,
    'Conhecimento': 266.55,
  },
  expenseItems: {
    'Custos fixos': [{ id: '1', name: 'Aluguel', value: 1200 }, { id: '2', name: 'Contas', value: 399.3 }],
    'Conforto': [{ id: '3', name: 'Assinaturas', value: 99.7 }, { id: '4', name: 'Delivery', value: 700 }],
    'Metas': [{ id: '5', name: 'Viagem', value: 799.7 }],
    'Prazeres': [{ id: '6', name: 'Saídas', value: 533.1 }],
    'Liberdade financeira': [{ id: '7', name: 'Investimentos', value: 1332.83 }],
    'Conhecimento': [{ id: '8', name: 'Cursos', value: 266.55 }],
  },
  autoFill: {
    'Custos fixos': [
      { id: 'af1', name: 'Aluguel', defaultVal: 1200 },
      { id: 'af2', name: 'Plano de Saúde', defaultVal: 300 },
      { id: 'af3', name: 'Energia', defaultVal: 155.5 },
    ],
    'Conforto': [
      { id: 'af4', name: 'Streaming', defaultVal: 50 },
      { id: 'af5', name: 'Delivery', defaultVal: 150 },
    ],
    'Metas': [
      { id: 'af6', name: 'Viagem', defaultVal: 200 },
    ],
    'Prazeres': [
      { id: 'af7', name: 'Saídas', defaultVal: 100 },
    ],
    'Liberdade financeira': [
      { id: 'af8', name: 'Tesouro Selic', defaultVal: 500 },
    ],
    'Conhecimento': [
      { id: 'af9', name: 'Livros', defaultVal: 50 },
      { id: 'af10', name: 'Cursos', defaultVal: 100 },
    ]
  },
  goals: DEFAULT_GOALS,
  month: 'Maio/2024',
};
