export const tabs = {
  all: { id: "all", displayName: "All users", param: "" },
  active: {
    id: "active",
    displayName: "Active users",
    param: "userCredentials.disabled:eq:false",
  },
  disabled: {
    id: "disabled",
    displayName: "Disabled users",
    param: "userCredentials.disabled:eq:true",
  },
};
