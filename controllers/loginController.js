const login = (req, res) => {
  const hardcodedUsername = "pardeep";
  const hardcodedPassword = "12345";

  const { name, pass } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Username not found", code: "Please fill username" });
  }

  if (!pass) {
    return res
      .status(400)
      .json({ message: "Password not found", code: "Please fill password" });
  }

  if (name === hardcodedUsername && pass === hardcodedPassword) {
    return res
      .status(200)
      .json({ message: "Login Successfully", code: "success" });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Username and Password", code: "Fail" });
  }
};

module.exports = { login };
