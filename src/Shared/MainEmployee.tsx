/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid } from '@material-ui/core';
import {
  appointmentsMainFormatter,
  kaidsMainFormatter,
  employeeDataView,
  salesMainFormatter,
} from './colorFormat';
import getGereralCalculation from '../graphql/query/getGereralCalculation';
import ReminderBox from './ReminderBox';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import RefetchBox from './RefetchBox';
import { ImageView } from '../components/viewer';
import SalaryBox from './SalaryBox';
import getSalaryCalculation from '../graphql/query/getSalaryCalculation';
import { getEndOfMonth, getStartOfMonth } from './helpers';

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
  sStart,
  setSStart,
  sEnd,
  setSEnd,
  company,
  user,
}: any) {
  const [data, setData] = useState<any>(null);
  const [sdata, setSdata] = useState<any>(null);
  const [salary, setSalary] = useState<any>(0);

  const [loadCalcss, calcsData]: any = useLazyQuery(getGereralCalculation, {
    fetchPolicy: 'cache-and-network',
  });
  const [loadSladata, calcsSaldata]: any = useLazyQuery(getSalaryCalculation, {
    fetchPolicy: 'cache-and-network',
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
    if (!sStart) {
      const somn = getStartOfMonth(null);
      setSStart(somn);
    }
    if (!sEnd) {
      const eom = getEndOfMonth(null);
      setSEnd(eom);
    }
  }, []);

  useEffect(() => {
    const variables = {
      [name]: id,
      start: sStart ? new Date(sStart).setHours(0, 0, 0, 0) : undefined,
      end: sEnd ? new Date(sEnd).setHours(23, 59, 59, 999) : undefined,
    };
    loadSladata({
      variables,
    });
  }, [sStart, sEnd]);

  useEffect(() => {
    const res = calcsData?.data?.getGereralCalculation?.data;
    if (res) {
      const data = JSON.parse(res);
      setData(data);
    }
  }, [calcsData, calcsSaldata, start, end]);

  useEffect(() => {
    const res = calcsSaldata?.data?.getSalaryCalculation?.data;
    if (res) {
      const data = JSON.parse(res);
      setSdata(data);
    }
  }, [calcsData, calcsSaldata, sStart, sEnd]);

  // eslint-disable-next-line no-sequences
  const refresh = () => (calcsData?.refetch(), calcsSaldata?.refetch());

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
        {data && sdata && (
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
                    {employeeDataView({ row, words, isRTL })}
                  </Box>
                  <Box
                    style={{
                      backgroundColor: '#fff',
                      height: 210,
                      marginTop: 10,
                    }}
                  >
                    <ReminderBox
                      isRTL={isRTL}
                      words={words}
                      id={id}
                      name={name}
                      start={start}
                      end={end}
                      theme={theme}
                      height={420}
                    ></ReminderBox>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    style={{
                      backgroundColor: '#fff',
                      height: 250,
                    }}
                  >
                    {appointmentsMainFormatter({ row: data, theme, isRTL })}
                  </Box>
                  <Box display={'flex'}>
                    <Box
                      style={{
                        backgroundColor: '#fff',
                        height: 200,
                        marginTop: 10,
                        marginLeft: 10,
                      }}
                    >
                      {salesMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                    <Box
                      style={{
                        backgroundColor: '#fff',
                        height: 200,
                        marginTop: 10,
                      }}
                    >
                      {kaidsMainFormatter({ row: data, theme, isRTL })}
                    </Box>
                  </Box>
                  <Box style={{ marginTop: 10 }}>
                    <ImageView
                      images={row?.photos ? JSON.parse(row?.photos) : []}
                      height={210}
                      width="100%"
                      big
                    ></ImageView>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <SalaryBox
                    data={sdata}
                    isRTL={isRTL}
                    height={height - 290}
                    start={sStart}
                    setStart={setSStart}
                    end={sEnd}
                    setEnd={setSEnd}
                    words={words}
                    salary={salary}
                    setSalary={setSalary}
                    company={company}
                    user={user}
                    row={row}
                  ></SalaryBox>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
