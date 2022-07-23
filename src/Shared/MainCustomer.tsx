/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core';
import {
  appointmentsMainFormatter,
  expensesMainFormatter,
  kaidsMainFormatter,
  salesMainFormatter,
  purchaseMainFormatter,
  taskDataView,
  daysdataMainFormatter,
  resourseDataView,
  employeeDataView,
  customerDataView,
  incomeMainFormatter,
  projectDataView,
  employeeMainFormatter,
  raseedMainFormatter,
} from './colorFormat';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import ReminderBox from './ReminderBox';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import RefetchBox from './RefetchBox';
import { ImageView } from '../components/viewer';

export default function MainCustomer({
  isRTL,
  words,
  theme,
  name,
  id,
  value: row,
  width,
  height,
  start,
  end,
}: any) {
  const [data, setData] = useState<any>(null);

  const isCust = name === 'customerId';
  const isSupp = name === 'supplierId';
  const isCont = name === 'contractId';
  const isReso = name === 'resourseId';
  const isEmpl = name === 'employeeId';
  const isDepart = name === 'departmentId';
  const isProj = name === 'projectId';

  const [loadCalcss, calcsData]: any = useLazyQuery(getGereralCalculation, {
    nextFetchPolicy: 'cache-and-network',
  });
  useEffect(() => {
    const variables = {
      [name]: id,
      start: start ? new Date(start).setHours(0, 0, 0, 0) : undefined,
      end: end ? new Date(end).setHours(23, 59, 59, 999) : undefined,
    };
    loadCalcss({
      variables,
    });
  }, [id, start, end]);

  useEffect(() => {
    const res = calcsData?.data?.getGereralCalculation?.data;
    if (res) {
      const data = JSON.parse(res);
      if (isCont) {
        data.coAmount = row.amount;
      }
      setData(data);
    }
  }, [calcsData, start, end]);
  const refresh = () => calcsData?.refetch();
  const loading = calcsData.loading;
  return (
    <Box
      style={{
        height: height - 280,
        width: width - 300,
        margin: 10,
      }}
    >
      <Box
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          left: isRTL ? 220 : undefined,
          right: isRTL ? undefined : 220,
          zIndex: 111,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          top: 55,
        }}
      >
        <RefetchBox
          isRTL={isRTL}
          theme={theme}
          refresh={refresh}
          loading={loading}
        ></RefetchBox>
      </Box>
      <Box
        style={{
          height: height - 290,
          width: width - 320,
        }}
      >
        {data && (
          <Box mt={1}>
            <Box
              style={{
                display: 'flex',
                flex: 1,
                height: 525,
                marginBottom: 10,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box style={{ backgroundColor: '#fff', height: 250 }}>
                    {isCont && taskDataView({ row, words, isRTL })}
                    {isProj && projectDataView({ row, words, isRTL })}
                    {isReso && resourseDataView({ row, words, isRTL })}
                    {(isEmpl || isDepart) &&
                      employeeDataView({ row, words, isRTL })}
                    {(isCust || isSupp) &&
                      customerDataView({ row, words, isRTL })}
                  </Box>
                </Grid>
                {!isSupp && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {appointmentsMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {isEmpl && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {employeeMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}

                {isCont && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 250 }}>
                      {daysdataMainFormatter({
                        row,
                        theme,
                        isRTL,
                      })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {salesMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}

                {!isCust && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {purchaseMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={3}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {expensesMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && (
                  <Grid item xs={2}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {incomeMainFormatter({
                        row: data,
                        theme,
                        isRTL,
                      })}
                    </Box>
                  </Grid>
                )}

                {!isSupp && !isCont && (
                  <Grid item xs={2}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {kaidsMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {(isCust || isEmpl) && (
                  <Grid item xs={2}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      {raseedMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Grid>
                )}
                {!isSupp && !isCust && (
                  <Grid item xs={4}>
                    <Box style={{ backgroundColor: '#fff', height: 200 }}>
                      <ReminderBox
                        isRTL={isRTL}
                        words={words}
                        id={id}
                        name={name}
                        start={start}
                        end={end}
                        theme={theme}
                        height={190}
                      ></ReminderBox>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={4}>
                  <ImageView
                    images={row?.photos ? JSON.parse(row?.photos) : []}
                    height={200}
                    width={400}
                    big
                  ></ImageView>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
