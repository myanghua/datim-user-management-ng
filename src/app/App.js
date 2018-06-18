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
// import Invite from './components/Invite.component.js';
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
      this.state = {snackbar:''};
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

    renderSection(key, apps, showUpload) {
        const d2 = this.props.d2;
          switch (key) {
            case "invite":
              // return (<Invite d2={d2}/>);
          // case "edit":
          //     return (<Edit d2={d2}/>);

            //The landing page
            default:
              return (<List d2={d2}/>);
        }
    }

    handleListAction() {
    }

    handleInviteAction() {
      console.log('invite')
      this.setSection('invite');
    }

    render() {
      const d2 = this.props.d2;

      return (
          <div className="app-wrapper">
            <HeaderBar/>
            <Processing />
            <div className="menuwrapper">
              <div className="menu">
                <RaisedButton
                   primary={true}
                    onClick={this.handleListAction}
                    label={d2.i18n.getTranslation('list')}
                    icon={<FontIcon className="material-icons">people-outline</FontIcon>} />
                <RaisedButton
                  primary={true}
                  style={{marginLeft:"1em"}}
                  onClick={this.handlInviteAction}
                  label={d2.i18n.getTranslation('invite')}
                  icon={<FontIcon className="material-icons">person-add</FontIcon>} />
              </div>
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
