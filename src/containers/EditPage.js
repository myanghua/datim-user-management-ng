// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Edit from "../Components/Edit.component";
import * as editActions from "../actions/edit";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(editActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Edit);
