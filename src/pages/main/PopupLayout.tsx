/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  fade,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import React from 'react';
import Draggable from 'react-draggable';
import { AlertLocal } from '../../components';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { roles } from '../../common';
function PaperComponent(props: any) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function PopupLayout(props: any) {
  const {
    children,
    isRTL,
    theme,
    open,
    onClose,
    title,
    onSubmit,
    width,
    height,
    alrt,
    mt = 30,
    mb = 70,
    maxWidth = 'sm',
    onlyclose = false,
    print,
    savetitle = isRTL ? 'حفظ' : 'Save',
    taskvalue,
    preventclose = false,
    saving,
    bgcolor,
  } = props;
  const bgc = bgcolor ? fade(bgcolor, 0.1) : '#f5f5f5';

  return (
    <Dialog
      open={open}
      onClose={preventclose ? () => null : onClose}
      PaperComponent={PaperComponent}
      aria-describedby="scroll-dialog-description"
      aria-labelledby="draggable-dialog-title"
      maxWidth={maxWidth}
    >
      <Box
        id="draggable-dialog-title"
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          backgroundColor: bgc,
          cursor: 'move',
          height: 60,
          display: 'flex',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          style={{
            fontSize: 20,
            marginRight: 20,
            marginLeft: 20,
          }}
        >
          {title} {taskvalue ? ` - ${taskvalue?.title}` : ''}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseOutlinedIcon
            style={{ fontSize: 26, color: '#777' }}
          ></CloseOutlinedIcon>
        </IconButton>
      </Box>
      <DialogContent
        style={{
          width: width ? width : undefined,
          height: height ? height : undefined,
          direction: isRTL ? 'rtl' : 'ltr',
          paddingTop: mt,
          paddingBottom: mb,
        }}
        dividers={true}
      >
        {React.cloneElement(children, { ...props })}
      </DialogContent>
      {alrt.show && (
        <AlertLocal
          isRTL={isRTL}
          type={alrt?.type}
          msg={alrt?.msg}
        ></AlertLocal>
      )}

      <DialogActions
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          backgroundColor: theme
            ? fade(theme.palette.primary.main, 0.05)
            : '#dddd',
          height: 60,
          alignItems: 'center',
          paddingRight: 5,
          paddingLeft: 5,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
      >
        {onClose && (
          <Button
            style={{ width: 100, height: 36, marginRight: 10, marginLeft: 10 }}
            variant="outlined"
            onClick={onClose}
            color="primary"
          >
            <Typography variant="subtitle2">
              {isRTL ? 'الغاء' : 'Cancel'}
            </Typography>
          </Button>
        )}
        {print && (
          <Button
            style={{ width: 100, height: 36, marginRight: 10, marginLeft: 10 }}
            variant="contained"
            onClick={print}
            color="primary"
          >
            <Typography variant="subtitle2">
              {isRTL ? 'طباعة' : 'print'}
            </Typography>
          </Button>
        )}
        {!onlyclose && roles.isEditor() && (
          <Button
            style={{
              width: 100,
              height: 36,
              marginRight: 10,
              marginLeft: 10,
            }}
            variant="contained"
            onClick={onSubmit}
            color="primary"
            disabled={saving}
          >
            <Typography
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="subtitle2"
            >
              {savetitle}
            </Typography>
            {saving && <CircularProgress color="primary" size={16} />}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
