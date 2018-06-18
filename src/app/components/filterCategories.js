import { filter } from "rsvp";

const filterCategories = {
  name: {
    id: "name",
    displayName: "Name",
    model: "",
  },
  username: {
    id: "username",
    displayName: "Username",
    model: "",
  },
  email: {
    id: "email",
    displayName: "Email",
    model: "",
  },
  orgunit: {
    id: "orgunit",
    displayName: "Organisation Unit",
    model: "orgunit",
  },
  userrole: {
    id: "userrole",
    displayName: "User role",
    model: "userrole",
  },
  usergroup: {
    id: "usergroup",
    displayName: "User group",
    model: "userrole",
  },
};

export const filterCategoryDefault = "name";

export default filterCategories;
