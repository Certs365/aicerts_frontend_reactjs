const deleteToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("User");
};

const getToken = () => {
  return localStorage.getItem("token");
};

const getUserDetails = () => {
  return localStorage.getItem("user");
};


export { getToken, deleteToken,getUserDetails };