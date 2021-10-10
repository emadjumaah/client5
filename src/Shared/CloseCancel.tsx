/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Button, Box } from "@material-ui/core";
import ButtonText from "./ButtonText";

const CloseCancel = ({
  classes,
  handleSubmit,
  words,
  onClose,
  isRTL,
  onSubmit,
  print,
}: any) => {
  return (
    <Box
      display="flex"
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
        marginLeft: 40,
        marginRight: 40,
      }}
    >
      <Box>
        <Button
          className={classes.margin}
          variant="outlined"
          onClick={onClose}
          color="primary"
          style={{ width: 110 }}
        >
          <ButtonText title={words.cancel} isRTL={isRTL}></ButtonText>
        </Button>
      </Box>
      <Box>
        {print && (
          <Button
            className={classes.margin}
            onClick={() => {
              print();
              handleSubmit(onSubmit)();
            }}
            color="primary"
            variant="contained"
            style={{ width: 110 }}
          >
            <ButtonText title={words.printsave} isRTL={isRTL}></ButtonText>
          </Button>
        )}
        <Button
          className={classes.margin}
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
          style={{ width: 110 }}
        >
          <ButtonText title={words.save} isRTL={isRTL}></ButtonText>
        </Button>
        {print && (
          <Button
            className={classes.margin}
            onClick={() => {
              print();
            }}
            color="primary"
            variant="contained"
            style={{ width: 110 }}
          >
            <ButtonText title={words.print} isRTL={isRTL}></ButtonText>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CloseCancel;
