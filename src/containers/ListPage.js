// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import List from "../Components/List.component";
import * as listActions from "../actions/list";

const mapStateToProps = state => {
  const { list } = state;

  return {
    users: list.users,
    pager: list.pager,
    selectedUser: list.selectedUser,
    tab: list.tab,
    currentPage: list.currentPage,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(listActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
