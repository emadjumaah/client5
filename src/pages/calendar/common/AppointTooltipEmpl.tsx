/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@material-ui/core';
import { roles, timeToHourMinute } from '../../../common';
import { cardClasses } from '../../../themes/classes';
import PopupAppointInvoice from '../../../pubups/PopupAppointInvoice';
import { GContextTypes } from '../../../types';
import { GlobalContext } from '../../../contexts';
import { useLazyQuery } from '@apollo/client';
import { getOperationItems } from '../../../graphql';
import { useTemplate } from '../../../hooks';
import { StatusSelect } from './StatusSelect';
import MyIcon from '../../../Shared/MyIcon';

export const AppointTooltipEmpl = ({
  appointmentData,
  setVisible,
  services,
  editEvent,
  company,
  viewonly,
  theme,
  tasks,
}: any) => {
  const [itemsList, setItemsList] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [stat] = useState(appointmentData?.status);
  // const [isEditor, setIsEditor] = useState(false);

  const {
    translate: { words, isRTL },
  }: GContextTypes = useContext(GlobalContext);

  const classes = cardClasses();
  const { tempwords } = useTemplate();
  // useEffect(() => {
  //   const isCalPOSEditor = roles.isEditor();
  //   const isEmployee = roles.isEmployee();
  //   setIsEditor(isCalPOSEditor || isEmployee);
  // }, []);

  const onStatusChange = async (value: any) => {
    await editEvent({
      variables: {
        id: appointmentData.id,
        status: value,
      },
    });
    setVisible(false);
    setOpen(false);
  };

  const {
    startDate,
    endDate,
    customerName,
    customerNameAr,
    customerPhone,
    items,
    status,
    amount,
    docNo,
    contractId,
    contractName,
    contractNameAr,
    title,
    location,
  } = appointmentData;

  const task = tasks.filter((t: any) => t._id === contractId)?.[0];

  const [getItems, itemsData]: any = useLazyQuery(getOperationItems, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (appointmentData && appointmentData._id) {
      const variables = { opId: appointmentData._id };
      getItems({
        variables,
      });
    }
  }, []);

  useEffect(() => {
    const items = itemsData?.data?.['getOperationItems']?.data || [];
    if (items && items.length > 0) {
      const ids = items.map((it: any) => it.itemId);
      const servlist = services.filter((ser: any) => ids.includes(ser._id));

      const itemsWqtyprice = items.map((item: any, index: any) => {
        const {
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
          resourseId,
          resourseName,
          resourseNameAr,
          resourseColor,
        } = item;
        const serv = servlist.filter((se: any) => se._id === item.itemId)[0];
        return {
          ...serv,
          categoryId,
          categoryName,
          categoryNameAr,
          departmentId,
          departmentName,
          departmentNameAr,
          departmentColor,
          employeeId,
          employeeName,
          employeeNameAr,
          employeeColor,
          resourseId,
          resourseName,
          resourseNameAr,
          resourseColor,
          contractId,
          contractName,
          contractNameAr,
          index,
          itemprice: item.itemPrice,
          itemqty: item.qty,
          itemtotal: item.total,
          // itemtotalcost: item.qty * serv.cost,
        };
      });
      itemsWqtyprice.sort((a: any, b: any) =>
        a.indx > b.indx ? 1 : b.indx > a.indx ? -1 : 0
      );
      setItemsList(itemsWqtyprice);
    }
  }, [itemsData]);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const handleNewInvoice = () => {
    setOpen(true);
  };

  const desabledSave =
    (!customerPhone && !items) || status === 10 || !roles.isEditor();

  return (
    <Card style={{ direction: isRTL ? 'rtl' : 'ltr' }} className={classes.root}>
      <CardContent>
        {status && (
          <Box
            display="flex"
            style={{
              position: 'absolute',
              height: 30,
              paddingRight: 5,
              paddingLeft: 5,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
              left: 10,
              top: 10,
            }}
          >
            <StatusSelect
              status={stat}
              noTitle={true}
              setStatus={onStatusChange}
              onNewFieldChange={() => null}
              isRTL={isRTL}
              title={words.status}
            ></StatusSelect>
          </Box>
        )}
        <Box
          display="flex"
          style={{ alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {docNo}
          </Typography>
        </Box>
        <Box
          display="flex"
          style={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box>
            <Typography gutterBottom variant="subtitle2" component="h2">
              {startDate.toLocaleString(isRTL ? 'ar-QA' : 'en-US', options)}
            </Typography>
          </Box>
          <Box display="flex" style={{ marginBottom: 3 }}>
            <div>
              {timeToHourMinute(startDate, isRTL ? 'ar-QA' : 'en-US')} -{' '}
            </div>
            <div> {timeToHourMinute(endDate, isRTL ? 'ar-QA' : 'en-US')}</div>
          </Box>
        </Box>

        <Box style={{ alignItems: 'center', justifyContent: 'flex-start' }}>
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {tempwords?.task}: {task?.title}
          </Typography>
          <Typography style={{ fontWeight: 'bold' }} variant="body2">
            {tempwords?.appointment}: {title}
          </Typography>
        </Box>

        <Box>
          <Typography gutterBottom variant="h6" component="h5">
            {isRTL ? customerNameAr : customerName}
          </Typography>
          <Typography
            style={{ marginTop: -5, marginLeft: 5 }}
            gutterBottom
            variant="subtitle1"
            component="h2"
          >
            {customerPhone}
          </Typography>
        </Box>
        <Divider></Divider>
        <Box
          display="flex"
          style={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          {itemsList?.[0] && (
            <Typography gutterBottom variant="h6" component="h1">
              {isRTL ? itemsList?.[0].nameAr : itemsList?.[0].name}
            </Typography>
          )}

          {amount && (
            <Typography
              style={{
                zIndex: 10,
                padding: 3,
                backgroundColor: '#667fb5',
                color: '#fff',
              }}
              gutterBottom
              variant="subtitle2"
              component="h2"
            >
              {amount} QR
            </Typography>
          )}
        </Box>
        {location && location?.lat && (
          <Box
            display="flex"
            style={{
              marginTop: 10,
              flexDirection: 'column',
              cursor: 'pointer',
              width: 40,
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
            onClick={() => {
              window.open(
                // `https://www.google.com/maps/search/?api=1&query=${location?.lat}, ${location?.lng}`
                `https://www.google.com/maps/dir/?api=1&destination=${location?.lat}, ${location?.lng}`
              );
            }}
          >
            <MyIcon size={28} color="#667fb5" icon="resourse"></MyIcon>
            <Typography variant="caption" style={{ color: '#667fb5' }}>
              Drive
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions>
        {!viewonly && (
          <Box
            m={1}
            display="flex"
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <Button
              size="medium"
              color="primary"
              variant="outlined"
              onClick={handleNewInvoice}
              disabled={desabledSave}
            >
              {words.addInvoice}
            </Button>
          </Box>
        )}
      </CardActions>
      <PopupAppointInvoice
        open={open}
        onClose={() => {
          setVisible(false);
          setOpen(false);
        }}
        appoint={appointmentData}
        services={services}
        editEvent={editEvent}
        company={company}
        theme={theme}
        items={itemsList}
      ></PopupAppointInvoice>
    </Card>
  );
};
