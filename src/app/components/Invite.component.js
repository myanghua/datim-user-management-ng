import React from 'react';

import { getInstance } from 'd2/lib/d2';

import Paper from 'material-ui/lib/paper';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Snackbar from 'material-ui/lib/snackbar';
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

class Invite extends React.Component {

    propTypes: {
        d2: React.PropTypes.object,
    }

    contextTypes: {
        d2: React.PropTypes.object,
    }

    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const d2 = this.props.d2;

        return (
          <div className="wrapper">
            <h2 className="title">{d2.i18n.getTranslation('invite')}</h2>
            <h3 className="subTitle">{d2.i18n.getTranslation('app')}</h3>

          </div>
        );
    }
}

export default Invite;
