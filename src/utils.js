import { tabs } from "./Components/filter/tabCategories";
import filterCategories from "./Components/filter/filterCategories";

export const arrayToIdMap = array => {
  return array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});
};

const filterString = (category, value) => {
  const filterParam = filterCategories[category].param;
  return value ? `${filterParam}${value}` : null;
};

export const buildFilterString = (filters, tab) => {
  let filterStrings = Object.values(filters)
    .filter(f => f.detail.length > 0)
    .map(filter => filterString(filter.category, filter.detail));

  const tabFilter = tabs[tab].param;
  if (tabFilter.length) {
    filterStrings.push(tabFilter);
  }

  return filterStrings.length > 0 ? filterStrings : undefined;
};
