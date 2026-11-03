const TOKEN_KEY = "croppay_token";
const USER_KEY = "croppay_user";

// SAFELY EXECUTE STORAGE OPERATIONS.
const safe = (action, fallback = null) => {
  try {
    return action();
  } catch {
    return fallback;
  }
};

// GET THE STORAGE LOCATION CONTAINING THE TOKEN.
const getTokenStorage = () => {
  return safe(() => {
    if (localStorage.getItem(TOKEN_KEY)) {
      return localStorage;
    }

    if (sessionStorage.getItem(TOKEN_KEY)) {
      return sessionStorage;
    }

    return null;
  });
};

// GET THE CURRENT AUTHENTICATION TOKEN.
export function getToken() {
  return safe(() => {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  });
}

// SAVE THE TOKEN BASED ON THE REMEMBER-ME OPTION.
export function saveToken(token, remember = false) {
  if (typeof token !== "string" || !token) {
    throw new Error("A valid authentication token is required.");
  }

  // REMOVE ANY PREVIOUS SESSION.
  clearSession();

  const storage = remember ? localStorage : sessionStorage;

  // DO NOT SILENTLY IGNORE TOKEN STORAGE FAILURE.
  storage.setItem(TOKEN_KEY, token);
}

// SAVE THE USER PROFILE BESIDE THE AUTHENTICATION TOKEN.
export function saveUser(user) {
  if (!user || typeof user !== "object") {
    return;
  }

  const storage = getTokenStorage();

  if (!storage) {
    throw new Error("No authentication session was found.");
  }

  storage.setItem(USER_KEY, JSON.stringify(user));
}


// GET THE SAVED USER PROFILE.
export function getStoredUser() {
  return safe(() => {
    const storage = getTokenStorage();

    if (!storage) return null;

    const raw = storage.getItem(USER_KEY);

    return raw ? JSON.parse(raw) : null;
  });
}


// CLEAR TOKENS AND USER DATA FROM BOTH STORAGE LOCATIONS.
export function clearSession() {
  safe(() => {
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(USER_KEY);
    });
  });
}
