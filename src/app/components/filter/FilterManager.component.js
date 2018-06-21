import React, { Component } from "react";
import { connect } from "react-redux";
import Paper from "material-ui/lib/paper";
import Filter from "./Filter.component";
import { removeFilters } from "../../actions/list";

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

  initState = () => {
    const newField = Object.assign({}, defaultFilterField, { id: generateId() });
    const newFields = { [newField.id]: newField };
    this.setState({ newFields });
  };

  componentDidMount() {
    this.initState();
  }

  addFilterField = () => {
    const newField = Object.assign({}, defaultFilterField, { id: generateId() });
    const newFields = Object.assign({}, this.state.newFields, { [newField.id]: newField });
    this.setState({ newFields });
  };

  clearFilterFields = () => {
    this.initState();
    this.props.removeFilters();
  };

  onRemove = id => {
    console.log("removeFilterFields", this.state);
    const { [id]: value, ...remainingNewFields } = this.state.newFields;
    this.setState({ newFields: remainingNewFields });
  };

  render() {
    console.log("render with state, props", this.state.newFields, this.props.filters);

    const filterList = Object.assign({}, this.state.newFields, this.props.filters);

    const filterFields = Object.values(filterList).map(f => {
      return <Filter key={f.id} filter={f} onRemove={this.onRemove} />;
    });

    return (
      <div>
        <Paper className="card filters">
          <h3>Filters</h3>
          <p>Select your filter type to limit your search</p>
          <p>Start typing your filter value</p>
        </Paper>
        {filterFields}
        <div>
          <button onClick={this.addFilterField}>Add filter</button>
          <button onClick={this.clearFilterFields}>Clear filters</button>
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
