/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect, useState } from 'react';
import { Box, Fab, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { Autocomplete } from '@material-ui/lab';
import OptionItemData from '../Shared/OptionItemData';
import { yup } from '../constants';
import { itemClasses } from '../themes/classes';
import { useTemplate } from '../hooks';
import { PopupDialog } from '../Shared';

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
  products,
}: any) => {
  const classes = itemClasses();
  const [itemError, setItemError] = useState<any>(false);

  const [itemvalue, setItemvalue] = useState<any>(null);
  const [itemqty, setItemqty] = useState(1);
  const [itemprice, setItemprice] = useState(0);

  const { register, handleSubmit, errors } = useForm(yup.invItemResolver);
  const { tempoptions } = useTemplate();

  const itemRef: any = React.useRef();

  useEffect(() => {
    if (row && row._id) {
      setItemprice(row.itemprice);
      setItemqty(row.itemqty);
      const servId = row._id;
      if (servId) {
        const serv = products?.filter((se: any) => se._id === servId)[0];
        setItemvalue(serv);
      }
    }
  }, [open]);

  const resetAll = () => {
    setItemprice(0);
    setItemqty(1);
    setItemvalue(null);
  };

  const editLocalItem = () => {
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
            options={products}
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
            label={words.theprice}
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
