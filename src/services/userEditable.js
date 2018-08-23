import { getUserType, isGlobalUser, UNKNOWN_USER_TYPE } from "../models/user";
import { arrayToIdMap } from "../utils";

export const reasonsNotEditable = (user = {}, me = {}) => {
  let reasonsNoEdit = [];
  const iAmSuperuser = me.hasAllAuthority && me.hasAllAuthority();

  //Global current user cannot edit users of other types
  if (isGlobalUser(me) && !iAmSuperuser && user.type !== "Global") {
    reasonsNoEdit.push(`"Global" user cannot edit this "${user.type}" user`);
  }

  //MOH current user cannot edit non MOH users
  if (getUserType(me) === "MOH" && !iAmSuperuser && user.type !== "MOH") {
    reasonsNoEdit.push(`"MOH" user cannot edit this "${user.type}" user`);
  }

  //Cannot edit yourself
  if (user.id === me.id) {
    reasonsNoEdit.push("Cannot edit yourself");
  }

  //User does not conform to a known type
  if (user.type === UNKNOWN_USER_TYPE) {
    reasonsNoEdit.push("User does not conform to a known type");
  }

  // Cannot manage ANY group
  const userGroups = user.userGroups.toArray();
  const unmanagableGroups = userGroups.filter(
    ug => !ug || !ug.access || !ug.access.manage
  );
  if (
    !iAmSuperuser &&
    unmanagableGroups.length !== 0 &&
    unmanagableGroups.length === userGroups.length
  ) {
    unmanagableGroups.forEach(ug => {
      reasonsNoEdit.push(`User is a member of the "${ug.name}" group, which you are not`);
    });
  }

  // Don't have all the user's roles
  if (!iAmSuperuser && user.userCredentials && user.userCredentials.userRoles) {
    const myUserRoles = (me.userCredentials && me.userCredentials.userRoles) || [];

    user.userCredentials.userRoles.forEach(userRole => {
      if (!arrayToIdMap(myUserRoles)[userRole.id]) {
        reasonsNoEdit.push(`User has the role "${userRole.name}" which you do not`);
      }
    });
  }

  return reasonsNoEdit;
};
