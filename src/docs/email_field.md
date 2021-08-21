# Email Field

Allows users to enter one or more e-mail addresses with _domain hints_ into a traditional text or e-mail field.

## Supported Field Types
- Text
- Email
- Multiline Text
- Text Area

## Configuration options
- Domains: A collection of domain names separated by the ',' character. For e.g. gmail.com,outlook.com
- Maximum selections: The maximum number of e-mail addresses that can be entered or selected.

## Supported app types
- Model Driven

## Notes
- If domains are specified in the configuration, the control will suggest e-mail addresses suffixing those domains. If the user enters an e-mail address that does not match the domain, the control will produce a warning and the e-mail address will be presented in warning colours. If the user continues on to saving the record, the invalid e-mail addresses are not sent through. The form cannot be blocked due to limitations of the PCF control framework (see [this link](https://powerusers.microsoft.com/t5/Power-Apps-Ideas/Allow-a-PCF-field-component-to-flag-a-field-as-invalid-and-stop/idi-p/293890))
- If no domain is specified, the control will accept e-mail addresses without restrictions
- If maximum selections configuration is set to more than 1, and the type of the bound field is either Text or Email, then that configuration is not applied. Only one e-mail address will be selectable in such case.
