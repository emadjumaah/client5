/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCategories, useDepartments, useBrands } from '../hooks';
import {
  successAlert,
  dublicateAlert,
  errorAlert,
  getReturnItem,
  yup,
} from '../Shared';
import PopupDeprtment from './PopupDeprtment';
import PopupCategory from './PopupCategory';
import { GContextTypes } from '../types';
import { GlobalContext } from '../contexts';
import { PopupBrand } from '.';
import PopupLayout from '../pages/main/PopupLayout';
import { Grid } from '@material-ui/core';
import { TextFieldLocal } from '../components';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';

const PopupNSProduct = ({
  open,
  onClose,
  row,
  isNew,
  setNewValue,
  addAction,
  editAction,
  newtext,
  theme,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: '', type: undefined });

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [departError, setDepartError] = useState<any>(false);
  const [openDepart, setOpenDepart] = useState<any>(false);
  const departRef: any = React.useRef();

  const [brndvalue, setBrndvalue] = useState<any>(null);
  const [brndError, setBrndError] = useState<any>(false);
  const [openBrnd, setOpenBrnd] = useState<any>(false);
  const brndRef: any = React.useRef();

  const [catvalue, setCatvalue] = useState<any>(null);
  const [catError, setCatError] = useState<any>(false);
  const [openCat, setOpenCat] = useState<any>(false);
  const catRef: any = React.useRef();

  const { register, handleSubmit, errors, reset } = useForm(yup.itmResolver);
  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const { departments, addDepartment, editDepartment } = useDepartments();
  const { brands, addBrand, editBrand } = useBrands();
  const { categories, addCategory, editCategory } = useCategories();

  useEffect(() => {
    if (row && row._id) {
      const depId = row.departmentId;
      const brndId = row.brandId;
      const catId = row.categoryId;
      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (brndId) {
        const brnd = brands.filter((emp: any) => emp._id === brndId)[0];
        setBrndvalue(brnd);
      }
      if (catId) {
        const cat = categories.filter((ca: any) => ca._id === catId)[0];
        setCatvalue(cat);
      }
    }
  }, [row]);

  const resetAll = () => {
    reset();
    setDepartvalue(null);
    setBrndvalue(null);
    setCatvalue(null);
    setDepartError(false);
    setCatError(false);
  };

  const closeDepartment = () => {
    setOpenDepart(false);
  };

  const closeBrand = () => {
    setOpenBrnd(false);
  };

  const closeCategory = () => {
    setOpenCat(false);
  };

  const onDepartFieldChange = (nextValue: any) => {
    setDepartvalue(nextValue);
  };
  const onBrndFieldChange = (nextValue: any) => {
    setBrndvalue(nextValue);
  };
  const onCatFieldChange = (nextValue: any) => {
    setCatvalue(nextValue);
  };

  const onSubmit = async (data: any) => {
    if (!catvalue) {
      setCatError(true);
      catRef.current.focus();
      return;
    }
    setSaving(true);
    const name = data.name.trim();
    const nameAr = data.nameAr.trim();
    const cost = data.cost;
    const price = data.price;
    const barcode = data.barcode;

    const category = catvalue
      ? {
          categoryId: catvalue._id,
          categoryName: catvalue.name,
          categoryNameAr: catvalue.nameAr,
        }
      : {
          categoryId: undefined,
          categoryName: undefined,
          categoryNameAr: undefined,
        };
    const brand = brndvalue
      ? {
          brandId: brndvalue._id,
          brandName: brndvalue.name,
          brandNameAr: brndvalue.nameAr,
        }
      : {
          brandId: undefined,
          brandName: undefined,
          brandNameAr: undefined,
        };
    const department = departvalue
      ? {
          departmentId: departvalue._id,
          departmentName: departvalue.name,
          departmentNameAr: departvalue.nameAr,
          departmentColor: departvalue.color,
        }
      : {
          departmentId: undefined,
          departmentName: undefined,
          departmentNameAr: undefined,
          departmentColor: undefined,
        };

    const variables: any = {
      _id: row && row._id ? row._id : undefined, // is it new or edit
      itemType: 3,
      barcode,
      name,
      nameAr,
      cost: Number(cost),
      price: Number(price),
      department,
      brand,
      category,
      branch: user.branch,
      userId: user._id,
    };
    const mutate = isNew ? addAction : editAction;
    const mutateName = isNew ? 'createItem' : 'updateItem';
    apply(mutate, mutateName, variables);
  };

  const apply = async (mutate: any, mutateName: string, variables: any) => {
    try {
      const res = await mutate({ variables });
      const nitem = getReturnItem(res, mutateName);
      if (setNewValue && nitem) setNewValue(nitem, 'item');
      setSaving(false);
      await successAlert(setAlrt, isRTL);
      closeModal();
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

  const closeModal = () => {
    resetAll();
    onClose();
    setSaving(false);
  };

  const onHandleSubmit = () => {
    handleSubmit(onSubmit)();
  };
  const title = isRTL
    ? isNew
      ? 'منتج جدبد'
      : 'تعديل منتج'
    : isNew
    ? 'New Product'
    : 'Edit Product';

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={closeModal}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={alrt}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <TextFieldLocal
            autoFocus
            name="barcode"
            label={'Barcode'}
            register={register}
            errors={errors}
            row={row}
            fullWidth
          />
          {isRTL && (
            <React.Fragment>
              <TextFieldLocal
                required
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
                ltr
                label={words.nameEn}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
                fullWidth
              />
            </React.Fragment>
          )}
          {!isRTL && (
            <React.Fragment>
              <TextFieldLocal
                required
                name="name"
                ltr
                label={words.name}
                register={register}
                errors={errors}
                row={row}
                newtext={newtext}
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
          <TextFieldLocal
            required
            name="cost"
            label={words.cost}
            register={register}
            errors={errors}
            type="number"
            row={row}
            fullWidth
          />
          <TextFieldLocal
            required
            name="price"
            label={words.price}
            register={register}
            errors={errors}
            type="number"
            row={row}
            fullWidth
          />
          <AutoFieldLocal
            name="category"
            title={words.category}
            words={words}
            options={categories}
            value={catvalue}
            setSelectValue={setCatvalue}
            setSelectError={setCatError}
            selectError={catError}
            refernce={catRef}
            register={register}
            // openAdd={openCategory}
            isRTL={isRTL}
            mb={20}
          ></AutoFieldLocal>

          <AutoFieldLocal
            name="brand"
            title={words.brand}
            words={words}
            options={brands}
            value={brndvalue}
            setSelectValue={setBrndvalue}
            setSelectError={setBrndError}
            selectError={brndError}
            refernce={brndRef}
            register={register}
            // openAdd={openBrand}
            isRTL={isRTL}
          ></AutoFieldLocal>
          <AutoFieldLocal
            name="department"
            title={words.department}
            words={words}
            options={departments.filter((d: any) => d.depType === 1)}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepartError}
            selectError={departError}
            refernce={departRef}
            register={register}
            // openAdd={openDepartment}
            isRTL={isRTL}
            mb={20}
          ></AutoFieldLocal>
          <PopupDeprtment
            open={openDepart}
            onClose={closeDepartment}
            isNew={true}
            setNewValue={onDepartFieldChange}
            row={null}
            addAction={addDepartment}
            editAction={editDepartment}
            depType={1}
          ></PopupDeprtment>
          <PopupBrand
            open={openBrnd}
            onClose={closeBrand}
            isNew={true}
            setNewValue={onBrndFieldChange}
            row={null}
            addAction={addBrand}
            editAction={editBrand}
          ></PopupBrand>
          <PopupCategory
            open={openCat}
            onClose={closeCategory}
            isNew={true}
            setNewValue={onCatFieldChange}
            row={null}
            addAction={addCategory}
            editAction={editCategory}
          ></PopupCategory>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupNSProduct;
