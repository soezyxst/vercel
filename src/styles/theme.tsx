import {
  extendTheme,
  withDefaultProps,
  type ThemeConfig,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme(
  config,
  withDefaultProps({
    defaultProps: {
      size: {
        base: "sm",
        md: "md",
      },
    },

    components: [
      "Input",
      "Button",
      "Select",
      "Checkbox",
      "Radio",
      "Switch",
      "Textarea",
      "FormLabel",
      "FormErrorMessage",
      "FormHelperText",
      "FormControl",
      "Form",
      "NumberInput",
      "IconButton",
    ],
  }),

  withDefaultProps({
    defaultProps: {
      fontSize: {
        base: "sm",
        md: "md",
      }
    },
    components: [
      "Text"
    ]
  }),

  withDefaultProps({
    defaultProps: {
      loading: "lazy",
      draggable: false,
    },
    components: [
      "Image"
    ]
  }),
);

export default theme;
