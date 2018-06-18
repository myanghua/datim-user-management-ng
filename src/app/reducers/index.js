import {combineReducers} from "redux";

import core from "./coreReducers";
import processing from "./processingReducers";
import list from "./listReducers";
import mainMenu from "./mainMenuReducers";

export default combineReducers({
  core,
  processing,
  list,
  mainMenu
})
