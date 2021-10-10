import { createContext } from "react";
import { GContextTypes } from "../types";

export const GlobalContext = createContext<GContextTypes | any>({});

export default GlobalContext;
