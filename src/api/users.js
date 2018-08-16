import { getInstance } from "d2/lib/d2";

const onError = error => console.log("Error: ", error);

export const apiPatchUserDisabledState = (id, disabled) => {
  return getInstance()
    .then(d2 => {
      const url = `/users/${id}`;
      const data = { userCredentials: { disabled: disabled } };
      return d2.Api.getApi().patch(url, data);
    })
    .catch(onError);
};

export const apiFetchUser = id => {
  return getInstance()
    .then(d2 => d2.models.users.get(id))
    .catch(onError);
};

export const apiFetchUsers = customParams => {
  return getInstance()
    .then(d2 => {
      const defaultParams = {
        canManage: true,
        paging: true,
        fields:
          "id,firstName,surname,displayName,employer,email,organisationUnits[name,displayName,id,level],userCredentials[username,disabled,userRoles[id,name,displayName]],userGroups[name,displayName,id]",
      };
      const params = Object.assign({}, defaultParams, customParams);
      return d2.models.users.list(params);
    })
    .catch(onError);
};
