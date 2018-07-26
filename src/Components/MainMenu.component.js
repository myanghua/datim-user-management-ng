import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import PeopleIcon from "@material-ui/icons/People";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

// import AppTheme from "../colortheme";

class MainMenu extends Component {
  handleListAction = () => {
    this.props.setPage("list");
  };

  handleInviteAction = () => {
    this.props.setPage("invite");
  };

  // DISPLAY THE BUTTONS
  render() {
    return (
      <div className="menu">
        <Button color="primary" onClick={this.handleListAction}>
          <PeopleIcon />
          List
        </Button>
        <Button color="primary" style={{ marginLeft: "1em" }} onClick={this.handleInviteAction}>
          <PersonAddIcon />
          Invite
        </Button>
      </div>
    );
  }
}

MainMenu.propTypes = {
  setPage: PropTypes.func.isRequired,
};

export default MainMenu;
