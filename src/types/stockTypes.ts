// NOTE: the fields are converted to camelCase with camelcaseKeys

export type Stock = {
  id: number;
  name: string;
  price: number;
};

export type Holding = {
  stockId: number;
  stockName: string;
  count: number;
};

export type History = {
  day: number;
  userName: string;
  holdings: Holding[];
  cash: number;
};

export type APIResponse = {
  stocks: Stock[];
  histories: History[];
};
