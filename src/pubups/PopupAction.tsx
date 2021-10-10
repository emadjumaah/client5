/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useContext, useEffect, useState } from "react";
import { GContextTypes } from "../types";
import { GlobalContext } from "../contexts";
import PopupLayout from "../pages/main/PopupLayout";
import { Box, Grid } from "@material-ui/core";
import { TextFieldLocal } from "../components";
import { SelectLocal } from "../pages/calendar/common/SelectLocal";
import {
  actionOptions,
  timeRelationOptions,
  timeUnitOptions,
} from "../constants/rrule";
import { getSendTime } from "../common/helpers";
import { getDateDayTimeFormat } from "../Shared/colorFormat";

const PopupAction = ({
  open,
  onClose,
  row,
  isNew,
  addAction,
  editAction,
  theme,
  event,
}: any) => {
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState(1);
  const [timeunit, setTimeunit] = useState("minute");
  const [timerelate, setTimerelate] = useState("bstart");
  const [qty, setQty] = useState(30);
  const [body, setBody] = useState("");
  const [address, setAddreess] = useState("");
  const [sendtime, setSendtime] = useState(null);

  const {
    translate: { words, isRTL },
    store: { user },
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    if (row) {
      setBody(row.body);
      setType(row.type);
      setAddreess(row.address);
      setType(row.type);
      setTimeunit(row.timeunit);
      setQty(row.qty);
      setTimerelate(row.timerelate);
      setSendtime(row.sendtime);
    }
  }, [open]);

  useEffect(() => {
    const { startDate, endDate } = event;
    const sendtime = getSendTime({
      startDate,
      endDate,
      timeunit,
      timerelate,
      qty,
    });
    setSendtime(sendtime);
  }, [timeunit, timerelate, qty]);

  const onSubmit = async () => {
    setSaving(true);

    const variables: any = {
      branch: user.branch,
      type,
      phone: type === 1 ? address : undefined,
      email: type === 2 ? address : undefined,
      userId: type === 3 ? user._id : undefined,
      sendtime,
      body,
      timeunit,
      timerelate,
      qty,
      address,
    };

    isNew ? addAction(variables) : editAction(variables);
    reset();
    setSaving(false);
    onClose();
  };

  const onHandleSubmit = () => {
    onSubmit();
  };

  const reset = () => {
    setType(1);
    setTimeunit("minute");
    setTimerelate("bstart");
    setQty(30);
    setBody("");
    setAddreess("");
    setSendtime(null);
  };

  const onCloseForem = () => {
    reset();
    onClose();
  };

  const title = isRTL
    ? isNew
      ? "اضافة تنبيه"
      : "تعديل تنبيه"
    : isNew
    ? "New Action"
    : "Edit Action";
  const addresstitle =
    type === 1 ? words.mobile : type === 2 ? words.email : words.notification;

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onCloseForem}
      title={title}
      onSubmit={onHandleSubmit}
      theme={theme}
      alrt={{}}
      saving={saving}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldLocal
                required
                name="body"
                multiline
                rows={4}
                label={words.body}
                value={body}
                onChange={(e: any) => setBody(e.target.value)}
                row={row}
                fullWidth
                mb={0}
              />
            </Grid>
            <Grid item xs={5}>
              <SelectLocal
                options={actionOptions}
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                isRTL={isRTL}
                width={160}
              ></SelectLocal>
            </Grid>
            <Grid item xs={7}>
              {type !== 3 && (
                <TextFieldLocal
                  name="address"
                  label={addresstitle}
                  value={address}
                  onChange={(e: any) => setAddreess(e.target.value)}
                  fullWidth
                  mb={0}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <SelectLocal
                    options={timeRelationOptions}
                    value={timerelate}
                    onChange={(e: any) => setTimerelate(e.target.value)}
                    isRTL={isRTL}
                    width={128}
                  ></SelectLocal>
                </Grid>
                <Grid item xs={4}>
                  <TextFieldLocal
                    required
                    name="qty"
                    label={words.qty}
                    value={qty}
                    onChange={(e: any) => setQty(Number(e.target.value))}
                    type="number"
                    width={128}
                  />
                </Grid>
                <Grid item xs={4}>
                  <SelectLocal
                    options={timeUnitOptions}
                    value={timeunit}
                    onChange={(e: any) => setTimeunit(e.target.value)}
                    isRTL={isRTL}
                    width={128}
                  ></SelectLocal>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    style={{
                      flex: 1,
                      direction: "ltr",
                      fontSize: 16,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getDateDayTimeFormat(sendtime, isRTL)}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupAction;
