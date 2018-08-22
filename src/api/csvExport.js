import { saveAs } from "file-saver";
import { apiFetchUsers } from "./users";
import { buildFilterString } from "../utils";
import { getUserType, getUserCountry, getUserActions } from "../models/user";
import config from "../actions/config";

const getAllActions = () => {
  const actions = Object.values(config).reduce((acc, curr) => {
    const actionNames = curr.actions.map(a => a.name);
    return acc.concat(actionNames);
  }, []);

  return [...new Set(actions)];
};

const getAllStreams = () => {
  const streams = Object.values(config).reduce((acc, curr) => {
    const typeStreams = Object.values(curr.streams).map(s =>
      Object.values(s.accessLevels).map(al => al.groupName)
    );

    return acc.concat(typeStreams);
  }, []);

  const flattenedStreams = streams.reduce((acc, curr) => acc.concat(curr), []);

  return [...new Set(flattenedStreams)];
};

const createCSVFromUsers = users => {
  const allStreams = getAllStreams();
  const allActions = getAllActions();

  const headers = [
    "Last Updated",
    "Created",
    "id",
    "First Name",
    "Surname",
    "E-mail",
    "Active",
    "Username",
    "Account Type",
    "Organisations",
  ].concat(
    allActions,
    allStreams.map(s => s.replace(/^Data /, "").replace("PRIME", "MER"))
  );

  const userValue = (item, collection) => {
    return collection.indexOf(item) !== -1 ? "Y" : "N";
  };

  const rows = users.map(u => {
    const { lastUpdated, created, id, firstName, surname, email, userCredentials } = u;
    const type = getUserType(u);
    const userActions = getUserActions(u, type);

    const dataSet = [
      lastUpdated,
      created,
      id,
      firstName,
      surname,
      email,
      userCredentials.disabled ? "N" : "Y",
      userCredentials.username,
      type,
      getUserCountry(u),
    ];
    allActions.forEach(action => {
      dataSet.push(userValue(action, userActions));
    });

    allStreams.forEach(stream => {
      dataSet.push(userValue(stream, u.userGroups.toArray().map(g => g.name)));
    });

    return dataSet.join(",");
  });

  const csvBlob = new Blob([headers, "\r\n", rows.join("\r\n")], { type: "text/csv" });
  saveAs(csvBlob, "users.csv", true);
  return Promise.resolve();
};

export const downloadAsCSV = (filters, tab) => {
  const params = {
    filter: buildFilterString(filters, tab),
    paging: false,
  };

  return apiFetchUsers(params, "created,lastUpdated")
    .then(users => users.toArray())
    .then(createCSVFromUsers)
    .catch(err => {
      if (err && err.status !== 0) {
        console.log("Unable to get the list of users from the server");
      }
    });
};
