import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { JssProvider } from "react-jss";
import HeaderBar from "@dhis2/d2-ui-header-bar";
import Snackbar from "@material-ui/core/Snackbar";
import injectTapEventPlugin from "react-tap-event-plugin";

import AppTheme from "./colortheme";
import actions from "./actions";
import * as coreActions from "./actions/core";
import MainMenu from "./containers/MainMenu.js";
import AccessDenied from "./Components/AccessDenied.component.js";
import Processing from "./Components/Processing.component.js";
import Invite from "./containers/InvitePage.js";
import List from "./containers/ListPage.js";

import "./App.css";

injectTapEventPlugin();

class App extends Component {
  getChildContext = () => ({
    d2: this.props.d2,
    muiTheme: AppTheme,
  });

  constructor(props) {
    super(props);
    this.state = { snackbar: "", mainMenu: { page: "list" } };

    //bootstrap some items
    props.setD2(props.d2);
    props.setMe(props.d2);
    props.getCountries(props.d2);
    props.parseConfiguration();
    props.getLocales(props.d2);
    props.getFundingAgencyUID(props.d2);
    props.getImplementingPartnerUID(props.d2);
    props.getDoDUID(props.d2);
    props.getUserGroups(props.d2);
    // props.getUserRoles(props.d2);
  }

  componentDidMount() {
    this.subscriptions = [
      actions.showSnackbarMessage.subscribe(params => {
        if (!!this.state.snackbar) {
          this.setState({ snackbar: undefined });
          setTimeout(() => {
            this.setState({ snackbar: params.data });
          }, 150);
        } else {
          this.setState({ snackbar: params.data });
        }
      }),
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => {
      subscription.dispose();
    });
  }

  closeSnackbar() {
    this.setState({ snackbar: undefined });
  }

  showSnackbar(message) {
    this.setState({ snackbar: message });
  }

  renderSection(key) {
    const d2 = this.props.d2;
    switch (key) {
      case "invite":
        return <Invite d2={d2} />;
      // case "edit":
      //     return (<Edit d2={d2}/>);

      // The landing page
      default:
        return <List d2={d2} />;
    }
  }

  render() {
    const d2 = this.props.d2;
    return (
      <JssProvider>
        <div className="app-wrapper">
          <AccessDenied />
          <HeaderBar d2={d2} />
          <Processing />
          <div className="menuwrapper">
            <MainMenu d2={d2} />
          </div>
          <Snackbar
            className="snackbar"
            message={this.state.snackbar || ""}
            autoHideDuration={2500}
            onRequestClose={this.closeSnackbar}
            open={!!this.state.snackbar}
          />
          <div className="content-area">{this.renderSection(this.props.section)}</div>
        </div>
      </JssProvider>
    );
  }
}

App.childContextTypes = {
  d2: PropTypes.object,
  muiTheme: PropTypes.object,
};

App.propTypes = {
  d2: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({ section: state.mainMenu.page });
const mapDispatchToProps = dispatch => bindActionCreators(coreActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
