import { PCFControlContextService } from "pcf-react";
import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

export const Context = React.createContext<
  PCFControlContextService | undefined
>(undefined);

export interface IEmailFieldControlProps {
  width?: number;
  height?: number;
}
