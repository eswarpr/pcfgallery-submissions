import { PCFControlContextService } from "pcf-react";
import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

export const Context = React.createContext<
  PCFControlContextService | undefined
>(undefined);

export interface IEmailFieldProps {
  width?: number;
  height?: number;
  service?: PCFControlContextService;
}

export interface IEmailFieldControlProps {
  width?: number;
  height?: number;
  parameters?: IInputs;
  setParameters?: (value: IOutputs) => void;
  readonly?: boolean;
  utils?: any;
}