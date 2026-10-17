
const TOKEN_KEY = "croppay_token";
const USER_KEY = "croppay_user";

const safe = (action, fallback = null) => {
  try {
    return action();
  } catch {
    return fallback; 
  }
};


export function getToken() {
  return safe(() => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY));
}

// Replaces any previous session, then stores the token where remember says.
export function saveToken(token, remember = false) {
  clearSession();
  safe(() => (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token));
}

// Saved next to the token, so both are cleared together.
export function saveUser(user) {
  safe(() => {
    const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    store.setItem(USER_KEY, JSON.stringify(user));
  });
}

export function getStoredUser() {
  return safe(() => {
    const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
}

export function clearSession() {
  safe(() => {
    [localStorage, sessionStorage].forEach((store) => {
      store.removeItem(TOKEN_KEY);
      store.removeItem(USER_KEY);
    });
  });
}