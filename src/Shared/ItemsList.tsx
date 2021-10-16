/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { TextField, Typography, Box, IconButton } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const ccyFormat = (num: any) => {
  if (num > 0) {
    return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
};

const OptionItem = ({ item }: any) => {
  return (
    <Box margin="0.5">
      <Box style={{ position: 'relative', top: 7 }}>
        <Box display="flex" flexDirection="row">
          <Typography
            style={{
              marginLeft: 5,
              marginRight: 20,
              color: '#20A4F3',
              width: 100,
              fontSize: 11,
            }}
            variant="caption"
          >
            {item.catName}
          </Typography>
          <Typography
            style={{
              marginRight: 20,
              color: '#844257',
              width: 100,
              fontSize: 11,
            }}
            variant="caption"
          >
            {item.brandName ? item.brandName : ''}
          </Typography>
          <Typography
            style={{ color: '#00B77C', width: 100, fontSize: 11 }}
            variant="caption"
          >
            {item.price ? ccyFormat(item.price) : '-'}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography style={{ marginBottom: 5 }}>{item.name}</Typography>
      </Box>
    </Box>
  );
};

const Price = ({ control, index }: any) => {
  const value: any = useWatch({
    control,
    name: `items[${index}]`,
    defaultValue: {},
  });
  const total = (value.qty || 0) * (value.price || 0);
  return (
    <Typography style={{ paddingRight: 10, fontWeight: 'bold' }}>
      {total}
    </Typography>
  );
};

const PriceTotal = ({ control }: any) => {
  let sum;
  const list: any = useWatch({
    control,
    name: `items`,
    defaultValue: {},
  });
  if (list.length > 0) {
    const totals = list.map((it: any) => it.qty * it.price);
    sum = totals.reduce((psum: any, a: any) => psum + a, 0);
  }
  return (
    <Typography style={{ fontWeight: 'bold', fontSize: 18 }}>
      Total: {sum || 0}
    </Typography>
  );
};

export const inList = (item: any, list: any) => {
  return list.findIndex((x: any) => x._id === item._id);
};

export default function ItemsList({
  lang,
  services,
  setAmount,
  setCostAmount,
  setProfit,
  setTotal,
  discount,
}: any): any {
  const [itemsList, setItemsList] = useState<any>([]);

  const addItemToList = (item: any, index: number) => {
    const newArray = [...itemsList];
    newArray[index] = item;
    setItemsList(newArray);
  };
  const removeItemFromList = (index: any) => {
    const newList = [...itemsList];
    newList.splice(index, 1);
    setItemsList(newList);
  };
  // console.log("itemsList", itemsList);

  React.useEffect(() => {
    getOverallTotal(itemsList);
  }, [discount]);
  const { register, control } = useForm({});

  const itemNameRef: any = React.useRef();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const getOverallTotal = (items: any) => {
    if (items.length > 0) {
      const totals = items.map((litem: any) => litem.total);
      const sum = totals.reduce((psum: any, a: any) => psum + a, 0);
      const totalscost = items.map((litem: any) => litem.totalCost);
      const costsum = totalscost.reduce((psum: any, a: any) => psum + a, 0);
      const amount = sum - discount;
      const prfit = amount - costsum;
      setCostAmount(costsum);
      setTotal(sum);
      setAmount(amount);
      setProfit(prfit);
    }
  };

  console.log('itemsList', itemsList);
  // console.log("localitems", localitems);

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : undefined}
      style={{ backgroundColor: '#fff' }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography style={{ padding: 10 }}>Items</Typography>
      </Box>
      <div>
        {fields.map(({ id, itemName, price }, index: number) => {
          console.log('fields', fields);

          return (
            <Box
              style={{ marginBottom: 10 }}
              key={id}
              display="flex"
              flexDirection="row"
            >
              <Box
                display="flex"
                style={{
                  width: 50,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: '#dedede',
                  // marginLeft: 10,
                }}
              >
                <Typography style={{}}>{index + 1}</Typography>
              </Box>
              {services && (
                <Autocomplete
                  selectOnFocus
                  options={services}
                  getOptionLabel={(option: any) => option.name}
                  renderOption={(option) => (
                    <OptionItem item={option}></OptionItem>
                  )}
                  getOptionSelected={(option, values) =>
                    option._id === values._id
                  }
                  onChange={(_: any, newValue: any) => {
                    addItemToList(newValue, index);
                  }}
                  openOnFocus
                  autoSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{
                        width: 350,
                        margin: 0,
                        padding: 0,
                        marginLeft: 10,
                      }}
                      required
                      id="itemName"
                      name={`items[${index}].itemName`}
                      error={false}
                      variant="outlined"
                      defaultValue={itemName}
                      inputRef={(ref) => {
                        itemNameRef.current = ref;
                        register(ref);
                      }}
                    />
                  )}
                />
              )}
              <TextField
                name={`items[${index}].qty`}
                style={{ width: 120, margin: 0, padding: 0, marginLeft: 10 }}
                inputProps={{ style: { textAlign: 'right' } }}
                variant="outlined"
                type="number"
                defaultValue={1}
                inputRef={register()}
              />
              {/* {itemsList?.[index]?.price && (
                <TextField
                  required
                  name={`items[${index}].price`}
                  style={{ width: 120, margin: 0, padding: 0, marginLeft: 10 }}
                  inputProps={{ style: { textAlign: "right" } }}
                  variant="outlined"
                  type="number"
                  defaultValue={itemsList?.[index]?.price || price}
                  inputRef={register()}
                />
                )} */}
              <TextField
                required
                name={`items[${index}].price`}
                style={{ width: 120, margin: 0, padding: 0, marginLeft: 10 }}
                inputProps={{ style: { textAlign: 'right' } }}
                variant="outlined"
                type="number"
                defaultValue={itemsList?.[index]?.price || price}
                inputRef={register()}
              />
              <Box
                display="flex"
                style={{
                  width: 120,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  borderRadius: 5,
                  backgroundColor: '#dedede',
                  marginLeft: 10,
                }}
              >
                <Price control={control} index={index} />
              </Box>
              <IconButton
                color="default"
                aria-label="upload picture"
                component="span"
                disableFocusRipple
                onClick={() => {
                  remove(index);
                  removeItemFromList(index);
                }}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          );
        })}

        <Box
          style={{ marginBottom: 10 }}
          display="flex"
          flexDirection="row"
          borderColor="primary.main"
        >
          <Box
            display="flex"
            style={{
              width: 50,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
            }}
          >
            <Typography style={{}}></Typography>
          </Box>
          <TextField
            required
            style={{
              width: 350,
              margin: 0,
              padding: 0,
              marginLeft: 10,
              backgroundColor: '#eee',
            }}
            inputProps={{ style: { textAlign: 'right' } }}
            variant="outlined"
            onFocus={() => append({})}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          style={{ paddingRight: 70 }}
        >
          <PriceTotal control={control} />
        </Box>
      </div>
    </div>
  );
}
