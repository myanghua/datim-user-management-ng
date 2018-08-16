export const arrayToIdMap = array => {
  return array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});
};
