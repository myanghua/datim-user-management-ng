import React from 'react';

import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Checkbox from 'material-ui/lib/checkbox';
import {GridList, GridTile} from 'material-ui/lib/grid-list';

import DataStream from './DataStream.component';
import DataAction from './DataAction.component';
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

class Invite extends React.Component {

    propTypes: {
        d2: React.PropTypes.object,
    }

    contextTypes: {
        d2: React.PropTypes.object,
    }

    constructor(props) {
      super(props);
      this.state = {
        userType: false,
        country: false,
        email:'',
        locale:'en',
        agencies: [],
        partners: [],
        agency:false,
        partner:false,
        streams:{},
        actions: {},
        userManager: false,
        userGroupFilter:false,
      };
      this.handleChangeType = this.handleChangeType.bind(this);
      this.handleChangeCountry = this.handleChangeCountry.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.handleChangeLocale = this.handleChangeLocale.bind(this);
      this.handleChangeAgency = this.handleChangeAgency.bind(this);
      this.handleChangePartner = this.handleChangePartner.bind(this);
      this.handleCheckUserManager = this.handleCheckUserManager.bind(this);
      this.handleChangeStream = this.handleChangeStream.bind(this);
      this.handleChangeActions = this.handleChangeActions.bind(this);
      // this.getDatimUserGroups().then(res => console.log('dugs',res))
      // .catch(e => console.error(e));
    }

    // Get all user groups with (DATIM) in their name
    getDatimUserGroups = async() =>{
      const d2 = this.props.d2;
      let list = await d2.models.userGroups.list({
        filter: 'name:like: (DATIM)',
        fields: 'id,name,users[id,name]'
      });
      return list;
    }

    // get a list of relevant Partners based upon the selected "country"
    // for some reason "Partners" are both userGroups and categoryOptionGroups
    getPartnersInOrg(ouUID) {
      const { core, d2 } = this.props;
      const countryName = core.countries.filter(r=> (r.id===ouUID))[0].name;
      const params = {
        paging: false,
        fields: 'id,name,code',
        filter: 'name:ilike:' + countryName + ' Partner',
      };
      console.log('params',params);
      d2.models.userGroups.list(params).then(res=>{

        // these three functions are copied from the original stores.json
        // extract the partner code in  format of categoryOptionGroups "Partner_XXXX"
        let getPartnerCode = (userGroup) => {
          return (/Partner \d+?(?= )/i.exec(userGroup.name) || '').toString().replace('Partner ', 'Partner_');
        }
        // figure out the user group type based on the nameing convention
        let getType = (userGroup) => {
          return (/ all mechanisms - /i.test(userGroup.name) ? 'mechUserGroup' : (/ user administrators - /i.test(userGroup.name) ? 'userAdminUserGroup' : 'userUserGroup'));
        }
        // merge together userGroups based upon their partner ID
        let extendObj = (obj, userGroup, partnerName, groupType) => {
          return (function () { obj[partnerName] = obj[partnerName] || {}; obj[partnerName][groupType] = userGroup; return obj; })();
        }

        // take the userGroups that have a name like our OU, group and index them by their partner_code
        const merged = res.toArray().reduce((obj, ug) => {
            return extendObj(obj, ug.toJSON(), getPartnerCode(ug),  getType(ug)); }, {}
        );
        // shove that data into the main partners object
        const mapped = core.partners.map(p=>{
          return Object.assign({}, p, merged[p.code]);
        });
        // remove any that didn't get mapped
        let filtered = mapped.filter(p => {
          return p.mechUserGroup && p.mechUserGroup.id && p.userUserGroup && p.userUserGroup.id;
        });
        filtered.sort((a, b) => { return (a.name > b.name)?1:(a.name< b.name)?-1:0});
        // check for DoD silliness
        filtered.forEach(p => {
          p.dodEntry = ((core.dod[ouUID] || {})[p.id] || false);  // will be false, 0, or 1
          p.normalEntry = (p.dodEntry === false);                 // no DoD information
        });


        this.setState({partners:filtered});
      })
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }

    handleChangeType(event, index, value) {
      let ugFilter = '';
      if (this.state.country || value == 'MOH'){
        switch(value){
          case 'Agency':
            ugFilter = 'OU ' + this.state.country + ' Agency ';
            break;
          case 'Global':
            ugFilter = 'Global users';
            break;
          case 'Inter-Agency':
            //country team
            ugFilter = 'OU ' + this.state.country + ' Country team';
            break;
          case 'MOH':
            ugFilter = 'Data MOH Access';
            break;
          case 'Partner':
            this.getPartnersInOrg(this.state.country);
            ugFilter = 'OU ' + this.state.country + ' Partner ';
            break;
          case 'Partner DoD':
            // @TODO
            break;
        }
        this.setState({userGroupFilter:ugFilter});
      }
      this.setState({userType:value,agency:false,partner:false});
    }

    handleChangeCountry(event, index, value) {
      this.setState({country:value});
      if (value==='global'){
        this.handleChangeType(event, 0, 'Global');
      }
      else{
          this.handleChangeType(event, 0, false);
      }
    }

    handleChangeLocale(event, index, value) {
      this.setState({locale:value});
    }

    handleChangeAgency(event, index, value) {
      this.setState({agency:value});
    }

    handleChangePartner(event, index, value) {
      // @TODO check if we need to add DoD objects to view
      this.setState({partner:value});
    }

    handleChangeEmail = (event) => {
      this.setState({
        email: event.target.value,
      });
    }

    handleCheckUserManager = () => {
      this.setState({
        userManager: !this.state.userManager,
      });
    }

    handleChangeStream(streamName, state, value) {
      console.log('stream',streamName, state, value);
    }

    handleChangeActions(roleUID, value) {
      console.log('actions',roleUID,value);
    }

    render() {
        const { d2, core } = this.props;

        let uts = [];
        let countries = [];
        let locales = [];
        let agencies = [{id:'-',name:'Loading...'}];

        if (core) {
          if (core.userTypes){
            uts = core.userTypes;
          }
          if (core.countries){
            countries = core.countries;
            if (countries && countries[0] && countries[0].id!=='global'){
              countries.unshift({id:'global',name:'Global'});
            }
          }
          if (core.locales){
            locales = core.locales;
          }
          if (core.agencies){
            agencies = core.agencies;
          }
        }
        else{
          //BAD CORE CONFIG @TODO:: redirect with warning
        }

        let typeMenus = [];
        uts.forEach(el => {
          // don't show "Partner DoD" as an option here
          if (core.config[el].isDoD) {
            return;
          }
          typeMenus.push(
            <MenuItem
              key={el}
              value={el}
              primaryText={el}
              checked={this.state.userType==el}
              disabled={this.state.country==='global' ||
                (el==='Global' && this.state.country!=='Global') ||
                (!this.state.country)
              }
            />
          );
        })

        // Build the select menus
        const countryMenus = countries.map((v) => (
          <MenuItem
            key={v.id}
            value={v.id}
            primaryText={v.name}
            checked={this.state.country==v.id}
          />
        ));

        const localeMenus = locales.map((v) => (
          <MenuItem
            key={v.locale}
            value={v.locale}
            primaryText={v.name}
            checked={this.state.locale==v.locale}
          />
        ));

        const agencyMenus = agencies.map((v) => (
          <MenuItem
            key={v.id}
            value={v.id}
            primaryText={v.name}
            checked={this.state.agency==v.id}
          />
        ));

        console.log('PARTNERS',this.state.partners);
        const partnerMenus = this.state.partners.map((v) => (
          <MenuItem
            key={v.id}
            value={v.id}
            primaryText={v.name}
            checked={this.state.partner==v.id}
          />
        ));

        // Build the Stream / Action radios
        let streams = [];
        let actions = [];
        if (core.config.hasOwnProperty(this.state.userType)){
          let cfg = core.config[this.state.userType];
          // Check for DoD awareness
          if (this.state.userType==="Partner" && core.config.dod && core.config.dod[this.state.country]){
            console.log('IS DOD?',core.config.dod[this.state.country])
          }

          //convert to array for easier sorting
          const s = Object.entries(cfg.streams).map(([key, value]) => ({key,value})).sort((a,b)=> a.value.sortOrder > b.value.sortOrder);
          s.forEach(stream => {
            streams.push(
              <GridTile key={stream.key} >
                <DataStream stream={stream} onChangeStream={this.handleChangeStream} userManager={this.state.userManager}/>
              </GridTile>
            );
          });
          //convert to array for easier sorting
          const act = cfg.actions
            .filter(a => a.hidden===0)
            .sort((a,b)=> a.sortOrder > b.sortOrder);
          act.forEach(action => {
            console.log('action',action);
            actions.push(
              <DataAction key={action.roleUID} action={action} onChangeAction={this.handleChangeActions} userManager={this.state.userManager}/>
            );
          });
        }


        return (
          <div className="wrapper">
            <h2 className="title">{d2.i18n.getTranslation('invite')}</h2>
            <h3 className="subTitle">{d2.i18n.getTranslation('app')}</h3>


            <Paper className="card filters">

              <SelectField
                      floatingLabelText="Country"
                      hintText="Select a country"
                      value={this.state.country}
                      onChange={this.handleChangeCountry}
                    >
                {countryMenus}
              </SelectField>
              <br />
              <SelectField
                      floatingLabelText="User Type"
                      hintText="Select a user type"
                      value={this.state.userType}
                      onChange={this.handleChangeType}
                    >
                {typeMenus}
              </SelectField>
              <br />

              {(this.state.userType==="Partner")?
                <SelectField
                        floatingLabelText="Partner"
                        hintText="Select a partner"
                        fullWidth={true}
                        value={this.state.partner}
                        onChange={this.handleChangePartner}
                      >
                  {partnerMenus}
                </SelectField>
              :null}
              <br />
              {(this.state.userType==="Agency")?
                <SelectField
                        floatingLabelText="Agency"
                        hintText="Select an agency"
                        value={this.state.agency}
                        onChange={this.handleChangeAgency}
                      >
                  {agencyMenus}
                </SelectField>
              :null}
              <br />


              <TextField
                id="email"
                floatingLabelText="E-mail address"
                hintText="user@organisation.tld"
              />
              <br />

              <SelectField
                      floatingLabelText="Language"
                      hintText="Select a language"
                      value={this.state.locale}
                      onChange={this.handleChangeLocale}
                    >
                {localeMenus}
              </SelectField>


              <Checkbox
                style={{marginTop:"1em"}}
                label="User Manager"
                checked={this.state.userManager}
                onCheck={this.handleCheckUserManager}
                disabled={(!this.state.userType)}
              />

            </Paper>

            <Paper className="card filters">
              <h3>Data Streams</h3>
              <GridList
                  style={{display: 'flex', flexWrap: 'nowrap', overflowX: 'auto'}}
                  cols={streams.length}
              >
                {streams.length>0? streams: <p>None</p>}
              </GridList>
            </Paper>

            <Paper className="card filters">
              <h3>User Actions</h3>
              {actions.length>0? actions: <p>None</p>}
            </Paper>

          </div>
        );
    }
}

export default Invite;
