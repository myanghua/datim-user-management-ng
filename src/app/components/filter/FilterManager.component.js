import React, { Component } from "react";
import Paper from "material-ui/lib/paper";
import Filter from "./Filter.component";

const defaultFilterField = {
  id: "name_0",
  category: "name",
  detail: "",
};

export class FilterManager extends Component {
  state = {
    filterFields: [],
  };

  componentDidMount() {
    this.setState({ filterFields: Object.values(this.props.filters) });
  }

  addFilterField = () => {
    console.log("add filter field", this.state);
  };

  clearFilterFields = () => {
    console.log("clear filter fields");
  };

  render() {
    const { onChange } = this.props;
    const filterList = this.state.filterFields.length
      ? this.state.filterFields
      : [defaultFilterField];

    const filterFields = filterList.map(f => {
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

export default FilterManager;
