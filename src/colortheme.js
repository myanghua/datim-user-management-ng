import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

const theme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: '#4786a6',
        primary2Color: Colors.blue900,
        primary3Color: Colors.blue800,
        accent1Color: Colors.orange500,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        canvasColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
        pickerHeaderColor: Colors.lightBlue600,

    }
};


function createAppTheme(style) {
    return {
        forms: {
            minWidth: 350,
            maxWidth: 900,
        },
    };
}

const muiTheme = ThemeManager.getMuiTheme(theme);
const appTheme = createAppTheme(theme);

export default Object.assign({}, muiTheme, appTheme);
