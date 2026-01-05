export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
  