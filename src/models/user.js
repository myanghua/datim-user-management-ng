import config from "../actions/config";
import { apiFetchUserGroups } from "../api/userGroups";
import { arrayToIdMap } from "../utils";

export const UNKNOWN_USER_TYPE = "Unknown type";

export const getUserType = rawUser => {
  const ug = Array.isArray(rawUser.userGroups)
    ? rawUser.userGroups
    : rawUser.userGroups.toArray();

  const type = Object.keys(config).reduce((acc, type) => {
    if (ug.find(g => RegExp(config[type].groupFilter).test(g.name))) {
      acc.push(type);
    }
    return acc;
  }, [])[0]; //hack, returning the first one - replace with usertype pri

  return type ? type : UNKNOWN_USER_TYPE;
};

export const isGlobalUser = rawUser => {
  return (
    rawUser.organisationUnits &&
    rawUser.organisationUnits.length &&
    rawUser.organisationUnits[0].name === "Global"
  );
};

export const getUserCountry = rawUser => {
  const userCountry = rawUser.organisationUnits.toArray().find(c => c.level === 3);
  return userCountry ? userCountry.name : "Global";
};

export const getUserOrganization = (rawUser, type) => {
  const groupFilterRegex = new RegExp(config[type].groupFilter);
  const ugs = rawUser.userGroups.toArray().filter(ug => groupFilterRegex.test(ug.name));

  if (ugs.length) {
    return ugs
      .map(ug => {
        return [config[type].groupFilter]
          .concat(config[type].groupSpecifics)
          .reduce((orgName, regex) => {
            const rgx = new RegExp(regex);
            return orgName.replace(rgx, "");
          }, ug.name);
      })[0]
      .trim();
  }
  return "";
};

const fetchUserGroups = async (groupIds, managedUserGroups) => {
  const groups = await apiFetchUserGroups(groupIds);
  const userGroupData = (groups || {}).userGroups || [];
  userGroupData.forEach(g => {
    managedUserGroups[g.id] = (g.managedByGroups || []).map(g => g.id);
  });

  let missingUserGroupIds = userGroupData.reduce((acc, ug) => {
    const missingIds = (ug.managedByGroups || [])
      .map(g => g.id)
      .filter(managedByGroup => !managedUserGroups[managedByGroup.id]);

    return acc.concat(missingIds);
  }, []);

  missingUserGroupIds = [...new Set(missingUserGroupIds)];

  return (
    missingUserGroupIds.length && fetchUserGroups(missingUserGroupIds, managedUserGroups)
  );
};

export const bindUserGroupData = async (users, currentUser) => {
  const userGroupAccessCache = {};
  const userGroups = users.reduce((userGroups, user) => {
    ((user || {}).userGroups || []).forEach(ug => {
      var cachedUserGroupAccess = userGroupAccessCache[ug.id];
      if (cachedUserGroupAccess) {
        Object.assign(ug, cachedUserGroupAccess);
      } else {
        userGroups[ug.id] = userGroups[ug.id] || [];
        userGroups[ug.id].push(ug);
      }
    });
    return userGroups;
  }, {});

  var userGroupIds = Object.keys(userGroups);
  if (!userGroupIds.length) {
    return users;
  }

  const managedUserGroups = {};
  await fetchUserGroups(userGroupIds, managedUserGroups);

  setUserGroupAccessToUserGroups();

  function setUserGroupAccessToUserGroups() {
    const currentUserGroups = arrayToIdMap(currentUser.userGroups);

    userGroupIds.forEach(gId => {
      const userGroupAccess = {
        access: {
          manage: !!currentUserGroups[gId],
        },
      };

      if (!userGroupAccess.access.manage) {
        const allUserGroupIds = getAllUserGroupIds(gId);
        userGroupAccess.access.manage = allUserGroupIds.some(
          id => !!currentUserGroups[id]
        );
      }

      userGroupAccessCache[gId] = userGroupAccess;

      userGroups[gId].forEach(g => {
        Object.assign(g, userGroupAccess);
      });
    });
  }

  function getAllUserGroupIds(id) {
    const allUserGroupIds = (managedUserGroups[id] || []).reduce((acc, gId) => {
      return acc.concat(getAllUserGroupIds(gId));
    }, []);

    return [...new Set(allUserGroupIds)];
  }

  return users;
};

export const getUserActions = (rawUser, type) => {
  if (config[type]) {
    const visibleActions = config[type].actions; //.filter(a => a.hidden === 0);
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
      [currKey]: found ? true : false,
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
  user.actions = getUserActions(rawUser, rawUser.type);
  user.country = getUserCountry(rawUser);
  if (["Agency", "Partner", "Partner DoD"].indexOf(rawUser.type) !== -1) {
    user.employer = getUserOrganization(rawUser, rawUser.type);
  }
  user.displayName = rawUser.displayName;

  return user;
};

export default getUser;
