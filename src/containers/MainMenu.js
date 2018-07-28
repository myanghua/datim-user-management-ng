// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import MainMenu from "../Components/MainMenu.component";
import * as menuActions from "../actions/menu";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(menuActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);
