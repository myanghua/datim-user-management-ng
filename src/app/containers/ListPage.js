// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import List from '../components/List.component';
import * as listActions from '../actions/list';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(listActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
