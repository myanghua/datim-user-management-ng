import React, { Component } from "react";
import { connect } from "react-redux";

import FontIcon from "material-ui/lib/font-icon";

import AppTheme from "../../colortheme";
import actions from "../../actions";
import { getUserTypes } from "../reducers/coreReducers";
import "../../translationRegistration";
import allStreams from "../constants/streams";
import allRoles from "../constants/roles";

import "./UserDetails.component.css";

const styles = {
  activeColor: "#00C853",
  disabledColor: "#E53935",
  icon: {
    color: "#369",
    marginRight: 2,
  },
};

const parseStreamName = name => {
  const firstSpacePos = name.indexOf(" ");
  const lastSpacePos = name.lastIndexOf(" ");
  const type = name.slice(firstSpacePos, lastSpacePos).trim();
  const level = name.slice(lastSpacePos).trim();

  return [type, level];
};

const Streams = ({ streams }) => {
  const mappedVals = streams
    .map(s => parseStreamName(s))
    .reduce((acc, [currentKey, currentVal]) => {
      return {
        ...acc,
        [currentKey]: { ...acc[currentKey], ...{ [currentVal]: true } },
      };
    }, {});

  const rows = Object.keys(mappedVals).map(k => {
    const view = mappedVals[k].access ? "*" : "";
    const enter = mappedVals[k].entry ? "*" : "";
    return (
      <tr key={k}>
        <td>{k}</td>
        <td>{view}</td>
        <td>{enter}</td>
      </tr>
    );
  });

  return (
    <table>
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

const Actions = ({ roles }) => {
  const roleItems = roles.map((r, i) => <li key={`useraction-${i}`}>{r.displayName}</li>);

  return <ul>{roleItems}</ul>;
};

class UserDetails extends React.Component {
  handleClickEdit = () => {
    this.props.onClickEdit(this.props.user);
  };

  handleClickDisable = () => {
    this.props.onClickDisable(this.props.user);
  };

  getUserType = () => {
    // if we were to use the user custom attribute
    // const userType = this.props.user.attributeValues.find(v => v.attribute.code === "usertype");
    // return userType ? userType.value : "unknown";

    // getUserType by parsing the userGroups
    const types = this.props.userTypes.map(t => t.toLowerCase());
    const groupsString = this.props.user.userGroups
      .toArray()
      .map(g => g.name.toLowerCase())
      .join(" ");

    return types.find(t => groupsString.includes(t)) || "unknown";
  };

  getUserCountry = () => {
    const userCountry = this.props.user.organisationUnits.toArray().find(c => c.level === 3);
    return userCountry ? userCountry.name : "Global";
  };

  getUserRoles = () =>
    this.props.user.userCredentials.userRoles
      .filter(r => allRoles[r.name])
      .map(r => allRoles[r.name])
      .filter(r => !r.implied);

  getUserDataStreams = () =>
    this.props.user.userGroups
      .toArray()
      .filter(g => allStreams.indexOf(g.name) !== -1)
      .map(s => s.name);

  render() {
    const user = this.props.user;

    return (
      <div>
        <h3>{user.displayName}</h3>
        <p>
          <FontIcon className="material-icons" style={styles.icon} />
          <strong>User Type:</strong>
          <span>{this.getUserType()}</span>
        </p>
        <p>
          <FontIcon className="material-icons" style={styles.icon} />
          <strong>Organization:</strong> {user.employer}
        </p>
        <p>
          <FontIcon className="material-icons" style={styles.icon} />
          <strong>Country:</strong> {this.getUserCountry()}
        </p>
        <h4>Data streams</h4>
        <Streams streams={this.getUserDataStreams()} />
        <h4>Actions</h4>
        <Actions roles={this.getUserRoles()} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    userTypes: getUserTypes(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(UserDetails);
