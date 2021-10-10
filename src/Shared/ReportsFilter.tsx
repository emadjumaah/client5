/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { moneyFormat } from "./colorFormat";
import FilterSelectMulti from "./FilterSelectMulti";
import CloseIcon from "@material-ui/icons/Close";
// import SelectServProd from "./SelectServProd";
export default function SalesFilter({
  emplvalue,
  setEmplvalue,
  servicevalue,
  setServicevalue,
  departvalue,
  setDepartvalue,
  custvalue,
  setCustvalue,
  itemType,
  tasks,
  taskvalue,
  setTaskvalue,
  employees,
  departments,
  services,
  customers,
  total,
  words,
  isRTL,
  documentTypes,
  types,
  setTypes,
}: any) {
  const [emplvalueLocal, setEmplvalueLocal] = React.useState([]);
  const [servicevalueLocal, setServicevalueLocal] = React.useState([]);
  const [departvalueLocal, setDepartvalueLocal] = React.useState([]);
  const [custvalueLocal, setCustvalueLocal] = React.useState([]);
  const [taskvalueLocal, setTaskvalueLocal] = React.useState([]);
  const [typesvalueLocal, setTypesvalueLocal] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<any>("paper");

  useEffect(() => {
    if (open === true) {
      setEmplvalueLocal(emplvalue);
      setServicevalueLocal(servicevalue);
      setDepartvalueLocal(departvalue);
      setCustvalueLocal(custvalue);
      setTaskvalueLocal(taskvalue);
      setTypesvalueLocal(types);
    }
  }, [open]);

  const reset = () => {
    setEmplvalueLocal([]);
    setServicevalueLocal([]);
    setDepartvalueLocal([]);
    setCustvalueLocal([]);
    setTaskvalueLocal([]);
    setTypesvalueLocal([]);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleResetAll = () => {
    reset();
    setEmplvalue([]);
    setServicevalue([]);
    setDepartvalue([]);
    setCustvalue([]);
    setTaskvalue([]);
    setTypes([]);
  };
  const handleClickOpen = (scrollType: any) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const onSubmit = () => {
    setEmplvalue(emplvalueLocal);
    setServicevalue(servicevalueLocal);
    setDepartvalue(departvalueLocal);
    setCustvalue(custvalueLocal);
    setTaskvalue(taskvalueLocal);
    setTypes(typesvalueLocal);
    setOpen(false);
  };
  const tt = types ? types : [];
  const filtercounts = [
    ...emplvalue,
    ...servicevalue,
    ...departvalue,
    ...custvalue,
    ...taskvalue,
    ...tt,
    itemType ? itemType : undefined,
  ].filter((x: any) => x);

  return (
    <Box
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 20,
        marginRight: 20,
        direction: isRTL ? "rtl" : "ltr",
        marginTop: 2,
        height: 38,
      }}
    >
      <Button
        variant="outlined"
        style={{
          height: 38,
          width: 160,
          backgroundColor:
            filtercounts.length > 0 || itemType ? "#FFF5D6" : undefined,
        }}
        onClick={handleClickOpen("paper")}
      >
        <Box
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography style={{}} variant="button">
            {isRTL
              ? `الفلاتر - (${filtercounts.length})`
              : `Filters - (${filtercounts.length})`}
          </Typography>
          <IconButton
            style={{ marginRight: 10, width: 30, height: 30 }}
            onClick={handleResetAll}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </Box>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{ direction: isRTL ? "rtl" : "ltr", backgroundColor: "#eee" }}
        >
          {isRTL
            ? `الفلاتر - (${filtercounts.length})`
            : `Filters - (${filtercounts.length})`}
        </DialogTitle>
        <DialogContent
          style={{ width: 600, height: 450, direction: isRTL ? "rtl" : "ltr" }}
          dividers={scroll === "paper"}
        >
          <Box>
            <Box>
              {documentTypes && (
                <FilterSelectMulti
                  options={documentTypes}
                  value={typesvalueLocal}
                  setValue={setTypesvalueLocal}
                  words={words}
                  isRTL={isRTL}
                  name="type"
                  width={350}
                ></FilterSelectMulti>
              )}
              <FilterSelectMulti
                options={employees}
                value={emplvalueLocal}
                setValue={setEmplvalueLocal}
                words={words}
                isRTL={isRTL}
                name="employee"
                width={350}
              ></FilterSelectMulti>
              <FilterSelectMulti
                options={departments}
                value={departvalueLocal}
                setValue={setDepartvalueLocal}
                words={words}
                isRTL={isRTL}
                name="department"
                width={350}
              ></FilterSelectMulti>
              {tasks && tasks.length > 0 && (
                <FilterSelectMulti
                  options={tasks}
                  value={taskvalueLocal}
                  setValue={setTaskvalueLocal}
                  words={words}
                  isRTL={isRTL}
                  name="task"
                  width={350}
                ></FilterSelectMulti>
              )}
              {servicevalue && servicevalue.length > 0 && (
                <FilterSelectMulti
                  options={services}
                  value={servicevalueLocal}
                  setValue={setServicevalueLocal}
                  words={words}
                  isRTL={isRTL}
                  name="serviceproduct"
                  width={350}
                ></FilterSelectMulti>
              )}
              <FilterSelectMulti
                options={customers}
                value={custvalueLocal}
                setValue={setCustvalueLocal}
                words={words}
                isRTL={isRTL}
                name="customer"
                width={350}
              ></FilterSelectMulti>

              {total && total.length > 0 && (
                <Box
                  display="flex"
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box style={{ marginRight: 20, marginLeft: 20 }}>
                    <Typography variant="h6">
                      {words.total}: {moneyFormat(total[0].total)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          style={{
            direction: isRTL ? "rtl" : "ltr",
            backgroundColor: "#f8f8f8",
            height: 60,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button
            style={{ width: 100, height: 36 }}
            variant="contained"
            onClick={onSubmit}
            color="primary"
          >
            {isRTL ? "تطبيق" : "Submit"}
          </Button>
          <Button
            style={{ width: 100, height: 36 }}
            variant="contained"
            onClick={handleClose}
            color="primary"
          >
            {isRTL ? "الغاء" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
