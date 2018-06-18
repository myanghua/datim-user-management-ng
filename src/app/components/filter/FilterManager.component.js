import React, { Component } from "react";
import Paper from "material-ui/lib/paper";
import Filter from "./Filter.component";

export class FilterManager extends Component {
  render() {
    const { filters, onChange } = this.props;
    const filterList = filters.length
      ? filters
      : {
          name_0: {
            category: "name",
            str: "",
          },
        };

    const filterComponents = Object.entries(filterList).map((filter, i) => {
      const filterId = `_${i}`;
      return <Filter key={filterId} id={filterId} filter={filter[1]} onChange={onChange} />;
    });

    return (
      <div>
        <Paper className="card filters">
          <h3>Filters</h3>
          <p>Select your filter type to limit your search</p>
          <p>Start typing your filter value</p>
        </Paper>
        {filterComponents}
      </div>
    );
  }
}

export default FilterManager;
