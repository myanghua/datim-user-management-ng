import config from "../actions/config";

const getUserType = rawUser => {
  const ug = rawUser.userGroups.toArray();

  return Object.keys(config).reduce((acc, type) => {
    if (ug.find(g => RegExp(config[type].groupFilter).test(g.name))) {
      acc.push(type);
    }
    return acc;
  }, [])[0]; //hack, returning the first one - replace with usertype pri
};

export const getUserCountry = rawUser => {
  const userCountry = rawUser.organisationUnits.toArray().find(c => c.level === 3);
  return userCountry ? userCountry.name : "Global";
};

export const getUserOrganization = (rawUser, type) => {
  const regexArray = config[type].organisationRegex;

  return regexArray.reduce((acc, regex) => {
    const rx = new RegExp(regex);
    const matchingUg = rawUser.userGroups.toArray().find(ug => rx.test(ug.name));

    // return matchingUg ? matchingUg.name.replace(rx, "").trim() : acc;
    if (matchingUg) {
      console.log("match", matchingUg.name);
      return "";
    }
  }, undefined);
};

const getUserActions = (rawUser, type) => {
  const visibleActions = config[type].actions; //.filter(a => a.hidden === 0);
  const userRoleIds = rawUser.userCredentials.userRoles.map(r => r.id);

  return visibleActions
    .filter(va => userRoleIds.indexOf(va.roleUID) !== -1)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(va => va.name);
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

const getDataStreams = (rawUser, type) => {
  const allTypeStreams = config[type].streams;
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
};

const getUser = (rawUser, agencies, partners) => {
  const user = {};
  user.type = getUserType(rawUser);
  user.dataStreams = getDataStreams(rawUser, user.type);
  user.actions = getUserActions(rawUser, user.type);
  user.country = getUserCountry(rawUser);
  user.employer = getUserOrganization(
    rawUser,
    user.country,
    user.type,
    agencies,
    partners
  );
  user.displayName = rawUser.displayName;

  return user;
};

export default getUser;
