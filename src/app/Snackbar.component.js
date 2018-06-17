import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { closeSnackbar } from '../actions/actions';
import SnackbarUI from 'material-ui/Snackbar/Snackbar';

export const Snackbar = React.createClass({
  propTypes: {
    message: PropTypes.string,
  },

  render() {
    return (
      <SnackbarUI open={typeof this.props.message === 'string'}
          message={<span>{this.props.message}</span>}
          autoHideDuration={10000} onRequestClose={this.props.emptySnackbar}
      />
    )
  }
})

const mapStateToProps = (state) => ({
    message: state.snackbar.message,
});

const mapDispatchToProps = (dispatch) => ({
    emptySnackbar() {
        dispatch(closeSnackbar());
    }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snackbar);
