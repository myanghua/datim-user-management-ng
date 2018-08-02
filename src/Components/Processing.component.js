import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";

class Processing extends Component {
  render() {
    return (
      <Dialog open={this.props.processing.processing}>
        <CircularProgress
          size={40}
          color="primary"
          thickness={7}
          style={{ padding: "1em" }}
        />
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  processing: state.processing,
});

export default connect(mapStateToProps)(Processing);
