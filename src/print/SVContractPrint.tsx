/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box, Typography } from '@material-ui/core';
import React from 'react';
import { tafkeet } from '../common/helpers';
import {
  simpleSpanDateFormatter,
  covertToTimeOnly,
  getDateDayWeekGB,
  moneyFormatEmpty,
} from '../Shared/colorFormat';
import { carlist, custlist } from './lists';

const printcolor = '#0E9DAD';

export class SVContractPrint extends React.PureComponent<any, any> {
  renderHeader = (company: any) => (
    <Grid item xs={12}>
      <img
        src={company?.header}
        alt={company?.name}
        height="auto"
        width="100%"
        style={{
          objectFit: 'contain',
        }}
      />
    </Grid>
  );
  renderFooter = (company: any) => (
    <Grid item xs={12}>
      <img
        src={company?.footer}
        alt={company?.name}
        height={50}
        width="100%"
        style={{
          objectFit: 'contain',
          alignSelf: 'flex-start',
        }}
      />
    </Grid>
  );

  renderCarFooter = () => (
    <img
      src={
        'https://res.cloudinary.com/fivegstore/image/upload/v1649414122/car_2_gs0d21.png'
      }
      alt={'car'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );
  renderCarTameen = () => (
    <img
      src={
        'https://res.cloudinary.com/fivegstore/image/upload/v1649415448/tameen_evlk8b.png'
      }
      alt={'car insurance'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );
  renderNotes = (info: any, isRTL: any) => {
    const notes = info?.[2]?.value;
    return (
      <Box style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Typography style={{ fontSize: 14 }}>{notes}</Typography>
      </Box>
    );
  };
  renderSignatureFooter = () => (
    <img
      src={
        'https://res.cloudinary.com/fivegstore/image/upload/v1647785315/signature_xjbt4u.png'
      }
      alt={'car'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );
  renderBunud = () => (
    <img
      src={
        'https://res.cloudinary.com/fivegstore/image/upload/v1647780352/bunud_x6o6im.png'
      }
      alt={'car'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );
  renderPetrol = () => (
    <img
      // src={
      //   'https://res.cloudinary.com/fivegstore/image/upload/v1648541509/petrol_dsgxej.jpg'
      // }
      src={
        'https://res.cloudinary.com/fivegstore/image/upload/v1652033731/footerbig_qciqee.png'
      }
      alt={'car'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );

  renderTitle = (data: any) => (
    <Grid container spacing={0}>
      <Grid item xs={2}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <div>No: {data?.no}</div>
          <div>Date: {simpleSpanDateFormatter(data?.start)}</div>
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Box
          border={2}
          borderColor={printcolor}
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            display: 'flex',
            padding: 5,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 15,
            paddingRight: 15,
            color: printcolor,
          }}
        >
          <div>VEHICLE RENTAL AGREEMENT</div>
          <div>عقد ايجار سيارة</div>
        </Box>
      </Grid>

      <Grid item xs={2}></Grid>
    </Grid>
  );
  renderTitle2 = (data: any) => (
    <Grid container spacing={0}>
      <Grid item xs={2}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <div>No: {data?.no}</div>
          <div>Date: {simpleSpanDateFormatter(data?.start)}</div>
        </Box>
      </Grid>
      <Grid item xs={8}></Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );

  renderCarRow = (item: any, data: any) => {
    let d = '';
    const kmout = Number(data?.info?.[0]?.value);
    const kmin = Number(data?.info?.[1]?.value);

    if (item.id === 1) {
      if (data?.isRTL) {
        d = data?.resovalue?.nameAr;
      } else {
        d = data?.resovalue?.name;
      }
    } else if (item?.id === 2) {
      d = data?.resovalue?.plate;
    } else if (item?.id === 3) {
      d = `${getDateDayWeekGB(data?.start, data?.isRTL)}`;
    } else if (item?.id === 4) {
      d = `${covertToTimeOnly(data?.start)}`;
    } else if (item?.id === 5) {
      d = `${getDateDayWeekGB(data?.end, data?.isRTL)}`;
    } else if (item?.id === 6) {
      d = `${covertToTimeOnly(data?.end)}`;
    } else if (item?.id === 7 && kmout) {
      d = `${kmout}`;
    } else if (item?.id === 8 && kmin) {
      d = `${kmin}`;
    } else if (item?.id === 9 && kmout && kmin) {
      d = `${kmin - kmout}`;
    } else if (item?.id === 10) {
      d = data?.resovalue?.insurance;
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={9}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              paddingRight: 2,
              paddingLeft: 2,
            }}
          >
            {d}
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              direction: 'rtl',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              fontSize: 10,
              height: 30,
            }}
          >
            <div>{item?.nameAr}</div>
            <div>{item?.name}</div>
          </Box>
        </Grid>
      </Grid>
    );
  };
  renderCustRow = (item: any, customer: any, isRTL: any) => {
    let d = '';
    if (item?.id === 1) {
      if (isRTL) {
        d = customer?.nameAr;
      } else {
        d = customer?.name;
      }
    } else if (item?.id === 2) {
      d = customer?.address;
    } else if (item?.id === 4) {
      d = customer?.phone;
    } else if (item?.id === 5) {
      d = customer?.driver;
    } else if (item?.id === 6) {
      d = customer?.licenseNo;
    } else if (item?.id === 7) {
      d = customer?.licenseDate;
    } else if (item?.id === 9) {
      d = customer?.national;
    } else if (item?.id === 10) {
      d = customer?.nationalNo;
    } else if (item?.id === 11) {
      d = customer?.nationalDate;
    }
    return (
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              direction: 'ltr',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              fontSize: 9,
              height: 26,
              paddingRight: 2,
              paddingLeft: 2,
            }}
          >
            <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
              {item?.name}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 26,
              fontSize: 14,
            }}
          >
            {d}
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              direction: 'rtl',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              fontSize: 9,
              height: 26,
              paddingRight: 2,
              paddingLeft: 2,
            }}
          >
            <div>{item?.nameAr}</div>
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderCarBox = (list: any, data: any) => (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {list?.map((cl: any) => this.renderCarRow(cl, data))}
      </Grid>
    </Grid>
  );
  renderCustBox = (list: any, customer: any, isRTL: any) => (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {list?.map((cl: any) => this.renderCustRow(cl, customer, isRTL))}
      </Grid>
    </Grid>
  );

  renderPriceType = (data: any) => {
    const { isRTL, freq, interval, amount, evQty } = data;
    const unit =
      freq === 1 || (freq === 3 && interval > 27)
        ? isRTL
          ? 'شهري'
          : 'Monthly'
        : freq === 2
        ? isRTL
          ? 'اسبوعي'
          : 'Weekly'
        : isRTL
        ? 'يومي'
        : 'Daily';
    const price = amount / evQty;
    return (
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                <Box>السعر</Box>
                <Box>Price</Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                <Box>العدد</Box>
                <Box>Quantity</Box>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                <Box>الوحدة</Box>
                <Box>Unit</Box>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                {moneyFormatEmpty(price)}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                {evQty}
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                border={1}
                borderColor="grey.400"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 'bold',
                  flexDirection: 'column',
                  height: 30,
                }}
              >
                {unit}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderRight={0}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 60,
            }}
          >
            <Box>السعر المتفق عليه</Box>
            <Box>Km Price</Box>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              flexDirection: 'column',
              height: 30,
            }}
          >
            {moneyFormatEmpty(amount)}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderRight={0}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              fontSize: 10,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 30,
            }}
          >
            <Box>القيمة</Box>
            <Box>Amount</Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 30,
            }}
          >
            {amount && <Box>{tafkeet(amount, isRTL)}</Box>}
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderPeriod = (data: any) => {
    const { amount, totalpaid } = data;
    return (
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              flexDirection: 'column',
              height: 30,
            }}
          >
            QR
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              flexDirection: 'column',
              height: 30,
            }}
          >
            {moneyFormatEmpty(totalpaid)}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderRight={0}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              fontSize: 10,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 30,
            }}
          >
            <Box>مدفوعات</Box>
            <Box>Payments</Box>
          </Box>
        </Grid>

        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              flexDirection: 'column',
              height: 30,
            }}
          >
            QR
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              flexDirection: 'column',
              height: 30,
            }}
          ></Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderRight={0}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              fontSize: 10,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 30,
            }}
          >
            <Box>أشياء اخرى</Box>
            <Box>Others</Box>
          </Box>
        </Grid>
        <Grid item xs={1}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              flexDirection: 'column',
              height: 30,
            }}
          >
            QR
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              flexDirection: 'column',
              height: 30,
            }}
          >
            {moneyFormatEmpty(amount - totalpaid)}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderRight={0}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              fontSize: 10,
              flexDirection: 'column',
              backgroundColor: '#0E9DAD',
              color: '#fff',
              height: 30,
            }}
          >
            <Box>الرصيد المستحق</Box>
            <Box>Balance Due/Refund</Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderDivider = (x: number) => (
    <Grid item xs={12}>
      <Box m={x}></Box>
    </Grid>
  );

  render() {
    const data = this.props.printData;
    const isRTL = data?.isRTL;
    const { company } = this.props;
    return (
      <Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {this.renderTitle(data)}
                  </Grid>
                  <Grid item xs={6}>
                    {this.renderCustBox(custlist, data?.custvalue, isRTL)}
                    {this.renderDivider(1)}
                    {this.renderPeriod(data)}
                  </Grid>
                  <Grid item xs={6}>
                    {this.renderCarBox(carlist, data)}
                    {this.renderDivider(2)}
                    {this.renderPriceType(data)}
                  </Grid>
                </Grid>
              </Box>
              <Box style={{ marginLeft: 30, marginRight: 30, marginTop: 15 }}>
                <Box
                  style={{
                    position: 'absolute',
                    zIndex: 111,
                    bottom: 310,
                    right: 70,
                    width: 340,
                    height: 100,
                  }}
                >
                  {this.renderNotes(data?.info, isRTL)}
                </Box>
                {this.renderPetrol()}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={0}>
                  {this.renderTitle2(data)}
                  <Box
                    ml={-2}
                    mr={-2}
                    mt={2}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      height: 800,
                    }}
                  >
                    {this.renderBunud()}
                  </Box>
                </Grid>
              </Box>
              {this.renderDivider(5)}
              {this.renderFooter(company)}
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
