/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box } from '@material-ui/core';
import React from 'react';
import { moneyFormatEmpty, simpleDateFormatter } from '../Shared/colorFormat';
import _ from 'lodash';

export class GeneralKaidPrint extends React.PureComponent<any, any> {
  renderHeaderCell = ({ size, title, titleAr }: any) => (
    <Grid item xs={size}>
      <Box
        border={1}
        borderColor="grey.300"
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          fontSize: 14,
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>{title}</div>
        <div>{titleAr}</div>
      </Box>
    </Grid>
  );
  renderItemCell = ({ size, title, titleAr, isRTL }: any) => (
    <Grid item xs={size}>
      <Box
        border={1}
        borderColor="grey.300"
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          fontSize: 14,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isRTL ? (titleAr ? titleAr : '') : title ? title : ''}
      </Box>
    </Grid>
  );
  renderTableHeader = () => {
    return (
      <Grid container spacing={0}>
        {this.renderHeaderCell({ titel: 'No', titleAr: 'م', size: 1 })}
        {this.renderHeaderCell({
          titel: 'Item Dexcription',
          titleAr: 'التفاصيل',
          size: 3,
        })}
        {this.renderHeaderCell({
          titel: 'Contract',
          titleAr: 'العقد',
          size: 2,
        })}
        {this.renderHeaderCell({
          titel: 'Account',
          titleAr: 'الحساب',
          size: 2,
        })}
        {this.renderHeaderCell({ titel: 'Debit', titleAr: 'مدين', size: 2 })}
        {this.renderHeaderCell({ titel: 'Credit', titleAr: 'دائن', size: 2 })}
      </Grid>
    );
  };
  renderItem = (item: any, isRTL: any, tasks: any) => {
    const task = tasks.filter((tsk: any) => tsk.id === item?.taskId)?.[0];
    const debit = moneyFormatEmpty(item?.debit);
    const credit = moneyFormatEmpty(item?.credit);
    return (
      <Grid container spacing={0}>
        {this.renderItemCell({
          titel: item?.index + 1,
          titleAr: item?.index + 1,
          size: 1,
          isRTL,
        })}
        {this.renderItemCell({
          titel: item?.desc,
          titleAr: item?.desc,
          size: 3,
          isRTL,
        })}
        {this.renderItemCell({
          titel: task?.title,
          titleAr: task?.title,
          size: 2,
          isRTL,
        })}
        {this.renderItemCell({
          titel: item?.accName,
          titleAr: item?.accNameAr,
          size: 2,
          isRTL,
        })}
        {this.renderItemCell({
          titel: debit,
          titleAr: debit,
          size: 2,
          isRTL,
        })}
        {this.renderItemCell({
          titel: credit,
          titleAr: credit,
          size: 2,
          isRTL,
        })}
      </Grid>
    );
  };
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
  renderTitle = (data: any, isRTL: any, total: any, title: any) => (
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                {isRTL ? 'التاريخ:' : 'Date:'}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontSize: 14 }}>
                {simpleDateFormatter(data?.time)}
              </div>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                {isRTL ? 'رقم القيد:' : 'Entry No:'}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontSize: 14 }}>{data?.kaidNo}</div>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={2}>
              <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                {isRTL ? 'قيمة القيد:' : 'Entry Amount:'}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                {moneyFormatEmpty(total)}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <div style={{ fontSize: 50, letterSpacing: 2 }}>
            {isRTL ? 'قيد' : 'Entry'}
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Box
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {title}
          </Box>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Grid>
  );
  renderDivider = (x: number) => (
    <Grid item xs={12}>
      <Box m={x}></Box>
    </Grid>
  );

  render() {
    const { company, printData, isRTL, tasks } = this.props;
    const { items, desc } = printData;
    const total = _.sumBy(items, 'credit');
    return (
      <Box style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="header">{this.renderHeader(company)}</div>
        <Box
          style={{
            height: 170,
          }}
        ></Box>
        <Box
          style={{
            height: 170,
            position: 'absolute',
            top: 170,
            width: '100%',
            left: 60,
          }}
        >
          {this.renderTitle(printData, isRTL, total, desc)}
        </Box>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box ml={6} mr={6}>
              <Grid container spacing={0}>
                <table id="report" className="report-container">
                  <thead className="report-header">
                    <div className="header-space"></div>
                    {this.renderTableHeader()}
                  </thead>
                  <tbody className="report-content">
                    {items?.map((item: any) =>
                      this.renderItem(item, isRTL, tasks)
                    )}
                  </tbody>
                </table>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
