// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Invite from '../components/Invite.component';
import * as inviteActions from "../actions/invite";

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(inviteActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
