const STORAGE_KEY = "complaints";

export function loadComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveComplaints(complaints) {
  const safe = Array.isArray(complaints) ? complaints : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
}

export function addComplaint(complaint) {
  const current = loadComplaints();
  const next = {
    id: complaint?.id ?? Date.now(),
    status: complaint?.status ?? "Pending",
    ...complaint,
  };
  current.unshift(next);
  saveComplaints(current);
  return next;
}

export function updateComplaint(id, patch) {
  const current = loadComplaints();
  const idx = current.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return null;

  current[idx] = { ...current[idx], ...patch, id: current[idx].id };
  saveComplaints(current);
  return current[idx];
}

export function getComplaintById(id) {
  return loadComplaints().find((c) => String(c.id) === String(id));
}