import { getInstance } from "d2/lib/d2";

const onError = error => console.log("Error: ", error);

export const apiFetchUserGroups = ids => {
  return getInstance()
    .then(d2 => {
      const idList = ids.join(",");
      const params = {
        paging: false,
        fields: "id,managedByGroups",
        filter: `id:in:[${idList}]`,
      };

      const url = "/userGroups";
      //   return d2.models.userGroups.list(params);
      return d2.Api.getApi().get(url, params);
    })
    .catch(onError);
};
