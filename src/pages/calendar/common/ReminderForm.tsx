/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import { PopupCustomer, PopupDeprtment, PopupEmployee } from '../../../pubups';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';
import { Grid } from '@material-ui/core';
import { CalenderLocal, TextFieldLocal } from '../../../components';
import AutoFieldLocal from '../../../components/fields/AutoFieldLocal';
import { weekdaysNNo } from '../../../constants/datatypes';
import { setRowFromAppointment } from '../../../common/calendar';
import {
  actionTypeFormatter,
  getDateDayTimeFormat,
  getDateDayWeek,
} from '../../../Shared/colorFormat';
import { useCustomers, useTemplate } from '../../../hooks';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PopupResourses from '../../../pubups/PopupResourses';
import useDepartmentsUp from '../../../hooks/useDepartmentsUp';
import useEmployeesUp from '../../../hooks/useEmployeesUp';
import useResoursesUp from '../../../hooks/useResoursesUp';
import PopupMaps from '../../../pubups/PopupMaps';
import PopupAddrRule from '../../../pubups/PopupAddrRule';
import PopupReminderAction from '../../../pubups/PopupReminderAction';

export const indexTheList = (list: any) => {
  return list.map((item: any, index: any) => {
    return {
      ...item,
      index,
    };
  });
};

export const ReminderForm = (props: any) => {
  const { onFieldChange, appointmentData, theme } = props;

  const row = setRowFromAppointment(appointmentData);

  const [startDate, setStartDate]: any = useState(row?.startDate);

  const [custvalue, setCustvalue] = useState<any>(null);
  const [emplvalue, setEmplvalue] = useState<any>(null);
  const [departvalue, setDepartvalue] = useState<any>(null);
  const [resovalue, setResovalue] = useState<any>(null);

  const [openAction, setOpenAction] = useState(false);
  const [actionslist, setActionslist] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tasktitle, setTasktitle]: any = useState();

  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState(null);

  const [rrule, setRrule] = useState<any>(null);
  const [openMulti, setOpenMulti] = useState(false);

  const [newtext, setNewtext] = useState('');

  const [openCust, setOpenCust] = useState(false);
  const [openDep, setOpenDep] = useState(false);
  const [openEmp, setOpenEmp] = useState(false);
  const [openRes, setOpenRes] = useState(false);

  const { customers, addCustomer, editCustomer } = useCustomers();
  const { tempwords, tempoptions } = useTemplate();
  const { departments, addDepartment, editDepartment } = useDepartmentsUp();
  const { employees, addEmployee, editEmployee } = useEmployeesUp();
  const { resourses, addResourse, editResourse } = useResoursesUp();

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  const isemployee = user?.isEmployee && user?.employeeId;

  const openDepartment = () => {
    setOpenDep(true);
  };
  const onCloseDepartment = () => {
    setOpenDep(false);
    setNewtext('');
  };
  const openEmployee = () => {
    setOpenEmp(true);
  };
  const onCloseEmploee = () => {
    setOpenEmp(false);
    setNewtext('');
  };
  const openResourse = () => {
    setOpenRes(true);
  };
  const onCloseResourse = () => {
    setOpenRes(false);
    setNewtext('');
  };
  const openCustomer = () => {
    setOpenCust(true);
  };
  const onCloseCustomer = () => {
    setOpenCust(false);
    setNewtext('');
  };

  useEffect(() => {
    if (isemployee) {
      const emp = employees.filter(
        (em: any) => em._id === user.employeeId
      )?.[0];
      setEmplvalue(emp);
    }
  }, [user]);

  useEffect(() => {
    if (row && row._id) {
      if (row.employee && employees.length > 0 && !emplvalue) {
        const empl = employees.filter(
          (emp: any) => emp._id === row?.employee?._id
        )?.[0];
        setEmplvalue(empl);
      }
      if (row.resourse && resourses.length > 0 && !resovalue) {
        const empl = resourses.filter(
          (emp: any) => emp._id === row?.resourse?._id
        )?.[0];
        setResovalue(empl);
      }
      if (row.customer && customers.length > 0 && !custvalue) {
        const empl = customers.filter(
          (emp: any) => emp._id === row?.customer?._id
        )?.[0];
        setCustvalue(empl);
      }
      if (row.department && departments.length > 0 && !departvalue) {
        const empl = departments.filter(
          (emp: any) => emp._id === row?.department?._id
        )?.[0];
        setDepartvalue(empl);
      }
    }
  }, [employees, resourses, departments, customers]);

  const onNewFieldChange = (nextValue: any, name: any) => {
    onFieldChange({ [name]: nextValue });
  };

  useEffect(() => {
    if (!row.status) {
      onNewFieldChange(2, 'status');
    }
  }, [row.status]);
  useEffect(() => {
    const title = row.title ? row.title : tasktitle ? tasktitle : '';
    setTasktitle(title);
    onNewFieldChange(title, 'title');
  }, [row.title]);

  const selectCustomer = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        customerId: undefined,
        customerName: undefined,
        customerNameAr: undefined,
        customerPhone: undefined,
      };
      onNewFieldChange(value, 'customerId');
      onNewFieldChange(value, 'customerName');
      onNewFieldChange(value, 'customerNameAr');
      onNewFieldChange(value, 'customerPhone');
    }
    onNewFieldChange(newValue, 'customer');
    setCustvalue(newValue);
  };
  const selectDepartment = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        departmentId: undefined,
        departmentName: undefined,
        departmentNameAr: undefined,
        departmentColor: undefined,
      };
      onNewFieldChange(value, 'departmentId');
      onNewFieldChange(value, 'departmentName');
      onNewFieldChange(value, 'departmentNameAr');
      onNewFieldChange(value, 'departmentColor');
    }
    onNewFieldChange(newValue, 'department');
    setDepartvalue(newValue);
  };
  const selectEmployee = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        employeeId: undefined,
        employeeName: undefined,
        employeeNameAr: undefined,
        employeeColor: undefined,
      };
      onNewFieldChange(value, 'employeeId');
      onNewFieldChange(value, 'employeeName');
      onNewFieldChange(value, 'employeeNameAr');
      onNewFieldChange(value, 'employeeColor');
    }
    onNewFieldChange(newValue, 'employee');
    setEmplvalue(newValue);
    if (newValue?.departmentId) {
      const dept = departments.filter(
        (dep: any) => dep._id === newValue?.departmentId
      )?.[0];
      onNewFieldChange(dept, 'department');
      setDepartvalue(dept);
    }
  };
  const selectResourse = (value: any) => {
    let newValue = value;
    if (!value) {
      newValue = {
        resourseId: undefined,
        resourseName: undefined,
        resourseNameAr: undefined,
        resourseColor: undefined,
      };
      onNewFieldChange(value, 'resourseId');
      onNewFieldChange(value, 'resourseName');
      onNewFieldChange(value, 'resourseNameAr');
      onNewFieldChange(value, 'resourseColor');
    }
    onNewFieldChange(newValue, 'resourse');
    setResovalue(newValue);
    if (newValue?.departmentId) {
      const dept = departments.filter(
        (dep: any) => dep._id === newValue?.departmentId
      )?.[0];
      onNewFieldChange(dept, 'department');
      setDepartvalue(dept);
    }
  };

  useEffect(() => {
    if (!row._id) {
      if (emplvalue) {
        if (emplvalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === emplvalue?.departmentId
          )?.[0];
          onNewFieldChange(dept, 'department');
        }
      }
    }
  }, [emplvalue]);

  useEffect(() => {
    if (!row._id) {
      if (resovalue) {
        if (resovalue?.departmentId) {
          const dept = departments.filter(
            (dep: any) => dep._id === resovalue?.departmentId
          )?.[0];
          onNewFieldChange(dept, 'department');
        }
      }
    }
  }, [resovalue]);

  useEffect(() => {
    onFieldChange({ actions: JSON.stringify(actionslist) });
  }, [actionslist]);

  const addActionToList = (item: any) => {
    const newArray = [...actionslist, item];
    const listwithindex = indexTheList(newArray);
    setActionslist(listwithindex);
  };
  const editActionInList = (item: any) => {
    const newArray = actionslist.map((it: any) => {
      if (it._id === item._id) {
        return item;
      } else {
        return it;
      }
    });
    const listwithindex = indexTheList(newArray);
    setActionslist(listwithindex);
  };

  const removeActionFromList = (item: any) => {
    const newlist = actionslist.filter((il: any) => il.index !== item.index);
    const listwithindex = indexTheList(newlist);
    setActionslist(listwithindex);
  };

  const date = row?.startDate ? new Date(row?.startDate) : new Date();
  const day = weekdaysNNo?.[date.getDay()];

  return (
    <>
      <Box style={{ position: 'absolute', top: 50, left: 30 }}>
        <Typography
          style={{ fontWeight: 'bold', marginTop: 15 }}
          variant="body2"
        >
          {row?.docNo}
        </Typography>
      </Box>
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <CalenderLocal
                isRTL={isRTL}
                label={words.start}
                value={startDate}
                onChange={(d: any) => {
                  setStartDate(d);
                  onNewFieldChange(d, 'startDate');
                  onNewFieldChange(d, 'runtime');
                  const end = new Date(d).getTime() + 60 * 60 * 1000;
                  onNewFieldChange(new Date(end), 'endDate');
                }}
                format="dd/MM/yyyy - hh:mm"
                time
              ></CalenderLocal>
            </Grid>
            <Grid item xs={11}>
              <TextFieldLocal
                autoFocus={true}
                name="tasktitle"
                label={words.title}
                value={tasktitle}
                onChange={(e: any) => {
                  setTasktitle(e.target.value);
                  onNewFieldChange(e.target.value, 'title');
                }}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={6}>
              <AutoFieldLocal
                name="customer"
                title={tempwords?.customer}
                words={words}
                options={customers}
                value={custvalue}
                setSelectValue={selectCustomer}
                isRTL={isRTL}
                openAdd={openCustomer}
                fullWidth
                showphone
              ></AutoFieldLocal>
            </Grid>

            {!tempoptions?.noEmp && (
              <Grid item xs={6}>
                <AutoFieldLocal
                  name="employee"
                  title={tempwords?.employee}
                  words={words}
                  options={employees}
                  disabled={isemployee}
                  value={emplvalue}
                  setSelectValue={selectEmployee}
                  openAdd={openEmployee}
                  isRTL={isRTL}
                  fullWidth
                  day={day}
                ></AutoFieldLocal>
              </Grid>
            )}
            {!tempoptions?.noRes && (
              <Grid item xs={6}>
                <AutoFieldLocal
                  name="resourse"
                  title={tempwords?.resourse}
                  words={words}
                  options={resourses}
                  value={resovalue}
                  setSelectValue={selectResourse}
                  openAdd={openResourse}
                  isRTL={isRTL}
                  fullWidth
                  day={day}
                ></AutoFieldLocal>
              </Grid>
            )}
            <Grid item xs={6}>
              <AutoFieldLocal
                name="department"
                title={tempwords?.department}
                words={words}
                options={departments}
                value={departvalue}
                setSelectValue={selectDepartment}
                openAdd={openDepartment}
                isRTL={isRTL}
                fullWidth
              ></AutoFieldLocal>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 5,
              padding: 7,
              margin: 10,
            }}
          >
            <Button
              variant="outlined"
              style={{
                marginBottom: 5,
                fontSize: 14,
                minWidth: 80,
              }}
              onClick={() => {
                setSelected(null);
                setOpenAction(true);
              }}
            >
              {isRTL ? 'اضافة رسائل نصية' : 'Add SMSs'}
            </Button>
            <Paper style={{ height: 170, overflow: 'auto' }}>
              {actionslist.map((act: any) => {
                return (
                  <ListItem>
                    <ListItemText
                      primary={actionTypeFormatter({ row: act })}
                      secondary={getDateDayTimeFormat(act.sendtime, isRTL)}
                    />
                    <IconButton
                      onClick={() => removeActionFromList(act)}
                      title="Delete row"
                      style={{ padding: 5, margin: 5 }}
                    >
                      <DeleteOutlinedIcon
                        style={{ fontSize: 22, color: '#a76f9a' }}
                      />
                    </IconButton>
                    <IconButton
                      style={{ padding: 5 }}
                      onClick={() => {
                        setSelected(act);
                        setOpenAction(true);
                      }}
                      title="Edit row"
                    >
                      <EditOutlinedIcon
                        style={{ fontSize: 22, color: '#729aaf' }}
                      />
                    </IconButton>
                  </ListItem>
                );
              })}
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={12}></Grid>
            <Grid item xs={4}>
              <Button
                style={{ minWidth: 100, marginTop: 5 }}
                variant="contained"
                onClick={() => setOpenMulti(true)}
              >
                {isRTL ? 'تكرار' : 'Repeate'}
              </Button>
              {rrule?.all && (
                <Button
                  style={{
                    minWidth: 100,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                  variant="outlined"
                  onClick={() => setRrule(null)}
                >
                  {isRTL ? 'الغاء التكرار' : 'Cancel Repeate'}
                </Button>
              )}
            </Grid>
            <Grid item xs={8}>
              {rrule?.all && (
                <Paper
                  style={{
                    height: 210,
                    overflow: 'auto',
                  }}
                >
                  <Box style={{ flexDirection: 'row' }}>
                    {rrule?.all?.map((al: any, index: any) => {
                      return (
                        <Box
                          display="flex"
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#f5f5f5',
                            margin: 4,
                            padding: 4,
                          }}
                        >
                          <Typography>{getDateDayWeek(al, isRTL)}</Typography>
                          <Typography variant="caption">{index + 1}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Grid>
        <PopupAddrRule
          start={startDate}
          open={openMulti}
          onClose={() => setOpenMulti(false)}
          onSubmit={setRrule}
          theme={theme}
          isRTL={isRTL}
          words={words}
          noStartView={true}
          noEndView={true}
        ></PopupAddrRule>
        <PopupCustomer
          newtext={newtext}
          open={openCust}
          onClose={onCloseCustomer}
          isNew={true}
          setNewValue={selectCustomer}
          row={null}
          addAction={addCustomer}
          editAction={editCustomer}
        ></PopupCustomer>
        <PopupDeprtment
          newtext={newtext}
          open={openDep}
          onClose={onCloseDepartment}
          isNew={true}
          setNewValue={selectDepartment}
          row={null}
          addAction={addDepartment}
          editAction={editDepartment}
          depType={1}
        ></PopupDeprtment>
        <PopupEmployee
          newtext={newtext}
          departments={departments}
          open={openEmp}
          onClose={onCloseEmploee}
          isNew={true}
          setNewValue={selectEmployee}
          row={null}
          resType={1}
          addAction={addEmployee}
          editAction={editEmployee}
        ></PopupEmployee>
        <PopupResourses
          newtext={newtext}
          departments={departments}
          open={openRes}
          onClose={onCloseResourse}
          isNew={true}
          setNewValue={selectResourse}
          row={null}
          resType={1}
          addAction={addResourse}
          editAction={editResourse}
        ></PopupResourses>
        <PopupReminderAction
          open={openAction}
          onClose={() => setOpenAction(false)}
          row={selected}
          isNew={selected ? false : true}
          addAction={addActionToList}
          editAction={editActionInList}
          theme={theme}
          runtime={startDate}
        ></PopupReminderAction>
        <PopupMaps
          open={openMap}
          onClose={() => setOpenMap(false)}
          isRTL={isRTL}
          theme={theme}
          location={location}
          setLocation={(value: any) => {
            setLocation(value);
            onNewFieldChange(value, 'location');
          }}
        ></PopupMaps>
      </Grid>
    </>
  );
};
