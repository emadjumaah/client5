/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, Grid } from '@material-ui/core';
import { TextFieldLocal } from '../../components';
import AutoFieldLocal from '../../components/fields/AutoFieldLocal';

const PaymentSelect = ({
  debitaccounts,
  debitAcc,
  setDebitAcc,
  isCash,
  setIsCash,
  words,
  paid,
  setPaid,
  isRTL,
}: any) => {
  const onMainChange = (e: any) => {
    const { value } = e.target;
    if (value === 'paid') {
      setIsCash(true);
    } else {
      setIsCash(false);
    }
  };
  return (
    <Box
      style={{
        backgroundColor: '#f3f3f3',
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
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
        <Grid item xs={4}>
          {isCash && (
            <AutoFieldLocal
              name="creditAcc"
              title={isRTL ? 'حساب القبض' : 'Receipt Acc'}
              words={words}
              options={debitaccounts}
              value={debitAcc}
              setSelectValue={setDebitAcc}
              isRTL={isRTL}
              fullwidtth
              mb={0}
              nosort
            ></AutoFieldLocal>
          )}
        </Grid>
        {isCash && setPaid && (
          <Grid item xs={3}>
            <TextFieldLocal
              name="price"
              label={isRTL ? 'قيمة الدفعة' : 'Amount Paid'}
              value={paid}
              onChange={(e: any) => setPaid(Number(e.target.value))}
              type="number"
              fullWidth
              mb={0}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PaymentSelect;
