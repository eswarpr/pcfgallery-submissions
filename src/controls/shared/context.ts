import { PCFControlContextService } from "pcf-react";
import * as React from "react";

export const ControlContext = React.createContext<
  PCFControlContextService | undefined
>(undefined);
