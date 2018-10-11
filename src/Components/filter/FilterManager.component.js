import React, { Component } from "react";
import { connect } from "react-redux";
// import Paper from "@material-ui/core/Paper";
import Filter from "./Filter.component";
import { removeFilters } from "../../actions/list";
import Button from "@material-ui/core/Button";

const defaultFilterField = {
  id: "",
  category: "name",
  detail: "",
};

const generateId = () => {
  const now = new Date();
  return `id_${now.getTime()}`;
};

export class FilterManager extends Component {
  state = {
    newFields: {},
  };

  constructor(props) {
    super(props);

    if (!Object.values(this.props.filters).length) {
      const newField = Object.assign({}, defaultFilterField, {
        id: generateId(),
      });
      const newFields = { [newField.id]: newField };
      this.state.newFields = newFields;
    }
  }

  addFilterField = () => {
    const newField = Object.assign({}, defaultFilterField, {
      id: generateId(),
    });
    const newFields = Object.assign({}, this.state.newFields, {
      [newField.id]: newField,
    });
    this.setState({ newFields });
  };

  clearFilterFields = () => {
    const newField = Object.assign({}, defaultFilterField, {
      id: generateId(),
    });
    const newFields = { [newField.id]: newField };
    this.setState({ newFields });

    this.props.removeFilters();
  };

  onRemove = id => {
    const { [id]: value, ...remainingNewFields } = this.state.newFields;
    this.setState({ newFields: remainingNewFields });
  };

  render() {
    const filterList = Object.values(
      Object.assign({}, this.state.newFields, this.props.filters)
    );

    const filterFields = filterList.map(f => {
      return (
        <Filter
          key={f.id}
          filter={f}
          onRemove={filterList.length > 1 ? this.onRemove : null}
        />
      );
    });

    return (
      <div>
        {filterFields}
        <div>
          <Button color="primary" onClick={this.addFilterField}>
            Add filter
          </Button>
          <Button color="primary" onClick={this.clearFilterFields}>
            Clear filters
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    filters: state.list.filters,
  };
};

export default connect(
  mapStateToProps,
  { removeFilters }
)(FilterManager);
