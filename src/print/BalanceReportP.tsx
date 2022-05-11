/* eslint-disable jsx-a11y/alt-text */
import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import {
  simpleDateFormatter,
  simpleDateFormatterData,
  moneyFormatEmpty,
} from '../Shared/colorFormat';
import './index.css';

export class BalanceReportP extends React.PureComponent<any, any> {
  renderItemTable = (item: any, isRTL: any) => {
    const { accCode, accName, accNameAr, rc, rd } = item;
    const name = isRTL ? accNameAr : accName;

    return (
      <tr style={{ fontSize: 12 }}>
        <td style={{ textAlign: 'center' }}>{accCode}</td>
        <td>{name}</td>
        <td>{moneyFormatEmpty(rd)}</td>
        <td>{moneyFormatEmpty(rc)}</td>
      </tr>
    );
  };
  renderItemHeaderTable = (isRTL: boolean) => {
    return (
      <tr style={{ fontSize: 12 }}>
        <th>{isRTL ? 'الرقم' : 'No'}</th>
        <th>{isRTL ? 'الحساب' : 'Account'}</th>
        <th>{isRTL ? 'مدين' : 'Debit'}</th>
        <th>{isRTL ? 'دائن' : 'Credit'}</th>
      </tr>
    );
  };
  renderHeader = (company: any) => (
    <img
      src={company?.header}
      alt={company?.name}
      height="auto"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );

  renderFooter = (company: any) => (
    <img
      src={company?.footer}
      alt={company?.name}
      height="100%"
      width="100%"
      style={{
        objectFit: 'contain',
      }}
    />
  );

  renderFrontTop = ({ documentTitle, start, end, isTime, isRTL }: any) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Typography>{isRTL ? 'التاريخ' : 'Date'}:</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{simpleDateFormatter(new Date())}</Typography>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={6}>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}
          >
            {documentTitle}
          </Typography>
          {start && end && isTime && (
            <Typography>
              {simpleDateFormatterData(start)} - {simpleDateFormatterData(end)}
            </Typography>
          )}
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
    );
  };

  render() {
    const {
      company,
      isRTL,
      parentslist,
      start,
      end,
      profit,
      totals,
      documentTitle,
      isTime,
      report,
    } = this.props;
    let items = [];
    parentslist.map((pl: any) => {
      items = [...items, ...pl.accounts];
      return true;
    });
    return (
      <Box>
        <div className="header">{this.renderHeader(company)}</div>
        <Box
          style={{
            height: 110,
          }}
        ></Box>
        <div style={{ paddingLeft: 60, paddingRight: 40, direction: 'rtl' }}>
          <Box
            style={{
              height: 170,
              position: 'absolute',
              top: 170,
              width: '100%',
            }}
          >
            {this.renderFrontTop({ documentTitle, start, end, isTime, isRTL })}
          </Box>
          <table id="report" className="report-container">
            <thead className="report-header">
              <div className="header-space"></div>
              {this.renderItemHeaderTable(isRTL)}
            </thead>
            <tbody className="report-content">
              {items?.map((item: any) => this.renderItemTable(item, isRTL))}
              {report === 'bs' && (
                <tr style={{ fontSize: 12 }}>
                  <td></td>
                  <td style={{ fontWeight: 'bold' }}>
                    {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {moneyFormatEmpty(profit?.raseedd)}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {moneyFormatEmpty(profit?.raseedc)}
                  </td>
                </tr>
              )}
              <tr style={{ fontSize: 12 }}>
                <td></td>
                <td style={{ fontWeight: 'bold' }}>
                  {isRTL ? 'المجموع' : 'Total'}
                </td>
                <td style={{ fontWeight: 'bold' }}>
                  {moneyFormatEmpty(totals?.debit)}
                </td>
                <td style={{ fontWeight: 'bold' }}>
                  {moneyFormatEmpty(totals?.credit)}
                </td>
              </tr>
              {report === 'is' && (
                <tr style={{ fontSize: 12 }}>
                  <td></td>
                  <td style={{ fontWeight: 'bold' }}>
                    {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {moneyFormatEmpty(profit?.raseedd)}
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {moneyFormatEmpty(profit?.raseedc)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="report-footer">
              <tr style={{ padding: 0, borderColor: '#fff', borderWidth: 0 }}>
                <td style={{ padding: 0, borderColor: '#fff', borderWidth: 0 }}>
                  <div className="footer-info">
                    <div
                      className="page-footer"
                      style={{ fontSize: 14, padding: 5 }}
                    >
                      {company?.name}
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
            {/* <div style={{ marginTop: 100 }}>After Footer</div> */}
          </table>
        </div>
        <img alt={company?.name} src={company?.logo} className={'watermark'} />
      </Box>
    );
  }
}
