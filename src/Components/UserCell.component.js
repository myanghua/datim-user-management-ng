import React, { Fragment } from "react";
import { connect } from "react-redux";
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
      <div>
        <h4>
          {user.surname}, {user.firstName}
        </h4>

        {user.id !== this.props.me.id && (
          <Fragment>
            <Button
              variant="fab"
              mini={true}
              style={{ float: "right", backgroundColor: bgcolor }}
              onClick={this.handleClickDisable}
            >
              {user.userCredentials.disabled === true ? <CheckIcon /> : <CancelIcon />}
            </Button>

            <Button
              variant="fab"
              mini={true}
              style={{ float: "right" }}
              onClick={this.handleClickEdit}
            >
              <EditIcon />
            </Button>
          </Fragment>
        )}
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

const mapStateToProps = state => {
  return {
    me: state.core.me,
  };
};

export default connect(mapStateToProps)(UserCell);
