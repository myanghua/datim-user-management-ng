import React, { Component } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';
import { connect } from 'react-redux';

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import FontIcon from 'material-ui/lib/font-icon';

import AppTheme from '../colortheme';
import actions from '../actions';
import '../translationRegistration';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

import List from './containers/ListPage.js';
import MainMenu from './containers/MainMenu.js';
import Invite from './components/Invite.component.js';
import Processing from './components/Processing.component.js';

class App extends Component<Props> {
    props: Props;

    propTypes: {
        d2: React.PropTypes.object,
    }

    static childContextTypes = {
        d2: React.PropTypes.object,
        muiTheme: React.PropTypes.object
    }

    constructor(props) {
      super(props);
      this.state = {snackbar:'',mainMenu:{page:'list'}};
      this.handleMenuAction = this.handleMenuAction.bind(this);
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            muiTheme: AppTheme
        };
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

    setSection(key) {
        this.setState({ section: key });
    }

    renderSection(key, apps) {
        const d2 = this.props.d2;
          switch (key) {
            case "invite":
              return (<Invite d2={d2}/>);
          // case "edit":
          //     return (<Edit d2={d2}/>);

            // The landing page
            default:
              return (<List d2={d2}/>);
        }
    }

    // What to do when they click on a menu button
    // @TODO:: get state higher up so we can send to edit page as well
    handleMenuAction(menu) {
      this.setSection(menu);
    }

    render() {
      const d2 = this.props.d2;
      return (
          <div className="app-wrapper">
            <HeaderBar/>
            <Processing />
            <div className="menuwrapper">
              <MainMenu d2={d2} onMenuClick={this.handleMenuAction}/>
            </div>
            <Snackbar className="snackbar"
                message={this.state.snackbar || ''}
                autoHideDuration={2500}
                onRequestClose={this.closeSnackbar}
                open={!!this.state.snackbar}
            />
            <div className="content-area">
                {this.renderSection(this.state.section)}
            </div>
          </div>
      );
    }
}

export default App;
