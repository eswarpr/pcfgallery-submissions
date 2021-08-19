import {
  ColorPicker,
  Stack,
  Text,
  Callout,
  mergeStyles,
  useTheme,
  isDark,
  getShade,
  getColorFromString,
  Icon,
  TextField,
  ITextFieldStyles,
  ITextFieldProps,
  FocusTrapCallout,
  DirectionalHint,
  IconButton,
  PrimaryButton,
  DefaultButton,
  IButtonStyles,
  IStackTokens,
  IStackStyles,
  ITextStyles,
  FontWeights,
  IColor,
  Shade,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { PCFControlContextService } from "pcf-react";
import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

const Context = React.createContext<PCFControlContextService | undefined>(
  undefined
);

interface IColourPickerComponentBaseProps {
  parameters?: IInputs;
  setParameters?: (values: IOutputs) => void;
  readonly?: boolean;
  width?: number;
  height?: number;
}

const ColourPickerComponentBase: React.FC<IColourPickerComponentBaseProps> = ({
  parameters,
  setParameters,
  width,
  height,
  readonly,
}) => {
  const [isOpen, { toggle: toggleOpen }] = useBoolean(false);
  const [newValue, setNewValue] = React.useState<string>();
  const [textColour, setTextColour] = React.useState<string>();
  const [pickedColor, setPickedColor] = React.useState<IColor>();
  const theme = useTheme();
  const textFieldId = useId();

  React.useEffect(() => {
    setNewValue(parameters?.value?.raw || theme.semanticColors.inputBackground);
  }, [parameters?.value, theme]);

  const root = mergeStyles({});

  React.useEffect(() => {
    if (!!newValue) {
      const color_ = getColorFromString(newValue);
      if (!!!color_) {
        return;
      }

      if(isDark(color_)) {
        setTextColour(theme.palette.white);
      }
      else {
        setTextColour(theme.palette.black);
      }
    }
  }, [newValue]);

  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: `${height}px`
    },
    field: {
      backgroundColor: newValue,
      color: textColour,
      textAlign: "center",
    },
    suffix: {
      padding: "0px 4px",
    },
  };

  const buttonStyles: IButtonStyles = {
    root: {
      height: `${!!height ? height - 4 : 30}px`,
      color: theme.palette.black,
    },
    rootHovered: {
      height: `${!!height ? height - 4 : 30}px`,
      color: theme.palette.black,
    }
  };

  const rootStackTokens: IStackTokens = {
    childrenGap: 8,
  };

  const commandStackTokens: IStackTokens = {
    childrenGap: 8,
  };

  const titleStackStyles: IStackStyles = {
    root: {
      padding: "16px 16px 0px 16px",
    },
  };

  const commandStackStyles: IStackStyles = {
    root: {
      padding: "0px 16px 16px 16px",
    },
  };

  const titleStyles: ITextStyles = {
    root: {
      fontWeight: FontWeights.semibold,
    },
  };

  const handlePickButtonClick = () => {
    // update the picked color
    if (!!newValue) {
      setPickedColor(getColorFromString(newValue));
    }
    toggleOpen();
  };

  const onRenderSuffix = (props?: ITextFieldProps): JSX.Element => {
    return (
      <IconButton
        iconProps={{
          iconName: "Eyedropper",
        }}
        styles={buttonStyles}
        onClick={handlePickButtonClick}
      ></IconButton>
    );
  };

  const handleColourSelect = () => {
    if (!!pickedColor) {
      setNewValue(pickedColor.str);
    }
    toggleOpen();

    // set parameters so the system knows
    if (!!setParameters) {
      setParameters({
        value: pickedColor?.str,
      });
    }
  };

  return (
    <div className={root}>
      <TextField
        value={newValue}
        readOnly
        styles={textFieldStyles}
        onRenderSuffix={onRenderSuffix}
        id={textFieldId}
      ></TextField>
      {!!isOpen && (
        <FocusTrapCallout
          isBeakVisible={false}
          directionalHint={DirectionalHint.bottomLeftEdge}
          target={`#${textFieldId}`}
          gapSpace={0}
          onDismiss={() => toggleOpen()}
        >
          <Stack tokens={rootStackTokens}>
            <Stack horizontal styles={titleStackStyles}>
              <Text variant="medium" styles={titleStyles}>
                Pick a colour
              </Text>
            </Stack>
            {!!newValue && (
              <ColorPicker
                alphaType="none"
                onChange={(ev, color) => setPickedColor(color)}
                color={pickedColor || "#fff"}
              ></ColorPicker>
            )}
            <Stack
              horizontal
              tokens={commandStackTokens}
              styles={commandStackStyles}
            >
              <PrimaryButton onClick={handleColourSelect}>Select</PrimaryButton>
              <DefaultButton onClick={() => toggleOpen()}>Cancel</DefaultButton>
            </Stack>
          </Stack>
        </FocusTrapCallout>
      )}
    </div>
  );
};

export interface IColourPickerComponentProps {
  width?: number;
  height?: number;
  service?: PCFControlContextService;
}

const Component: React.FC<IColourPickerComponentProps> = ({
  width,
  height,
  service,
}) => {
  return (
    <Context.Provider value={service}>
      <Context.Consumer>
        {(service) => {
          const params_ = service?.getParameters<IInputs>();
          const setParams_ = service?.setParameters.bind(service);
          const readonly = service?.getIsControlReadOnly();

          return (
            <ColourPickerComponentBase
              width={width}
              height={height}
              parameters={params_}
              setParameters={setParams_}
              readonly={readonly}
            ></ColourPickerComponentBase>
          );
        }}
      </Context.Consumer>
    </Context.Provider>
  );
};

export default Component;
