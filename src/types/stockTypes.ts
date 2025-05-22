// NOTE: the fields are converted to camelCase with camelcaseKeys

export type Stock = {
  id: number;
  name: string;
  price: number;
};

export type History = {
  day: number;
  userName: string;
  holdings: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]; // 固定長度 10
  cash: number;
};

export type APIResponse = {
  stocks: Stock[];
  histories: History[];
};
