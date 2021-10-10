/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useMutation } from "@apollo/client";
import { backupDB, restoreDB } from "../graphql";

export default () => {
  const [backup] = useMutation(backupDB);
  const [restore] = useMutation(restoreDB);

  return { backup, restore };
};
