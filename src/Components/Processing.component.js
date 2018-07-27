import React from "react";
import { connect } from "react-redux";

import CircularProgress from "@material-ui/core/CircularProgress";

class Processing extends React.Component {
  render() {
    return (
      <div>
        {this.props.processing.processing ? (
          <div className="progressWrapper">
            <CircularProgress size={4} />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  processing: state.processing,
});

export default connect(mapStateToProps)(Processing);
