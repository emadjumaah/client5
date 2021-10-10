/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext } from "react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import { timeToHourMinute } from "../../../common";
import { renderStatusIcon } from "./StatusIcon";
import { useEmployees } from "../../../hooks";
import { eventStatusEn } from "../../../constants";
import { GContextTypes } from "../../../types";
import { GlobalContext } from "../../../contexts";

export const AppointmentContent = (props: any) => {
  const {
    startDate,
    endDate,
    customerName,
    customerNameAr,
    serviceName,
    serviceNameAr,
    employeeId,
    employeeName,
    employeeNameAr,
    status,
  } = props.data;
  const { employees } = useEmployees();

  const empColor = employees
    ? employees.filter((emp: any) => emp._id === employeeId)
    : "";
  const color = empColor?.[0]?.color || "";

  const {
    translate: { isRTL },
  }: GContextTypes = useContext(GlobalContext);

  return (
    <Appointments.AppointmentContent {...props}>
      <div className={props.container}>
        {status && (
          <Tooltip title={eventStatusEn[status]}>
            <Box
              style={{
                position: "absolute",
                right: isRTL ? undefined : 2,
                left: isRTL ? 2 : undefined,
                top: 2,
                zIndex: 12,
                width: 22,
                height: 22,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "#555",
                borderRadius: 2,
              }}
            >
              {renderStatusIcon(status, "#ffffff", 22)}
            </Box>
          </Tooltip>
        )}
        <Box display="flex" style={{ flexWrap: "wrap" }}>
          <div>{timeToHourMinute(startDate)}-</div>
          <div>{timeToHourMinute(endDate)}</div>
        </Box>
        <Box>
          <Typography style={{ fontWeight: "bold" }} variant="subtitle2">
            {isRTL ? customerNameAr : customerName}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption">
            {isRTL ? serviceNameAr : serviceName}
          </Typography>
        </Box>
        {employeeName && (
          <Tooltip title={isRTL ? employeeNameAr : employeeName}>
            <Box
              display="flex"
              alignItems="center"
              style={{
                position: "absolute",
                left: 0,
                bottom: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                style={{ marginLeft: 4, marginRight: 4 }}
              >
                {isRTL ? employeeNameAr : employeeName}
              </Typography>
              {/* <Avatar name={employeeName} bg={color} size={18}></Avatar> */}
            </Box>
          </Tooltip>
        )}
      </div>
    </Appointments.AppointmentContent>
  );
};
