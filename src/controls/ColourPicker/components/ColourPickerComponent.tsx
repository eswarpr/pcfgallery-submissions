import {
  ColorPicker,
  DefaultButton,
  DirectionalHint,
  FocusTrapCallout,
  FontWeights,
  getColorFromString,
  IButtonStyles,
  IColor,
  IconButton,
  isDark,
  IStackStyles,
  IStackTokens,
  ITextFieldProps,
  ITextFieldStyles,
  ITextStyles,
  mergeStyles,
  PrimaryButton,
  Stack,
  Text,
  TextField,
  useTheme,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import * as React from "react";
import { ControlContext } from "../../shared";
import { IInputs } from "../generated/ManifestTypes";
import { IColourPickerComponentProps } from "./ColourPickerComponent.types";

const ColourPickerComponent: React.FC<IColourPickerComponentProps> = ({
  width,
  height,
}) => {
  const service = React.useContext(ControlContext);
  const [isOpen, { toggle: toggleOpen }] = useBoolean(false);
  const [newValue, setNewValue] = React.useState<string>();
  const [textColour, setTextColour] = React.useState<string>();
  const [pickedColor, setPickedColor] = React.useState<IColor>();
  const textFieldId = useId();
  const theme = useTheme();

  const parameters = service?.getParameters<IInputs>();
  const setParameters = service?.setParameters.bind(service);
  const context = service?.getFormContext();
  const resources = context?.resources;

  const textBoxAriaLabel = resources.getString(
    "ColourPicker_TextField_AriaLabel"
  );
  const pickerButtonAriaLabel = resources.getString(
    "ColourPicker_PickerButton_AriaLabel"
  );
  const selectButtonAriaLabel = resources.getString(
    "ColourPicker_Picker_SelectButton_AriaLabel"
  );
  const cancelButtonAriaLabel = resources.getString(
    "ColourPicker_Picker_CancelButton_AriaLabel"
  );
  const pickerWindowTitleLabel = resources.getString(
    "ColourPicker_Picker_WindowTitle_Label"
  );

  React.useEffect(() => {
    setNewValue(parameters?.value?.raw || undefined);
  }, [parameters?.value, theme]);

  const root = mergeStyles({});

  React.useEffect(() => {
    if (!!newValue) {
      const color_ = getColorFromString(newValue);
      if (!!!color_) {
        return;
      }

      if (isDark(color_)) {
        setTextColour(theme.palette.white);
      } else {
        setTextColour(theme.palette.black);
      }
    }
  }, [newValue]);

  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: {
      height: `${height}px`,
    },
    field: {
      backgroundColor: newValue || theme.semanticColors.inputBackground,
      color: textColour || theme.semanticColors.inputText,
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
    },
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
        ariaLabel={pickerButtonAriaLabel}
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
        ariaLabel={textBoxAriaLabel}
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
                {pickerWindowTitleLabel}
              </Text>
            </Stack>
            <ColorPicker
              alphaType="none"
              onChange={(ev, color) => setPickedColor(color)}
              color={pickedColor || "#fff"}
            ></ColorPicker>
            <Stack
              horizontal
              tokens={commandStackTokens}
              styles={commandStackStyles}
            >
              <PrimaryButton
                onClick={handleColourSelect}
                ariaLabel={selectButtonAriaLabel}
              >
                Select
              </PrimaryButton>
              <DefaultButton
                onClick={() => toggleOpen()}
                ariaLabel={cancelButtonAriaLabel}
              >
                Cancel
              </DefaultButton>
            </Stack>
          </Stack>
        </FocusTrapCallout>
      )}
    </div>
  );
};

export default ColourPickerComponent;
