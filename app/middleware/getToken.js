const getToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer")) {
    return null;
  }

  const token = auth.split(" ")[1];
  return token || null;
};

module.exports = getToken;
