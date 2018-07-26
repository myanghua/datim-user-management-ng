import { combineReducers } from "redux";

import core from "./coreReducers";
import processing from "./processingReducers";
import access from "./accessReducers";
import list from "./listReducers";
import invite from "./inviteReducers";
import mainMenu from "./mainMenuReducers";

export default combineReducers({
  core,
  processing,
  access,
  list,
  invite,
  mainMenu,
});
