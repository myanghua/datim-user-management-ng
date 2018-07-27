import React from "react";

import EditIcon from "@material-ui/icons/EditSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";

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
  handleClickEdit = () => {
    this.props.onClickEdit(this.props.user);
  };

  handleClickDisable = () => {
    this.props.onClickDisable(this.props.user);
  };

  render() {
    const user = this.props.user;
    const bgcolor =
      user.userCredentials.disabled === true ? styles.disabledColor : styles.activeColor;

    return (
      <div>
        <h4>
          {user.surname}, {user.firstName}
        </h4>

        <Button
          variant="fab"
          mini={true}
          style={{ float: "right", backgroundColor: bgcolor }}
          onClick={this.handleClickDisable}
        >
          {user.userCredentials.disabled === true ? <CancelIcon /> : <CheckIcon />}
        </Button>

        <Button
          variant="fab"
          mini={true}
          style={{ float: "right" }}
          onClick={this.handleClickEdit}
        >
          <EditIcon />
        </Button>

        <p>
          <EmailIcon />
          {user.email}
        </p>
        <p>
          <PersonIcon />
          {user.userCredentials.username}
        </p>
      </div>
    );
  }
}

export default UserCell;
