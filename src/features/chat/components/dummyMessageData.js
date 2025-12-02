export const DummyMessageData = [
  {
    "_id": "65f1a1b2c001a12f001a1111",
    "conversationId": "conv_1001",
    "senderId": 101,
    "content": "Hello team, welcome to the project!",
    "attachments": [],
    "replyTo": null,
    "reactions": {
      "👍": [102, 103],
      "❤️": [104]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-01T10:15:30.000Z",
    "updatedAt": "2025-03-01T10:15:30.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a2222",
    "conversationId": "conv_1001",
    "senderId": 102,
    "content": "Thanks! Glad to be here 😊",
    "attachments": [],
    "replyTo": "65f1a1b2c001a12f001a1111",
    "reactions": {
      "🔥": [101],
      "👍": [103]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-01T10:16:05.000Z",
    "updatedAt": "2025-03-01T10:16:05.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a3333",
    "conversationId": "conv_1001",
    "senderId": 103,
    "content": "Sharing the project requirements document.",
    "attachments": [
      {
        "fileName": "requirements.pdf",
        "fileType": "application/pdf",
        "fileSize": 245678,
        "url": "https://example.com/uploads/requirements.pdf"
      }
    ],
    "replyTo": null,
    "reactions": {},
    "edited": true,
    "deleted": false,
    "createdAt": "2025-03-01T10:18:20.000Z",
    "updatedAt": "2025-03-01T10:20:00.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a7777",
    "conversationId": "conv_1001",
    "senderId": 101,
    "content": "Thanks for sharing, I will review it today.",
    "attachments": [],
    "replyTo": "65f1a1b2c001a12f001a3333",
    "reactions": {
      "✅": [102]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-01T10:25:00.000Z",
    "updatedAt": "2025-03-01T10:25:00.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a8888",
    "conversationId": "conv_1001",
    "senderId": 104,
    "content": "Let me know if anyone needs help understanding the flow.",
    "attachments": [],
    "replyTo": null,
    "reactions": {
      "💡": [101, 102]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-01T10:30:45.000Z",
    "updatedAt": "2025-03-01T10:30:45.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a4444",
    "conversationId": "conv_1002",
    "senderId": 104,
    "content": "Can anyone help me with the login issue?",
    "attachments": [],
    "replyTo": null,
    "reactions": {
      "😢": [105]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-02T08:05:10.000Z",
    "updatedAt": "2025-03-02T08:05:10.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a5555",
    "conversationId": "conv_1002",
    "senderId": 105,
    "content": "Yes, I faced that too. Try clearing cache and logging in again.",
    "attachments": [
      {
        "fileName": "fix_screenshot.png",
        "fileType": "image/png",
        "fileSize": 134567,
        "url": "https://example.com/uploads/fix_screenshot.png"
      }
    ],
    "replyTo": "65f1a1b2c001a12f001a4444",
    "reactions": {
      "✅": [104]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-02T08:07:45.000Z",
    "updatedAt": "2025-03-02T08:07:45.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a9999",
    "conversationId": "conv_1002",
    "senderId": 104,
    "content": "It worked! Thank you so much.",
    "attachments": [],
    "replyTo": "65f1a1b2c001a12f001a5555",
    "reactions": {
      "🎉": [105]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-02T08:12:30.000Z",
    "updatedAt": "2025-03-02T08:12:30.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001a6666",
    "conversationId": "conv_1003",
    "senderId": 106,
    "content": "This message was deleted",
    "attachments": [],
    "replyTo": null,
    "reactions": {},
    "edited": false,
    "deleted": true,
    "createdAt": "2025-03-03T12:30:00.000Z",
    "updatedAt": "2025-03-03T12:31:00.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001aaaa1",
    "conversationId": "conv_1003",
    "senderId": 101,
    "content": "Reminder: Daily standup at 10 AM.",
    "attachments": [],
    "replyTo": null,
    "reactions": {
      "⏰": [102, 103, 104]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-03T09:50:00.000Z",
    "updatedAt": "2025-03-03T09:50:00.000Z"
  },

  {
    "_id": "65f1a1b2c001a12f001aaaa2",
    "conversationId": "conv_1003",
    "senderId": 102,
    "content": "Got it, thanks!",
    "attachments": [],
    "replyTo": "65f1a1b2c001a12f001aaaa1",
    "reactions": {
      "👍": [101]
    },
    "edited": false,
    "deleted": false,
    "createdAt": "2025-03-03T09:51:15.000Z",
    "updatedAt": "2025-03-03T09:51:15.000Z"
  }
];
