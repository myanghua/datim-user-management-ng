import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/EditSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { green, red } from "../colors";
import { reasonsNotEditable } from "../services/userEditable";

const styles = {
  activeColor: green,
  disabledColor: red,
  icon: {
    color: "#369",
    marginRight: 2,
  },
  customWidth: {
    maxWidth: "500px",
    fontSize: "13px",
  },
};

const ToolTipForNotEditable = ({ reasonsNoEdit }) => {
  const reasons = reasonsNoEdit.map((r, i) => {
    return (
      <li key={`reason-${i}`}>
        <span>{r}</span>
      </li>
    );
  });

  return (
    <Fragment>
      <p>You cannot edit this user because:</p>
      <ul>{reasons}</ul>
    </Fragment>
  );
};

class UserCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonsNoEdit: reasonsNotEditable(props.user, props.me),
    };
  }

  handleClickDisable = e => {
    e.stopPropagation();
    this.props.onClickDisable(this.props.user);
  };

  handleClickEdit = e => {
    e.stopPropagation();
    this.props.onClickEdit();
  };

  render() {
    if (!this.props.me.hasOwnProperty("id")) {
      return <div />;
    }
    const user = this.props.user;
    const bgcolor =
      user.userCredentials.disabled === true ? styles.activeColor : styles.disabledColor;

    return (
      <div style={{ position: "relative" }}>
        <h4>
          {user.surname}, {user.firstName}
        </h4>
        <p>
          <EmailIcon />
          {user.email}
        </p>
        <p>
          <PersonIcon />
          {user.userCredentials.username}
        </p>

        <div style={{ position: "absolute", top: 0, right: 0 }}>
          {!this.state.reasonsNoEdit.length ? (
            <Fragment>
              <Tooltip title="Edit User" placement="bottom-end">
                <IconButton
                  style={{ height: 32, width: 32 }}
                  aria-label="Edit user"
                  component={Link}
                  onClick={this.handleClickEdit}
                  to={"/edit/" + user.id}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={user.userCredentials.disabled === true ? "Enable" : "Disable"}
                placement="bottom-start"
              >
                <IconButton
                  style={{ color: bgcolor, height: 32, width: 32 }}
                  onClick={this.handleClickDisable}
                  aria-label="Change user enabled state"
                >
                  {user.userCredentials.disabled === true ? (
                    <CheckIcon />
                  ) : (
                    <CancelIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Fragment>
          ) : (
            <Tooltip
              title={<ToolTipForNotEditable reasonsNoEdit={this.state.reasonsNoEdit} />}
              classes={{ tooltip: this.props.classes.customWidth }}
            >
              <span>
                <Button variant="outlined" size="small" color="primary" disabled>
                  Unable to edit
                </Button>
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  me: state.core.me,
});

export default connect(mapStateToProps)(withStyles(styles)(UserCell));
