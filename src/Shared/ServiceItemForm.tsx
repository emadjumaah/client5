/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useForm } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import OptionProductData from './OptionProductData';
import { yup } from '../constants';
import AutoPopper from './AutoPopper';
import { useProducts, useServices, useTemplate } from '../hooks';
import ListboxComponent from '../components/fields/ListboxComponent';
import PopupServiceItem from '../pubups/PopupServiceItem';
import { messageAlert } from './helpers';

export default function ServiceItemForm({
  services,
  products,
  addItem,
  words,
  classes,
  user,
  isRTL,
  setAlrt,
}: any) {
  const [itemError, setItemError] = useState<any>(false);

  const [itemvalue, setItemvalue] = useState<any>(null);
  const [itemqty, setItemqty] = useState(1);
  const [itemprice, setItemprice] = useState(0);
  const [openItem, setOpenItem] = useState(false);
  const [newtext, setNewtext] = useState('');
  const [desc, setDesc] = useState('');

  const [items, setItems] = useState(services);
  const [type, setType] = useState(2);

  const { register, handleSubmit, errors } = useForm(yup.invItemResolver);

  const itemRef: any = React.useRef();
  const { addService, editService } = useServices();
  const { addProduct, editProduct } = useProducts();
  const { tempoptions } = useTemplate();

  useEffect(() => {
    if (type === 2) {
      setItems(services);
      setItemvalue(null);
    } else if (type === 1) {
      setItems(products);
      setItemvalue(null);
    }
  }, [type]);

  const onOpenItem = () => {
    setOpenItem(true);
  };
  const onCloseItem = () => {
    setOpenItem(false);
    setNewtext('');
  };

  const onNewItemChange = (nextValue: any) => {
    setItemvalue(nextValue);
    setItemprice(nextValue?.price || 0);
  };

  const resetAll = () => {
    setItemprice(0);
    setItemqty(1);
    setItemvalue(null);
    setDesc('');
  };

  const addLocalItem = async () => {
    if (!itemvalue) {
      setItemError(true);
      itemRef.current.focus();
      return;
    }
    if (itemvalue.itemType === 1 && itemvalue.quantity < itemqty) {
      await messageAlert(
        setAlrt,
        isRTL ? 'لا يوجد كمية في المخزم' : 'No stock avaliable'
      );
      return;
    }

    const itemdata = {
      ...itemvalue,
      itemqty,
      itemprice,
      itemtotal: itemqty * itemprice,
      itemtotalcost: itemqty * itemvalue.cost,
      branch: user.branch,
      userId: user._id,
      note: desc,
    };
    addItem(itemdata);
    resetAll();
    itemRef.current.focus();
  };

  const name =
    type === 1 ? (isRTL ? 'المنتج' : 'Product') : isRTL ? 'الخدمة' : 'Service';

  return (
    <Box
      display="flex"
      style={{
        flex: 1,
        margin: 5,
        borderRadius: 5,
      }}
    >
      <RadioGroup
        aria-label="Views"
        name="views"
        row
        value={type}
        onChange={(e: any) => setType(Number(e.target.value))}
      >
        <FormControlLabel
          value={2}
          control={<Radio color="primary" />}
          label={isRTL ? 'الخدمات' : 'Services'}
        />
        <FormControlLabel
          value={1}
          control={<Radio color="primary" />}
          label={isRTL ? 'منتجات' : 'Products'}
        />
      </RadioGroup>
      <Box display="flex" style={{ flex: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Autocomplete
              PopperComponent={AutoPopper}
              autoSelect
              size="small"
              options={items}
              ListboxComponent={ListboxComponent}
              getOptionLabel={(option: any) =>
                isRTL ? option.nameAr : option.name
              }
              getOptionSelected={(option, values) => option._id === values._id}
              renderOption={(option) => (
                <OptionProductData
                  isRTL={isRTL}
                  item={option}
                ></OptionProductData>
              )}
              fullWidth
              value={itemvalue}
              onChange={(_, newValue: any) => {
                setItemvalue(newValue);
                setItemprice(newValue?.price || 0);
                if (newValue) {
                  setItemError(false);
                }
              }}
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              classes={{ input: classes.smallFont }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="product"
                  name="product"
                  label={name}
                  error={itemError}
                  variant="outlined"
                  fullWidth
                  inputRef={(ref) => {
                    itemRef.current = ref;
                  }}
                  InputLabelProps={{
                    style: { fontSize: isRTL ? 16 : 13 },
                  }}
                ></TextField>
              )}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              disableFocusRipple
              onClick={onOpenItem}
              style={{
                backgroundColor: '#dfdfdf',
                width: 30,
                height: 30,
                marginTop: 10,
              }}
            >
              <AddIcon style={{ color: '#aaa' }}></AddIcon>
            </IconButton>
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="qty"
              onChange={(e: any) => setItemqty(Number(e.target.value))}
              value={itemqty}
              label={words.qty}
              variant="outlined"
              inputRef={register}
              type="number"
              error={errors.qty ? true : false}
              fullWidth
              margin="dense"
              onFocus={(e) => e.target.select()}
              inputProps={{
                style: { textAlign: 'right', fontSize: 13, height: 13 },
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="price"
              onChange={(e: any) => setItemprice(Number(e.target.value))}
              value={itemprice}
              label={words.price}
              error={errors.price ? true : false}
              variant="outlined"
              inputRef={register}
              type="number"
              fullWidth
              margin="dense"
              onFocus={(e) => e.target.select()}
              inputProps={{
                style: { textAlign: 'right', fontSize: 13, height: 13 },
              }}
            />
          </Grid>
          {!tempoptions?.noTsk && <Grid item xs={2}></Grid>}
          {!tempoptions?.noTsk && (
            <Grid item xs={10}>
              <TextField
                name="desc"
                label={words.description}
                onChange={(e: any) => setDesc(e.target.value)}
                value={desc}
                variant="outlined"
                inputRef={register}
                margin="dense"
                fullWidth
                inputProps={{
                  style: { textAlign: 'right', fontSize: 13, height: 13 },
                }}
              />
            </Grid>
          )}
          <Grid item xs={1}></Grid>
          <Grid item xs={1}>
            <Fab
              style={{ marginLeft: 10, marginTop: 5, width: 36, height: 36 }}
              color="primary"
              onClick={handleSubmit(addLocalItem)}
              title="Create new row"
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>

        <PopupServiceItem
          newtext={newtext}
          open={openItem}
          onClose={onCloseItem}
          isNew={true}
          setNewValue={onNewItemChange}
          row={null}
          resType={1}
          type={type}
          addAction={type === 2 ? addService : addProduct}
          editAction={type === 2 ? editService : editProduct}
        ></PopupServiceItem>
      </Box>
    </Box>
  );
}
