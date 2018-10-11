import React, { Component } from "react";
import PropTypes from "prop-types";

import { withTheme } from "@material-ui/core/styles";
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
import Button from "@material-ui/core/Button";
import SaveAlt from "@material-ui/icons/SaveAlt";
import { tabs } from "./filter/tabCategories";
import { downloadAsCSV } from "../services/csvExport";

class List extends Component {
  state = {
    downloading: false,
  };
  constructor(props) {
    super(props);
    this.props.getUserListing();
  }

  handleChangeTab = (e, value) => {
    this.props.setTab(value);
  };

  toggleUserSelect = (e, userId) => {
    if (this.props.selectedUser && this.props.selectedUser.id === userId) {
      this.props.clearSelectedUser();
      return;
    }

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

  handleDownload = async () => {
    this.setState({ downloading: true });
    await downloadAsCSV(this.props.filters, this.props.tab);
    this.setState({ downloading: false });
  };

  render() {
    let { users, selectedUser, pager, tab, theme } = this.props;

    if (!pager || !pager.page || !users) {
      return <div />;
    }

    const tabComponents = Object.values(tabs).map(t => {
      return <Tab key={t.id} label={t.displayName} value={t.id} />;
    });

    const showDetailsClass = selectedUser && "show-user-details";
    const highlight = (this.props.selectedUser || {}).id || "-";

    const styles = {
      text: theme.palette.text.main,
      activeColor: theme.palette.primary.main,
      contrastText: theme.palette.primary.contrastText,
      disabledColor: "#999999",
      disabledText: theme.palette.text.disabled,
      icon: {
        color: "#369",
        marginRight: 2,
      },
    };

    return (
      <div className="wrapper">
        <MainMenu />

        <h2 className="title">Manage Users</h2>
        <h3 className="subTitle">User management</h3>

        <FilterManager />

        <Paper className={`card listing ${showDetailsClass}`}>
          {this.state.downloading ? (
            <div
              style={{
                color: "grey",
                float: "right",
                marginRight: "1.5em",
                marginTop: "1.5em",
                fontStyle: "italic",
              }}
            >
              <span>Downloading...</span>
            </div>
          ) : (
            <Button
              style={{ float: "right", marginRight: "2em", marginTop: "1em" }}
              color="primary"
              size="small"
              variant="outlined"
              onClick={this.handleDownload}
            >
              <SaveAlt style={{ marginRight: "4px" }} />
              Download CSV
            </Button>
          )}

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
                  onClick={event => this.toggleUserSelect(event, user.id)}
                  key={index}
                  className={`listingRow row-${user.id}`}
                  selected={highlight === user.id}
                >
                  <TableCell
                    style={{
                      color:
                        user.userCredentials.disabled === true
                          ? styles.disabledText
                          : styles.text,
                    }}
                  >
                    <UserCell
                      user={user}
                      onClickEdit={this.handleUserEdit}
                      onClickDisable={this.handleUserDisable}
                    />
                  </TableCell>
                  <TableCell
                    padding="none"
                    style={{
                      margin: "auto",
                      backgroundColor:
                        user.userCredentials.disabled === true
                          ? styles.disabledColor
                          : styles.activeColor,
                    }}
                  >
                    <div
                      className={`statusIndicator rotate90`}
                      style={{
                        color: "white",
                        fontSize: "bigger",
                        fontWeight: "lighter",
                      }}
                    >
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
          <Paper className="card details">
            <UserDetails
              user={users[selectedUser.id]}
              onCloseDetails={this.props.clearSelectedUser}
              onClickEdit={this.handleUserEdit}
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

export default withTheme()(List);
