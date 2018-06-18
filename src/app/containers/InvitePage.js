// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Invite from '../components/Invite.component';
import * as coreActions from '../actions/core';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(coreActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
