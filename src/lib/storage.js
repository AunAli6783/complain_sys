
const KEYS = {
  COMPLAINTS: "complaints",
  ADMIN_HASH: "adminPasswordHash",
  ADMIN_AUTH: "adminAuthed"
};

export function getComplaints() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.COMPLAINTS) || "[]");
  } catch {
    return [];
  }
}

export function saveComplaints(list) {
  localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(list));
}

export function addComplaint(complaint) {
  const list = getComplaints();
  const next = [
    {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      status: "open",
      createdAt: new Date().toISOString(),
      ...complaint
    },
    ...list
  ];
  saveComplaints(next);
  return next[0];
}

export function resolveComplaint(id, resolutionNote = "") {
  const list = getComplaints();
  const next = list.map((c) =>
    c.id === id
      ? {
          ...c,
          status: "resolved",
          resolvedAt: new Date().toISOString(),
          resolutionNote
        }
      : c
  );
  saveComplaints(next);
  return next;
}

export function isAdminSetup() {
  return Boolean(localStorage.getItem(KEYS.ADMIN_HASH));
}

export function setAdminPasswordHash(hash) {
  localStorage.setItem(KEYS.ADMIN_HASH, hash);
}

export function getAdminPasswordHash() {
  return localStorage.getItem(KEYS.ADMIN_HASH) || "";
}

export function setAdminAuthed(value) {
  localStorage.setItem(KEYS.ADMIN_AUTH, value ? "true" : "false");
}

export function isAdminAuthed() {
  return localStorage.getItem(KEYS.ADMIN_AUTH) === "true";
}

export function adminLogout() {
  setAdminAuthed(false);
}