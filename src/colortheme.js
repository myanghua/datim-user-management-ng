import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";
// import ColorManipulator from "@material-ui/core/styles/color-manipulator";
// import Spacing from "@material-ui/core/styles/spacing";
// import zIndex from "@material-ui/core/styles/zIndex";

const black = "#000000";
const white = "#FFFFFF";

const theme = {
  //   spacing: Spacing,
  //   zIndex: zIndex,
  fontFamily: "Roboto, sans-serif",
  palette: {
    primary1Color: "#4786a6",
    primary2Color: blue[900],
    primary3Color: blue[800],
    accent1Color: orange[500],
    accent2Color: grey[100],
    accent3Color: grey[500],
    textColor: black,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey[300],
    disabledColor: grey[200], //ColorManipulator.fade(black, 0.3),
    pickerHeaderColor: lightBlue[600]
  }
};

function createAppTheme() {
  return {
    forms: {
      minWidth: 350,
      maxWidth: 900
    }
  };
}

const muiTheme = createMuiTheme(theme);
const appTheme = createAppTheme();

export default Object.assign({}, muiTheme, appTheme);
