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
  setCustvalue,
  isRTL,
}) => {
  const onchange = (e: any) => {
    setPtype(e.target.value);
    setEmplvalue(null);
    setCustvalue(null);
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
          value="expenses"
          control={<Radio color="primary" />}
          label={isRTL ? 'مصروفات عامة' : 'General Expenses'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="payable"
          control={<Radio color="primary" />}
          label={isRTL ? 'الدائنون' : 'Account Payable'}
        />
      </Box>
      <Box
        display="flex"
        style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}
      >
        <FormControlLabel
          value="employee"
          control={<Radio color="primary" />}
          label={isRTL ? 'عهدة نثر' : 'Petty Cash Payment'}
        />
      </Box>
    </RadioGroup>
  );
};

export default ExpensesTypeSelect;
