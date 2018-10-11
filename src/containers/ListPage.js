// @flow
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import List from "../Components/List.component";
import * as listActions from "../actions/list";

const mapStateToProps = state => {
  const { list, core } = state;

  return {
    me: core.me,
    filters: list.filters,
    users: list.users,
    pager: list.pager,
    selectedUserId: list.selectedUserId,
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
