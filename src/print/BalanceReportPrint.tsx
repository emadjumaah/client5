/* eslint-disable jsx-a11y/alt-text */
import { Grid, Typography, Box, Divider } from '@material-ui/core';
import React from 'react';
import {
  renderAccount,
  renderAccountHeaderCell,
} from '../pages/reports/BudgetReport';
import {
  currencyFormatter,
  simpleDateFormatter,
  simpleDateFormatterData,
  opTypeFormatter,
  moneyFormatEmpty,
} from '../Shared/colorFormat';
import './index.css';

export class BalanceReportPrint extends React.PureComponent<any, any> {
  renderItemHeaderTable = (isRTL: boolean) => {
    return (
      <tr style={{ fontSize: 12 }}>
        <th>{isRTL ? 'التاريخ' : 'Date'}</th>
        <th>{isRTL ? 'الوثيقة' : 'Document'}</th>
        <th>{isRTL ? 'الحساب' : 'Account'}</th>
        <th>{isRTL ? 'مدين' : 'Debit'}</th>
        <th>{isRTL ? 'دائن' : 'Credit'}</th>
        <th>{isRTL ? 'الرصيد' : 'Balance'}</th>
      </tr>
    );
  };
  renderItemTable = (item: any, isRTL: any) => {
    return (
      <tr style={{ fontSize: 12 }}>
        <td style={{ textAlign: 'center' }}>
          {simpleDateFormatter(item?.opTime)}
        </td>
        <td style={{ textAlign: 'center' }}>
          {opTypeFormatter({ value: item?.opType })} {item?.opDocNo}
        </td>
        <td style={{ textAlign: 'center' }}>
          {isRTL ? item?.accNameAr : item?.accName}
        </td>
        <td>{currencyFormatter({ value: item?.debit })}</td>
        <td>{currencyFormatter({ value: item?.credit })}</td>
        <td>{currencyFormatter({ value: item?.rased })}</td>
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
      style={{ objectFit: 'contain' }}
    />
  );

  renderFrontTop = ({ account, start, end, rased, isRTL }: any) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Typography>التاريخ:</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography>{simpleDateFormatter(new Date())}</Typography>
        </Grid>
        <Grid item xs={8}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>الحساب:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {isRTL ? account?.nameAr : account?.name}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>مدة التقرير:</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {simpleDateFormatter(start)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {simpleDateFormatter(end)}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <Typography style={{ fontSize: 16 }}>رصيد نهاية المدة:</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>
            {currencyFormatter({ value: rased })}
          </Typography>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    );
  };

  render() {
    const {
      company,
      parentslist,
      isRTL,
      start,
      end,
      report,
      profit,
      totals,
      documentTitle,
      isTime,
    } = this.props;
    return (
      <Box>
        <div className="header">{this.renderHeader(company)}</div>
        <Box
          style={{
            height: 170,
          }}
        ></Box>
        <div style={{ paddingLeft: 60, paddingRight: 40, direction: 'rtl' }}>
          <Box
            style={{
              height: 70,
              position: 'absolute',
              top: 100,
              right: 350,
              zIndex: 112,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}
            >
              {documentTitle}
            </Typography>
            {start && end && isTime && (
              <Typography variant="caption">
                {simpleDateFormatterData(start)} -{' '}
                {simpleDateFormatterData(end)}
              </Typography>
            )}
          </Box>
          <table id="report" className="report-container">
            <tbody className="report-content">
              <Box ml={4} mr={4}>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Divider></Divider>
                  </Grid>
                  {renderAccountHeaderCell(isRTL ? 'الرقم' : 'No', 1, 2)}
                  {renderAccountHeaderCell(isRTL ? 'الحساب' : 'Account', 5, 2)}
                  {renderAccountHeaderCell(isRTL ? 'مدين' : 'Debit', 3, 2)}
                  {renderAccountHeaderCell(isRTL ? 'دائن' : 'Credit', 3, 2)}
                </Grid>
                {parentslist.map((pacc: any) => {
                  return renderAccount({ pacc, isRTL, p: 2 });
                })}
                {report === 'bs' && (
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Divider></Divider>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>
                      <Typography style={{ padding: 5, fontWeight: 'bold' }}>
                        {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                      </Typography>
                    </Grid>
                    {renderAccountHeaderCell(
                      moneyFormatEmpty(profit?.raseedd),
                      3,
                      2
                    )}
                    {renderAccountHeaderCell(
                      moneyFormatEmpty(profit?.raseedc),
                      3,
                      2
                    )}
                  </Grid>
                )}

                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Divider></Divider>
                  </Grid>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={5}></Grid>
                  {renderAccountHeaderCell(
                    moneyFormatEmpty(totals?.debit),
                    3,
                    2
                  )}
                  {renderAccountHeaderCell(
                    moneyFormatEmpty(totals?.credit),
                    3,
                    2
                  )}
                </Grid>
                {report === 'is' && (
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <Divider></Divider>
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>
                      <Typography style={{ padding: 5, fontWeight: 'bold' }}>
                        {isRTL ? 'صافي ( الربح/الخسارة )' : 'Net Profit / Loss'}
                      </Typography>
                    </Grid>
                    {renderAccountHeaderCell(
                      moneyFormatEmpty(profit?.raseedd),
                      3,
                      2
                    )}
                    {renderAccountHeaderCell(
                      moneyFormatEmpty(profit?.raseedc),
                      3,
                      2
                    )}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box m={6}></Box>
                </Grid>
              </Box>
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
