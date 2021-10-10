import { createContext } from "react";
import { MaindataContextTypes } from "../../types";

export const MaindataContext = createContext<MaindataContextTypes | any>({});

export default MaindataContext;
