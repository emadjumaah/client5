/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { accountCodes } from "../constants/kaid";

export const getAccountCodeRange = (acc: any) => {
  const parentcode = acc.parentcode;
  if (parentcode) {
    return accountCodes[parentcode];
  }
};

export const getAccountsNumbers = (parentvalue: any, accounts: any) => {
  const { parentcode } = parentvalue;
  const filteredaccounts = accounts.filter(
    (acc: any) => parentcode === acc.parentcode
  );
  const codes = filteredaccounts.map((fc: any) => fc.code);
  return codes;
};

export const getValidCode = (codes: any[], range: any) => {
  const len = range.max + 1 - range.min;
  const arr = Array.from(Array(len), (_, i) => i + range.min);
  const code = arr.find((item: any) => !codes.includes(item));
  return code;
};

export const getNewCode = (parentvalue: any, accounts: any, range: any) => {
  const codes = getAccountsNumbers(parentvalue, accounts);
  const newcode = getValidCode(codes, range);
  return newcode;
};
