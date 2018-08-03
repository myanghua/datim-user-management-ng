import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { Link, withRouter } from "react-router-dom";

// import AppTheme from "../colortheme";

class MainMenu extends Component {
  // DISPLAY THE BUTTONS
  render() {
    return (
      <div className="menuwrapper">
        <Button
          color="primary"
          variant="outlined"
          component={Link}
          to="/"
          disabled={this.props.location && this.props.location.pathname === "/"}
        >
          <PeopleIcon />
          List
        </Button>
        <Button
          color="primary"
          style={{ marginLeft: "1em" }}
          variant="outlined"
          component={Link}
          to="/invite"
          disabled={this.props.location && this.props.location.pathname === "/invite"}
        >
          <PersonAddIcon />
          Invite
        </Button>
      </div>
    );
  }
}

export default withRouter(MainMenu);
