/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box } from '@material-ui/core';

const ExpensesTypeSelect = ({
  ptype,
  setPtype,
  setEmplvalue,
  setSuppvalue,
  isRTL,
}) => {
  const onchange = (e: any) => {
    setPtype(e.target.value);
    setEmplvalue(null);
    setSuppvalue(null);
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
        style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15 }}
      >
        <FormControlLabel
          value="expenses"
          control={<Radio color="primary" />}
          label={isRTL ? 'عام' : 'General'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15 }}
      >
        <FormControlLabel
          value="exppettycash"
          control={<Radio color="primary" />}
          label={isRTL ? 'عهدة نثر' : 'Petty Cash'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15 }}
      >
        <FormControlLabel
          value="exppayable"
          control={<Radio color="primary" />}
          label={isRTL ? 'الدائنون' : 'Account Payable'}
        />
      </Box>
    </RadioGroup>
  );
};

export default ExpensesTypeSelect;
