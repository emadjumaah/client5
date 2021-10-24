/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useForm } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import OptionItemData from './OptionItemData';
import { yup } from '../constants';
import AutoField from './AutoField';
import AutoPopper from './AutoPopper';
import { useTemplate } from '../hooks';

export default function ServiceItemForm({
  options,
  addItem,
  words,
  employees,
  departments,
  classes,
  user,
  isRTL,
}: any) {
  const [itemError, setItemError] = useState<any>(false);

  const [itemvalue, setItemvalue] = useState<any>(null);
  const [itemqty, setItemqty] = useState(1);
  const [itemprice, setItemprice] = useState(0);

  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [emplError, setEmplError] = useState<any>(false);
  const emplRef: any = React.useRef();

  const [departvalue, setDepartvalue] = useState<any>(null);
  const [depError, setDepError] = useState<any>(false);
  const departRef: any = React.useRef();

  const [resKind, setResKind] = useState<any>(null);
  const [emplslist, setEmplslist] = useState<any>([]);

  const { register, handleSubmit, errors } = useForm(yup.invItemResolver);
  const { tempoptions } = useTemplate();

  const itemRef: any = React.useRef();

  useEffect(() => {
    if (employees && employees.length > 0) {
      const filtered = employees.filter(
        (emp: any) => emp.resKind === resKind && emp.resType === 2
      );
      setEmplslist(filtered);
    }
  }, [resKind, employees]);

  useEffect(() => {
    if (itemvalue) {
      if (itemvalue.employeeId) {
        const itememp = employees.filter(
          (emp: any) => emp._id === itemvalue.employeeId
        )[0];
        setEmplvalue(itememp);
      }
      if (itemvalue.departmentId) {
        const itemdep = departments.filter(
          (it: any) => it._id === itemvalue.departmentId
        )[0];
        setDepartvalue(itemdep);
      }
    }
  }, [employees, departments, itemvalue]);

  const resetAll = () => {
    setItemprice(0);
    setItemqty(1);
    setItemvalue(null);
    setEmplvalue(null);
    setDepartvalue(null);
    setResKind(null);
  };

  const addLocalItem = () => {
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
      : undefined;
    const department = departvalue
      ? {
          departmentId: departvalue._id,
          departmentName: departvalue.name,
          departmentNameAr: departvalue.nameAr,
          departmentColor: departvalue.color,
        }
      : undefined;
    const itemdata = {
      ...itemvalue,
      ...employee,
      ...department,
      itemqty,
      itemprice,
      itemtotal: itemqty * itemprice,
      itemtotalcost: itemqty * itemvalue.cost,
      branch: user.branch,
      userId: user._id,
    };
    addItem(itemdata);
    resetAll();
    itemRef.current.focus();
  };

  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
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
          PopperComponent={AutoPopper}
          autoSelect
          size="small"
          options={options}
          getOptionLabel={(option: any) =>
            isRTL ? option.nameAr : option.name
          }
          getOptionSelected={(option, values) => option._id === values._id}
          renderOption={(option) => (
            <OptionItemData isRTL={isRTL} item={option}></OptionItemData>
          )}
          value={itemvalue}
          onChange={(_, newValue: any) => {
            setItemvalue(newValue);
            setItemprice(newValue?.price || 0);
            if (newValue) {
              setItemError(false);
            }
          }}
          classes={{ input: classes.smallFont }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="service"
              name="service"
              label={`${words.service}/${words.product}`}
              error={itemError}
              variant="outlined"
              style={{
                width:
                  !tempoptions?.noServEmp && !tempoptions?.noServRes
                    ? 220
                    : 420,
              }}
              inputRef={(ref) => {
                itemRef.current = ref;
              }}
              InputLabelProps={{
                style: { fontSize: isRTL ? 16 : 13 },
              }}
            ></TextField>
          )}
        />

        <Box>
          {!tempoptions?.noServEmp && !tempoptions?.noServRes && (
            <Box style={{ marginRight: 10, marginTop: -20 }}>
              <RadioGroup
                aria-label="Views"
                name="views"
                row
                value={resKind}
                onChange={(e: any) => {
                  setResKind(Number(e.target.value));
                  setEmplvalue(null);
                }}
              >
                <FormControlLabel
                  value={1}
                  control={
                    <Radio style={{ padding: 0, margin: 0 }} color="primary" />
                  }
                  label={isRTL ? 'الفني' : 'Employee'}
                />

                <FormControlLabel
                  value={2}
                  control={
                    <Radio style={{ padding: 0, margin: 0 }} color="primary" />
                  }
                  label={isRTL ? 'المورد' : 'Resourse'}
                />
              </RadioGroup>
            </Box>
          )}
          {!tempoptions?.noServEmp && !tempoptions?.noServRes && (
            <AutoField
              name="employee"
              // title={words.employee}
              words={words}
              options={emplslist}
              disabled={!resKind}
              value={emplvalue}
              setSelectValue={setEmplvalue}
              setSelectError={setEmplError}
              selectError={emplError}
              refernce={emplRef}
              register={register}
              width={180}
              ms={0}
              nolabel
              noPlus
              classes={classes}
              isRTL={isRTL}
            ></AutoField>
          )}
        </Box>
        {!tempoptions?.noServDep && (
          <AutoField
            name="department"
            title={words.department}
            words={words}
            options={departments.filter((dep: any) => dep.depType === 2)}
            value={departvalue}
            setSelectValue={setDepartvalue}
            setSelectError={setDepError}
            selectError={depError}
            refernce={departRef}
            register={register}
            width={200}
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
          onClick={handleSubmit(addLocalItem)}
          title="Create new row"
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
}
