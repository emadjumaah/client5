/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { tafkeet } from '../common/helpers';
import {
  simpleSpanDateFormatter,
  covertToTimeOnly,
  getDateDayWeek,
  moneyFormatEmpty,
} from '../Shared/colorFormat';
import { carlist, custlist } from './lists';

const printcolor = '#777';

export class ContractPrint extends React.PureComponent<any, any> {
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
        'https://res.cloudinary.com/fivegstore/image/upload/v1607758777/car_q0gfdq.png'
      }
      alt={'car'}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );
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
          <div>No: {data.no}</div>
          <div>Date: {simpleSpanDateFormatter(data.start)}</div>
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
          }}
        >
          <div>CEHICLERENTALAGREEMENT</div>
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
          <div>No: {data.no}</div>
          <div>Date: {simpleSpanDateFormatter(data.start)}</div>
        </Box>
      </Grid>
      <Grid item xs={8}></Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );

  renderCarRow = (item: any, data: any) => {
    let d = '';

    if (item.id === 1) {
      if (data.isRTL) {
        d = data?.resovalue?.nameAr;
      } else {
        d = data?.resovalue?.name;
      }
    } else if (item.id === 2) {
      d = data?.resovalue?.plate;
    } else if (item.id === 3) {
      d = `${getDateDayWeek(data?.start, data.isRTL)}`;
    } else if (item.id === 4) {
      d = `${covertToTimeOnly(data?.start)}`;
    } else if (item.id === 7) {
      d = data?.info?.[0]?.value;
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={8}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {d}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              direction: 'rtl',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#eee',
              fontSize: 10,
              height: 30,
              paddingRight: 5,
              paddingLeft: 5,
            }}
          >
            <div>{item.name}</div>
            <div>{item.nameAr}</div>
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
        <Grid item xs={3}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              direction: 'ltr',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eee',
              fontSize: 10,
              height: 26,
              paddingRight: 5,
              paddingLeft: 5,
            }}
          >
            <Box style={{ alignItems: 'center', justifyContent: 'center' }}>
              {item.name}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            border={1}
            borderColor="grey.400"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 26,
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
              alignItems: 'center',
              backgroundColor: '#eee',
              fontSize: 10,
              height: 26,
              paddingRight: 5,
              paddingLeft: 5,
            }}
          >
            <div>{item.nameAr}</div>
          </Box>
        </Grid>
      </Grid>
    );
  };

  renderCarBox = (list: any, data: any) => (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {list.map((cl: any) => this.renderCarRow(cl, data))}
      </Grid>
    </Grid>
  );
  renderCustBox = (list: any, customer: any, isRTL: any) => (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {list.map((cl: any) => this.renderCustRow(cl, customer, isRTL))}
      </Grid>
    </Grid>
  );

  renderPriceType = (data: any) => {
    const { isRTL, freq, amount, evQty } = data;

    const unit =
      freq === 1
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
    const qty = freq === 3 ? evQty : evQty - 1;
    const price = freq === 3 ? amount / evQty : amount / (evQty - 1);
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
                {qty}
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
              backgroundColor: '#eee',
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
              backgroundColor: '#eee',
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
              backgroundColor: '#eee',
              height: 30,
            }}
          >
            {amount && <Box>{tafkeet(amount)}</Box>}
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
              backgroundColor: '#eee',
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
              backgroundColor: '#eee',
              height: 30,
            }}
          >
            <Box>توع التأمين</Box>
            <Box>Insurance Coverage</Box>
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
              backgroundColor: '#eee',
              height: 30,
            }}
          >
            <Box>مبالغ اضافية مستحقة</Box>
            <Box>Over Charges</Box>
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
              backgroundColor: '#eee',
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
              backgroundColor: '#eee',
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
                    {this.renderCustBox(custlist, data?.custvalue, data?.isRTL)}
                    <Box style={{ display: 'flex', height: 360 }}>
                      {this.renderSignatureFooter()}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    {this.renderCarBox(carlist, data)}
                    {this.renderDivider(1)}
                    {this.renderPriceType(data)}
                    {this.renderDivider(1)}
                    {this.renderPeriod(data)}
                    {this.renderDivider(1)}
                    <Box style={{ display: 'flex', height: 300 }}>
                      {this.renderCarFooter()}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              {this.renderFooter(company)}
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
                    mt={4}
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