import React, { Component } from "react";
import { connect } from "react-redux";
import getUser from "../models/user";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

import "./UserDetails.component.css";

// const styles = {
//   activeColor: "#00C853",
//   disabledColor: "#E53935",
//   icon: {
//     color: "#369",
//     marginRight: 2,
//   },
// };

const Streams = ({ streams }) => {
  const rows = streams.map((s, i) => {
    const view = s.accesses["View Data"] ? s.accesses["View Data"] : "-";
    const enter = s.accesses["Enter Data"] ? s.accesses["Enter Data"] : "-";
    return (
      <tr key={`${s.name}-${i}`}>
        <td>{s.name}</td>
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

const Actions = ({ actions }) => {
  const actionItems = actions.map((action, i) => (
    <li key={`useraction-${i}`}>{action}</li>
  ));

  return <ul>{actionItems}</ul>;
};

class UserDetails extends Component {
  render() {
    const user = getUser(this.props.user, this.props.agencies, this.props.partners);
    console.log("user", user);

    return (
      <div style={{ position: "relative" }}>
        <h3>{user.displayName}</h3>
        <IconButton
          style={{ position: "absolute", top: "-18px", right: 0 }}
          onClick={this.props.onCloseDetails}
          aria-label="Close user details"
        >
          <CancelIcon />
        </IconButton>
        <p>
          <strong>User Type:</strong>
          <span>{user.type}</span>
        </p>
        <p>
          <strong>Organization:</strong> {user.employer}
        </p>
        <p>
          <strong>Country:</strong> {user.country}
        </p>
        <h4>Data streams</h4>
        <Streams streams={user.dataStreams} />
        {user.actions.length ? (
          <div>
            <h4>Actions</h4>
            <Actions actions={user.actions} />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    agencies: state.core.agencies,
    partners: state.core.partners,
  };
};

export default connect(mapStateToProps)(UserDetails);
