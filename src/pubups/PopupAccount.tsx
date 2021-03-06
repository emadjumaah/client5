/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { parentsAccountsList } from '../constants/kaid';
import PopupLayout from '../pages/main/PopupLayout';
import { GContextTypes } from '../types';
import { TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';
import { GlobalContext } from '../contexts';
import { dublicateAlert, errorAlert } from '../Shared';
import { getAccountCodeRange, getNewCode } from '../common/accounts';
import { errorAlertMsg, successAlert } from '../Shared/helpers';

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
const accountEditSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
});
export const accountResolver = { resolver: yupResolver(accountSchema) };
export const accountEditResolver = { resolver: yupResolver(accountEditSchema) };

const PopupAccount = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  accounts,
  emplnoaccount,
  addNewEmployeeAccount,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const [parentvalue, setParentvalue] = useState<any>(null);
  const [parentError, setParentError] = useState<any>(false);
  const parentRef: any = React.useRef();

  const [range, setRange] = useState<any>({});
  const [code, setCode] = useState(0);

  const [isEmployee, setisEmployee] = useState(false);
  const [emplvalue, setEmplvalue] = useState<any>(null);

  const { register, handleSubmit, errors, reset } = useForm(
    !isEmployee ? (isNew ? accountResolver : accountEditResolver) : {}
  );

  const {
    store: { user },
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (parentvalue) {
      const rng = getAccountCodeRange(parentvalue);
      setRange(rng);
      if (isNew) {
        const newcode = getNewCode(parentvalue, accounts, rng);
        setCode(newcode);
      }
    } else {
      setCode(0);
    }
  }, [parentvalue]);

  useEffect(() => {
    if (row && row.parentcode) {
      const { parentcode } = row;
      const parent = parentsAccountsList.filter(
        (par: any) => par.parentcode === parentcode
      )[0];
      setParentvalue(parent);
      setCode(row.code);
    }
  }, [row]);

  const onSubmit = async (data: any) => {
    if (!isEmployee && !parentvalue) {
      setParentError(true);
      parentRef.current.focus();
      return;
    }
    if (!isEmployee && isNew && (code > range.max || code < range.min)) {
      await errorAlertMsg(
        setAlrt,
        isRTL ? '?????? ???????????? ???????? ????????????' : 'Code range issue'
      );
      return;
    }
    if (isEmployee && !emplvalue) {
      await errorAlertMsg(setAlrt, 'You have to choose an Employee');
      return;
    }
    setSaving(true);

    if (isEmployee) {
      const variables: any = { employeeId: emplvalue?._id };
      const mutate = addNewEmployeeAccount;
      apply(mutate, variables);
    } else {
      const name = data.name.trim();
      const nameAr = !isNew ? data.nameAr.trim() : name;
      const branch = user.branch;
      const variables: any = {
        _id: row?._id ? row?._id : undefined, // is it new or edit
        branch,
        code,
        name,
        nameAr,
        canedit: row?._id ? undefined : true,
        ...parentvalue,
      };
      const mutate = isNew ? addAction : editAction;
      apply(mutate, variables);
    }
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
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
    setParentvalue(null);
    setParentError(false);
    setSaving(false);
    setRange({});
    setCode(0);
    reset();
    setisEmployee(false);
    setEmplvalue(null);
  };

  const closeForm = () => {
    resetAll();
    onClose();
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL
    ? isNew
      ? '?????????? ????????'
      : '?????????? ???????????? ????????'
    : isNew
    ? 'New Account'
    : 'Edit Account';
  const empl = isRTL ? '???????? ????????' : 'Employee Custody';

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
      minWidth="md"
    >
      <Grid container spacing={2} style={{ minWidth: 450, minHeight: 255 }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          {isNew && (
            <FormControlLabel
              style={{ marginBottom: 15 }}
              control={
                <Checkbox
                  checked={isEmployee}
                  onChange={() => {
                    setisEmployee(!isEmployee);
                    setParentvalue(null);
                  }}
                  name={'isEmployee'}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                  {empl}
                </Typography>
              }
            />
          )}
          {isEmployee && (
            <AutoFieldLocal
              name="employee"
              title={words.employee}
              words={words}
              options={emplnoaccount}
              value={emplvalue}
              setSelectValue={setEmplvalue}
              noPlus
              isRTL={isRTL}
              fullWidth
            ></AutoFieldLocal>
          )}
          {!isEmployee && (
            <>
              <AutoFieldLocal
                name="parent"
                nolabel
                title={isRTL ? '???????????? ??????????????' : 'Main Account'}
                basename="parent"
                options={parentsAccountsList}
                value={parentvalue}
                setSelectValue={setParentvalue}
                setSelectError={setParentError}
                selectError={parentError}
                refernce={parentRef}
                register={register}
                disabled={row && row.parentcode ? true : false}
                isRTL={isRTL}
                fullWidth
              ></AutoFieldLocal>
              {parentvalue && range && range?.min && isNew && (
                <Typography>
                  {range.min} - {range.max}
                </Typography>
              )}
              <TextFieldLocal
                required
                name="code"
                label={isRTL ? '?????? ????????????' : 'Code'}
                value={code}
                onChange={(e: any) => setCode(Number(e.target.value))}
                row={row}
                disabled={row && row.parentcode ? true : false}
                type="number"
                fullWidth
              />
              <TextFieldLocal
                required
                name="name"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                fullWidth
                mb={10}
              />
              {!isNew && (
                <TextFieldLocal
                  required
                  name="nameAr"
                  label={words.nameAr}
                  register={register}
                  errors={errors}
                  row={row}
                  fullWidth
                  mb={0}
                />
              )}
            </>
          )}
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAccount;
