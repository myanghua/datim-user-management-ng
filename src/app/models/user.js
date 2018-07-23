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
  const userCountry = rawUser.organisationUnits.toArray().find(c => c.level === 3);
  return userCountry ? userCountry.name : "Global";
};

const getUserRoles = rawUser =>
  rawUser.userCredentials.userRoles
    .filter(r => allRoles[r.name])
    .map(r => allRoles[r.name])
    .filter(r => !r.implied);

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

const getUser = rawUser => {
  const user = {};
  user.type = getUserType(rawUser);
  user.dataStreams = getDataStreams(rawUser, user.type);
  user.roles = [];
  user.employer = rawUser.employer;
  user.displayName = rawUser.displayName;
  user.country = getUserCountry(rawUser);

  return user;
};

export default getUser;
