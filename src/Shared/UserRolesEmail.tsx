/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@material-ui/core';
import AutoFieldLocal from '../components/fields/AutoFieldLocal';

export default function UserRolesEmail({
  branch,
  isRTL,
  words,
  isBranchAdmin,
  isEmployee,
  isFinance,
  isOperate,
  isEditor,
  isWriter,
  isViewer,
  emplvalue,
  setisBranchAdmin,
  setisEmployee,
  setisFinance,
  setisOperate,
  setisEditor,
  setisWriter,
  setisViewer,
  setEmplvalue,
  employees,
}) {
  const manager = isRTL ? 'المدير العام' : 'General Manager';
  const empl = isRTL ? 'موظف متخصص' : 'Employee';
  const tech = isRTL ? 'قسم العمليات' : 'Operation Section';
  const finance = isRTL ? 'قسم الحسابات' : 'Finance Section';
  return (
    <Box>
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
                  setisEditor(null);
                  setisWriter(null);
                  setisViewer(null);
                }
              }}
              name={branch}
              color="primary"
            />
          }
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
            options={employees?.filter(
              (emp: any) => emp?.resKind === 1 && emp?.resType === 1
            )}
            value={emplvalue}
            setSelectValue={setEmplvalue}
            noPlus
            isRTL={isRTL}
            fullWidth
          ></AutoFieldLocal>
        </Box>
      )}
      {!isEmployee && (
        <Box style={{ height: 150 }}>
          <Box>
            <Typography variant="h6" style={{ marginTop: 10 }}>
              {isRTL ? 'الصلاحيات' : 'Roles'}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isBranchAdmin}
                onChange={() => setisBranchAdmin(!isBranchAdmin)}
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
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFinance}
                  onChange={() => setisFinance(!isFinance)}
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
              control={
                <Checkbox
                  checked={isOperate}
                  onChange={() => setisOperate(!isOperate)}
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
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
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
                <Typography variant="body2" color="textSecondary">
                  {isRTL ? 'محرر' : 'Editor'}
                </Typography>
              }
            />
            <FormControlLabel
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
                <Typography variant="body2" color="textSecondary">
                  {isRTL ? 'كاتب' : 'Writer'}
                </Typography>
              }
            />
            <FormControlLabel
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
                <Typography variant="body2" color="textSecondary">
                  {isRTL ? 'مشاهد' : 'Viwer'}
                </Typography>
              }
            />
          </FormGroup>
        </Box>
      )}
    </Box>
  );
}
