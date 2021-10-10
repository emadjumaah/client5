/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { dayslist } from "../constants/datatypes";
import { Typography } from "@material-ui/core";

export default function DaysOffView({ isRTL, daysoff, daysoffChange }) {
  return (
    <FormControl component="fieldset">
      <Typography
        variant="subtitle1"
        style={{ fontWeight: "bold", marginBottom: 10 }}
      >
        {isRTL ? "يوم العطلة" : "Day Off"}
      </Typography>

      <FormGroup>
        {dayslist.map((day: any) => {
          return (
            <FormControlLabel
              style={{ margin: 0, padding: 0, paddingBottom: 5 }}
              key={day.id}
              control={
                <Checkbox
                  checked={daysoff[day.short]}
                  onChange={daysoffChange}
                  color="primary"
                  name={day.short}
                  style={{ margin: 0, padding: 0, paddingBottom: 5 }}
                />
              }
              label={isRTL ? day.nameAr : day.name}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
}
