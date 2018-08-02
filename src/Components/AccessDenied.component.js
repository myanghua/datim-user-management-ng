import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

class AccessDenied extends Component {
  render() {
    const { access } = this.props;

    return (
      <div>
        {access.show === true ? (
          <Dialog
            disableBackdropClick={true}
            open={true}
            className="accessDeniedDialog"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" className="accessDeniedTitle">
              Access Denied
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {access.message}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  access: state.access,
});

export default connect(mapStateToProps)(AccessDenied);
