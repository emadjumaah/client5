/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box } from '@material-ui/core';

const CashTransfareSelect = ({ ptype, setPtype, setEmplvalue, isRTL }) => {
  const onchange = (e: any) => {
    setPtype(e.target.value);
    setEmplvalue(null);
  };
  return (
    <RadioGroup
      aria-label="Views"
      name="views"
      row
      value={ptype}
      onChange={onchange}
    >
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="cashDeposet"
          control={<Radio color="primary" />}
          label={isRTL ? 'ايداع في البنك' : 'Cash Deposet'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="cashDraw"
          control={<Radio color="primary" />}
          label={isRTL ? 'سحب من البنك' : 'Cash Draw'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="pettyCashPay"
          control={<Radio color="primary" />}
          label={isRTL ? 'دفع عهدة' : 'Petty Cash Payment'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="pettyCashRec"
          control={<Radio color="primary" />}
          label={isRTL ? 'قبض عهدة' : 'Petty Cash Receipt'}
        />
      </Box>
    </RadioGroup>
  );
};

export default CashTransfareSelect;
