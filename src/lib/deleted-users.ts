/**
 * Deleted Users Blacklist System
 * Ensures any member/user permanently deleted from the Admin Console (Verifications Queue or Dossiers)
 * is immediately and permanently blacklisted across local storage, cache, and Supabase fetches.
 */

const STORAGE_DELETED_KEY = "precious_meets_deleted_users_blacklist_v1";

interface DeletedStore {
  emails: string[];
  ids: string[];
}

function getStore(): DeletedStore {
  if (typeof window === "undefined") return { emails: [], ids: [] };
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.emails) && Array.isArray(parsed.ids)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("[DeletedUsers] Failed to read deleted users blacklist:", e);
  }
  return { emails: [], ids: [] };
}

function saveStore(store: DeletedStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_DELETED_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn("[DeletedUsers] Failed to save deleted users blacklist:", e);
  }
}

/**
 * Permanently registers a user email and ID into the deletion blacklist.
 */
export function recordDeletedUser(email?: string, id?: string, memberId?: string): void {
  const store = getStore();
  const emailsSet = new Set(store.emails.map((e) => e.toLowerCase().trim()));
  const idsSet = new Set(store.ids.map((i) => i.toLowerCase().trim()));

  if (email && email.trim()) {
    emailsSet.add(email.trim().toLowerCase());
  }

  if (id && id.trim()) {
    const cleanId = id.trim().toLowerCase();
    idsSet.add(cleanId);
    idsSet.add(cleanId.replace(/^ver_/, ""));
    idsSet.add(`ver_${cleanId.replace(/^ver_/, "")}`);
  }

  if (memberId && memberId.trim()) {
    const cleanMem = memberId.trim().toLowerCase();
    idsSet.add(cleanMem);
    idsSet.add(cleanMem.replace(/^pm-file-/, ""));
    idsSet.add(cleanMem.replace(/^pm-/, ""));
  }

  saveStore({
    emails: Array.from(emailsSet),
    ids: Array.from(idsSet),
  });
}

/**
 * Checks if a user has been deleted by email or ID.
 */
export function isDeletedUser(email?: string, id?: string): boolean {
  if (!email && !id) return false;
  const store = getStore();

  if (email && email.trim()) {
    const cleanEmail = email.trim().toLowerCase();
    if (store.emails.some((e) => e.toLowerCase() === cleanEmail)) {
      return true;
    }
  }

  if (id && id.trim()) {
    const cleanId = id.trim().toLowerCase();
    const rawId = cleanId.replace(/^ver_/, "");
    if (
      store.ids.some((i) => {
        const ci = i.toLowerCase();
        return ci === cleanId || ci === rawId;
      })
    ) {
      return true;
    }
  }

  return false;
}

export function getDeletedList(): DeletedStore {
  return getStore();
}

export function clearDeletedBlacklist(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_DELETED_KEY);
  }
}
