/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react';
import { Box, Fab, IconButton, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useForm } from 'react-hook-form';

import { Autocomplete } from '@material-ui/lab';
import OptionItemData from './OptionItemData';
import { yup } from '../constants';
import AutoPopper from './AutoPopper';
import { PopupExpenseItem } from '../pubups';
import { useExpenseItems } from '../hooks';
import _ from 'lodash';
import ListboxComponent from '../components/fields/ListboxComponent';

export default function ExpensesItemForm({
  options,
  addItem,
  words,
  classes,
  user,
  isRTL,
}: any) {
  const [itemError, setItemError] = useState<any>(false);

  const [itemvalue, setItemvalue] = useState<any>(null);
  const [itemqty, setItemqty] = useState(1);
  const [itemprice, setItemprice] = useState(0);
  const [openItem, setOpenItem] = useState(false);
  const [newtext, setNewtext] = useState('');
  const sorted = _.sortBy(options, isRTL ? 'nameAr' : 'name');

  const { register, handleSubmit, errors } = useForm(yup.invItemResolver);

  const itemRef: any = React.useRef();
  const { addExpenseItem, editExpenseItem } = useExpenseItems();
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
  };

  const addLocalItem = () => {
    if (!itemvalue) {
      setItemError(true);
      itemRef.current.focus();
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
        margin: 10,
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
          PopperComponent={AutoPopper}
          autoSelect
          size="small"
          options={sorted}
          ListboxComponent={ListboxComponent}
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
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          classes={{ input: classes.smallFont }}
          renderInput={(params) => (
            <TextField
              {...params}
              id="service"
              name="service"
              label={`${words.expenses}`}
              error={itemError}
              variant="outlined"
              style={{ width: 400 }}
              inputRef={(ref) => {
                itemRef.current = ref;
              }}
              InputLabelProps={{
                style: { fontSize: isRTL ? 16 : 13 },
              }}
            ></TextField>
          )}
        />
        <IconButton
          disableFocusRipple
          onClick={onOpenItem}
          style={{
            backgroundColor: '#dfdfdf',
            width: 30,
            height: 30,
            position: 'relative',
            top: 3,
            left: isRTL ? 35 : undefined,
            right: isRTL ? undefined : 35,
          }}
        >
          <AddIcon style={{ color: '#aaa' }}></AddIcon>
        </IconButton>

        <TextField
          name="qty"
          onChange={(e: any) => setItemqty(Number(e.target.value))}
          value={itemqty}
          label={words.qty}
          variant="outlined"
          inputRef={register}
          type="number"
          error={errors.qty ? true : false}
          style={{ width: 150 }}
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
          label={words.cost}
          error={errors.price ? true : false}
          variant="outlined"
          inputRef={register}
          type="number"
          style={{ width: 150 }}
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
      <PopupExpenseItem
        newtext={newtext}
        open={openItem}
        onClose={onCloseItem}
        isNew={true}
        setNewValue={onNewItemChange}
        row={null}
        addAction={addExpenseItem}
        editAction={editExpenseItem}
      ></PopupExpenseItem>
    </Box>
  );
}
