import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import EditIcon from "@material-ui/icons/EditSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { getUserType, isGlobalUser, UNKNOWN_USER_TYPE } from "../models/user";
import { arrayToIdMap } from "../utils";

const styles = {
  activeColor: "#00C853",
  disabledColor: "#E53935",
  icon: {
    color: "#369",
    marginRight: 2,
  },
};

class UserCell extends React.Component {
  handleClickDisable = e => {
    e.stopPropagation();
    this.props.onClickDisable(this.props.user);
  };

  handleClickEdit = e => {
    e.stopPropagation();
    this.props.onClickEdit();
  };

  userEditable = () => {
    let errors = [];

    // user in list
    const user = this.props.user;
    const userType = getUserType(user);

    // current user
    const currentUserIsSuperUser =
      this.props.me && this.props.me.hasAllAuthority && this.props.me.hasAllAuthority();
    const currentUserIsGlobalUser = isGlobalUser(this.props.me);
    const currentUserType = getUserType(this.props.me);

    //Global current user cannot edit users of other types
    if (currentUserIsGlobalUser && !currentUserIsSuperUser && userType !== "Global") {
      errors.push('"Global" user cannot edit this "' + userType + '" user');
    }

    //MOH current user cannot edit non MOH users
    if (currentUserType === "MOH" && !currentUserIsSuperUser && userType !== "MOH") {
      errors.push('"MOH" user cannot edit this "' + userType + '" user');
    }

    //Cannot edit yourself
    if (user.id === this.props.me.id) {
      errors.push("Cannot edit yourself");
    }

    //User does not conform to a known type
    if (user.type === UNKNOWN_USER_TYPE) {
      errors.push("User does not conform to a known type");
    }

    const ugArray = user.userGroups.toArray();
    const unmanagableGroups = ugArray.filter(
      ug => !ug || !ug.access || !ug.access.manage
    );

    // Cannot manage ANY group
    if (
      !currentUserIsSuperUser &&
      unmanagableGroups.length !== 0 &&
      unmanagableGroups.length === ugArray.length
    ) {
      unmanagableGroups.forEach(ug => {
        errors.push('User is a member of the "' + ug.name + '" group, which you are not');
      });
    }

    // DOn't have all the user's roles
    if (
      !currentUserIsSuperUser &&
      user.userCredentials &&
      user.userCredentials.userRoles
    ) {
      const currentUser = this.props.me;
      const currentUserRoles =
        (currentUser.userCredentials && currentUser.userCredentials.userRoles) || [];
      const currentUserRolesMap = arrayToIdMap(currentUserRoles);

      user.userCredentials.userRoles.forEach(userRole => {
        if (!currentUserRolesMap[userRole.id]) {
          errors.push('User has the role "' + userRole.name + '" which you do not');
        }
      });
    }

    return !errors.length;
  };

  render() {
    if (!this.props.me.hasOwnProperty("id")) {
      return <div />;
    }
    const user = this.props.user;
    const bgcolor =
      user.userCredentials.disabled === true ? styles.activeColor : styles.disabledColor;

    const userEditable = this.userEditable();

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

        {userEditable && (
          <div style={{ position: "absolute", top: 0, right: 0 }}>
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
                {user.userCredentials.disabled === true ? <CheckIcon /> : <CancelIcon />}
              </IconButton>
            </Tooltip>
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
