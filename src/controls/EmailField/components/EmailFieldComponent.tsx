import {
  IPickerItemProps,
  ISuggestionItemProps,
  ITag,
  ITagItemStyles,
  TagPicker,
  TagItem,
  useTheme,
  Stack,
  Text,
  IconButton,
  IStackStyles,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import {
  Context,
  IEmailFieldControlProps,
  IEmailFieldProps,
} from "./EmailFieldComponent.types";

interface ISelectedEmail extends ITag {
  isValid?: boolean;
}

const EmailFieldComponent: React.FC<IEmailFieldControlProps> = ({
  width,
  height,
  parameters,
  setParameters,
  readonly,
  utils,
}) => {
  const theme = useTheme();
  const [domainList, setDomainList] = React.useState<string[]>([]);
  const [matcher, setMatcher] = React.useState<RegExp>();
  const [newValue, setNewValue] = React.useState<ISelectedEmail[]>();
  const [itemLimit, setItemLimit] = React.useState<number>(1);
  const [lastNotifyId, setLastNotifyId] = React.useState<string>();
  const [canCopyToClipboard, { setFalse: disableCopyToClipboard }] =
    useBoolean(true);

  React.useEffect(() => {
    if (!!parameters) {
      const {
        value: { type: valueType, raw: value },
        domains: { raw: domains },
        maxSelections: { raw: maxSelections },
      } = parameters;

      // set the new value
      if (!!value) {
        setNewValue(
          value.split(",").map((x) => ({
            key: x,
            name: x,
            isValid: true,
          }))
        );
      }

      // the list of domains
      const domainList = (!!domains && domains?.split(",")) || [];
      let pattern = "";
      if (!!domainList && domainList.length > 0) {
        pattern = domainList.reduce(
          (p, c) =>
            `${p}${!!p ? "|" : ""}^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@${c}$`,
          ""
        );
      }
      if (!!pattern) {
        setMatcher(new RegExp(pattern, "gm"));
      } else {
        setMatcher(undefined);
      }
      setDomainList(domainList);

      // calculate the maximum items we can
      // let the user select
      let itemLimit = maxSelections || 1;
      if (valueType === "SingleLine.Text" || valueType === "SingleLine.Email") {
        itemLimit = 1;
      }

      setItemLimit(itemLimit);
    }
  }, [parameters]);

  React.useEffect(() => {
    (async () => {
      const perms = await navigator.permissions.query({
        name: "clipboard-write",
      } as any);
      if (perms.state === "denied") {
        disableCopyToClipboard();
      }
    })();
  }, []);

  const onResolveSuggestions = (
    filter?: string,
    selectedItems?: ITag[]
  ): ITag[] => {
    if (!!!filter) {
      return [];
    }

    const atindex = filter.indexOf("@");

    if (!!matcher) {
      // prepare a list of tags using
      // the available domains
      return atindex > -1
        ? [
            {
              key: filter,
              name: filter,
              isValid: matcher.test(filter),
            },
          ]
        : domainList.map(
            (x) =>
              ({
                key: `${filter}@${x}`,
                name: `${filter}@${x}`,
                isValid: true,
              } as ISelectedEmail)
          );
    } else if (atindex > -1 && atindex < filter.length - 1) {
      return [
        {
          key: filter,
          name: filter,
          isValid: true,
        } as ISelectedEmail,
      ];
    } else {
      return [];
    }
  };

  const onSelectionChange = (items?: ISelectedEmail[]) => {
    if (!!setParameters) {
      // validate tag

      const isValid = items?.reduce<boolean>((p, c) => p && !!c.isValid, true);

      if (!!isValid) {
        clearNotification();
        setParameters({
          value: items?.map((x) => x.key)?.join(","),
        });
      } else {
        setNotification(
          "There are one or more invalid e-mail addresses selected which will not be saved. Please correct them before submitting."
        );
      }
    }

    // set the value of the field
    setNewValue(items);
  };

  const setNotification = (message: string) => {
    if (!!utils && !!utils.setNotification) {
      const notifyId = `notify-${Date.now()}`;
      if (utils.setNotification(message, notifyId)) {
        setLastNotifyId(notifyId);
      }
    }
  };

  const clearNotification = () => {
    if (!!utils && !!utils.clearNotification && !!lastNotifyId) {
      utils.clearNotification(lastNotifyId);
    }
  };

  const errorItem: Partial<ITagItemStyles> = {
    root: {
      color: theme.palette.redDark,
    },
  };

  const suffixStyles: IStackStyles = {
    root: {
      backgroundColor: theme.semanticColors.disabledBackground,
      alignItems: "center",
    },
  };

  const onCopyClick = async () => {
    if (!!navigator.clipboard && !!newValue) {
      // text to copy
      const text = newValue
        .filter((x) => !!x.isValid)
        .map((x) => x.name)
        .join(";");
      await navigator.clipboard.writeText(text);
    }
  };

  const onSendClick = () => {
    if (!!newValue) {
      // text to copy
      const text = newValue
        .filter((x) => !!x.isValid)
        .map((x) => x.name)
        .join(";");
      window.open(`mailto:${text}`);
    }
  };

  const renderSuffix = (): JSX.Element => {
    const isDisabled =
      !!!newValue ||
      newValue.length === 0 ||
      newValue.findIndex((x) => !!x.isValid) === -1;

    return (
      <Stack styles={suffixStyles} horizontal>
        <IconButton
          iconProps={{
            iconName: "Copy",
          }}
          disabled={isDisabled && !canCopyToClipboard}
          onClick={onCopyClick}
          label="Copy these e-mail addresses clipboard"
        ></IconButton>
        <IconButton
          iconProps={{
            iconName: "EditMail",
          }}
          disabled={isDisabled}
          onClick={onSendClick}
          label="Compose an e-mail for these recipients"
        ></IconButton>
      </Stack>
    );
  };

  const onRenderItem = (
    props: IPickerItemProps<ISelectedEmail>
  ): JSX.Element => {
    return (
      <div key={props.item.key}>
        {!!!props.item.isValid && (
          <TagItem styles={errorItem} {...props}>
            {props.item.name}
          </TagItem>
        )}
        {!!props.item.isValid && (
          <TagItem {...props}>{props.item.name}</TagItem>
        )}
      </div>
    );
  };

  if (!!itemLimit) {
    return (
      <Stack horizontal>
        <TagPicker
          itemLimit={itemLimit}
          onResolveSuggestions={onResolveSuggestions}
          pickerSuggestionsProps={{
            suggestionsHeaderText: "Suggestions",
          }}
          selectedItems={newValue}
          onChange={onSelectionChange}
          onRenderItem={onRenderItem}
          styles={{
            root: {
              flex: "auto",
              width: width,
            },
            text: {
              height: height,
            },
          }}
        ></TagPicker>
        {renderSuffix()}
      </Stack>
    );
  }

  return null;
};

const Component: React.FC<IEmailFieldProps> = ({ width, height, service }) => {
  return (
    <Context.Provider value={service}>
      <Context.Consumer>
        {(service) => {
          const params_ = service?.getParameters<IInputs>();
          const setParams_ = service?.setParameters.bind(service);
          const readonly = service?.getIsControlReadOnly();
          const context =
            service?.getFormContext() as ComponentFramework.Context<IInputs>;
          const utils = context.utils;

          return (
            <EmailFieldComponent
              readonly={readonly}
              parameters={params_}
              setParameters={setParams_}
              utils={utils}
              width={width}
              height={height}
            ></EmailFieldComponent>
          );
        }}
      </Context.Consumer>
    </Context.Provider>
  );
};

export default Component;
