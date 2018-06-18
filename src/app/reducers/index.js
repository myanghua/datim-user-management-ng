import {combineReducers} from "redux";

import core from "./coreReducers";
import processing from "./processingReducers";
import list from "./listReducers";

export default combineReducers({
  core,
  processing,
  list
})
