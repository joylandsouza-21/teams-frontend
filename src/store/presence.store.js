const presenceStore = new Map();
/*
userId => {
  status: "online" | "away" | "busy" | "offline",
  isManual: false,
  lastActiveAt: Date.now(),
  socketId: null,
  inCall: false
}
*/

module.exports = presenceStore;
