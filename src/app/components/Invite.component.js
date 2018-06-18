import React from 'react';

import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

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
        agency:false,
        partner:false,
        streams:{},
        userGroupFilter:false,
      };
      this.handleChangeType = this.handleChangeType.bind(this);
      this.handleChangeCountry = this.handleChangeCountry.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.handleChangeLocale = this.handleChangeLocale.bind(this);
      this.handleChangeAgency = this.handleChangeAgency.bind(this);
      this.handleChangePartner = this.handleChangePartner.bind(this);
      this.getDatimUserGroups().then(res => console.log('dugs',res))
      .catch(e => console.error(e));
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
      this.setState({partner:value});
    }
    handleChangeEmail = (event) => {
      this.setState({
        email: event.target.value,
      });
    }

    menuOUs() {
        // return persons.map(() => (
        //   <MenuItem
        //     key={person.value}
        //     insetChildren={true}
        //     checked={this.state.values.indexOf(person.value) > -1}
        //     value={person.value}
        //     primaryText={person.name}
        //   />
        // ));
    }


    render() {
        const d2 = this.props.d2;

        let uts = new Set().values();
        let countries = [];
        let locales = [];
        let partners = [{id:'aaaa',name:'Alice'}];
        let agencies = [{id:'bbbb',name:'Bob'}];

        if (this.props.core) {
          if (this.props.core.userTypes){
            uts = this.props.core.userTypes;
          }
          if (this.props.core.countries){
            countries = this.props.core.countries;
            if (countries && countries[0] && countries[0].id!=='global'){
              countries.unshift({id:'global',name:'Global'});
            }
          }
          if (this.props.core.locales){
            locales = this.props.core.locales;
          }
          if (this.props.core.partners){
            partners = this.props.core.partners;
          }
          if (this.props.core.agencies){
            agencies = this.props.core.agencies;
          }

        }

        let typeMenus = [];
        uts.forEach(el => {
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

        const partnerMenus = partners.map((v) => (
          <MenuItem
            key={v.id}
            value={v.id}
            primaryText={v.name}
            checked={this.state.partner==v.id}
          />
        ));



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

            </Paper>
          </div>
        );
    }
}

export default Invite;
