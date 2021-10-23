import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { PCFControlContextService, StandardControlReact } from "pcf-react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { initializeIcons } from "@fluentui/react";
import ColourPickerComponent from "./components/ColourPickerComponent";
import { ControlContext } from "../shared";

export class ColourPicker extends StandardControlReact<IInputs, IOutputs> {
  /**
   * Initialises the colour picker
   */
  constructor() {
    super();
    initializeIcons();
    this.reactCreateElement = (container, width, height, serviceProvider) => {
      const service = serviceProvider.get<PCFControlContextService>(
        PCFControlContextService.serviceProviderName
      );
      ReactDOM.render(
        <ControlContext.Provider value={service}>
          <ColourPickerComponent
            width={width}
            height={height}
          ></ColourPickerComponent>
        </ControlContext.Provider>,
        container
      );
    };
  }
}
