import { createMuiTheme } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#6d6d6d",
      main: "#424242",
      dark: "#424242",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff833a",
      main: "#e55100",
      dark: "#000",
      contrastText: "#fff",
    },
    title: orange["900"],
    type: "light",
  },
});

export default theme;
