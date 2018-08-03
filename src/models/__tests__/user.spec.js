import { getUserCountry, getUserOrganization } from "../user";

const country = "Angola";
const orgPartner = "Association of Public Health Laboratories";
const orgAgency = "HHS/CDC";

const ugPartnerUser = `OU Angola Partner 1923 users - ${orgPartner}`;
const ugPartnerAdminUser = `OU Angola Partner 5706 user administrators - ${orgPartner}`;
const ugPartnerAllMech = `OU Angola Partner 1923 all mechanisms - ${orgPartner}`;

const ugAgencyUser = `OU Angola Agency ${orgAgency} users`;
const ugAgencyAdminUser = `OU Angola Agency ${orgAgency} user administrators`;
const ugAgencyAllMech = `OU Angola Agency ${orgAgency} all mechanisms`;

describe("user model", () => {
  describe.only("getUserOrganisation", () => {
    it("gets the organization for partner user", () => {
      const ugArray = [
        { id: 1, name: ugPartnerUser },
        { id: 2, name: "Data Access Entry" },
      ];

      const rawUser = {
        userGroups: {
          toArray: () => {
            return ugArray;
          },
        },
      };

      expect(getUserOrganization(rawUser, "Partner")).toEqual(orgPartner);
    });

    it("gets the organization for partner admin", () => {
      const ugArray = [
        { id: 2, name: "Data Access Entry" },
        { id: 3, name: ugPartnerAdminUser },
      ];

      const rawUser = {
        userGroups: {
          toArray: () => {
            return ugArray;
          },
        },
      };

      expect(getUserOrganization(rawUser, "Partner")).toEqual(orgPartner);
    });

    it("gets the organization for partner all mech", () => {
      const ugArray = [
        { id: 2, name: "Data Access Entry" },
        { id: 3, name: ugPartnerAllMech },
      ];

      const rawUser = {
        userGroups: {
          toArray: () => {
            return ugArray;
          },
        },
      };

      expect(getUserOrganization(rawUser, "Partner")).toEqual(orgPartner);
    });

    it.only("gets the organization for agency user", () => {
      const ugArray = [
        { id: 1, name: ugAgencyUser },
        { id: 2, name: "Data Access Entry" },
      ];

      const rawUser = {
        userGroups: {
          toArray: () => {
            return ugArray;
          },
        },
      };

      expect(getUserOrganization(rawUser, "Agency")).toEqual(orgAgency);
    });
  });

  describe("getUserCountry", () => {
    it("returns the user country", () => {
      const rawUser = {
        organisationUnits: {
          toArray: () => {
            const orgUnitsArray = [
              {
                name: "ou1",
                level: 2,
              },
              { name: "ou2", level: 3 },
            ];
            return orgUnitsArray;
          },
        },
      };

      const res = getUserCountry(rawUser);
      expect(res).toEqual("ou2");
    });
  });
});
