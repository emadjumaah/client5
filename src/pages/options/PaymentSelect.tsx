/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, Grid } from '@material-ui/core';

const PaymentSelect = ({ ptype, setPtype, isCash, setIsCash, words }) => {
  const onchange = (e: any) => {
    setPtype(e.target.value);
  };
  const onMainChange = (e: any) => {
    const { value } = e.target;
    if (value === 'paid') {
      setIsCash(true);
      setPtype('cash');
    } else {
      setIsCash(false);
      setPtype('');
    }
  };
  return (
    <Box
      style={{
        backgroundColor: '#f3f3f3',
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <RadioGroup
            aria-label="Views"
            name="views"
            value={isCash ? 'paid' : 'credit'}
            onChange={onMainChange}
          >
            <Box display="flex" style={{ flexDirection: 'row', padding: 5 }}>
              <FormControlLabel
                value="paid"
                style={{
                  minWidth: 200,
                  backgroundColor: isCash ? '#e5e5e5' : '#f3f3f3',
                  marginInlineStart: 5,
                  borderRadius: 10,
                }}
                control={<Radio color="primary" />}
                label={words.paid}
              />
            </Box>
            <Box display="flex" style={{ flexDirection: 'row', padding: 5 }}>
              <FormControlLabel
                value="credit"
                style={{
                  minWidth: 200,
                  backgroundColor: !isCash ? '#e5e5e5' : '#f3f3f3',
                  marginInlineStart: 5,
                  borderRadius: 10,
                }}
                control={<Radio color="primary" />}
                label={words.credit}
              />
            </Box>
          </RadioGroup>
        </Grid>
        <Grid item xs={7}>
          {isCash && (
            <RadioGroup
              aria-label="Views"
              name="views"
              row
              value={ptype}
              onChange={onchange}
            >
              <Box
                display="flex"
                style={{ flexDirection: 'row', marginTop: 5 }}
              >
                <FormControlLabel
                  value="cash"
                  control={<Radio color="primary" />}
                  label={words.cash}
                />
              </Box>
              <Box
                display="flex"
                style={{ flexDirection: 'row', marginTop: 5 }}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio color="primary" />}
                  label={words.card}
                />
              </Box>
            </RadioGroup>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentSelect;
