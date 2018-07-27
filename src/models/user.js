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

const getUserCountry = rawUser => {
  const userCountry = rawUser.organisationUnits
    .toArray()
    .find(c => c.level === 3);
  return userCountry ? userCountry.name : "Global";
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
    const found = groups.find(g =>
      RegExp(accesses[currKey].groupName).test(g.name)
    );

    return {
      ...acc,
      [currKey]: found ? "Y" : "N"
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
        sortOrder: allTypeStreams[name].sortOrder
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

const getUser = rawUser => {
  const user = {};
  user.type = getUserType(rawUser);
  user.dataStreams = getDataStreams(rawUser, user.type);
  user.actions = getUserActions(rawUser, user.type);
  user.employer = rawUser.employer;
  user.displayName = rawUser.displayName;
  user.country = getUserCountry(rawUser);

  return user;
};

export default getUser;
