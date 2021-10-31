/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { departmentClasses } from '../themes';
import {
  CloseCancel,
  AlertMsg,
  successAlert,
  dublicateAlert,
  errorAlert,
  getReturnItem,
  yup,
  PopupTitle,
  PopupDialog,
  PopupDialogContent,
  PopupTextField,
} from '../Shared';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';

const PopupCompany = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
}: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });
  const { register, handleSubmit, errors, reset } = useForm(yup.custResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);
  const classes = departmentClasses();

  const onSubmit = async (data: any) => {
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const { phone, email } = data;
    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      name,
      nameAr,
      phone,
      email,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createCustomer' : 'updateCustomer';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'customer');
      reset();
      await successAlert(setAlrt, isRTL);
      onClose();
    } catch (error) {
      onError(error);
    }
  };

  const onError = async (error: any) => {
    if (error.message.includes('duplicate')) {
      await dublicateAlert(setAlrt, isRTL);
    } else {
      await errorAlert(setAlrt, isRTL);
      reset();
      console.log(error);
    }
  };

  return (
    <PopupDialog
      open={open}
      onClose={onClose}
      maxWidth={'md'}
      classes={classes}
    >
      <div dir={isRTL ? 'rtl' : undefined} style={{ padding: 20 }}>
        {alrt.show && <AlertMsg type={alrt.type} msg={alrt.msg}></AlertMsg>}
        <PopupTitle title={words.customer} />
        <PopupDialogContent>
          <PopupTextField
            autoFocus
            required
            name="name"
            ltr
            label={words.customerName}
            register={register}
            errors={errors}
            row={row}
          />
          <PopupTextField
            required
            name="nameAr"
            label={words.customerNameAr}
            register={register}
            errors={errors}
            row={row}
          />
          <PopupTextField
            required
            name="phone"
            label={words.phoneNumber}
            register={register}
            errors={errors}
            row={row}
            newtext={newtext}
          />
          <PopupTextField
            name="email"
            label={words.email}
            register={register}
            errors={errors}
            row={row}
          />
        </PopupDialogContent>
        <CloseCancel
          classes={classes}
          handleSubmit={handleSubmit}
          words={words}
          onClose={onClose}
          isRTL={isRTL}
          onSubmit={onSubmit}
        ></CloseCancel>
      </div>
    </PopupDialog>
  );
};

export default PopupCompany;
