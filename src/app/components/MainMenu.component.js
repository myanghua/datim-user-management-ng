import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import AppTheme from '../../colortheme';
import '../../translationRegistration';

/**
 * Top menu buttons
 */
class MainMenu extends Component<Props> {
    props: Props;

    propTypes: {
      d2: PropTypes.object.isRequired,
      setPage: PropTypes.func.isRequired,
    }

    constructor(props) {
      super(props)
      // bind functions in this class so they can run
      this.handleListAction = this.handleListAction.bind(this);
      this.handleInviteAction = this.handleInviteAction.bind(this);
    }

    // Show the list page
    handleListAction() {
      this.props.setPage('list');
    }
    // Show the Invite page
    handleInviteAction() {
      this.props.setPage('invite');
    }

    // DISPLAY THE BUTTONS
    render() {
        const { d2 } = this.props;

        return (
          <div className="menu">
            <RaisedButton
              primary={true}
              onClick={this.handleListAction}
              label={d2.i18n.getTranslation('list')}
              icon={<FontIcon className="material-icons">people-outline</FontIcon>} />
            <RaisedButton
              primary={true}
              style={{marginLeft:"1em"}}
              onClick={this.handleInviteAction}
              label={d2.i18n.getTranslation('invite')}
              icon={<FontIcon className="material-icons">person-add</FontIcon>} />
          </div>
        );
    }

}

export default MainMenu;
