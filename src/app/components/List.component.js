import React from 'react';

import { getInstance } from 'd2/lib/d2';

import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Snackbar from 'material-ui/lib/snackbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import CircularProgress from 'material-ui/lib/circular-progress';
import {Tabs, Tab} from 'material-ui/lib/tabs';

import AppTheme from '../../colortheme';
import actions from '../../actions';
import '../../translationRegistration';

const styles = {
  activeColor:  "#00C853",
  disabledColor: "#E53935",
  icon: {
    color:"#369",
    marginRight: 2
  }
}


// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
export default React.createClass({
    propTypes: {
        d2: React.PropTypes.object,
    },

    contextTypes: {
        d2: React.PropTypes.object,
    },

    //onload functions
    componentDidMount() {
      const d2 = this.props.d2;

      // //get user groups as a cache
      // d2.models.userGroups.list({ paging: false, fields: 'id,name' })
      //   .then(groups => {
      //     let g = {};
      //     for (let group of groups){
      //       g[group[1].name]={id:group[1].id,name:group[1].name};
      //     }
      //     this.setState({groups:g});
      //   })
      //   .catch(err => {
      //     this.setState({
      //       warnings: ["No user groups defined"].concat(this.state.warnings),
      //       groups:{}
      //     });
      //     actions.showSnackbarMessage("No user groups defined");
      //     console.log(err);
      //   });
      //
      // //get user roles as a cache
      // d2.models.userRoles.list({ paging: false, fields: 'id,name' })
      //   .then(roles => {
      //     let g = {};
      //     for (let role of roles){
      //       g[role[1].name]={id:role[1].id,name:role[1].name};
      //     }
      //     this.setState({roles:g});
      //   })
      //   .catch(err => {
      //     this.setState({
      //       warnings: ["No user roles defined"].concat(this.state.warnings),
      //       roles:{}
      //     });
      //     actions.showSnackbarMessage("No user roles defined");
      //     console.log(err);
      // });

      this.getUserListing({},0);

    },

    getInitialState() {
        return {
          processing: false,
          roles:[],
          groups:[],
          ous:[],
          types:[],
          userCount:0,
          users:[],
          selectedUser:false,
          filters:[],
          tab: 'all'
         };
    },

    handleChangeTab(value) {
      let filters = this.state.filters;
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

      this.setState({
        tab: value,
        filters: filters,
      });

      this.getUserListing(filters,0);

    },

    getUserListing(filters,page) {

      this.setState({processing:true});
      const d2 = this.props.d2;
      let params = {
        paging: true,
        fields: 'id,surname,firstName,email,employer,displayName,userCredentials[username,disabled,lastLogin]',
        page: page
      };
      if (Object.values(filters).length>0){
        params.filter = Object.values(filters).join(',');
      }
      d2.models.users.list(params).then(u=>{
        this.setState({
          users:u.toArray(),
          userCount:u.pager.total,
          processing: false,
        });
      });
    },

    handleUserChange(r,c) {
      this.setState({selectedUser:this.state.users[r]});
    },

    handleUserEdit(event,value) {
      console.log(event.target,value);
    },

    //DISPLAY THE INFO
    render() {
        const d2 = this.props.d2;

        const data = this.state.users;
        const user = this.state.selectedUser;

        return (
          <div className="wrapper" key={this.state.loaderName}>
            <h2 className="title">{d2.i18n.getTranslation('list')}</h2>
            <h3 className="subTitle">{d2.i18n.getTranslation('app')}</h3>

                { (this.state.processing) ? <div className="progressWrapper">
                  <CircularProgress size={4} />
                </div> : null }



                <Paper className="card filters">
                  <h3>Filters</h3>
                  <p>Select your filter type to limit your search</p>
                  <p>Start typing your filter value</p>


                </Paper>

                <Paper className="card listing">

                <Tabs
                  value={this.state.tab}
                  onChange={this.handleChangeTab}
                  inkBarStyle={{height: 4, bottom: 2}}
                  inkBarContainerStyle={{background:'red'}}
                >
                  <Tab label="All Users" value="all">
                    <div>
                    </div>
                  </Tab>
                  <Tab label="Active Users" value="active">
                    <div>
                    </div>
                  </Tab>
                  <Tab label="Disabled Users" value="disabled">
                    <div>
                    </div>
                  </Tab>
                </Tabs>

                <h2>{this.state.userCount} Users found</h2>

                  <Table
                    selectable={true}
                    multiSelectable={false}
                    onCellClick={this.handleUserChange}
                  >
                    <TableBody
                      displayRowCheckbox={false}
                      deselectOnClickaway={false}
                      showRowHover={true}
                      stripedRows={true}
                    >
                      {data.map( (user, index) => (
                        <TableRow key={index} className="listingRow">
                          <TableRowColumn>

                            <h4>{user.surname}, {user.firstName}</h4>

                            <FloatingActionButton
                              mini={true}
                              style={{float:'right'}}
                              backgroundColor={(user.userCredentials.disabled===true)?styles.disabledColor:styles.activeColor}
                            >
                              <FontIcon className="material-icons">{(user.userCredentials.disabled===true)?'cancel':'check_box'}</FontIcon>
                            </FloatingActionButton>
                            <FloatingActionButton key={index} mini={true} style={{float:'right'}} onClick={this.handleUserEdit}>
                              <FontIcon className="material-icons">edit</FontIcon>
                            </FloatingActionButton>

                            <p>
                              <FontIcon className="material-icons" style={styles.icon}>email</FontIcon> {user.email}
                            </p>
                            <p>
                              <FontIcon className="material-icons" style={styles.icon}>person</FontIcon> {user.userCredentials.username}
                            </p>



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

                {(user===false)?null:
                <Paper className="card details">
                    <h3>{user.displayName}</h3>
                    <p>
                      <FontIcon className="material-icons" style={styles.icon}>work</FontIcon>
                      <strong>User Type:</strong> ????????PARTNER?AGENCY?
                      </p>
                    <p>
                      <FontIcon className="material-icons" style={styles.icon}>supervisor_account</FontIcon>
                      <strong>Organization:</strong> {user.employer}
                    </p>
                    <p>
                      <FontIcon className="material-icons" style={styles.icon}>map</FontIcon>
                      <strong>Country:</strong> ?????OU_LEVEL_3????/GLOBAL
                    </p>
                    <p>
                      <FontIcon className="material-icons" style={styles.icon}>access_time</FontIcon>
                      <strong>Last Login:</strong> {user.userCredentials.lastLogin}
                      </p>

                    <h4>Data streams</h4>
                      Access	Data entry
                      MER
                      MER Country Team
                      Expenditure
                      SIMS
                      MOH
                      Actions
                       Read Data
                       Submit data

                   <FloatingActionButton
                     mini={true}
                     style={{float:'right'}}
                     backgroundColor={(user.userCredentials.disabled===true)?styles.disabledColor:styles.activeColor}
                   >
                     <FontIcon className="material-icons">{(user.userCredentials.disabled===true)?'cancel':'check_box'}</FontIcon>
                   </FloatingActionButton>
                   <FloatingActionButton mini={true} style={{float:'right'}}>
                     <FontIcon className="material-icons">edit</FontIcon>
                   </FloatingActionButton>

                </Paper>
              }

          </div>
        );
    },


});
