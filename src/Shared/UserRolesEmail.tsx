/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@material-ui/core';
import { roles } from '../common';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';

export default function UserRolesEmail({
  branch,
  isRTL,
  words,
  isBranchAdmin,
  isEmployee,
  isFinance,
  isOperate,
  isPurchase,
  isAdmin,
  isEditor,
  isWriter,
  isViewer,
  emplvalue,
  setisBranchAdmin,
  setisEmployee,
  setisFinance,
  setisOperate,
  setisPurchase,
  setisAdmin,
  setisEditor,
  setisWriter,
  setisViewer,
  setEmplvalue,
  employees,
  isNew,
}) {
  const manager = isRTL ? 'مدير عام' : 'Branch Manager';
  const empl = isRTL ? 'موظف متخصص' : 'Employee';
  const tech = isRTL ? 'ادارة العمليات' : 'Operation Section';
  const finance = isRTL ? 'قسم الحسابات' : 'Finance Section';
  const purchase = isRTL ? 'قسم المشتريات' : 'Purchase Section';

  if (isBranchAdmin && !roles.isSuperAdmin()) {
    return <div></div>;
  }

  return (
    <Box
      style={{
        padding: 10,
        backgroundColor: '#f3f3f3',
        borderRadius: 5,
        minWidth: 350,
        marginTop: 10,
      }}
    >
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isEmployee}
              onChange={() => {
                setisEmployee(!isEmployee);
                if (!isEmployee) {
                  setisBranchAdmin(null);
                  setisFinance(null);
                  setisOperate(null);
                  setisPurchase(null);
                  setisEditor(null);
                  setisWriter(null);
                  setisViewer(null);
                }
              }}
              name={branch}
              color="primary"
            />
          }
          disabled={!isNew}
          label={
            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
              {empl}
            </Typography>
          }
        />
      </Box>
      {isEmployee && (
        <Box style={{ height: 160 }}>
          <AutoFieldLocal
            name="employee"
            title={words.employee}
            words={words}
            options={employees}
            value={emplvalue}
            setSelectValue={setEmplvalue}
            noPlus
            isRTL={isRTL}
            fullWidth
            disabled={!isNew}
          ></AutoFieldLocal>
        </Box>
      )}
      {!isEmployee && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Typography variant="h6" style={{ marginTop: 10 }}>
                {isRTL ? 'الصلاحيات' : 'Roles'}
              </Typography>
            </Box>
          </Grid>
          {roles.isSuperAdmin() && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBranchAdmin}
                    onChange={() => {
                      setisAdmin(false);
                      setisEditor(false);
                      setisWriter(false);
                      setisViewer(false);
                      setisOperate(false);
                      setisPurchase(false);
                      setisFinance(false);
                      setisBranchAdmin(!isBranchAdmin);
                    }}
                    name={branch}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {manager}
                  </Typography>
                }
              />
              <Divider></Divider>
            </Grid>
          )}
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel
                disabled={isBranchAdmin}
                control={
                  <Checkbox
                    checked={isOperate}
                    onChange={() => {
                      if (isOperate && !isFinance && !isPurchase) {
                        setisAdmin(false);
                        setisEditor(false);
                        setisWriter(false);
                        setisViewer(false);
                      }
                      setisOperate(!isOperate);
                    }}
                    name={branch}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {tech}
                  </Typography>
                }
              />
              <FormControlLabel
                disabled={isBranchAdmin}
                control={
                  <Checkbox
                    checked={isFinance}
                    onChange={() => {
                      if (isFinance && !isOperate && !isPurchase) {
                        setisAdmin(false);
                        setisEditor(false);
                        setisWriter(false);
                        setisViewer(false);
                      }
                      setisFinance(!isFinance);
                    }}
                    name={branch}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {finance}
                  </Typography>
                }
              />
              <FormControlLabel
                disabled={isBranchAdmin}
                control={
                  <Checkbox
                    checked={isPurchase}
                    onChange={() => {
                      if (isPurchase && !isFinance && !isOperate) {
                        setisAdmin(false);
                        setisEditor(false);
                        setisWriter(false);
                        setisViewer(false);
                      }
                      setisPurchase(!isPurchase);
                    }}
                    name={branch}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {purchase}
                  </Typography>
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}>
            <Box
              style={{ height: 100, width: 1, backgroundColor: '#ddd' }}
            ></Box>
          </Grid>
          <Grid item xs={5}>
            <FormGroup>
              <FormControlLabel
                disabled={
                  isBranchAdmin || (!isOperate && !isFinance && !isPurchase)
                }
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={() => setisAdmin(!isAdmin)}
                    size="small"
                    name={`edit`}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {isRTL ? 'مدير' : 'Admin'}
                  </Typography>
                }
              />
              <FormControlLabel
                disabled={
                  isBranchAdmin ||
                  isAdmin ||
                  (!isOperate && !isFinance && !isPurchase)
                }
                control={
                  <Checkbox
                    checked={isEditor}
                    onChange={() => setisEditor(!isEditor)}
                    size="small"
                    name={`edit`}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {isRTL ? 'محرر' : 'Editor'}
                  </Typography>
                }
              />
              <FormControlLabel
                disabled={
                  isBranchAdmin ||
                  isAdmin ||
                  isEditor ||
                  (!isOperate && !isFinance && !isPurchase)
                }
                control={
                  <Checkbox
                    checked={isWriter}
                    onChange={() => setisWriter(!isWriter)}
                    size="small"
                    name={`edit`}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {isRTL ? 'كاتب' : 'Writer'}
                  </Typography>
                }
              />
              <FormControlLabel
                disabled={
                  isBranchAdmin ||
                  isAdmin ||
                  isEditor ||
                  isWriter ||
                  (!isOperate && !isFinance && !isPurchase)
                }
                control={
                  <Checkbox
                    checked={isViewer}
                    onChange={() => setisViewer(!isViewer)}
                    size="small"
                    name={`edit`}
                    color="primary"
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {isRTL ? 'مشاهد' : 'Viwer'}
                  </Typography>
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
