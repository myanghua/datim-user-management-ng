import { reasonsNotEditable } from "../userEditable";
import * as userModel from "../../models/user";

describe("reasonsNotEditable", () => {
  let user = {};
  let me = {};
  let userGroups;
  beforeEach(() => {
    userGroups = [
      {
        name: "groupA",
        access: {
          manage: true,
        },
      },
      {
        name: "groupB",
        access: {
          manage: true,
        },
      },
    ];

    user = {
      id: "abc123",
      type: "blab",
      userGroups: {
        toArray: () => userGroups,
      },
      userCredentials: {
        userRoles: [],
      },
    };

    me = {
      id: "xyzpdq",
      userCredentials: {
        userRoles: [],
      },
      hasAllAuthority: () => true,
    };

    userModel.isGlobalUser = () => false;
    userModel.getUserType = () => "Partner";
  });

  afterEach(() => {
    user = {};
    me = {};
    userGroups = [];
  });

  describe("when not superuser", () => {
    beforeEach(() => {
      me.hasAllAuthority = () => false;
    });

    it('returns "User has the role"', () => {
      user.userCredentials.userRoles.push({
        id: "role1",
        name: "Role 1",
      });

      const reasons = reasonsNotEditable(user, me);
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toMatch(/^User has the role/);
    });

    it('returns "User is member of [groups]"', () => {
      userGroups.forEach(g => {
        g.access.manage = false;
      });

      const reasons = reasonsNotEditable(user, me);
      expect(reasons).toHaveLength(userGroups.length);
      expect(reasons[0]).toMatch(/^User is a member of the/);
    });

    it("returns no reasons when one user group allows manage access", () => {
      userGroups[0].access.manage = false;

      const reasons = reasonsNotEditable(user, me);
      expect(reasons).toHaveLength(0);
    });

    it('returns reason "Global user cannot edit"', () => {
      userModel.getUserType = () => "Global";
      userModel.isGlobalUser = () => true;
      user.type = "Agency";

      const reasons = reasonsNotEditable(user, me);
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toMatch(/^\"Global\" user cannot edit this/);
    });

    it('returns reason "MOH user cannot edit"', () => {
      userModel.getUserType = () => "MOH";
      user.type = "Agency";

      const reasons = reasonsNotEditable(user, me);
      expect(reasons).toHaveLength(1);
      expect(reasons[0]).toMatch(/^\"MOH\" user cannot edit this/);
    });
  });

  it("returns no reasons", () => {
    expect(reasonsNotEditable(user, me)).toHaveLength(0);
  });

  it('returns reason "User does not conform to a known type"', () => {
    user.type = userModel.UNKNOWN_USER_TYPE;
    userModel.getUserType = () => "Global";

    const reasons = reasonsNotEditable(user, me);
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toEqual("User does not conform to a known type");
  });

  it('returns reason "Cannot edit yourself"', () => {
    me.id = "abc123";
    userModel.getUserType = () => "Global";

    const reasons = reasonsNotEditable(user, me);
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/^Cannot edit yourself/);
  });
});
