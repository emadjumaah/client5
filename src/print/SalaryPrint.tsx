/* eslint-disable jsx-a11y/alt-text */
import { Grid, Box, Typography, Divider } from '@material-ui/core';
import React from 'react';
import { moneyFormat, simpleDateFormatter2 } from '../Shared/colorFormat';

const RH = 36;

const renderBox = (title: any, number = false, bold = false, height = RH) => {
  return (
    <Box
      border={1}
      borderColor="grey.300"
      style={{
        paddingLeft: 8,
        paddingRight: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: number ? 'flex-end' : 'flex-start',
        height,
        fontSize: height > 36 ? 20 : 16,
      }}
    >
      <Typography style={{ fontWeight: bold ? 'bold' : undefined }}>
        {title}
      </Typography>
    </Box>
  );
};

export class SalaryPrint extends React.PureComponent<any, any> {
  renderFooter = (data: any) => {
    const { row } = data;
    return (
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <Typography>Name: {row.name}</Typography>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            <Typography>ID: {row.nationalNo}</Typography>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={12} style={{ height: 10 }}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={5}>
            Sign: ...............................
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
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
      <Divider></Divider>
    </Grid>
  );

  renderTitle = (data: any) => {
    const { row } = data;
    return (
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid item xs={12} style={{ marginTop: -30 }}>
            <Typography>Date: {simpleDateFormatter2(new Date())}</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 40, marginTop: 20 }}>
            <Typography style={{ textAlign: 'center' }} variant="h4">
              SALARY RECEIPT
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {renderBox('Rider Name', false, true)}
          </Grid>
          <Grid item xs={9}>
            {renderBox(row.name)}
          </Grid>
          <Grid item xs={3}>
            {renderBox('TALABAT ID', true)}
          </Grid>
          <Grid item xs={9}>
            {renderBox(row.workId, true)}
          </Grid>
        </Grid>
      </Grid>
    );
  };
  renderPeform = (data: any) => {
    const { incomeqty } = data;
    return (
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            {renderBox('Performance', false, true, 80)}
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                {renderBox('Total Working hours', false, true)}
              </Grid>
              <Grid item xs={6}>
                {renderBox('')}
              </Grid>
              <Grid item xs={6}>
                {renderBox('Total Completed Deliveries', false, true)}
              </Grid>
              <Grid item xs={6}>
                {renderBox(incomeqty, false, true)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  renderSalary = (data: any) => {
    const { salary, expense, exptotal } = data;

    const netsalary = salary - exptotal;
    const now = new Date();
    const date = now.toLocaleString('en-GB', {
      month: 'long',
      year: 'numeric',
    });
    const h = (expense?.length + 2) * RH;
    return (
      <Grid item xs={12}>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            {renderBox(date, false, true, h)}
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                {renderBox('Salary')}
              </Grid>
              <Grid item xs={3}>
                {renderBox(moneyFormat(salary), true)}
              </Grid>
              <Grid item xs={3}>
                {renderBox('')}
              </Grid>
              {expense?.length > 0 &&
                expense.map((exp: any) => {
                  return (
                    <>
                      <Grid item xs={6}>
                        {renderBox(exp?.itemName)}
                      </Grid>
                      <Grid item xs={3}>
                        {renderBox(moneyFormat(exp?.debit), true)}
                      </Grid>
                      <Grid item xs={3}>
                        {renderBox('')}
                      </Grid>
                    </>
                  );
                })}
              <Grid item xs={6}>
                {renderBox('Net Salary', false, true)}
              </Grid>
              <Grid item xs={3}>
                {renderBox(moneyFormat(netsalary), true, true)}
              </Grid>
              <Grid item xs={3}>
                {renderBox('')}
              </Grid>
            </Grid>
          </Grid>
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
    const { company, printData } = this.props;
    return (
      <Box>
        <Box>
          <Grid container spacing={0}>
            {this.renderHeader(company)}
            <Grid item xs={12}>
              <Box ml={8} mr={8}>
                <Grid container spacing={2}>
                  {this.renderDivider(1)}
                  {this.renderTitle(printData)}
                  {this.renderDivider(1)}
                  {this.renderPeform(printData)}
                  {this.renderDivider(1)}
                  {this.renderSalary(printData)}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box style={{ position: 'absolute', bottom: 160, width: '100%' }}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Box ml={6} mr={6}>
                <Grid container spacing={2}>
                  {this.renderFooter(printData)}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}
