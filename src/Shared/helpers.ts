/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export function sleep(s: any) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

type AT = 'success' | 'info' | 'warning' | 'error' | undefined;
interface ShowAType {
  setAlrt: any;
  msg: string;
  type: AT;
  s?: number;
}

export const showAlert = async ({ setAlrt, msg, type, s = 2 }: ShowAType) => {
  setAlrt({ show: true, msg, type });
  await sleep(s);
  setAlrt({ show: false, msg: '', type: 'info' });
};

export const successAlert = async (setAlrt: any, isRTL: any) => {
  await showAlert({
    setAlrt,
    msg: isRTL ? 'تمت الاضافة بنجاح' : 'item added successfuly',
    type: 'success',
    s: 0.25,
  });
};
export const successAlert2S = async (setAlrt: any, isRTL: any) => {
  await showAlert({
    setAlrt,
    msg: isRTL ? 'تمت الاضافة بنجاح' : 'item added successfuly',
    type: 'success',
    s: 2,
  });
};

export const dublicateAlert = async (setAlrt: any, isRTL: any) => {
  showAlert({
    setAlrt,
    msg: isRTL ? 'خطأ - هذا المدخل موجود من قبل' : 'Error, Item already exist',
    type: 'error',
  });
};

export const errorAlert = async (setAlrt: any, isRTL: any) => {
  await showAlert({
    setAlrt,
    msg: isRTL ? 'خطأ - حدث خطأ في العملية' : 'Error on operation',
    type: 'error',
    s: 2,
  });
};
export const errorAlertMsg = async (setAlrt: any, msg: any) => {
  await showAlert({
    setAlrt,
    msg,
    type: 'error',
    s: 2,
  });
};

export const errorAccountAlert = async (setAlrt: any, isRTL: any) => {
  await showAlert({
    setAlrt,
    msg: isRTL ? 'خطأ - لا يمكن حذف هذا الحساب' : 'Error on operation',
    type: 'error',
    s: 2,
  });
};

export const errorDeleteAlert = async (setAlrt: any, isRTL: any) => {
  await showAlert({
    setAlrt,
    msg: isRTL
      ? 'لا يمكن حذف هذا المدخل - لديه ارتباطات'
      : "Can't Delete this Item, it has related",
    type: 'error',
    s: 2,
  });
};

export const messageAlert = async (setAlrt: any, msg: any) => {
  await showAlert({
    setAlrt,
    msg,
    type: 'error',
    s: 2,
  });
};
export const messageShow = async (setAlrt: any, msg: any) => {
  await showAlert({
    setAlrt,
    msg,
    type: 'success',
    s: 2,
  });
};

export const getReturnItem = (res: any, mutation: string) => {
  return res?.data?.[mutation]?.ok ? JSON.parse(res.data[mutation].data) : null;
};

export const colorShade = (color: any, percent: any) => {
  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = ((num >> 8) & 0x00ff) + amt,
    G = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

export const getCashBankPetty = (accounts: any) => {
  const fpetty = accounts.filter((acc: any) => acc.code === 1070);
  const fcash = accounts.filter((acc: any) => acc.code === 1000);
  const fbank = accounts.filter((acc: any) => acc.code === 1020);
  const cash = fcash?.[0];
  const bank = fbank?.[0];
  const petty = fpetty?.[0];
  return { cash, bank, petty };
};
