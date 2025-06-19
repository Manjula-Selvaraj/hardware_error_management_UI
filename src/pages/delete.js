const data = {
  keyValues: [
    { key: "dc", value: "jpe1b" },
    { key: "tenantName", value: "gsp" },
    { key: "serialNo", value: "A501779X2A14487" },
    { key: "id", value: "325454" },
    { key: "instanceType", value: "c7.standard" },
    { key: "infraHostname", value: "jpe1b-1-e0109-15-3u12n" },
    { key: "bootNicParentSwitchName", value: "jpe1b-1-e0109-dhl-a" },
    { key: "hostname", value: "jpe1bp-gsp-sol-jpmalldoc-003-047" },
    {
      key: "fqdn",
      value: "jpe1bp-gsp-sol-jpmalldoc-003-047.gsp.jpe1b.dcnw.rakuten",
    },
    { key: "network", value: "common-service" },
    { key: "tagNames", value: "SRM-14542" },
    { key: "status", value: "running" },
    { key: "chefRoles", value: "gsp215a-jp_prod-gsp" },
    { key: "organization", value: "roc_jpe1b_gsp" },
    { key: "powerStatus", value: "on" },
  ],
};

const f = {
  errorDetails: {
    title: "Network Interface Card (NIC) Failure Detected on Host-03",
    description: "Network Interface Card (NIC) Failure Detected on Host-03",
  },
  investigationDetails:
    "Investigation details added manually for testing purposes and it should stay till the actual integration with the API",
  playBook: "restart,restore",
  successfulTroubleshoot: false,
  d,
};

const data1 = {
  issues: [
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10091",
      key: "SCRUM-29",
      fields: {},
    },
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10086",
      key: "SCRUM-24",
      fields: {},
    },
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10082",
      key: "SCRUM-20",
      fields: {},
    },
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10081",
      key: "SCRUM-19",
      fields: {},
    },
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10080",
      key: "SCRUM-18",
      fields: {},
    },
    {
      self: "https://api.atlassian.com/ex/jira/b3efd337-1a82-4f6f-b5e8-41458b3e04cc/rest/api/3/issue/10041",
      key: "SCRUM-11",
      fields: {},
    },
  ],
};

// incidentData - error description remove the hard code - done
// bareMetalDetails - preview value - create a table under investigation details
//"2251799814354153-incidentData" shppuld map with playbook - done
//relatedJiraTickets - creata a table with previewValue and put it under investigation details - 2 column serial no and hyperlinked key with self data
//troubleshoot - create a editable field -- only editable if assigned to the current user and task definition id is Task_SRE_Team
