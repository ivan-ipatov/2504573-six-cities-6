import { ParamsDictionary } from 'express-serve-static-core';

export type LimitRequestParam = {
  limit: string;
} | ParamsDictionary;
