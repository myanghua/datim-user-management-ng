import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/EditSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import BlockIcon from "@material-ui/icons/Block";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import getUser from "../models/user";
import { userTypes as types } from "../actions/config";
import { green, red } from "../colors";
import { reasonsNotEditable } from "../services/userEditable";

import "./UserDetails.component.css";

const Streams = ({ streams }) => {
  const getAccessIcon = val => {
    if (val === undefined) {
      return <BlockIcon color="disabled" style={{ height: "16px" }} />;
    } else if (val === false) {
      return <ClearIcon style={{ color: red, height: "16px" }} />;
    }
    return <CheckIcon style={{ color: green, height: "16px" }} />;
  };

  const rows = streams.map((s, i) => {
    const view = getAccessIcon(s.accesses["View Data"]);
    const enter = getAccessIcon(s.accesses["Enter Data"]);
    return (
      <tr key={`${s.name}-${i}`}>
        <td style={{ textAlign: "left" }}>{s.name}</td>
        <td>{view}</td>
        <td>{enter}</td>
      </tr>
    );
  });

  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th />
          <th>View Data</th>
          <th>Enter Data</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const Actions = ({ actions }) => {
  const actionItems = actions.map((action, i) => (
    <ListItem key={`${action}-${i}`} style={{ padding: 0 }}>
      <ListItemIcon>
        <CheckIcon style={{ color: green, height: "16px" }} />
      </ListItemIcon>
      <ListItemText>{action}</ListItemText>
    </ListItem>
  ));

  return <List dense={false}>{actionItems}</List>;
};

class UserDetails extends Component {
  handleClickEdit = e => {
    e.stopPropagation();
    this.props.onClickEdit();
  };

  render() {
    const user = getUser(this.props.user);
    const userType = user.type || types.Unknown;
    const editable = reasonsNotEditable(this.props.user, this.props.me).length === 0;

    return (
      <div style={{ position: "relative" }}>
        <div>
          <span style={{ fontSize: "1.5em" }}>{user.displayName}</span>
        </div>
        <IconButton
          style={{ position: "absolute", top: "-20px", right: "-16px" }}
          onClick={this.props.onCloseDetails}
          aria-label="Close user details"
        >
          <CancelIcon />
        </IconButton>
        <p>
          <strong>User Type: </strong>
          <span>{userType}</span>
        </p>
        {[types.Agency, types.Partner, types.PartnerDoD].indexOf(user.type) !== -1 && (
          <p style={{ lineHeight: "1em" }}>
            <strong>Organization: </strong>
            {user.employer}
          </p>
        )}
        <p>
          <strong>Country: </strong>
          {user.country}
        </p>
        <p>
          <strong>Status: </strong>
          {this.props.user.userCredentials.disabled === true ? "Disabled" : "Active"}
        </p>
        {user.dataStreams.length > 0 && (
          <Fragment>
            <h3>Data streams</h3>
            <Streams streams={user.dataStreams} />
          </Fragment>
        )}
        {user.actions.length > 0 && (
          <Fragment>
            <h3>Actions</h3>
            <Actions actions={user.actions} />
          </Fragment>
        )}

        {editable === true && (
          <div style={{ marginTop: "1.5em" }}>
            <Tooltip title="Edit User" placement="bottom">
              <Button
                variant="extendedFab"
                aria-label="Edit User"
                color="primary"
                component={Link}
                onClick={this.handleClickEdit}
                to={"/edit/" + this.props.user.id}
              >
                <EditIcon style={{ marginRight: ".3em" }} />
                Edit
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  me: state.core.me,
});

export default connect(mapStateToProps)(UserDetails);
