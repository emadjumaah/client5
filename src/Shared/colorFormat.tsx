/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  Checkbox,
  CircularProgress,
  colors,
  fade,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { roles } from '../common';
import {
  isSuperAdmin,
  isBranchAdmin,
  isEditor,
  isWriter,
  isViewer,
  isFinance,
  isOperate,
  isAdmin,
} from '../common/roles';
import { operationTypes } from '../constants';
import { getTaskName } from '../constants/branch';
import {
  carstatuss,
  eventColors,
  eventStatus,
  operationNames,
  opTypesNames,
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
      <Box>
        {days.map((day: any) => {
          return (
            <span key={day} style={{ marginRight: 2, marginLeft: 2 }}>
              {isRTL ? weekdaysObj[day]?.nameAr : weekdaysObj[day]?.name}{' '}
            </span>
          );
        })}
      </Box>
    );
  } else {
    <Box>{value}</Box>;
  }
  return <Box></Box>;
};
export const rolesFormatter = ({ row, isRTL }: any) => {
  const user = row;
  const isF = isFinance(user);
  const isO = isOperate(user);
  const isA = isAdmin(user);
  const isE = isEditor(user);
  const isW = isWriter(user);
  const isV = isViewer(user);

  if (isSuperAdmin(user)) {
    return <Box>{isRTL ? 'الأدمن' : 'Main Admin'}</Box>;
  }
  if (isBranchAdmin(user)) {
    return <Box>{isRTL ? 'مدير عام' : 'Branch Admin'}</Box>;
  }
  if (isA) {
    if (isF && isO) {
      return <Box>{isRTL ? 'مدير حسابات وعمليات' : 'Admin / General'}</Box>;
    } else if (isF) {
      return <Box>{isRTL ? 'مدير حسابات' : 'Admin / Accountant'}</Box>;
    } else if (isO) {
      return <Box>{isRTL ? 'مدير عمليات' : 'Admin / Accountant'}</Box>;
    } else {
      return <Box>{isRTL ? 'مدير' : 'Admin'}</Box>;
    }
  }
  if (isE) {
    if (isF && isO) {
      return <Box>{isRTL ? 'محرر حسابات وعمليات' : 'Editor / General'}</Box>;
    } else if (isF) {
      return <Box>{isRTL ? 'محرر حسابات' : 'Editor / Accountant'}</Box>;
    } else if (isO) {
      return <Box>{isRTL ? 'محرر عمليات' : 'Editor / Accountant'}</Box>;
    } else {
      return <Box>{isRTL ? 'محرر' : 'Editor'}</Box>;
    }
  }
  if (isW) {
    if (isF && isO) {
      return <Box>{isRTL ? 'كاتب حسابات وعمليات' : 'writer / General'}</Box>;
    } else if (isF) {
      return <Box>{isRTL ? 'كاتب حسابات' : 'writer / Accountant'}</Box>;
    } else if (isO) {
      return <Box>{isRTL ? 'كاتب عمليات' : 'writer / Accountant'}</Box>;
    } else {
      return <Box>{isRTL ? 'كاتب' : 'writer'}</Box>;
    }
  }
  if (isV) {
    if (isF && isO) {
      return <Box>{isRTL ? 'زائر حسابات وعمليات ' : 'Viewer / General'}</Box>;
    } else if (isF) {
      return <Box>{isRTL ? 'زائر حسابات' : 'Viewer / Accountant'}</Box>;
    } else if (isO) {
      return <Box>{isRTL ? 'زائر عمليات' : 'Viewer / Accountant'}</Box>;
    } else {
      return <Box>{isRTL ? 'زائر' : 'Viewer'}</Box>;
    }
  }

  return <Box></Box>;
};

export const avatarPatternFormatter = ({ row }: any) => {
  const { name, color } = row;

  return (
    <Box>
      <AvatarColor name={name} bg={color}></AvatarColor>
    </Box>
  );
};
export const sectionsTypeFormatter = ({ value }: any) => {
  const store = getStoreItem('store');
  const { lang } = store;
  const nameObj = sectionTypes.filter((st: any) => st.value === value)?.[0];
  const name = nameObj ? (lang === 'ar' ? nameObj.nameAr : nameObj.name) : '';

  return <span>{name}</span>;
};

export const avatarFormatter = ({ row }: any) => {
  const { name, username, color } = row;

  return (
    <Box>
      <Avatar username={username} name={name} bg={color}></Avatar>
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
  const { lang } = store;
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
  const { lang } = store;
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
  const { lang } = store;
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
  const { lang } = store;
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
export const currencyFormatter = ({ value }: any) => {
  return (
    <span style={{ color: value >= 0 ? colors.blue[800] : colors.red[400] }}>
      {moneyFormat(value)}
    </span>
  );
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
  return (
    <span style={{ color: value >= 0 ? colors.blue[500] : colors.red[500] }}>
      {moneyFormat(value)}
    </span>
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
  const inc = totalinvoiced - toatlExpenses - totalDiscount;
  if (inc) {
    return (
      <span style={{ color: colors.green[800] }}>{moneyFormatEmpty(inc)}</span>
    );
  } else {
    return <span></span>;
  }
};
export const doneFormatter = ({ row, editEvent }: any) => {
  if (row.amount === 0) {
    return <span></span>;
  }
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
  const { lang } = store;
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
  const task = tasks.filter((tsk: any) => tsk.id === value);
  if (task && task.length > 0) {
    return <span>{task[0].title}</span>;
  } else {
    return <span></span>;
  }
};

export const nameLinkFormat = ({ row, value, setItem, setOpenItem }: any) => {
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
        {value}
      </Typography>
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
  const task = tasks.filter((tsk: any) => tsk.id === value)?.[0];
  if (task) {
    return (
      <div
        onClick={() => {
          if (roles.isEditor()) {
            setItem(task);
            setName('task');
            setOpenItem(true);
          }
        }}
        style={{ cursor: roles.isEditor() ? 'pointer' : undefined }}
      >
        <Typography
          style={{
            fontSize: 13,
            textAlign: 'start',
            color: roles.isEditor() ? colors.deepPurple[500] : undefined,
          }}
        >
          {task.title}
        </Typography>
      </div>
    );
  } else {
    return <span></span>;
  }
};
export const taskIdFormat = ({ value, tasks }: any) => {
  const task = tasks.filter((tsk: any) => tsk.id === value)?.[0];
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
  const { lang } = store;
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
  const cstat = carstatuss.filter((cs: any) => cs.id === value)?.[0];
  if (cstat?.nameAr) {
    status = isRTL ? cstat?.nameAr : cstat?.name;
  }

  return <div style={{ color }}>{status}</div>;
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
  const { lang } = store;
  const name =
    lang === 'ar' ? opTypesNames?.[value]?.nameAr : opTypesNames?.[value]?.name;
  return <span>{name}</span>;
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

export const accountFormatter = (props: any, accounts: any, isRTL: any) => {
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
