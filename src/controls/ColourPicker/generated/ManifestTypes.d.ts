/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    value: ComponentFramework.PropertyTypes.StringProperty;
    isHighContrast: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    value?: string;
    isHighContrast?: boolean;
}
