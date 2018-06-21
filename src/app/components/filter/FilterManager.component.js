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
    console.log("clear filter fields", this.props.removeFilters);
    this.initState();
    this.props.removeFilters();
    this.props.onChange();
  };

  render() {
    const { onChange } = this.props;
    console.log(
      "FM render state, props",
      Object.keys(this.state.newFields).length,
      Object.keys(this.props.filters).length
    );

    const filterList = Object.assign({}, this.state.newFields, this.props.filters);

    const filterFields = Object.values(filterList).map(f => {
      return <Filter key={f.id} filter={f} onChange={onChange} />;
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

export default connect(
  null,
  { removeFilters }
)(FilterManager);
