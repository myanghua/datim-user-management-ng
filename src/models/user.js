import config from "../actions/config";

export const UNKNOWN_USER_TYPE = "Unknown type";

export const getUserType = rawUser => {
  const ug = rawUser.userGroups.toArray();

  const type = Object.keys(config).reduce((acc, type) => {
    if (ug.find(g => RegExp(config[type].groupFilter).test(g.name))) {
      acc.push(type);
    }
    return acc;
  }, [])[0]; //hack, returning the first one - replace with usertype pri

  return type ? type : UNKNOWN_USER_TYPE;
};

export const getUserCountry = rawUser => {
  const userCountry = rawUser.organisationUnits.toArray().find(c => c.level === 3);
  return userCountry ? userCountry.name : "Global";
};

export const getUserOrganization = rawUser => {
  const groupFilterRegex = new RegExp(config[rawUser.type].groupFilter);
  const ugs = rawUser.userGroups.toArray().filter(ug => groupFilterRegex.test(ug.name));

  if (ugs.length) {
    return ugs
      .map(ug => {
        return [config[rawUser.type].groupFilter]
          .concat(config[rawUser.type].groupSpecifics)
          .reduce((orgName, regex) => {
            const rgx = new RegExp(regex);
            return orgName.replace(rgx, "");
          }, ug.name);
      })[0]
      .trim();
  }
  return "";
};

const getUserActions = rawUser => {
  if (config[rawUser.type]) {
    const visibleActions = config[rawUser.type].actions; //.filter(a => a.hidden === 0);
    const userRoleIds = rawUser.userCredentials.userRoles.map(r => r.id);

    return visibleActions
      .filter(va => userRoleIds.indexOf(va.roleUID) !== -1)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(va => va.name);
  }
  return [];
};

const getStreamAccesses = (groups, stream) => {
  const accesses = stream.accessLevels;
  return Object.keys(accesses).reduce((acc, currKey) => {
    const found = groups.find(g => RegExp(accesses[currKey].groupName).test(g.name));

    return {
      ...acc,
      [currKey]: found ? "Y" : "N",
    };
  }, {});
};

const getDataStreams = rawUser => {
  if (config[rawUser.type]) {
    const allTypeStreams = config[rawUser.type].streams;
    const groups = rawUser.userGroups.toArray();
    return Object.keys(allTypeStreams)
      .map(name => {
        return {
          name,
          accesses: getStreamAccesses(groups, allTypeStreams[name]),
          sortOrder: allTypeStreams[name].sortOrder,
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return [];
};

const getUser = (rawUser, agencies, partners) => {
  const user = {};
  user.type = rawUser.type;
  user.dataStreams = getDataStreams(rawUser);
  user.actions = getUserActions(rawUser);
  user.country = getUserCountry(rawUser);
  if (["Agency", "Partner", "Partner DoD"].indexOf(rawUser.type) !== -1) {
    user.employer = getUserOrganization(rawUser);
  }
  user.displayName = rawUser.displayName;

  return user;
};

export default getUser;
