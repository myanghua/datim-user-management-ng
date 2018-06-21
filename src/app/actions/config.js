const configuration = {
  "Agency": {
    "groupFilter": "^OU .+? Agency ",
    "actions": [
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Accept Data",
        "preSelected": 0,
        "roleUID": "QbxXEPw9xlf",
        "selectWhenUA": 1,
        "sortOrder": 0
      },
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Submit Data",
        "preSelected": 0,
        "roleUID": "n777lf1THwQ",
        "selectWhenUA": 1,
        "sortOrder": 2
      },
      {
        "hidden": 0,
        "locked": 1,
        "name": "View Unapproved Data",
        "preSelected": 1,
        "roleUID": "R74PQmVFl6R",
        "selectWhenUA": 1,
        "sortOrder": 3
      },
      {
        "hidden": 1,
        "locked": 0,
        "name": "Data Entry - Aggregate",
        "preSelected": 0,
        "roleUID": "k7BWFXkG6zt",
        "selectWhenUA": 1,
        "sortOrder": -1
      },
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "Expenditure": {
          "View Data": {
            "groupName": "Data Expenditure access",
            "groupUID": "M9Uer9SioL7",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 1
      },
      "MER": {
          "View Data": {
            "groupName": "Data PRIME access",
            "groupUID": "c6hGi8GEZot",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 0
      },
      "MOH": {
          "View Data": {
            "groupName": "Data MOH access",
            "groupUID": "OoiLAfMTyMx",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 2
      },
      "SIMS": {
          "View Data": {
            "groupName": "Data SIMS access",
            "groupUID": "iuD8wUFz95X",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 3
      }
    }
  },
  "Global": {
    "groupFilter": "^Global users",
    "actions": [
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "Expenditure": {
          "View Data": {
            "groupName": "Data Expenditure access",
            "groupUID": "M9Uer9SioL7",
            "locked": 1,
            "preSelected": 1,
            "selectWhenUA": 0
          },
          "sortOrder": 1
      },
      "MER": {
          "View Data": {
            "groupName": "Data PRIME access",
            "groupUID": "c6hGi8GEZot",
            "locked": 1,
            "preSelected": 1,
            "selectWhenUA": 0
          },
          "sortOrder": 0
      },
      "MOH": {
          "View Data": {
            "groupName": "Data MOH access",
            "groupUID": "OoiLAfMTyMx",
            "locked": 1,
            "preSelected": 1,
            "selectWhenUA": 0
          },
          "sortOrder": 2
      },
      "SIMS": {
          "View Data": {
            "groupName": "Data SIMS access",
            "groupUID": "iuD8wUFz95X",
            "locked": 1,
            "preSelected": 1,
            "selectWhenUA": 0
          },
          "sortOrder": 3
      },
      "SaS": {
          "View Data": {
            "groupName": "Data SaS access",
            "groupUID": "CwFniyubXbx",
            "locked": 1,
            "preSelected": 1,
            "selectWhenUA": 0
          },
          "sortOrder": 4
      }
    }
  },
  "Inter-Agency": {
    "groupFilter": "^OU .+? Country team$",
    "actions": [
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Accept Data",
        "preSelected": 0,
        "roleUID": "QbxXEPw9xlf",
        "selectWhenUA": 1,
        "sortOrder": 0
      },
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Submit Data",
        "preSelected": 0,
        "roleUID": "n777lf1THwQ",
        "selectWhenUA": 1,
        "sortOrder": 1
      },
      {
        "hidden": 1,
        "locked": 1,
        "name": "View Unapproved Data",
        "preSelected": 1,
        "roleUID": "R74PQmVFl6R",
        "selectWhenUA": 1,
        "sortOrder": 3
      },
      {
        "hidden": 1,
        "locked": 0,
        "name": "Data Entry - Aggregate",
        "preSelected": 0,
        "roleUID": "k7BWFXkG6zt",
        "selectWhenUA": 1,
        "sortOrder": -1
      },
      {
        "hidden": 0,
        "locked": 0,
        "name": "Deduplication",
        "preSelected": 0,
        "roleUID": "PZAx69RkL9Q",
        "selectWhenUA": 1,
        "sortOrder": -1
      },
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "Expenditure": {
          "View Data": {
            "groupName": "Data Expenditure access",
            "groupUID": "M9Uer9SioL7",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 1
      },
      "MER Country Team": {
          "Enter Data": {
            "groupName": "Data PRIME Country Team entry",
            "groupUID": "zY2t7de7Jzz",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "View Data": {
            "groupName": "Data PRIME access",
            "groupUID": "c6hGi8GEZot",
            "impliedRoles": [
              {
                "name": "Data Entry - Aggregate",
                "roleUID": "k7BWFXkG6zt"
              }
            ],
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 0
          },
          "sortOrder": 0
      },
      "MOH": {
          "View Data": {
            "groupName": "Data MOH access",
            "groupUID": "OoiLAfMTyMx",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 2
      },
      "SIMS": {
          "View Data": {
            "groupName": "Data SIMS access",
            "groupUID": "iuD8wUFz95X",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "sortOrder": 3
      }
    }
  },
  "MOH": {
    "groupFilter": "^Data MOH access$",
    "actions": [
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "MOH": {
          "View Data": {
            "groupName": "Data MOH access",
            "groupUID": "OoiLAfMTyMx",
            "locked": 0,
            "preSelected": 1,
            "selectWhenUA": 1
          },
          "sortOrder": 1
      }
    }
  },
  "Partner": {
    "groupFilter": "^OU .+? Partner ",
    "actions": [
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Submit Data",
        "preSelected": 0,
        "roleUID": "n777lf1THwQ",
        "selectWhenUA": 1,
        "sortOrder": 0
      },
      {
        "hidden": 1,
        "locked": 0,
        "name": "Data Entry - Aggregate",
        "preSelected": 0,
        "roleUID": "k7BWFXkG6zt",
        "selectWhenUA": 1,
        "sortOrder": -1
      },
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "Expenditure": {
          "Enter Data": {
            "groupName": "Data Expenditure entry",
            "groupUID": "XgctRYBpSiR",
            "impliedRoles": [
              {
                "name": "Data Entry - Aggregate",
                "roleUID": "k7BWFXkG6zt"
              }
            ],
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "View Data": {
            "groupName": "Data Expenditure access",
            "groupUID": "M9Uer9SioL7",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 0
          },
          "sortOrder": 1
      },
      "MER": {
          "Enter Data": {
            "groupName": "Data PRIME entry",
            "groupUID": "hCofOhr3q1Q",
            "impliedRoles": [
              {
                "name": "Data Entry - Aggregate",
                "roleUID": "k7BWFXkG6zt"
              }
            ],
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "View Data": {
            "groupName": "Data PRIME access",
            "groupUID": "c6hGi8GEZot",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 0
          },
          "sortOrder": 0
      }
    }
  },
  "Partner DoD": {
    "groupFilter": " DoD ",
    "isDoD": true,
    "actions": [
      {
        "hidden": 0,
        "locked": 0,
        "name": "Approvals: Submit Data",
        "preSelected": 0,
        "roleUID": "n777lf1THwQ",
        "selectWhenUA": 1,
        "sortOrder": 0
      },
      {
        "hidden": 1,
        "locked": 0,
        "name": "Data Entry - Aggregate",
        "preSelected": 0,
        "roleUID": "k7BWFXkG6zt",
        "selectWhenUA": 1,
        "sortOrder": -1
      },
      {
        "hidden": 1,
        "locked": 1,
        "name": "Read Only",
        "preSelected": 1,
        "roleUID": "b2uHwX9YLhu",
        "selectWhenUA": 1,
        "sortOrder": -1
      }
    ],
    "streams": {
      "Expenditure": {
          "Enter Data": {
            "groupName": "Data Expenditure entry",
            "groupUID": "XgctRYBpSiR",
            "impliedRoles": [
              {
                "name": "Data Entry - Aggregate",
                "roleUID": "k7BWFXkG6zt"
              }
            ],
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "View Data": {
            "groupName": "Data Expenditure access",
            "groupUID": "M9Uer9SioL7",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 0
          },
          "sortOrder": 1
      },
      "MER DoD": {
          "Enter Data": {
            "groupName": "Data PRIME DoD entry",
            "groupUID": "rP0VPKQcC8y",
            "impliedRoles": [
              {
                "name": "Data Entry - Aggregate",
                "roleUID": "k7BWFXkG6zt"
              }
            ],
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 1
          },
          "View Data": {
            "groupName": "Data PRIME access",
            "groupUID": "c6hGi8GEZot",
            "locked": 0,
            "preSelected": 0,
            "selectWhenUA": 0
          },
          "sortOrder": 0
      }
    }
  }
}

export default configuration;
