import React from 'react';

import FontIcon from 'material-ui/lib/font-icon';

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


class UserDetails extends React.Component {

  handleClickEdit = () => {
    this.props.onClickEdit(this.props.user);
  }

  handleClickDisable = () => {
    this.props.onClickDisable(this.props.user);
  }

  render() {
    const user = this.props.user;

    return (
      <div>
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

      </div>
    );
  }
}

export default UserDetails;
