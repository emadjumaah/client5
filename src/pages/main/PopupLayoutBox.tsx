/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  Dialog,
  DialogContent,
  fade,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import Draggable from 'react-draggable';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import React from 'react';
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

export default function PopupLayoutBox(props: any) {
  const {
    children,
    isRTL,
    theme,
    open,
    onClose,
    title,
    width,
    height,
    isMobile,
    mt = 30,
    mb = 70,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperComponent={PaperComponent}
      aria-describedby="scroll-dialog-description"
      aria-labelledby="draggable-dialog-title"
      fullWidth={isMobile}
      maxWidth="md"
    >
      <Box
        id="draggable-dialog-title"
        style={{
          direction: isRTL ? 'rtl' : 'ltr',
          backgroundColor: theme
            ? fade(theme.palette.primary.main, 0.15)
            : '#f5f5f5',
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
          {title}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseOutlinedIcon
            style={{ fontSize: 26, color: '#777' }}
          ></CloseOutlinedIcon>
        </IconButton>
      </Box>
      <DialogContent
        style={{
          width: width,
          height: height,
          direction: isRTL ? 'rtl' : 'ltr',
          paddingTop: mt,
          paddingBottom: mb,
        }}
        dividers={true}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
