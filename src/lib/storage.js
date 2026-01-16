const API_BASE = "http://localhost:3000";

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function addComplaint(complaint) {
  // Get current user info from localStorage
  const userId = localStorage.getItem("userId");
  const userUsername = localStorage.getItem("userUsername");
  
  const complaintWithUser = {
    ...complaint,
    userId: userId ? Number(userId) : null,
    userUsername: userUsername || null
  };
  
  const res = await fetch(`${API_BASE}/api/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complaintWithUser),
  });
  
  if (!res.ok) {
    const body = await readJsonSafe(res);
    throw new Error(body?.message || "Failed to add complaint");
  }
  
  return readJsonSafe(res);
}

export async function loadComplaints() {
  const res = await fetch(`${API_BASE}/api/complaints`);
  
  if (!res.ok) {
    throw new Error("Failed to load complaints");
  }
  
  const data = await readJsonSafe(res);
  return Array.isArray(data) ? data : [];
}

export async function getComplaints() {
  return loadComplaints();
}

export function isAdminAuthed() {
  return localStorage.getItem("adminAuthed") === "1";
}

export function adminLogout() {
  localStorage.removeItem("adminAuthed");
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminUsername");
}