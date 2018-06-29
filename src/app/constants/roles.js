const roles = {
  "Read Only": {
    name: "Read Only",
    displayName: "",
    implied: true,
  },
  "User Administrator": {
    name: "User Administrator",
    displayName: "User Manager",
  },
  "Data Submitter": {
    name: "Data Submitter",
    displayName: "Approvals: Submit Data",
  },
  "Data Accepter": {
    name: "Data Accepter",
    displayName: "Approvals: Accept Data",
  },
  "Unapproved Data Viewer": {
    name: "Unapproved Data Viewer",
    displayName: "View Unapproved Data",
  },
  "Data Entry - Aggregate": {
    name: "Data Entry - Aggregate",
    displayName: "",
    implied: true,
  },
  "Data Deduplication": {
    name: "Data Deduplication",
    displayName: "Deduplication",
  },
};

export default roles;
