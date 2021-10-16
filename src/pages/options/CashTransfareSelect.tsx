/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box } from '@material-ui/core';
import React from 'react';

const CashTransfareSelect = ({ ptype, setPtype, setCustvalue, words }) => {
  const onchange = (e: any) => {
    setPtype(e.target.value);
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
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <FormControlLabel
          value="deposit"
          control={<Radio color="primary" />}
          label={words.depositbank}
        />
      </Box>
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <FormControlLabel
          value="partnerdraw"
          control={<Radio color="primary" />}
          label={words.drawpartner}
        />
      </Box>
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <FormControlLabel
          value="partneradd"
          control={<Radio color="primary" />}
          label={words.addpartner}
        />
      </Box>
      {/* <Box display="flex" style={{ flexDirection: "row" }}>
        <FormControlLabel
          value="customerpay"
          control={<Radio color="primary" />}
          label={words.customerpay}
        />
      </Box> */}
    </RadioGroup>
  );
};

export default CashTransfareSelect;
