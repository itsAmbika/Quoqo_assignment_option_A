// Initial task data used by the seed script for local testing.
const sampleTasks = [
  {
    title: "Review onboarding request",
    description: "Check the new employee access request and move it forward.",
    status: "pending",
    comments: [
      {
        text: "Request received from HR.",
        author: "Admin",
      },
    ],
  },
  {
    title: "Approve laptop allocation",
    description: "Confirm inventory and approve a laptop for the design team.",
    status: "in_progress",
    comments: [
      {
        text: "Inventory check is currently in progress.",
        author: "Operations",
      },
    ],
  },
  {
    title: "Complete vendor verification",
    description: "Verify vendor documents before marking the request complete.",
    status: "completed",
    comments: [
      {
        text: "Documents verified and saved.",
        author: "Finance",
      },
      {
        text: "Marked complete after final approval.",
        author: "Manager",
      },
    ],
  },
  {
    title: "Cancel duplicate access request",
    description: "This request duplicates an existing access ticket.",
    status: "cancelled",
    comments: [
      {
        text: "Duplicate found during triage.",
        author: "Support",
      },
    ],
  },
];

module.exports = sampleTasks;
