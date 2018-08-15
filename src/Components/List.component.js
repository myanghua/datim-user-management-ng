import React, { Component } from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MainMenu from "../containers/MainMenu.js";
import UserCell from "./UserCell.component";
import UserDetails from "./UserDetails.component";
import FilterManager from "./filter/FilterManager.component";
import Pager from "./Pager.component";
import { tabs } from "./filter/tabCategories";

const styles = {
  activeColor: "#00C853",
  disabledColor: "#E53935",
  icon: {
    color: "#369",
    marginRight: 2,
  },
};

class List extends Component {
  state = {
    detailsOffsetTop: 0,
  };
  constructor(props) {
    super(props);
    this.props.getUserListing();
  }

  handleChangeTab = (e, value) => {
    this.props.setTab(value);
  };

  handleUserSelect = (e, userId) => {
    const detailsOffsetTop =
      document.querySelector(`.row-${userId}`).offsetTop +
      document.querySelector(".user-list-table").offsetTop;

    this.setState({ detailsOffsetTop });
    this.props.setSelectedUser(this.props.users[userId]);
  };

  handleUserEdit = () => {
    this.props.clearSelectedUser();
  };

  handleUserDisable = user => {
    if (user === undefined) {
      return false;
    }

    this.props.setUserDisabledState(user.id, !user.userCredentials.disabled);
  };

  handleCloseUserDetails = () => {
    this.props.clearSelectedUser();
  };

  // DISPLAY THE INFO
  render() {
    let { users, selectedUser, pager, tab } = this.props;

    if (!pager.page) {
      return <div />;
    }

    const tabComponents = Object.values(tabs).map(t => {
      return <Tab key={t.id} label={t.displayName} value={t.id} />;
    });

    const showDetailsClass = selectedUser && "show-user-details";

    return (
      <div className="wrapper">
        <MainMenu />

        <h2 className="title">Manage Users</h2>
        <h3 className="subTitle">User management</h3>

        <FilterManager />

        <Paper className={`card listing ${showDetailsClass}`}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={this.handleChangeTab}
          >
            {tabComponents}
          </Tabs>

          <h2>{pager.total} Users found</h2>

          <Table className="user-list-table">
            <TableBody>
              {Object.values(users).map((user, index) => (
                <TableRow
                  hover
                  onClick={event => this.handleUserSelect(event, user.id)}
                  key={index}
                  className={`listingRow row-${user.id}`}
                >
                  <TableCell>
                    <UserCell
                      user={user}
                      onClickEdit={this.handleUserEdit}
                      onClickDisable={this.handleUserDisable}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      width: "2em",
                      color: "white",
                      textAlign: "center",
                      paddingLeft: 0,
                      fontSize: "bigger",
                      fontWeight: "lighter",
                      backgroundColor:
                        user.userCredentials.disabled === true
                          ? styles.disabledColor
                          : styles.activeColor,
                    }}
                  >
                    <div className="rotate90">
                      {user.userCredentials.disabled === true ? "Disabled" : "Active"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <Pager pager={pager} onPageChange={this.handlePageChange} />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>

        {!selectedUser ? null : (
          <Paper className="card details" style={{ top: this.state.detailsOffsetTop }}>
            <UserDetails
              user={selectedUser}
              onCloseDetails={this.handleCloseUserDetails}
            />
          </Paper>
        )}
      </div>
    );
  }
}

List.propTypes = {
  getUserListing: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  clearSelectedUser: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
};

export default List;
