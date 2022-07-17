/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { parentsAccountsList } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { GContextTypes } from '../types';
import { TextFieldLocal } from '../components';
import { GlobalContext } from '../contexts';
import { dublicateAlert, errorAlert } from '../Shared';
import { errorAlertMsg, getReturnItem, successAlert } from '../Shared/helpers';
import { getNewCashCode } from '../common/accounts';

export const accountClasses = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      height: '50vh',
      width: '60vh',
    },
    margin: {
      margin: 8,
      height: 36,
      width: 100,
    },
    formControl: {
      margin: theme.spacing(1),
    },

    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

const accountSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
});

export const accountResolver = { resolver: yupResolver(accountSchema) };

const PopupAccountExpenses = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  theme,
  name,
  setNewValue,
  accounts,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [range, setRange] = useState<any>({});
  const [code, setCode] = useState(0);

  const { register, handleSubmit, errors, reset } = useForm(accountResolver);
  const parentvalue = parentsAccountsList[0];

  const {
    store: { user },
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    const rng = { min: 10500, max: 10999 };
    setRange(rng);
    if (isNew) {
      const newcode = getNewCashCode(accounts, rng);
      setCode(newcode);
    }
  }, [open]);

  const onSubmit = async (data: any) => {
    if (code > range.max || code < range.min) {
      await errorAlertMsg(
        setAlrt,
        isRTL ? 'رقم الحساب خارج النطاق' : 'Code range issue'
      );
      return;
    }
    setSaving(true);
    const name = data.name.trim();
    const branch = user.branch;
    const variables: any = {
      branch,
      code,
      name,
      nameAr: name,
      canedit: true,
      ...parentvalue,
    };
    const mutate = addAction;
    const mutateName = 'createAccount';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, name);
      await successAlert(setAlrt, isRTL);
      setSaving(false);
      closeForm();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      console.log(error);
    }
  };

  const resetAll = () => {
    setSaving(false);
    setRange({});
    setCode(0);
    reset();
  };

  const closeForm = () => {
    resetAll();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL ? 'اضافة حساب' : 'New Account';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeForm}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
      mb={50}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <TextFieldLocal
            required
            autoFocus
            name="name"
            label={words.name}
            register={register}
            errors={errors}
            row={row}
            fullWidth
          />
          <TextFieldLocal
            required
            name="code"
            label={isRTL ? 'كود الحساب' : 'Code'}
            value={code}
            onChange={(e: any) => setCode(Number(e.target.value))}
            row={row}
            disabled={row && row.parentcode ? true : false}
            type="number"
            fullWidth
            mb={5}
          />
          {range && range?.min && isNew && (
            <Typography>
              {range.min} - {range.max}
            </Typography>
          )}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAccountExpenses;
