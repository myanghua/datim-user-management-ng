import React from "react";
import { connect } from "react-redux";
import EditIcon from "@material-ui/icons/EditSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";

// import AppTheme from "../colortheme";
// import actions from "../actions";

const styles = {
  activeColor: "#00C853",
  disabledColor: "#E53935",
  icon: {
    color: "#369",
    marginRight: 2,
  },
};

class UserCell extends React.Component {
  handleClickEdit = e => {
    e.stopPropagation();
    this.props.onClickEdit(this.props.user);
  };

  handleClickDisable = e => {
    e.stopPropagation();
    this.props.onClickDisable(this.props.user);
  };

  render() {
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

        {user.id !== this.props.me.id && (
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton
              style={{ height: 32, width: 32 }}
              onClick={this.handleClickEdit}
              aria-label="Edit user"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              style={{ color: bgcolor, height: 32, width: 32 }}
              onClick={this.handleClickDisable}
              aria-label="Change user enabled state"
            >
              {user.userCredentials.disabled === true ? <CheckIcon /> : <CancelIcon />}
            </IconButton>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    me: state.core.me,
  };
};

export default connect(mapStateToProps)(UserCell);
