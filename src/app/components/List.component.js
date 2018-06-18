import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Tabs, Tab} from 'material-ui/lib/tabs';

import AppTheme from '../../colortheme';
import actions from '../../actions';  //Snackbar
import '../../translationRegistration';

import UserCell from './UserCell.component';
import UserDetails from './UserDetails.component';

const styles = {
  activeColor:  "#00C853",
  disabledColor: "#E53935",
  icon: {
    color:"#369",
    marginRight: 2
  }
}

/**
 * Main user listing screen
 */
class List extends Component<Props> {
    props: Props;

    propTypes: {
        d2: PropTypes.object.isRequired,
        getUserListing: PropTypes.func.isRequired,
        setSelectedUser: PropTypes.func.isRequired,
        setFilters: PropTypes.func.isRequired,
        setTab: PropTypes.func.isRequired
    }

    constructor(props) {
      super(props)
      // get initial listing for the user
      const { getUserListing } = this.props;
      getUserListing(this.props.d2,{},0);
      // bind functions in this class so they can run
      this.handleUserSelect = this.handleUserSelect.bind(this);
      this.handleChangeTab = this.handleChangeTab.bind(this);
      this.handleUserEdit = this.handleUserEdit.bind(this);
      this.handleUserDisable = this.handleUserDisable.bind(this);
    }

    // Clicked on Tab interface for all/active/disabled users
    handleChangeTab(value) {
      const { getUserListing, setFilters, setTab } = this.props;
      let filters = this.props.list.filters;
      switch (value) {
        case 'all':
          delete(filters.status);
          break;
        case 'active':
          filters.status='userCredentials.disabled:eq:false';
          break;
        case 'disabled':
          filters.status='userCredentials.disabled:eq:true';
          break;
      }
      setTab(value);
      setFilters(filters);
      getUserListing(this.props.d2,filters,0);
    }

    // What to do when the click on a table row
    handleUserSelect(r,c) {
      this.props.setSelectedUser(this.props.list.users[r]);
    }

    // Send user to editing interface
    handleUserEdit(user) {
      if (user===undefined) {
        return false;
      }
      // @TODO redux this user and send to edit page
      console.log('edit user',user.displayName);
    }

    // Toggle the disable flag on a user
    handleUserDisable(user) {
      if (user===undefined) {
        return false;
      }
      //update the UI
      user.userCredentials.disabled = !user.userCredentials.disabled;
      // @TODO redux this user and toggle disable flag
      // @TODO send disable command to API
      console.log('disable user toggle',user.displayName);
    }

    // DISPLAY THE INFO
    render() {
        const { d2 } = this.props;

        let { users, selectedUser, filters, userCount, tab } = this.props.list;

        return (
          <div className="wrapper">
            <h2 className="title">{d2.i18n.getTranslation('list')}</h2>
            <h3 className="subTitle">{d2.i18n.getTranslation('app')}</h3>

                <Paper className="card filters">
                  <h3>Filters</h3>
                  <p>Select your filter type to limit your search</p>
                  <p>Start typing your filter value</p>
                </Paper>

                <Paper className="card listing">

                  <Tabs
                    value={tab}
                    onChange={this.handleChangeTab}
                    inkBarStyle={{height: 4, bottom: 2}}
                    inkBarContainerStyle={{background:'red'}}
                  >
                    <Tab label="All Users" value="all" />
                    <Tab label="Active Users" value="active">
                      <div></div>
                    </Tab>
                    <Tab label="Disabled Users" value="disabled">
                      <div></div>
                    </Tab>
                  </Tabs>

                  <h2>{userCount} Users found</h2>

                  <Table
                    selectable={true}
                    multiSelectable={false}
                    onCellClick={this.handleUserSelect}
                  >
                    <TableBody
                      displayRowCheckbox={false}
                      deselectOnClickaway={false}
                      showRowHover={true}
                      stripedRows={true}
                    >
                      {users.map( (user, index) => (
                        <TableRow key={index} className="listingRow">
                          <TableRowColumn>
                            <UserCell
                              user={user}
                              onClickEdit={this.handleUserEdit}
                              onClickDisable={this.handleUserDisable}
                            />
                          </TableRowColumn>
                          <TableRowColumn
                            style={{
                                width:'2em',
                                color:'white',
                                textAlign:'center',
                                paddingLeft:0,
                                fontSize: 'bigger',
                                fontWeight: 'lighter',
                                backgroundColor:(user.userCredentials.disabled===true)?styles.disabledColor:styles.activeColor
                              }}
                          >
                            <div className="rotate90">
                              {(user.userCredentials.disabled===true)?"Disabled":"Active"}
                              </div>
                          </TableRowColumn>
                        </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  Pager

                </Paper>

                {(!selectedUser)?null:
                <Paper className="card details">
                    <UserDetails
                      user={selectedUser}
                      onClickEdit={this.handleUserEdit}
                      onClickDisable={this.handleUserDisable}
                    />
                </Paper>
              }

          </div>
        );
    }

}

export default List;
