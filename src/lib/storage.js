const API_URL = 'http://localhost:3000/api';

export async function loadComplaints() {
  try {
    const response = await fetch(`${API_URL}/complaints`);
    if (!response.ok) throw new Error('Failed to load complaints');
    return await response.json();
  } catch (error) {
    console.error('Error loading complaints:', error);
    return [];
  }
}

export async function addComplaint({ title, description, category }) {
  try {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category })
    });
    if (!response.ok) throw new Error('Failed to add complaint');
    return true;
  } catch (error) {
    console.error('Error adding complaint:', error);
    throw error;
  }
}

export async function resolveComplaint(id, resolutionNote) {
  try {
    const response = await fetch(`${API_URL}/complaints/${id}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolutionNote })
    });

    if (!response.ok) {
      // Try to extract server-provided details
      let msg = 'Failed to resolve complaint';
      try {
        const data = await response.json();
        msg = data?.details ? `${msg}: ${data.details}` : (data?.error || msg);
      } catch {
        // fallback to text if not JSON
        try {
          const text = await response.text();
          if (text) msg = `${msg}: ${text}`;
        } catch {}
      }
      throw new Error(msg);
    }

    return await loadComplaints();
  } catch (error) {
    console.error('Error resolving complaint:', error);
    throw error;
  }
}

export function setAdminAuthed(value) {
  localStorage.setItem('adminAuthed', value ? 'true' : 'false');
}

export function isAdminAuthed() {
  return localStorage.getItem('adminAuthed') === 'true';
}

export function adminLogout() {
  setAdminAuthed(false);
}

export async function getComplaints() {
  return await loadComplaints();
}