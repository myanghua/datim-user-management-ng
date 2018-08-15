import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";

class Processing extends Component {
  render() {
    return (
      <Dialog
        open={this.props.processing.processing}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title" style={{ display: "none" }}>
          Processing...
        </DialogTitle>
        <DialogContent style={{ textAlign: "center", margin: "1em", paddingTop: "1em" }}>
          <CircularProgress
            size={40}
            color="primary"
            thickness={7}
            style={{ padding: "1em" }}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  processing: state.processing,
});

export default connect(mapStateToProps)(Processing);
