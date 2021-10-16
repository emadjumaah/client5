/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { ipcRenderer } from "electron";

export const print = () => {
  // ipcRenderer.send("print", data);
};
export const reportprint = (data: any) => {
  console.log(data);

  // ipcRenderer.send("reportprint", data);
};
export const jadwalready = () => {
  // ipcRenderer.send("jadwalready", true);
};
