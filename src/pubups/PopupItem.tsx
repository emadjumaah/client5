/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import { Box, Fab, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Autocomplete } from '@material-ui/lab';
import OptionItemData from '../Shared/OptionItemData';
import { yup } from '../constants';
import AutoField from '../Shared/AutoField';
import { itemClasses } from '../themes/classes';
import { useExpenseItems, useTemplate } from '../hooks';
import { PopupDialog } from '../Shared';
import useDepartmentsDown from '../hooks/useDepartmentsDown';
import useEmployeesDown from '../hooks/useEmployeesDown';
import useResoursesDown from '../hooks/useResoursesDown';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

const PopupItem = ({
  open,
  onClose,
  row,
  editAction,
  isRTL,
  words,
  user,
}: any) => {
  const classes = itemClasses();
  const [itemError, setItemError] = useState<any>(false);

  const [itemvalue, setItemvalue] = useState<any>(null);
  const [itemqty, setItemqty] = useState(1);
  const [itemprice, setItemprice] = useState(0);

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [resovalue, setResovalue] = useState<any>(null);
  const [resoError, setResoError] = useState<any>(false);
  const resoRef: any = React.useRef();

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [depError, setDepError] = useState<any>(false);
  const departRef: any = React.useRef();

  const { register, handleSubmit, errors } = useForm(yup.invItemResolver);

  const { departments } = useDepartmentsDown();
  const { expenseItems } = useExpenseItems();
  const { employees } = useEmployeesDown();
  const { resourses } = useResoursesDown();
  const { tempoptions, tempwords } = useTemplate();

  const itemRef: any = React.useRef();

  useEffect(() => {
    if (row && row._id) {
      setItemprice(row.itemprice);
      setItemqty(row.itemqty);
      const servId = row._id;
      const depId = row.departmentId;
      const empId = row.employeeId;
      const resId = row.resourseId;

      if (depId) {
        const depart = departments.filter((dep: any) => dep._id === depId)[0];
        setDepartvalue(depart);
      }
      if (empId) {
        const empl = employees.filter((emp: any) => emp._id === empId)[0];
        setEmplvalue(empl);
      }
      if (resId) {
        const empl = resourses.filter((emp: any) => emp._id === resId)[0];
        setResovalue(empl);
      }
      if (servId) {
        const serv = expenseItems.filter((se: any) => se._id === servId)[0];
        setItemvalue(serv);
      }
    }
  }, [open]);

  const resetAll = () => {
    setItemprice(0);
    setItemqty(1);
    setItemvalue(null);
    setEmplvalue(null);
  };

  const editLocalItem = () => {
    if (!itemvalue) {
      setItemError(true);
      itemRef.current.focus();
      return;
    }
    const employee = emplvalue
      ? {
          employeeId: emplvalue._id,
          employeeName: emplvalue.name,
          employeeNameAr: emplvalue.nameAr,
          employeeColor: emplvalue.color,
        }
      : {
          employeeId: undefined,
          employeeName: undefined,
          employeeNameAr: undefined,
          employeeColor: undefined,
        };
    const resourse = resovalue
      ? {
          resourseId: resovalue._id,
          resourseName: resovalue.name,
          resourseNameAr: resovalue.nameAr,
          resourseColor: resovalue.color,
        }
      : {
          resourseId: undefined,
          resourseName: undefined,
          resourseNameAr: undefined,
          resourseColor: undefined,
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
    const itemdata = {
      ...itemvalue,
      ...employee,
      ...resourse,
      ...department,
      itemqty,
      itemprice,
      itemtotal: itemqty * itemprice,
      itemtotalcost: itemqty * itemvalue.cost,
      branch: user.branch,
      userId: user._id,
    };
    editAction(itemdata);
    onFormClose();
  };
  const onFormClose = () => {
    onClose();
    resetAll();
  };

  return (
    <PopupDialog
      open={open}
      onClose={onFormClose}
      maxWidth={'lg'}
      classes={classes}
    >
      <Box
        display="flex"
        style={{
          flex: 1,
          margin: 20,
          direction: isRTL ? 'rtl' : 'ltr',
        }}
      >
        <Box
          display="flex"
          style={{
            flex: 1,

            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Autocomplete
            // openOnFocus
            autoSelect
            size="small"
            options={expenseItems}
            getOptionLabel={(option: any) =>
              isRTL ? option.nameAr : option.name
            }
            getOptionSelected={(option, values) => option._id === values._id}
            renderOption={(option) => (
              <OptionItemData item={option}></OptionItemData>
            )}
            disabled={true}
            value={itemvalue}
            onChange={(_, newValue: any) => {
              setItemvalue(newValue);
              // setItemprice(newValue?.price || 0);
              if (newValue) {
                setItemError(false);
              }
            }}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            classes={{ input: classes.smallFont }}
            renderInput={(params) => (
              <TextField
                {...params}
                id="service"
                name="service"
                label={words.service}
                error={itemError}
                variant="outlined"
                style={{
                  width:
                    !tempoptions?.noServEmp && !tempoptions?.noServRes
                      ? 200
                      : 400,
                }}
                inputRef={(ref) => {
                  itemRef.current = ref;
                }}
                InputLabelProps={{
                  style: { fontSize: 13 },
                }}
              ></TextField>
            )}
          />

          {!tempoptions?.noServEmp && (
            <AutoField
              name="employee"
              title={tempwords?.employee}
              words={words}
              options={employees}
              value={emplvalue}
              setSelectValue={setEmplvalue}
              setSelectError={setEmplError}
              selectError={emplError}
              refernce={emplRef}
              register={register}
              width={130}
              ms={0}
              nolabel
              noPlus
              classes={classes}
              isRTL={isRTL}
            ></AutoField>
          )}
          {!tempoptions?.noServRes && (
            <AutoField
              name="resourse"
              title={tempwords?.resourse}
              words={words}
              options={resourses}
              value={resovalue}
              setSelectValue={setResovalue}
              setSelectError={setResoError}
              selectError={resoError}
              refernce={resoRef}
              register={register}
              width={130}
              ms={0}
              nolabel
              noPlus
              classes={classes}
              isRTL={isRTL}
            ></AutoField>
          )}
          {!tempoptions?.noServDep && (
            <AutoField
              name="department"
              title={words.department}
              words={words}
              options={departments}
              value={departvalue}
              setSelectValue={setDepartvalue}
              setSelectError={setDepError}
              selectError={depError}
              refernce={departRef}
              register={register}
              width={130}
              ms={0}
              nolabel
              noPlus
              classes={classes}
              isRTL={isRTL}
            ></AutoField>
          )}
          <TextField
            name="qty"
            onChange={(e: any) => setItemqty(Number(e.target.value))}
            value={itemqty}
            label={words.qty}
            variant="outlined"
            inputRef={register}
            type="number"
            error={errors.qty ? true : false}
            style={{ width: 80 }}
            margin="dense"
            onFocus={(e) => e.target.select()}
            inputProps={{
              style: { textAlign: 'right', fontSize: 13, height: 13 },
            }}
          />
          <TextField
            name="price"
            onChange={(e: any) => setItemprice(Number(e.target.value))}
            value={itemprice}
            label={words.price}
            error={errors.price ? true : false}
            variant="outlined"
            inputRef={register}
            type="number"
            style={{ width: 100 }}
            margin="dense"
            onFocus={(e) => e.target.select()}
            inputProps={{
              style: { textAlign: 'right', fontSize: 13, height: 13 },
            }}
          />
          <Fab
            style={{ marginLeft: 10 }}
            color="primary"
            size="small"
            onClick={handleSubmit(editLocalItem)}
            title="Create new row"
          >
            <SaveOutlinedIcon />
          </Fab>
        </Box>
      </Box>
    </PopupDialog>
  );
};

export default PopupItem;
