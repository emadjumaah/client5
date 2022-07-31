/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  colors,
  Divider,
  fade,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { nameToColor, roles } from '../common';
import {
  getTaskTimeAmountData,
  getTaskTimeAmountSimple,
} from '../common/helpers';
import {
  isSuperAdmin,
  isBranchAdmin,
  isEditor,
  isWriter,
  isViewer,
  isFinance,
  isOperate,
  isPurchase,
  isAdmin,
} from '../common/roles';
import CustodyChart from '../components/charts/CustodyChart';
import ExpensesChart from '../components/charts/ExpensesChart';
import IncomeChart from '../components/charts/IncomeChart';
import KaidsChart from '../components/charts/KaidsChart';
import PercentChartTask from '../components/charts/PercentChartTask';
import PurchaseChart from '../components/charts/PurchaseChart';
import SalesChart from '../components/charts/SalesChart';
import { operationTypes } from '../constants';
import { getTaskName } from '../constants/branch';
import {
  carstatuss,
  eventColors,
  eventStatus,
  operationNames,
  opTypesNames,
  retypeTypes,
  weekdaysObj,
} from '../constants/datatypes';
import { actionType } from '../constants/kaid';
import { sectionTypes } from '../constants/reports';
import { getStoreItem } from '../store';
import Avatar from './Avatar';
import AvatarColor from './AvatarColor';
import MyIcon from './MyIcon';

export const colorPatternFormatter = ({ value }) => (
  <Box
    style={{
      width: 100,
      height: 20,
      backgroundColor: value,
      ...employeeColorStyle,
    }}
  />
);
export const colorFormatter = ({ value }) => (
  <Box
    style={{
      width: 100,
      height: 20,
      backgroundColor: value,
    }}
  />
);
export const daysoffFormatter = ({ value, isRTL }: any) => {
  let days: any;
  if (value) {
    const obj = JSON.parse(value);
    days = Object.keys(obj).filter((k) => obj[k] === true);
  }
  if (days) {
    return (
      <>
        {days.map((day: any) => {
          return (
            <>{isRTL ? weekdaysObj[day]?.nameAr : weekdaysObj[day]?.name} </>
          );
        })}
      </>
    );
  } else {
    <>{value}</>;
  }
  return <></>;
};

export const rolesFormatter = ({ row, isRTL }: any) => {
  const user = row;
  const isF = isFinance(user);
  const isO = isOperate(user);
  const isP = isPurchase(user);
  const isA = isAdmin(user);
  const isE = isEditor(user);
  const isW = isWriter(user);
  const isV = isViewer(user);
  const isEmpl = row?.isEmployee;

  if (isSuperAdmin(user)) {
    return <Typography>{isRTL ? 'الأدمن' : 'Main Admin'}</Typography>;
  }
  if (isEmpl) {
    return <Typography>{isRTL ? 'موظف' : 'Employee'}</Typography>;
  }
  if (isBranchAdmin(user)) {
    return <Typography>{isRTL ? 'مدير عام' : 'Branch Admin'}</Typography>;
  }
  let fullt;
  let fsect = [];
  const titla = isRTL ? 'مدير' : 'Admin';
  const title = isRTL ? 'محرر' : 'Editor';
  const titlr = isRTL ? 'كاتب' : 'writer';
  const titlv = isRTL ? 'زائر' : 'Viewer';
  const acc = isRTL ? 'حسابات' : 'Accountant';
  const opr = isRTL ? 'عمليات' : 'Operation';
  const pur = isRTL ? 'مشتريات' : 'Purchase';

  if (isA) {
    fullt = titla;
  } else if (isE) {
    fullt = title;
  } else if (isW) {
    fullt = titlr;
  } else if (isV) {
    fullt = titlv;
  }

  if (isF) {
    fsect.push(acc);
  }
  if (isO) {
    fsect.push(opr);
  }
  if (isP) {
    fsect.push(pur);
  }

  const fulltitle = `${fullt} ${fsect.join(' ')}`;
  return <Typography>{fulltitle}</Typography>;
};

export const avatarPatternFormatter = ({ row }: any) => {
  const { name, color } = row;

  return (
    <Box>
      <AvatarColor name={name} bg={color}></AvatarColor>
    </Box>
  );
};
export const avataManageFormatter = ({
  row,
  setItem,
  setOpenItem,
  height = 100,
}: any) => {
  const { logo, avatar, name } = row;
  const bgcolor = name ? nameToColor(`${name}Jadwal2!@`) : '';
  const letter = name?.substring(0, 1)?.toUpperCase() || '';

  if (logo || avatar) {
    return (
      <Paper
        elevation={2}
        style={{
          overflow: 'hidden',
          borderRadius: height / 2,
          backgroundColor: '#fff',
          width: height,
          height,
          cursor: 'pointer',
        }}
        onClick={() => {
          setItem(row);
          setOpenItem(true);
        }}
      >
        <img
          style={{
            overflow: 'hidden',
            borderRadius: height / 2,
            objectFit: 'cover',
          }}
          width={height}
          height={height}
          src={logo ? logo : avatar}
        />
      </Paper>
    );
  }
  return (
    <Box
      style={{
        overflow: 'hidden',
        borderRadius: height / 2,
        backgroundColor: bgcolor,
        width: height,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={() => {
        setItem(row);
        setOpenItem(true);
      }}
    >
      <Typography style={{ color: '#eee', fontWeight: 'bold' }} variant="h4">
        {letter}
      </Typography>
    </Box>
  );
};
export const avatarColorFormatter = ({ row, height = 100 }: any) => {
  const { color } = row;
  return (
    <Box
      flex
      style={{
        flex: 1,
        width: 10,
        height,
        backgroundColor: color ? fade(color, 0.8) : undefined,
        borderRadius: 5,
      }}
    ></Box>
  );
};
export const photoFormatter = ({ row }: any) => {
  if (row.photo) {
    return (
      <div
        style={{
          overflow: 'hidden',
          borderRadius: 5,
          width: 55,
          height: 55,
        }}
      >
        <img
          style={{
            overflow: 'hidden',
            borderRadius: 5,
            objectFit: 'cover',
          }}
          width={55}
          height={55}
          src={row.photo}
        />
      </div>
    );
  }
  return (
    <Box
      style={{
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: '#ddd',
        width: 55,
        height: 55,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    ></Box>
  );
};
export const sectionsTypeFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const nameObj = sectionTypes.filter((st: any) => st.value === value)?.[0];
  const name = nameObj ? (lang === 'ar' ? nameObj.nameAr : nameObj.name) : '';

  return <span>{name}</span>;
};

export const avatarFormatter = ({ row }: any) => {
  const { name, username, color } = row;
  const bgcolor = color ? color : nameToColor(`${name}Jadwal2!@`);

  return (
    <Box>
      <Avatar username={username} name={name} bg={bgcolor}></Avatar>
    </Box>
  );
};

export const arabicFormatter = ({ value }: any) => {
  return (
    <Typography style={{ fontSize: '1.1em', fontWeight: 'bold' }}>
      {value}
    </Typography>
  );
};
export const activeFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  return (
    <Typography style={{ color: !value ? 'green' : 'red' }}>
      {!value
        ? lang === 'ar'
          ? 'فعال'
          : 'Active'
        : lang === 'ar'
        ? 'معطل'
        : 'Inactive'}
    </Typography>
  );
};
export const covertToDate = (time: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } else {
    return '';
  }
};
export const covertToTimeDate = (time: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return '';
  }
};
export const covertToTimeDateDigit = (time: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return '';
  }
};
export const covertToTimeOnly = (time: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString('en-QA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } else {
    return '';
  }
};
export const getDateDayFormat = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else {
    return '';
  }
};
export const getDateDayTimeFormat = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    return '';
  }
};
export const getDateDay = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else {
    return '';
  }
};
export const getDateDayWeek = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else {
    return '';
  }
};
export const getDateDayWeekGB = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else {
    return '';
  }
};

export const getDateFormat = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      day: 'numeric',
      month: 'long',
    });
  } else {
    return '';
  }
};
export const getDateMonthFormat = (time: any, isRTL: any) => {
  if (time) {
    const date = new Date(time);
    return date.toLocaleString(isRTL ? 'ar-QA' : 'en-GB', {
      month: 'long',
      year: 'numeric',
    });
  } else {
    return '';
  }
};

export const timeFormatter = ({ row }: any) => {
  const { time } = row;
  return <div>{covertToDate(time)}</div>;
};
export const documentTimeFormatter = ({ row }: any) => {
  const { time, startDate } = row;
  const value = row.opType === 80 ? startDate : time;
  return <div>{covertToDate(value)}</div>;
};

export const createdAtFormatter = ({ value }: any) => {
  return <div>{covertToDate(value)}</div>;
};
export const fromToFormatter = ({ row }: any) => {
  const start = covertToTimeOnly(row.startDate);
  // const end = covertToTimeOnly(row.endDate);
  return (
    <div>
      {/* {start} {end} */}
      {start}
    </div>
  );
};
export const actionTimeFormatter = ({ value }: any) => {
  return <div>{covertToTimeDateDigit(value)}</div>;
};
export const mobilesFormatter = ({ value }: any) => {
  if (value?.length === 1) {
    return value[0];
  }
  if (value?.length > 1) {
    return `( ${value.length} )`;
  }
  return value;
};
export const userFormatter = ({ value, users }: any) => {
  const user = users.filter((us: any) => us._id === value)?.[0];
  return <div>{user?.username}</div>;
};

export const locationFormatter = ({ value }: any) => {
  if (value?.lat) {
    return <MyIcon size={26} color="#ff80ed" icon="location"></MyIcon>;
  } else return <div></div>;
};
export const createdAtPrintFormatter = ({ value }: any) => {
  return <div style={{ fontSize: 12 }}>{covertToDate(value)}</div>;
};
export const dateTimePrintFormatter = ({ row }: any) => {
  const { startDate } = row;
  return <div style={{ fontSize: 12 }}>{covertToTimeOnly(startDate)}</div>;
};
export const eventStatusPrintFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const item = eventStatus.filter((es: any) => es.id === value);
  if (item && item.length > 0) {
    return (
      <div style={{ color: eventColors[value], fontSize: 12 }}>
        {lang === 'ar' ? item[0].nameAr : item[0].name}
      </div>
    );
  } else {
    return <div></div>;
  }
};
export const currencyPrintFormatter = ({ value }: any) => {
  return (
    <div style={{ color: '#403795', fontSize: 12 }}>{moneyFormat(value)}</div>
  );
};
export const samllFormatter = ({ value }: any) => {
  return <div style={{ fontSize: 12 }}>{value}</div>;
};
export const departmentFormatter = ({ row, isRTL }: any) => {
  return (
    <div>
      {isRTL
        ? row?.department?.departmentNameAr
        : row?.department?.departmentName}
    </div>
  );
};
export const employeeFormatter = ({ row, isRTL }: any) => {
  return (
    <div>
      {isRTL ? row?.employee?.employeeNameAr : row?.employee?.employeeName}
    </div>
  );
};

export const dateTimeFormatter = ({ row }: any) => {
  const { startDate } = row;
  return <div>{covertToTimeOnly(startDate)}</div>;
};

export const valueTimeFormatter = ({ value }: any) => {
  return <div>{covertToTimeDate(value)}</div>;
};
export const eventStatusFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const item = eventStatus.filter((es: any) => es.id === value);
  if (item && item.length > 0) {
    return (
      <span style={{ color: eventColors[value] }}>
        {lang === 'ar' ? item[0].nameAr : item[0].name}
      </span>
    );
  } else {
    return <div></div>;
  }
};

const renderTag = ({ value, color, bgcolor, fontSize = 12, width = 75 }) => {
  if (!value) return <></>;
  return (
    <Box
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height: 24,
        backgroundColor: bgcolor,
        borderRadius: 5,
        margin: 4,
      }}
    >
      <Typography
        style={{
          fontSize,
          fontWeight: 'bold',
          color,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export const taskTitleNameFormatter = ({
  row,
  isRTL,
  setItem,
  setOpenItem,
}: any) => {
  const { title, customerNameAr, customerName, customerPhone } = row;

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} style={{ marginTop: 5 }}>
        <Button
          onClick={() => {
            if (setItem) {
              setItem(row);
              setOpenItem(true);
            }
          }}
          variant="contained"
          color="primary"
          fullWidth
          style={{
            height: 30,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Typography style={{ fontSize: 14 }}> {title} </Typography>
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ paddingLeft: 10, paddingRight: 10, marginTop: 5 }}
      >
        <Typography style={{ fontWeight: 'bold', fontSize: 14 }}>
          {isRTL ? customerNameAr : customerName} ({' '}
          {customerPhone?.substring(3)} )
        </Typography>
      </Grid>
    </Grid>
  );
};
export const taskdataFormatter = ({
  row,
  isRTL,
  setEmployeeItem,
  setOpenEmployeeItem,
  setResourseItem,
  setOpenResourseItem,
  setDepartmentItem,
  setOpenDepartmentItem,
}: any) => {
  const {
    resourseName,
    resourseNameAr,
    departmentName,
    departmentNameAr,
    employeeName,
    employeeNameAr,
  } = row;
  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <Box
          onClick={() => {
            setEmployeeItem(row);
            setOpenEmployeeItem(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          {renderTag({
            value: isRTL ? employeeNameAr : employeeName,
            color: '#333',
            bgcolor: colors.blueGrey[50],
            fontSize: 14,
          })}
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          style={{
            display: 'flex',
            flex: 1,
            cursor: 'pointer',
          }}
          onClick={() => {
            setResourseItem(row);
            setOpenResourseItem(true);
          }}
        >
          {renderTag({
            value: isRTL ? resourseNameAr : resourseName,
            color: '#333',
            bgcolor: colors.blueGrey[50],
            width: 100,
          })}
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box
          style={{
            display: 'flex',
            flex: 1,
          }}
        >
          <Box
            style={{
              display: 'flex',
              flex: 1,
              cursor: 'pointer',
            }}
            onClick={() => {
              setDepartmentItem(row);
              setOpenDepartmentItem(true);
            }}
          >
            {renderTag({
              value: isRTL ? departmentNameAr : departmentName,
              color: '#333',
              bgcolor: colors.blueGrey[50],
              width: 100,
            })}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
export const tasksimpledataFormatter = ({ row }: any) => {
  const { start, end } = row;
  const { status, type } = row;
  let color;
  let bgcolor;
  if (status === 'مقفل' || status === 'Closed') {
    color = colors.blue[500];
    bgcolor = colors.blue[50];
  }
  if (status === 'لم يبدأ بعد' || status === 'Not Started') {
    color = colors.deepPurple[500];
    bgcolor = colors.deepPurple[50];
  }
  if (status === 'غير مقفل' || status === 'Not Closed') {
    color = colors.orange[500];
    bgcolor = colors.orange[50];
  }
  if (status === 'ساري' || status === 'In Progress') {
    color = colors.green[500];
    bgcolor = colors.green[50];
  }
  return (
    <Grid container spacing={0}>
      <Grid item xs={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
        <Typography style={{ fontSize: 13, textAlign: 'center' }}>
          {simpleDateFormatter2(start)}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        {end && (
          <Typography style={{ fontSize: 13, textAlign: 'center' }}>
            {simpleDateFormatter2(end)}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} style={{ marginTop: 3 }}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {renderTag({
            value: type,
            color: '#333',
            bgcolor: colors.blueGrey[50],
          })}
          {renderTag({ value: status, color, bgcolor })}
        </Box>
      </Grid>
    </Grid>
  );
};
export const daysdataFormatter = ({
  row,
  isRTL,
  height = 75,
  bc = '#ddd',
}: any) => {
  const daysData = getTaskTimeAmountSimple(row);
  const marginTop = 5;
  return (
    <Box display={'flex'} style={{ flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <PercentChartTask
            pricolor={colors.deepPurple[500]}
            seccolor={colors.deepPurple[200]}
            progress={daysData?.progress}
            height={height}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                {isRTL ? 'قيمة العقد' : 'Amount'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                {moneyFormat(daysData?.amount)}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                {isRTL ? 'عدد الايام' : 'Days'}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              <Typography style={{ fontSize: 13, fontWeight: 'bold' }}>
                {daysData?.days} / {daysData?.daysnow}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const daysdataMainFormatter = ({
  row,
  isRTL,
  theme,
  height = 250,
  bc = '#ddd',
}: any) => {
  const daysData = getTaskTimeAmountData(row);
  const marginTop = height > 100 ? 20 : 8;
  return (
    <Box display={'flex'} style={{ flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PercentChartTask
            pricolor={colors.deepPurple[500]}
            seccolor={colors.deepPurple[200]}
            progress={daysData?.progress}
            height={height - 10}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={{ marginTop }}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'عدد الايام' : 'Days'}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {daysData?.days}
              </Typography>
            </Grid>
            {daysData?.daysnow && (
              <>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                  >
                    {isRTL ? 'أيام مضت' : 'Spent Days'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                  >
                    {daysData?.daysnow}
                  </Typography>
                </Grid>
              </>
            )}
            {daysData?.dayamount && (
              <>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                  >
                    {isRTL ? 'تكلفة اليوم' : 'Day cost'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    style={{ fontSize: 16, fontWeight: 'bold' }}
                  >
                    {moneyFormat(daysData?.dayamount)}
                  </Typography>
                </Grid>
              </>
            )}
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المستحق' : 'Due', '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(daysData?.amountnow), '#333')}
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'المتبقي' : 'Amount'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {moneyFormat(daysData?.remaining)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const taskStatusFormatter = ({ value }: any) => {
  return (
    <Box
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: value === 10 ? '#39a539a0' : '#ffffff0',
      }}
    >
      {value === 1 && (
        <CircularProgress style={{ color: '#9958ac9b' }} size={16} />
      )}
    </Box>
  );
};
export const eventStatusPrintDataFormatter = (value) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const item = eventStatus.filter((es: any) => es.id === value);
  if (item && item.length > 0) {
    return lang === 'ar' ? item[0].nameAr : item[0].name;
  } else {
    return '';
  }
};

export const moneyFormat = (amount: number) => {
  if (amount) {
    if (!isNaN(amount)) {
      return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
  }
  return '0.00';
};
export const moneyFormatEmpty = (amount: number) => {
  if (amount) {
    if (!isNaN(amount)) {
      return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
  }
  return '';
};

export const simpleDateFormatter = (time: any) => {
  return (
    <div>
      {new Date(time).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </div>
  );
};
export const simpleDateFormatter2 = (time: any) => {
  return new Date(time).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
export const simpleDateFormatterData = (time: any) => {
  return new Date(time).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
export const simpleDateFormatterReceipt = (time: any, isMonthly: any) => {
  if (isMonthly) {
    return new Date(time).toLocaleString('en-GB', {
      month: 'short',
    });
  } else {
    return new Date(time).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
};

export const simpleSpanDateFormatter = (time: any) => {
  return (
    <span>
      {new Date(time).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </span>
  );
};

export const moneyFormatSimple = (amount: number) => {
  if (amount) {
    return amount.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return '0';
  }
};
export const quantityFormat = (amount: number, isRTL: boolean) => {
  if (amount === -1) return isRTL ? 'غير محددود' : 'unlimited';
  if (amount) {
    return amount.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return 0;
  }
};

export const amountFormatter = ({ row }: any) => {
  const { total, discount } = row;
  const amount = total - discount;

  return <div style={{ color: '#403795' }}>{moneyFormat(amount)}</div>;
};
export const totalFormatter = ({ row }: any) => {
  const { qty, phones } = row;
  const total = phones?.length ? qty * phones?.length : 0;

  return <div>{total}</div>;
};
export const currencyFormatter = ({ value }: any) => {
  return (
    <span
      style={{
        color: value >= 0 ? colors.blue[800] : colors.red[400],
      }}
    >
      {moneyFormat(value)}
    </span>
  );
};
export const inFormatter = ({ row }: any) => {
  if (row.opType === 30) return <span>{row.qty}</span>;
  return <span></span>;
};
export const outFormatter = ({ row }: any) => {
  if (row.opType === 10 || row.opType === 61) return <span>{row.qty}</span>;
  return <span></span>;
};
export const reqpackFormatter = ({ row }: any) => {
  const { pack, note } = row;
  if (pack === note || !note || note.length === 0) {
    return <span></span>;
  } else {
    const newpack = JSON.parse(note);
    return <span style={{ color: '#403795' }}>{newpack.titleAr}</span>;
  }
};
export const logoFormatter = ({ value }: any) => {
  return value ? (
    <img
      style={{
        overflow: 'hidden',
        borderRadius: 5,
        objectFit: 'cover',
        borderWidth: 1,
        borderColor: '#ddd',
      }}
      width={100}
      height={50}
      src={value}
    />
  ) : (
    <div style={{ width: 100, height: 50 }}></div>
  );
};
export const templateFormatter = ({ value }: any) => {
  if (!value) return '';
  const temp = JSON.parse(value);
  return temp?.nameAr;
};
export const currencyFormatterEmpty = ({ value }: any) => {
  return <span>{moneyFormat(value)}</span>;
};
export const amountManageFormatter = ({ value, theme }: any) => {
  return (
    <Box>
      <Typography
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.palette.primary.main,
        }}
      >
        {moneyFormat(value)}
      </Typography>
    </Box>
  );
};

export const dueAmountFormatter = ({ row }: any) => {
  const totalinvoiced = row.totalinvoiced ? row.totalinvoiced : 0;
  const totalpaid = row.totalpaid ? row.totalpaid : 0;
  const due = totalinvoiced - totalpaid;
  if (due) {
    return (
      <span style={{ color: colors.red[400] }}>{moneyFormatEmpty(due)}</span>
    );
  } else {
    return <span></span>;
  }
};
export const incomeAmountFormatter = ({ row }: any) => {
  const totalinvoiced = row.totalinvoiced ? row.totalinvoiced : 0;
  const toatlExpenses = row.toatlExpenses ? row.toatlExpenses : 0;
  const totalDiscount = row.totalDiscount ? row.totalDiscount : 0;
  const totalkaidsdebit = row?.totalkaidsdebit ? row.totalkaidsdebit : 0;
  const totalKaidscredit = row?.totalKaidscredit ? row.totalKaidscredit : 0;
  const totalkaids = totalkaidsdebit - totalKaidscredit;
  const income = totalinvoiced - toatlExpenses - totalDiscount - totalkaids;
  if (income) {
    return (
      <span style={{ color: income > 0 ? colors.green[600] : colors.red[400] }}>
        {moneyFormat(income)}
      </span>
    );
  } else {
    return <span></span>;
  }
};
export const totalkaidAmountFormatter = ({ row }: any) => {
  const totalkaidsdebit = row?.totalkaidsdebit ? row.totalkaidsdebit : 0;
  const totalKaidscredit = row?.totalKaidscredit ? row.totalKaidscredit : 0;
  const totalkaids = totalkaidsdebit - totalKaidscredit;
  if (totalkaids) {
    return <span>{moneyFormat(totalkaids)}</span>;
  } else {
    return <span></span>;
  }
};
export const doneFormatter = ({ row, editEvent }: any) => {
  const status = row.status === 10 ? 2 : 10;
  const id = row.id;
  const variables = { id, status };
  return (
    <span>
      <Checkbox
        style={{ padding: 5 }}
        checked={row.status === 10}
        onChange={async () => {
          await editEvent({
            variables,
            optimisticResponse: {
              __typename: 'updateEvent',
              updateEvent: {
                __typename: 'Operation',
                id,
                ...row,
                ...variables,
              },
            },
          });
        }}
        color="primary"
      />
    </span>
  );
};
export const doneShowFormatter = ({ row }: any) => {
  if (row.amount === 0) {
    return <span></span>;
  }
  return (
    <span>
      <Checkbox
        style={{ padding: 5 }}
        checked={row.status === 10}
        disabled
        color="primary"
      />
    </span>
  );
};
export const sentFormatter = ({ row, value, editRAction }: any) => {
  const sent = !value;
  const _id = row._id;
  const variables = { _id, sent };
  return (
    <span>
      <Checkbox
        style={{ padding: 5 }}
        checked={value}
        onChange={async () => {
          await editRAction({
            variables,
            optimisticResponse: {
              __typename: 'updateAction',
              updateEvent: {
                __typename: 'Action',
                _id,
                ...row,
                ...variables,
              },
            },
          });
        }}
        color="primary"
      />
    </span>
  );
};
export const isSalaryFormatter = ({ row, value, editAction }: any) => {
  const isSalary = !value;
  const _id = row._id;
  const variables = { _id, isSalary };
  return (
    <span>
      <Checkbox
        style={{ padding: 5 }}
        checked={value}
        onChange={async () => {
          await editAction({
            variables,
          });
        }}
        color="primary"
      />
    </span>
  );
};
export const sentShowFormatter = ({ value }: any) => {
  return (
    <span>
      <Checkbox
        style={{ padding: 5 }}
        checked={value}
        disabled
        color="primary"
      />
    </span>
  );
};
export const eventFormatter = ({ row }: any) => {
  return <span>{row?.event?.docNo}</span>;
};
export const addFormatter = ({
  row,
  groupId,
  addGtoContact,
  removeGfromContact,
}: any) => {
  const contactId = row._id;
  const checked = row.groupIds.includes(groupId);
  const variables = { contactId, groupId };
  const mutate = checked ? removeGfromContact : addGtoContact;
  return (
    <Checkbox
      style={{ padding: 5 }}
      checked={checked}
      onChange={async () => {
        await mutate({
          variables,
        });
      }}
      color="primary"
    />
  );
};
export const isActiveFormatter = ({ row, editSendreq }: any) => {
  const checked = row.active;
  const variables = { _id: row._id, active: row.active ? false : true };
  return (
    <Checkbox
      style={{ padding: 5 }}
      checked={checked}
      onChange={async () => {
        await editSendreq({
          variables,
        });
      }}
      color="primary"
    />
  );
};
export const isActiveViewFormatter = ({ value }: any) => {
  return (
    <Checkbox style={{ padding: 5 }} checked={value} disabled color="primary" />
  );
};
export const invoiceReceiptFormatter = ({ value, row }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar';
  const { amount } = row;
  const valuePercent = (value / amount) * 100;
  return (
    <Box
      style={{
        width: 100,
        height: 15,
        backgroundColor: '#ddd',
      }}
    >
      <Box
        style={{
          width: valuePercent,
          height: 15,
          backgroundColor: fade(colors.green[500], 0.5),
        }}
      ></Box>
      <Box
        style={{
          position: 'relative',
          bottom: 17,
          right: isRTL ? 30 : undefined,
          left: isRTL ? undefined : 30,
        }}
      >
        <Typography
          style={{ direction: 'ltr', fontWeight: 'bold' }}
          variant="caption"
        >
          {value ? moneyFormat(value) : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export const taskIdFormatter = ({ value, tasks }: any) => {
  const task = tasks.filter((tsk: any) => tsk._id === value);
  if (task && task.length > 0) {
    return <span>{task[0].title}</span>;
  } else {
    return <span></span>;
  }
};

export const nameLinkFormat = ({ row, value, setItem, setOpenItem }: any) => {
  if (!value || value === '') return <div></div>;
  return (
    // <Tooltip title={isRTL ? 'استعراض صفحة الادارة' : 'Managment Page'}>
    <Button
      onClick={() => {
        setItem(row);
        setOpenItem(true);
      }}
      variant="text"
      color="primary"
    >
      <Typography
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        {value}
      </Typography>
    </Button>
    // </Tooltip>
  );
};

export const departmentTypeFormat = ({ row, isRTL }: any) => {
  const { reType } = row;
  const dep = retypeTypes.filter((de: any) => de.id === reType);
  if (dep && dep.length > 0) {
    return (
      <Typography style={{ fontSize: 13 }}>
        {isRTL ? dep[0].nameAr : dep[0].name}
      </Typography>
    );
  } else {
    return <div></div>;
  }
};
export const nameManageLinkProject = ({
  row,
  value,
  setItem,
  setOpenItem,
}: any) => {
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="caption">
              {simpleDateFormatter2(row?.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const nameManageLinkFormat = ({
  row,
  value,
  setItem,
  setOpenItem,
  isRTL,
}: any) => {
  const { retypeId, retypeNameAr, retypeName } = row;
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          {row?.carstatus && (
            <Grid item xs={6}>
              {carstatusFormatter({ value: row.carstatus, isRTL })}
            </Grid>
          )}
          {retypeId && (
            <Grid item xs={6}>
              {renderTag({
                value: isRTL ? retypeNameAr : retypeName,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 100,
              })}
            </Grid>
          )}
          {row?.phone && (
            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
                variant="caption"
              >
                {row?.phone?.substring(3)}
              </Typography>
            </Grid>
          )}
          {row?.address?.length > 0 && (
            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: 12,
                }}
                variant="caption"
              >
                {row?.address}
              </Typography>
            </Grid>
          )}
          {row?.plate && (
            <Grid item xs={6}>
              <Typography
                style={{
                  fontSize: 14,
                  // fontWeight: 'bold',
                  marginRight: 5,
                  marginLeft: 5,
                }}
                // variant="caption"
              >
                {isRTL ? 'رقم : ' : 'No : '} {row.plate}
              </Typography>
            </Grid>
          )}
          {row?.insurance && (
            <Grid item xs={6}>
              <Typography style={{ fontSize: 12 }} variant="caption">
                {isRTL ? 'التأمين : ' : 'Insurance : '} {row.insurance}
              </Typography>
            </Grid>
          )}
          {!row?.phone && !row?.plate && (
            <Grid item xs={12}>
              <Typography variant="caption">
                {simpleDateFormatter2(row?.createdAt)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={10}>
            <Typography style={{ maxWidth: 200 }} variant="caption">
              {row?.desc?.substring(0, 40)}
            </Typography>
          </Grid>
        </Grid>
        {row?.daysoff && (
          <Grid item xs={12}>
            <Typography variant="caption">
              {isRTL ? 'يوم العطلة' : 'Day Off'}:{' '}
              {daysoffFormatter({ value: row.daysoff, isRTL })}
            </Typography>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
export const nameManageLinkCustomer = ({
  row,
  value,
  setItem,
  setOpenItem,
  isRTL,
}: any) => {
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          {row?.phone && (
            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
                variant="caption"
              >
                {isRTL ? 'هاتف' : 'Phone'} {row?.phone?.substring(3)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};
export const nameManageEmployeeRest = ({ row, isRTL }: any) => {
  return (
    <Box>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Typography style={{ fontSize: 13 }}>
              {isRTL ? 'رقم الهاتف' : 'Phone'}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            {row?.phone && (
              <Typography style={{ fontSize: 13 }}>
                {row?.phone?.substring(3)}
              </Typography>
            )}
          </Grid>
          <Grid item xs={5}>
            <Typography style={{ fontSize: 13 }}>
              {isRTL ? 'يوم العطلة' : 'Day Off'}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography style={{ fontSize: 13 }}>
              {daysoffFormatter({ value: row.daysoff, isRTL })}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const nameManageLinkEmployee = ({
  row,
  value,
  setItem,
  setOpenItem,
  isRTL,
}: any) => {
  const { retypeId, retypeNameAr, retypeName, workId } = row;
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            {workId &&
              renderTag({
                value: workId,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 100,
              })}
          </Grid>
          <Grid item xs={6}>
            {retypeId &&
              renderTag({
                value: isRTL ? retypeNameAr : retypeName,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 100,
              })}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const nameResourseRest = ({ row }: any) => {
  return (
    <Box>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            {row?.plate &&
              renderTag({
                value: row.plate,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 120,
              })}
          </Grid>
          <Grid item xs={6}>
            {row?.insurance &&
              renderTag({
                value: row.insurance,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 120,
              })}
          </Grid>
          <Grid item xs={6}>
            {row?.brand &&
              renderTag({
                value: row.brand,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 120,
              })}
          </Grid>
          <Grid item xs={6}>
            {row?.model &&
              renderTag({
                value: row.model,
                color: '#333',
                bgcolor: colors.blueGrey[50],
                width: 120,
              })}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const nameManageLinkSimpleRes = ({
  row,
  value,
  setItem,
  setOpenItem,
  isRTL,
}: any) => {
  const { retypeId, retypeNameAr, retypeName, retypeColor } = row;
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
      <Box
        style={{
          paddingLeft: 5,
          paddingRight: 5,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={6}>
            {row?.carstatus &&
              carstatusFormatter({ value: row.carstatus, isRTL })}
          </Grid>
          <Grid item xs={6}>
            {retypeId &&
              renderTag({
                value: isRTL ? retypeNameAr : retypeName,
                color: '#333',
                bgcolor: fade(retypeColor, 0.1),
                width: 100,
              })}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const nameManageLinkSimple = ({
  row,
  value,
  setItem,
  setOpenItem,
}: any) => {
  if (!value || value === '') return <div></div>;
  return (
    <Box>
      <Button
        onClick={() => {
          if (setItem) {
            setItem(row);
            setOpenItem(true);
          }
        }}
        variant="contained"
        color="primary"
        fullWidth
        style={{
          height: 30,
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: 5,
          marginTop: 5,
        }}
      >
        <Typography style={{ fontSize: 14 }}>{value}</Typography>
      </Button>
    </Box>
  );
};

export const timeActivateView = ({ fullTime, setFullTime, isRTL }) => {
  return (
    <Box style={{ padding: 7 }}>
      <FormControlLabel
        control={
          <Checkbox
            style={{ padding: 7 }}
            checked={fullTime}
            onChange={() => {
              setFullTime(!fullTime);
            }}
            color="primary"
          />
        }
        label={
          <Typography
            color="primary"
            style={{
              fontWeight: 'bold',
            }}
          >
            {isRTL ? 'كامل الفترة' : 'All Time'}
          </Typography>
        }
        style={{ fontSize: 14 }}
      />
    </Box>
  );
};

export const taskDataView = ({ row, words, isRTL }) => {
  const {
    title,
    start,
    end,
    docNo,
    status,
    type,
    customerNameAr,
    customerName,
    customerPhone,
    employeeNameAr,
    employeeName,
    departmentNameAr,
    departmentName,
    resourseNameAr,
    resourseName,
  } = row;
  let color;
  let bgcolor;
  if (status === 'مقفل' || status === 'Closed') {
    color = colors.blue[500];
    bgcolor = colors.blue[50];
  }
  if (status === 'لم يبدأ بعد' || status === 'Not Started') {
    color = colors.deepPurple[500];
    bgcolor = colors.deepPurple[50];
  }
  if (status === 'غير مقفل' || status === 'Not Closed') {
    color = colors.orange[500];
    bgcolor = colors.orange[50];
  }
  if (status === 'ساري' || status === 'In Progress') {
    color = colors.green[500];
    bgcolor = colors.green[50];
  }
  return (
    <Box style={{ padding: 10 }}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 14 }}>{docNo}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {isRTL ? resourseNameAr : resourseName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.customer}</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>{isRTL ? customerNameAr : customerName}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>{customerPhone}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.employee}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{isRTL ? employeeNameAr : employeeName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.department}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{isRTL ? departmentNameAr : departmentName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.time}</Typography>
        </Grid>
        <Grid item xs={3} style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Typography>{simpleDateFormatter2(start)}</Typography>
        </Grid>
        {end && (
          <Grid item xs={3}>
            <Typography>{simpleDateFormatter2(end)}</Typography>
          </Grid>
        )}
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Typography>
            {renderTag({ value: status, color, bgcolor })}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {' '}
            {renderTag({
              value: type,
              color: '#333',
              bgcolor: colors.blueGrey[50],
            })}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    </Box>
  );
};
export const resourseDataView = ({ row, words, isRTL }) => {
  const { name, nameAr, carstatus, plate, insurance, brand, model, info } = row;

  return (
    <Box style={{ padding: 20 }}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Typography variant="h6">{isRTL ? nameAr : name}</Typography>
        </Grid>
        {plate && (
          <Grid item xs={4}>
            <Typography
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginRight: 5,
                marginLeft: 5,
              }}
              variant="caption"
            >
              {plate}
            </Typography>
          </Grid>
        )}
        <Grid item xs={6}>
          {carstatus && carstatusFormatter({ value: carstatus, isRTL })}
        </Grid>

        {insurance && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'التأمين : ' : 'Insurance : '} {insurance}
            </Typography>
          </Grid>
        )}
        {brand && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الماركة : ' : 'Brand : '} {brand}
            </Typography>
          </Grid>
        )}
        {model && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'السنة : ' : 'Model : '} {model}
            </Typography>
          </Grid>
        )}
        {info && (
          <Grid item xs={12}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'معلومات : ' : 'Information : '} {info}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export const employeeDataView = ({ row, words, isRTL }) => {
  const {
    name,
    nameAr,
    phone,
    email,
    daysoff,
    retypeId,
    retypeNameAr,
    retypeName,
    telHome,
    licenseNo,
    licenseDate,
    national,
    nationalNo,
    nationalDate,
    workId,
    // info,
    avatar,
  } = row;
  const bgcolor = name ? nameToColor(`${name}Jadwal2!@`) : '';
  const letter = name?.substring(0, 1)?.toUpperCase() || '';

  const height = 100;
  return (
    <Box style={{ padding: 20 }}>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          {avatar && (
            <Paper
              elevation={2}
              style={{
                overflow: 'hidden',
                borderRadius: 10,
                backgroundColor: '#fff',
                width: height,
                height,
              }}
            >
              <img
                style={{
                  overflow: 'hidden',
                  borderRadius: 10,
                  objectFit: 'cover',
                }}
                width={height}
                height={height}
                src={avatar}
              />
            </Paper>
          )}
          {!avatar && (
            <Box
              style={{
                overflow: 'hidden',
                borderRadius: 10,
                backgroundColor: bgcolor,
                width: height,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                style={{ color: '#eee', fontWeight: 'bold' }}
                variant="h4"
              >
                {letter}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">{isRTL ? nameAr : name}</Typography>
            </Grid>
            {workId && (
              <Grid item xs={6}>
                {renderTag({
                  value: workId,
                  color: '#333',
                  bgcolor: colors.blueGrey[50],
                  width: 100,
                })}
              </Grid>
            )}
            {retypeId && (
              <Grid item xs={6}>
                {renderTag({
                  value: isRTL ? retypeNameAr : retypeName,
                  color: '#333',
                  bgcolor: colors.blueGrey[50],
                  width: 100,
                })}
              </Grid>
            )}
            {daysoff && (
              <Grid item xs={12}>
                <Typography variant="caption">
                  <Typography variant="caption">
                    {isRTL ? 'يوم العطلة' : 'Day Off'}:{' '}
                    {daysoffFormatter({ value: row.daysoff, isRTL })}
                  </Typography>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>

        {phone && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الهاتف : ' : 'Phone : '} {phone}
            </Typography>
          </Grid>
        )}
        {telHome && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'هاتف دولي : ' : 'Interntional : '} {telHome}
            </Typography>
          </Grid>
        )}
        {licenseDate && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {licenseDate}
            </Typography>
          </Grid>
        )}
        {licenseNo && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الرخصة : ' : 'License : '} {licenseNo}
            </Typography>
          </Grid>
        )}

        {nationalNo && (
          <Grid item xs={4}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {nationalNo}
            </Typography>
          </Grid>
        )}
        {nationalDate && (
          <Grid item xs={4}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {nationalDate}
            </Typography>
          </Grid>
        )}
        {national && (
          <Grid item xs={4}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الجنسية : ' : 'Nationality : '} {national}
            </Typography>
          </Grid>
        )}
        {email && (
          <Grid item xs={12}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'البريد : ' : 'Email : '} {email}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export const customerDataView = ({ row, words, isRTL }) => {
  const { name, nameAr, phone, mobile, email, address } = row;

  return (
    <Box style={{ padding: 20 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">{isRTL ? nameAr : name}</Typography>
        </Grid>

        {phone && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الهاتف : ' : '؛Phone : '} {phone}
            </Typography>
          </Grid>
        )}
        {mobile && (
          <Grid item xs={6}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'الجوال : ' : 'Mobile : '} {mobile}
            </Typography>
          </Grid>
        )}
        {email && (
          <Grid item xs={12}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'البريد : ' : 'Email : '} {email}
            </Typography>
          </Grid>
        )}
        {address && (
          <Grid item xs={12}>
            <Typography style={{ fontSize: 12 }} variant="caption">
              {isRTL ? 'العنوان : ' : 'Address : '} {address}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export const projectDataView = ({ row, words, isRTL }) => {
  const {
    name,
    nameAr,
    resourseNameAr,
    resourseName,
    customerNameAr,
    customerName,
    customerPhone,
    employeeNameAr,
    employeeName,
    departmentNameAr,
    departmentName,
  } = row;

  return (
    <Box style={{ padding: 20 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">{isRTL ? nameAr : name}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {isRTL ? resourseNameAr : resourseName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.customer}</Typography>
        </Grid>
        <Grid item xs={7}>
          <Typography>{isRTL ? customerNameAr : customerName}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>{customerPhone}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.employee}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{isRTL ? employeeNameAr : employeeName}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{words.department}</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography>{isRTL ? departmentNameAr : departmentName}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export const taskTypeFormat = ({ value }: any) => {
  return <Typography style={{ fontSize: 13 }}>{value}</Typography>;
};

export const taskStatusFormat = ({ value }: any) => {
  let color;
  if (value === 'مقفل' || value === 'Closed') {
    color = colors.blue[500];
  }
  if (value === 'لم يبدأ بعد' || value === 'Not Started') {
    color = colors.deepPurple[500];
  }
  if (value === 'غير مقفل' || value === 'Not Closed') {
    color = colors.orange[500];
  }
  if (value === 'ساري' || value === 'In Progress') {
    color = colors.green[500];
  }
  return (
    <Typography
      style={{
        fontSize: 13,
        textAlign: 'start',
        color,
      }}
    >
      {value}
    </Typography>
  );
};

export const idLinkFormat = ({
  row,
  value,
  list,
  setItem,
  setOpenItem,
  setName,
  isRTL,
}: any) => {
  const empl = list.filter((em: any) => em._id === value)?.[0];
  if (empl) {
    setItem(empl);
  }

  return (
    <Box
      onClick={() => {
        setItem(row);
        setOpenItem(true);
      }}
      style={{
        cursor: 'pointer',
        borderRadius: 5,
      }}
    >
      <Typography
        style={{
          fontSize: 13,
          textAlign: 'start',
          color: colors.deepPurple[500],
        }}
      >
        {isRTL ? empl?.nameAr : empl?.name}
      </Typography>
    </Box>
  );
};

export const taskIdLinkFormat = ({
  value,
  tasks,
  setItem,
  setOpenItem,
  setName,
}: any) => {
  const task = tasks.filter((tsk: any) => tsk._id === value)?.[0];
  if (task) {
    return (
      <Button
        onClick={() => {
          if (roles.isEditor()) {
            setItem(task);
            setName('task');
            setOpenItem(true);
          }
        }}
        variant="text"
        color="primary"
      >
        <Typography
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          {task.title}
        </Typography>
      </Button>
    );
  } else {
    return <span></span>;
  }
};
export const taskIdFormat = ({ value, tasks }: any) => {
  const task = tasks.filter((tsk: any) => tsk._id === value)?.[0];
  if (task) {
    return (
      <Typography
        style={{
          fontSize: 13,
          textAlign: 'start',
        }}
      >
        {task.title}
      </Typography>
    );
  } else {
    return <span></span>;
  }
};

export const taskNameFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const isRTL = lang === 'ar';
  return (
    <span style={{ color: '#403795' }}>
      {getTaskName({ id: value, isRTL })}
    </span>
  );
};
export const progressFormatter = ({ value }: any) => {
  return (
    <Box
      style={{
        width: 100,
        height: 15,
        backgroundColor: '#ddd',
      }}
    >
      <Box
        style={{
          width: value,
          height: 15,
          backgroundColor: fade(colors.blue[500], 0.5),
        }}
      ></Box>
      <Box style={{ position: 'relative', bottom: 17, right: 40 }}>
        <Typography
          style={{ direction: 'ltr', fontWeight: 'bold' }}
          variant="caption"
        >
          {value ? `${parseInt(value)}%` : ''}
        </Typography>
      </Box>
    </Box>
  );
};
export const appointmentsFormatter = ({
  row,
  theme,
  isRTL,
  height = 100,
  bc = '#ddd',
}: any) => {
  const progress = row?.evQty
    ? Math.round((row?.evDone / row?.evQty) * 100) / 100
    : 0;

  return (
    <Box
      display={'flex'}
      border={0.2}
      borderColor={bc}
      borderRadius={15}
      style={{ flex: 1, height }}
    >
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PercentChartTask
            pricolor={theme.palette.primary.main}
            seccolor={theme.palette.secondary.main}
            progress={progress}
            height={height - 10}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={0}>
            <Grid item xs={9} style={{ marginTop: 8 }}>
              <Typography style={{ fontSize: 12 }} variant="caption">
                {isRTL ? 'عدد المواعيد' : 'Appointments'}
              </Typography>
            </Grid>
            <Grid item xs={3} style={{ marginTop: 8 }}>
              <Typography style={{ fontSize: 12 }} variant="caption">
                {row?.evQty || 0}
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography style={{ fontSize: 12 }} variant="caption">
                {isRTL ? 'المواعيد المنجزة' : 'Done'}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography style={{ fontSize: 12 }} variant="caption">
                {row?.evDone || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                style={{ fontWeight: 'bold', fontSize: 12, marginTop: 20 }}
              >
                {isRTL ? 'الاجمالي' : 'Total'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                style={{ fontWeight: 'bold', fontSize: 12, marginTop: 20 }}
              >
                {moneyFormat(row?.amount)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const appointTaskFormatter = ({
  row,
  theme,
  isRTL,
  height = 100,
  bc = '#ddd',
}: any) => {
  const eventamount = row?.evQty ? row?.amount / row?.evQty : 0;
  const amountnow = row?.evQty ? eventamount * row?.evDone : 0;
  const remaining = row?.evQty ? row?.amount - amountnow : 0;
  const progress = row?.evQty
    ? Math.round((row?.evDone / row?.evQty) * 100) / 100
    : 0;

  return (
    <Box
      display={'flex'}
      border={0.2}
      borderColor={bc}
      borderRadius={15}
      style={{ flex: 1, height }}
    >
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <PercentChartTask
            pricolor={theme.palette.primary.main}
            seccolor={theme.palette.secondary.main}
            progress={progress}
            height={height - 10}
          />
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={6} style={{ marginTop: 8 }}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {isRTL ? 'المواعيد' : 'Appoints'}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 8 }}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {row?.evQty || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {isRTL ? 'المنجزة' : 'Done'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {row?.evDone || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {isRTL ? 'تكلفة الموعد' : 'One Cost'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {moneyFormat(eventamount)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'المستحق' : 'Due', '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(amountnow), '#333')}
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {isRTL ? 'المتبقي' : 'Amount'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                {moneyFormat(remaining)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const appointTaskMainFormatter = ({
  row,
  theme,
  isRTL,
  height = 250,
}: any) => {
  const eventamount = row?.evQty ? row?.amount / row?.evQty : 0;
  const amountnow = row?.evQty ? eventamount * row?.evDone : 0;
  const remaining = row?.evQty ? row?.amount - amountnow : 0;
  const progress = row?.evQty
    ? Math.round((row?.evDone / row?.evQty) * 100) / 100
    : 0;

  return (
    <Box display={'flex'} style={{ flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PercentChartTask
            pricolor={theme.palette.primary.main}
            seccolor={theme.palette.secondary.main}
            progress={progress}
            height={height - 10}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={{ marginTop: 20 }}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'المواعيد' : 'Appointments'}
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ marginTop: 20 }}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {row?.evQty || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'المنجزة' : 'Done'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {row?.evDone || 0}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'تكلفة الموعد' : 'Appointment Cost'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {moneyFormat(eventamount)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المستحق' : 'Due', '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(amountnow), '#333')}
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {isRTL ? 'المتبقي' : 'Amount'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body2"
                style={{ fontSize: 16, fontWeight: 'bold' }}
              >
                {moneyFormat(remaining)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const appointmentsMainFormatter = ({ row, theme, isRTL }: any) => {
  const progress = row?.evQty
    ? Math.round((row?.evDone / row?.evQty) * 100) / 100
    : 0;

  return (
    <Box display={'flex'} style={{ flex: 1, paddingTop: 15, height: 240 }}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PercentChartTask
            pricolor={theme.palette.primary.main}
            seccolor={theme.palette.secondary.main}
            progress={progress}
            height={200}
          />
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={7} style={{ marginTop: 35 }}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {isRTL ? 'قيمة التعاقد' : 'Contarct Amount'}
              </Typography>
            </Grid>
            <Grid item xs={5} style={{ marginTop: 35 }}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {moneyFormat(row?.coAmount)}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {isRTL ? 'المواعيد' : 'Appointments'}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {moneyFormat(row?.evAmount)}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {isRTL ? 'العدد' : 'Quantity'}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {row?.evQty || 0}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {isRTL ? 'المنجزة' : 'Done'}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography style={{ fontWeight: 'bold' }} variant="subtitle1">
                {row?.evDone || 0}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const renderColorTag = (title: any, color: any, value: any) => {
  return (
    <Box
      style={{
        display: 'flex',
        height: 30,
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <Typography style={{ color, width: 150, fontSize: 14 }}>
        {title}
      </Typography>
      <Typography style={{ color, fontSize: 14 }}>
        {moneyFormat(value)}
      </Typography>
    </Box>
  );
};

export const employeeMainFormatter = ({ row, theme, isRTL }: any) => {
  const {
    totalCustodyDebit,
    totalCustodyCredit,
    totalAdvancePay,
    totalAdvanceRec,
  } = row;
  const dcolor = colors.blue[800];
  const ccolor = colors.blue[400];
  const pcolor = colors.purple[800];
  const rcolor = colors.purple[400];
  const dtitle = isRTL ? 'عهدة' : 'Custody Debit';
  const ctitle = isRTL ? 'دفع من عهدة' : 'Custody Credit';
  const ptitle = isRTL ? 'سلفة' : 'Advanced Debit';
  const rtitle = isRTL ? 'دفع من سلفة' : 'Advanced Credit';
  const artitle = isRTL ? 'الباقي' : 'Balance';
  return (
    <Box display={'flex'} style={{ flex: 1, paddingTop: 15, height: 240 }}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <CustodyChart
            row={row}
            height={100}
            dcolor={dcolor}
            ccolor={ccolor}
            pcolor={pcolor}
            rcolor={rcolor}
          ></CustodyChart>
        </Grid>
        <Grid item xs={6} style={{ marginTop: 10 }}>
          {renderColorTag(dtitle, dcolor, totalCustodyDebit)}
          {renderColorTag(ctitle, ccolor, totalCustodyCredit)}
          <Divider></Divider>
          {renderColorTag(
            artitle,
            dcolor,
            totalCustodyDebit - totalCustodyCredit
          )}
          <Box style={{ height: 15 }}></Box>
          {renderColorTag(ptitle, pcolor, totalAdvancePay)}
          {renderColorTag(rtitle, rcolor, totalAdvanceRec)}
          <Divider></Divider>
          {renderColorTag(artitle, pcolor, totalAdvancePay - totalAdvanceRec)}
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </Box>
  );
};

const rCell = (title: any, color: any) => (
  <Typography
    variant="body2"
    style={{
      fontSize: 12,
      color,
      fontWeight: 'bold',
    }}
  >
    {title}
  </Typography>
);
const rCellMain = (title: any, color: any) => (
  <Typography
    style={{
      fontSize: 14,
      color,
      fontWeight: 'bold',
    }}
  >
    {title}
  </Typography>
);

export const raseedFormatter = ({ value }: any) => {
  const color = value < 0 ? colors.red[600] : colors.grey[800];
  return (
    <Box
      display={'flex'}
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Typography
        style={{
          color,
          fontWeight: 'bold',
          fontSize: 16,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {moneyFormat(value)}
      </Typography>
    </Box>
  );
};
export const salesFormatter = ({
  row,
  isRTL,
  theme,
  height = 100,
  bc = '#ddd',
}: any) => {
  const acolor = colors.grey[700];
  const scolor = colors.blue[400];
  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  const marginTop = height > 100 ? 20 : 10;
  const raseed = row?.totalinvoiced - row?.totalpaid - row?.totalDiscount;
  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height }}
    >
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <SalesChart
            scolor={scolor}
            pcolor={pcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
          ></SalesChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(isRTL ? 'القيمة' : 'Amount', acolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(moneyFormat(row?.amount), acolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الفواتير' : 'Invoices', scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalinvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'المقبوضات' : 'Receipts', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalpaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              <Box>{rCell(isRTL ? 'الرصيد' : 'Balance', '#333')}</Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                {rCell(
                  moneyFormat(raseed),
                  raseed < 0 ? colors.red[400] : '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const salesTaskFormatter = ({
  row,
  isRTL,
  theme,
  height = 100,
  bc = '#ddd',
}: any) => {
  const scolor = colors.blue[400];
  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  const marginTop = height > 100 ? 20 : 8;
  const raseed = row?.totalinvoiced - row?.totalpaid - row?.totalDiscount;

  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height }}
    >
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <SalesChart
            scolor={scolor}
            pcolor={pcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
          ></SalesChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(isRTL ? 'قيمة العقد' : 'Amount', '#333')}
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(moneyFormat(row?.amount), '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الفواتير' : 'Invoices', scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalinvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'المقبوضات' : 'Receipts', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalpaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الرصيد' : 'Balance', '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCell(
                moneyFormat(raseed),
                raseed < 0 ? colors.red[400] : '#333'
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const salesTaskMainFormatter = ({
  row,
  isRTL,
  theme,
  height = 200,
  bc = '#ddd',
}: any) => {
  const acolor = colors.grey[700];
  const scolor = colors.blue[400];
  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  const marginTop = height > 100 ? 20 : 8;
  const raseed = row?.totalinvoiced - row?.totalpaid - row?.totalDiscount;

  return (
    <Box display={'flex'} style={{ flex: 1, height }}>
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <SalesChart
            acolor={acolor}
            scolor={scolor}
            pcolor={pcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
          ></SalesChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={2}>
            <Grid item xs={6} style={{ marginTop }}>
              {rCellMain(isRTL ? 'قيمة العقد' : 'Contract Amount', '#333')}
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              {rCellMain(moneyFormat(row?.coAmount), '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'الفواتير' : 'Invoices', scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalinvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المقبوضات' : 'Receipts', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalpaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'الرصيد' : 'Balance', '#333')}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(
                moneyFormat(raseed),
                raseed < 0 ? colors.red[400] : '#333'
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const expensesFormatter = ({
  row,
  theme,
  isRTL,
  height = 100,
  bc = '#ddd',
}: any) => {
  const pcolor = colors.red[300];
  const ecolor = colors.red[500];
  const marginTop = height > 100 ? 20 : 10;

  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height, paddingLeft: 10, paddingRight: 10 }}
    >
      <Grid container spacing={1}>
        <Grid item xs={9}>
          <Grid container spacing={0}>
            <Grid item xs={7} style={{ marginTop }}>
              {rCell(isRTL ? 'الاستهلاك' : 'Products', pcolor)}
            </Grid>
            <Grid item xs={5} style={{ marginTop }}>
              {rCell(moneyFormat(row?.toatlProdExpenses), pcolor)}
            </Grid>
            <Grid item xs={7}>
              {rCell(isRTL ? 'المصروفات' : 'Expenses', ecolor)}
            </Grid>
            <Grid item xs={5}>
              {rCell(moneyFormat(row?.toatlExpenses), ecolor)}
            </Grid>
            <Grid item xs={7}>
              <Box style={{ marginTop: 25 }}>
                {rCell(isRTL ? 'المجموع' : 'Total', '#333')}
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box style={{ marginTop: 25 }}>
                {rCell(
                  moneyFormat(row?.toatlExpenses + row?.toatlProdExpenses),
                  '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <ExpensesChart
            ecolor={ecolor}
            pcolor={pcolor}
            row={row}
            theme={theme}
          ></ExpensesChart>
        </Grid>
      </Grid>
    </Box>
  );
};
export const kaidsFormatter = ({
  row,
  theme,
  isRTL,
  height = 100,
  bc = '#ddd',
}: any) => {
  const ccolor = colors.blueGrey[300];
  const dcolor = colors.brown[400];
  const marginTop = height > 100 ? 20 : 10;

  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height, paddingLeft: 10, paddingRight: 10 }}
    >
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Grid container spacing={0}>
            <Grid item xs={5} style={{ marginTop }}>
              {rCell(isRTL ? 'المدينة' : 'Debit', dcolor)}
            </Grid>
            <Grid item xs={7} style={{ marginTop }}>
              {rCell(moneyFormat(row?.totalkaidsdebit), dcolor)}
            </Grid>
            <Grid item xs={5}>
              {rCell(isRTL ? 'الدائنة' : 'Credit', ccolor)}
            </Grid>
            <Grid item xs={7}>
              {rCell(moneyFormat(row?.totalKaidscredit), ccolor)}
            </Grid>
            <Grid item xs={5}>
              <Box style={{ marginTop: 25 }}>
                {rCell(isRTL ? 'الرصيد' : 'Balance', '#333')}
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box style={{ marginTop: 25 }}>
                {rCell(
                  moneyFormat(row?.totalkaidsdebit - row?.totalKaidscredit),
                  '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <KaidsChart
            ccolor={ccolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
          ></KaidsChart>
        </Grid>
      </Grid>
    </Box>
  );
};
export const purchaseFormatter = ({
  row,
  theme,
  isRTL,
  height = 100,
  bc = '#ddd',
}: any) => {
  const scolor = colors.deepPurple[400];
  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  const marginTop = height > 100 ? 20 : 10;
  const raseed =
    row?.totalPurchaseInvoiced -
    row?.totalPurchasePaid -
    row?.totalPurchaseDiscount;
  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height }}
    >
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <PurchaseChart
            scolor={scolor}
            pcolor={pcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
          ></PurchaseChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={0}>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(isRTL ? 'المشتريات' : 'Purchases', scolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop }}>
              {rCell(moneyFormat(row?.totalPurchaseInvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'المدفوعات' : 'Payments', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalPurchasePaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCell(moneyFormat(row?.totalPurchaseDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              <Box>{rCell(isRTL ? 'الرصيد' : 'Balance', '#333')}</Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                {rCell(
                  moneyFormat(raseed),
                  raseed < 0 ? colors.red[400] : '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const salesMainFormatter = ({
  row,
  isRTL,
  theme,
  height = 200,
}: any) => {
  const scolor = colors.blue[400];
  const acolor = colors.grey[700];

  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  return (
    <Box style={{ display: 'flex', flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <SalesChart
            scolor={scolor}
            pcolor={pcolor}
            acolor={acolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
            height={height}
          ></SalesChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(isRTL ? 'الفواتير' : 'Invoices', scolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(moneyFormat(row?.totalinvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المقبوضات' : 'Receipts', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalpaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(isRTL ? 'الرصيد' : 'Balance', '#333')}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(
                  moneyFormat(
                    row?.totalinvoiced - row?.totalpaid - row?.totalDiscount
                  ),
                  '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const incomeFormatter = ({
  row,
  isRTL,
  theme,
  height = 100,
  bc = '#ddd',
}: any) => {
  const scolor = colors.blue[400];
  const ecolor = colors.red[500];
  const sales = row?.totalinvoiced - row?.totalDiscount;
  const expenses = row?.toatlExpenses + row?.toatlProdExpenses;
  const balance = sales - expenses;
  return (
    <Box
      border={0.2}
      borderColor={bc}
      display={'flex'}
      borderRadius={15}
      style={{ flex: 1, height, paddingLeft: 10, paddingRight: 10 }}
    >
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={7} style={{ marginTop: 10 }}>
              {rCell(isRTL ? 'المبيعات' : 'Net Sales', scolor)}
            </Grid>
            <Grid item xs={5} style={{ marginTop: 10 }}>
              {rCell(moneyFormat(sales), scolor)}
            </Grid>
            <Grid item xs={7}>
              {rCell(isRTL ? 'المصروفات' : 'Net Expenses', ecolor)}
            </Grid>
            <Grid item xs={5}>
              {rCell(moneyFormat(expenses), ecolor)}
            </Grid>

            <Grid item xs={7}>
              <Box style={{ marginTop: 25 }}>
                {rCell(isRTL ? 'صافي الربح' : 'Balance', '#333')}
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box style={{ marginTop: 25 }}>
                {rCell(moneyFormat(balance), '#333')}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <IncomeChart
            scolor={scolor}
            ecolor={ecolor}
            row={row}
            theme={theme}
            height={height}
          ></IncomeChart>
        </Grid>
      </Grid>
    </Box>
  );
};
export const incomeMainFormatter = ({
  row,
  isRTL,
  theme,
  height = 200,
}: any) => {
  const scolor = colors.blue[400];
  const ecolor = colors.red[500];
  const sales = row?.totalinvoiced - row?.totalDiscount;
  const expenses =
    row?.toatlExpenses +
    row?.toatlProdExpenses +
    row.totalExpPetty +
    row.toatlExpPayable;
  const balance = sales - expenses;
  return (
    <Box style={{ display: 'flex', flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <IncomeChart
            scolor={scolor}
            ecolor={ecolor}
            row={row}
            theme={theme}
            height={height}
          ></IncomeChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={6} style={{ marginTop: 50 }}>
              {rCellMain(isRTL ? 'المبيعات' : 'Net Sales', scolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 50 }}>
              {rCellMain(moneyFormat(sales), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المصروفات' : 'Net Expenses', ecolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(expenses), ecolor)}
            </Grid>

            <Grid item xs={6}>
              <Box style={{ marginTop: 30 }}>
                {rCellMain(isRTL ? 'صافي الربح' : 'Income', '#333')}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 30 }}>
                {rCellMain(moneyFormat(balance), '#333')}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const purchaseMainFormatter = ({
  row,
  theme,
  isRTL,
  height = 200,
}: any) => {
  const scolor = colors.deepPurple[400];
  const pcolor = colors.green[400];
  const dcolor = colors.orange[400];
  return (
    <Box style={{ display: 'flex', flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={5}>
          <PurchaseChart
            scolor={scolor}
            pcolor={pcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
            height={height}
          ></PurchaseChart>
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(isRTL ? 'المشتريات' : 'Purchases', scolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(moneyFormat(row?.totalPurchaseInvoiced), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المدفوعات' : 'Payments', pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalPurchasePaid), pcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'الخصومات' : 'Discounts', dcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(row?.totalPurchaseDiscount), dcolor)}
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(isRTL ? 'الرصيد' : 'Balance', '#333')}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(
                  moneyFormat(
                    row?.totalPurchaseInvoiced -
                      row?.totalPurchasePaid -
                      row?.totalPurchaseDiscount
                  ),
                  '#333'
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
export const expensesMainFormatter = ({
  row,
  theme,
  isRTL,
  height = 200,
}: any) => {
  const { toatlExpenses, totalExpPetty, toatlExpPayable, toatlProdExpenses } =
    row;
  const ecolor = colors.red[300];
  const pcolor = colors.deepOrange[500];
  const bcolor = colors.orange[500];
  const dcolor = colors.amber[500];
  const etitle = isRTL ? 'المصروفات' : 'Expenses';
  const ptitle = isRTL ? 'مصروف عهدة' : 'Products';
  const btitle = isRTL ? 'مصروف مورد' : 'Products';
  const dtitle = isRTL ? 'الاستهلاك' : 'Products';
  return (
    <Box style={{ display: 'flex', flex: 1, height }}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <ExpensesChart
            ecolor={ecolor}
            pcolor={pcolor}
            bcolor={bcolor}
            dcolor={dcolor}
            row={row}
            theme={theme}
            height={height}
          ></ExpensesChart>
        </Grid>
        <Grid item xs={8} style={{ marginTop: 30 }}>
          {renderColorTag(etitle, ecolor, toatlExpenses)}
          {renderColorTag(ptitle, pcolor, totalExpPetty)}
          {renderColorTag(btitle, bcolor, toatlExpPayable)}
          {renderColorTag(dtitle, dcolor, toatlProdExpenses)}
        </Grid>
      </Grid>
    </Box>
  );
};
export const kaidsMainFormatter = ({
  row,
  theme,
  isRTL,
  height = 200,
}: any) => {
  const ccolor = colors.blueGrey[300];
  const dcolor = colors.brown[400];
  return (
    <Box
      style={{
        height,
        paddingLeft: 30,
        paddingRight: 30,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={7} style={{ marginTop: 30 }}>
          {rCellMain(isRTL ? 'القيود المدينة' : 'Debit', dcolor)}
        </Grid>
        <Grid item xs={5} style={{ marginTop: 30 }}>
          {rCellMain(moneyFormat(row?.totalkaidsdebit), dcolor)}
        </Grid>
        <Grid item xs={7}>
          {rCellMain(isRTL ? 'القيود الدائنة' : 'Credit', ccolor)}
        </Grid>
        <Grid item xs={5}>
          {rCellMain(moneyFormat(row?.totalKaidscredit), ccolor)}
        </Grid>
        <Grid item xs={7} style={{ marginTop: 20 }}>
          {rCellMain(isRTL ? 'رصيد القيود' : 'Entries Balance', '#333')}
        </Grid>
        <Grid item xs={5} style={{ marginTop: 20 }}>
          {rCellMain(
            moneyFormat(row?.totalkaidsdebit - row?.totalKaidscredit),
            '#333'
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export const raseedMainFormatter = ({
  row,
  theme,
  isRTL,
  height = 200,
}: any) => {
  const scolor = colors.blue[400];
  const gcolor = colors.green[500];
  const ecolor = colors.red[500];
  const totalinvoiced = row?.totalinvoiced || 0;
  const totalDiscount = row?.totalDiscount || 0;
  const totalpaid = row?.totalpaid || 0;
  const toatlExpenses = row?.toatlExpenses || 0;
  const toatlProdExpenses = row?.toatlProdExpenses || 0;
  const totalExpPetty = row?.totalExpPetty || 0;
  const toatlExpPayable = row?.toatlExpPayable || 0;

  const sales = totalinvoiced - totalDiscount;
  const paid = totalpaid;
  const expenses =
    toatlExpenses + toatlProdExpenses + totalExpPetty + toatlExpPayable;
  const balance = sales - paid - expenses;
  return (
    <Box style={{ display: 'flex', flex: 1, height }}>
      <Grid container spacing={0}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Grid container spacing={1}>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(isRTL ? 'المبيعات' : 'Net Sales', scolor)}
            </Grid>
            <Grid item xs={6} style={{ marginTop: 30 }}>
              {rCellMain(moneyFormat(sales), scolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المدفوعات' : 'Paid', gcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(paid), gcolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(isRTL ? 'المصروفات' : 'Expenses', ecolor)}
            </Grid>
            <Grid item xs={6}>
              {rCellMain(moneyFormat(expenses), ecolor)}
            </Grid>
            <Divider></Divider>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(isRTL ? 'الرصيد' : 'Balance', '#333')}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box style={{ marginTop: 20 }}>
                {rCellMain(moneyFormat(balance), '#333')}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
};

export const carstatusFormatter = ({ value, isRTL }: any) => {
  let status = isRTL ? 'متوفر' : 'Available';
  const color =
    value === 1
      ? colors.green[500]
      : value === 3
      ? colors.red[500]
      : value === 2
      ? colors.grey[500]
      : value === 10
      ? colors.blue[500]
      : '#333';
  const bgcolor =
    value === 1
      ? colors.green[50]
      : value === 3
      ? colors.red[50]
      : value === 2
      ? colors.grey[50]
      : value === 10
      ? colors.blue[50]
      : '#ddd';
  const cstat = carstatuss.filter((cs: any) => cs.id === value)?.[0];
  if (cstat?.nameAr) {
    status = isRTL ? cstat?.nameAr : cstat?.name;
  }
  return <>{renderTag({ value: status, color, bgcolor })}</>;
};
export const deleteFormatter = ({ removeItem, row }: any) => {
  return (
    <span
      onClick={removeItem(row.indx - 1)}
      style={{ color: '#ffffff', padding: 5, backgroundColor: '#e99393' }}
    >
      X
    </span>
  );
};
export const opTypeFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const lang = store?.lang;
  const name =
    lang === 'ar' ? opTypesNames?.[value]?.nameAr : opTypesNames?.[value]?.name;
  return <Typography>{name}</Typography>;
};
export const actionTypeFormatter = ({ row }: any) => {
  const name =
    row.type === 1 ? row.phone : row.type === 2 ? row.email : 'Notification';
  return <span>{name}</span>;
};

export const calculateAmount = (item: any) => {
  const credit = item?.credit;
  const debit = item?.debit;
  const accType = item?.accType;
  const value =
    accType === actionType.DEBIT && debit > 0
      ? debit
      : accType === actionType.DEBIT && credit > 0
      ? -credit
      : accType === actionType.CREDIT && credit > 0
      ? credit
      : accType === actionType.CREDIT && debit > 0
      ? -debit
      : 0;
  return value;
};

export const kaidAmountFormatter = ({ row }: any) => {
  const credit = row?.credit;
  const debit = row?.debit;
  const accType = row?.accType;

  const value =
    accType === actionType.DEBIT && debit > 0
      ? debit
      : accType === actionType.DEBIT && credit > 0
      ? -credit
      : accType === actionType.CREDIT && credit > 0
      ? credit
      : accType === actionType.CREDIT && debit > 0
      ? -debit
      : 0;

  return <div style={{ color: '#403795' }}>{moneyFormat(value)}</div>;
};

export const getNameOfDocument = (opType: number) => {
  const name = Object.keys(operationTypes).find(
    (key) => operationTypes[key] === opType
  );
  if (name) {
    return operationNames[name];
  } else {
    return '';
  }
};

export const typeFormatter = ({ row }: any) => {
  const { opType } = row;
  const type = getNameOfDocument(opType);

  return <div style={{ fontSize: 12 }}>{type}</div>;
};
export const itemTotalFormatter = ({ row }: any) => {
  const { cost, quantity } = row;

  return (
    <div style={{ fontSize: 12 }}>{moneyFormat(cost * quantity || 0)}</div>
  );
};

export const accountFormatter = (props: any, accounts: any, isRTL: any) => {
  const account = accounts.filter((acc: any) => acc.code === props.value);
  return (
    <Typography style={{ fontSize: 14 }}>
      {account && account.length > 0
        ? isRTL
          ? account[0].nameAr
          : account[0].name
        : ''}
    </Typography>
  );
};
export const groupFormatter = (props: any, groups: any, isRTL: any) => {
  const gs = groups.filter((grp: any) => props.value?.includes(grp._id));
  if (gs && gs.length > 0) {
    return gs.map((g: any) => (
      <span style={{ padding: 5 }}>{isRTL ? g.nameAr : g.name}</span>
    ));
  } else {
    return <span></span>;
  }
};

export const customerAccountFormatter = (
  props: any,
  accounts: any,
  isRTL: any
) => {
  const customer =
    props?.row?.customerId && props?.row?.creditAcc === 1100
      ? isRTL
        ? props?.row?.customerNameAr
        : props?.row?.customerName
      : undefined;
  if (customer) {
    return <div style={{ fontSize: 14 }}>{customer}</div>;
  } else {
    const account = accounts.filter((acc: any) => acc.code === props.value);

    return (
      <div style={{ fontSize: 14 }}>
        {account && account.length > 0
          ? isRTL
            ? account[0].nameAr
            : account[0].name
          : ''}
      </div>
    );
  }
};

export const employeeColorStyle = {
  // backgroundImage:
  //   "linear-gradient(180deg,transparent 50%, rgba(255,255,255,0.9) 50%)",
  // backgroundSize: "1px 5px",
};
export const mainBackgroud = {
  backgroundColor: '#ecf1fa',
  // opacity: "0.3",
  backgroundImage:
    'radial-gradient(#D0D7F1 0.75px, transparent 0.75px), radial-gradient(#D0D7F1 0.75px, #ecf1fa 0.75px)',
  backgroundSize: '30px 30px',
  backgroundPosition: '0 0,15px 15px',
};

// background-color: gray;
// background-image: linear-gradient(90deg, transparent 50%, rgba(255,255,255,.5) 50%);
// background-size: 50px 50px;

// background-color:white;
// background-image: linear-gradient(90deg, rgba(200,0,0,.5) 50%, transparent 50%),
// linear-gradient(rgba(200,0,0,.5) 50%, transparent 50%);
// background-size:50px 50px;

// background-color: gray;
// background-image: linear-gradient(transparent 50%, rgba(255,255,255,.5) 50%);
// background-size: 50px 50px;

// background-color: gray;
// background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px);

// background: linear-gradient(45deg, #dca 12%, transparent 0, transparent 88%, #dca 0),
//     linear-gradient(135deg, transparent 37%, #a85 0, #a85 63%, transparent 0),
//     linear-gradient(45deg, transparent 37%, #dca 0, #dca 63%, transparent 0) #753;
//     background-size: 25px 25px;
