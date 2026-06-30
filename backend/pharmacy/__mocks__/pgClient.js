// Manual mock for pharmacy/pgClient.js — ESM-compatible (no jest global)
import { jest } from "@jest/globals";

const makeModel = () => ({
  findMany:   jest.fn(),
  findUnique: jest.fn(),
  findFirst:  jest.fn(),
  create:     jest.fn(),
  update:     jest.fn(),
  delete:     jest.fn(),
  deleteMany: jest.fn(),
  count:      jest.fn(),
  upsert:     jest.fn(),
});

const prismaMock = {
  category:     makeModel(),
  medicine:     makeModel(),
  cartItem:     makeModel(),
  order:        makeModel(),
  orderItem:    makeModel(),
  prescription: makeModel(),

  $transaction: jest.fn((arg) => {
    if (typeof arg === "function") return arg(prismaMock);
    if (Array.isArray(arg))        return Promise.all(arg);
    return Promise.resolve();
  }),

  $queryRaw:   jest.fn(),
  $executeRaw: jest.fn(),
  $connect:    jest.fn(),
  $disconnect: jest.fn(),
};

export const connectPharmacyDB = jest.fn().mockResolvedValue(undefined);
export default prismaMock;
