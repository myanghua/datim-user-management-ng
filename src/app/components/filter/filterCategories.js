import { filter } from "rsvp";

const filterCategories = {
  name: {
    id: "name",
    param: "name:ilike:",
    displayName: "Name",
    model: "",
  },
  username: {
    id: "username",
    param: "username:ilike:",
    displayName: "Username",
    model: "",
  },
  email: {
    id: "email",
    param: "email:ilike:",
    displayName: "Email",
    model: "",
  },
  usertype: {
    id: "usertype",
    param: "userGroups.name:ilike:",
    displayName: "User type",
    model: "userTypes",
  },

  orgunit: {
    id: "orgunit",
    param: "organisationUnits.name:ilike:",
    displayName: "Organisation Unit",
    model: "orgunit",
  },
  userrole: {
    id: "userrole",
    param: "userCredentials.userRoles.name:eq:",
    displayName: "User role",
    model: "userrole",
  },
  usergroup: {
    id: "usergroup",
    param: "userGroups.name:eq:",
    displayName: "User group",
    model: "userrole",
  },
};

export const filterCategoryDefault = "name";

export default filterCategories;
