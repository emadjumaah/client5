/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { parentsAccountsList } from "../constants/kaid";
import useBranches from "../hooks/useBranches";
import PopupLayout from "../pages/main/PopupLayout";
import { GContextTypes } from "../types";
import { TextFieldLocal } from "../components";
import AutoFieldLocal from "../components/fields/AutoFieldLocal";
import { GlobalContext } from "../contexts";
import { dublicateAlert, errorAlert } from "../Shared";
import { getAccountCodeRange, getNewCode } from "../common/accounts";
import { errorAlertMsg } from "../Shared/helpers";

export const accountClasses = makeStyles((theme: Theme) =>
  createStyles({
    popup: {
      height: "50vh",
      width: "60vh",
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
  nameAr: yup.string(),
});
const accountEditSchema = yup.object().shape({
  name: yup.string().required().min(3).max(100),
  nameAr: yup.string(),
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
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [parentvalue, setParentvalue] = useState<any>(null);
  const [parentError, setParentError] = useState<any>(false);
  const parentRef: any = React.useRef();

  const [branchvalue, setBranchvalue] = useState<any>(null);

  const [filteredParents, setFilteredParents] = useState([]);
  const [range, setRange] = useState<any>({});
  const [code, setCode] = useState(0);

  const { register, handleSubmit, errors, reset } = useForm(
    isNew ? accountResolver : accountEditResolver
  );

  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const { branches } = useBranches();

  useEffect(() => {
    setBranchvalue(branches[0]);
  }, [open]);

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
      const branch = branches.filter(
        (pra: any) => pra.basename === row.branch
      )[0];
      setParentvalue(parent);
      setBranchvalue(branch);
      setCode(row.code);
    }
  }, [row]);

  useEffect(() => {
    if (branchvalue) {
      setFilteredParents(parentsAccountsList);
    } else {
      setFilteredParents([]);
    }
  }, [branchvalue]);

  const onSubmit = async (data: any) => {
    if (!parentvalue) {
      setParentError(true);
      parentRef.current.focus();
      return;
    }
    if (code > range.max || code < range.min) {
      await errorAlertMsg(
        setAlrt,
        isRTL ? "رقم الحساب خارج النطاق" : "Code range issue"
      );
      return;
    }
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const branch = branchvalue.basename;
    const variables: any = {
      _id: row._id ? row._id : undefined, // is it new or edit
      branch,
      code,
      name,
      nameAr,
      canedit: row._id ? undefined : true,
      ...parentvalue,
    };
    const mutate = isNew ? addAction : editAction;
    apply(mutate, variables);
  };

  const apply = async (mutate: any, variables: any) => {
    try {
      await mutate({ variables });
      setSaving(false);
      closeForm();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes("duplicate")) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      console.log(error);
    }
  };

  const resetAll = () => {
    setParentvalue(null);
    setParentError(false);
    setBranchvalue(null);
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
  const title = isRTL
    ? isNew
      ? "اضافة حساب"
      : "تعديل بيانات حساب"
    : isNew
    ? "New Account"
    : "Edit Account";

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
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <AutoFieldLocal
            name="parent"
            nolabel
            title={isRTL ? "الحساب الرئيسي" : "Main Account"}
            basename="parent"
            options={filteredParents}
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
          {range && range?.min && isNew && (
            <Typography>
              {range.min} - {range.max}
            </Typography>
          )}
          <TextFieldLocal
            required
            name="code"
            label={isRTL ? "كود الحساب" : "Code"}
            value={code}
            onChange={(e: any) => setCode(e.target.value)}
            row={row}
            disabled={row && row.parentcode ? true : false}
            type="number"
            fullWidth
          />
          {isRTL && (
            <React.Fragment>
              <TextFieldLocal
                required
                autoFocus
                name="nameAr"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                fullWidth
              />
              <TextFieldLocal
                required
                name="name"
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                // newtext={newtext}
                fullWidth
              />
            </React.Fragment>
          )}
          {!isRTL && (
            <React.Fragment>
              <TextFieldLocal
                autoFocus
                required
                name="name"
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                // newtext={newtext}
                fullWidth
              />
              <TextFieldLocal
                required
                name="nameAr"
                label={words.nameAr}
                register={register}
                errors={errors}
                row={row}
                fullWidth
              />
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAccount;
