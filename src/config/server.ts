export default {
  token: {
    // 10 minutes
    expiresIn: 60 * 10
  },
  pathsToMulter: {
    avatar: "/uploadProfilePicture"
  },
  publicPath: [
    { path: "/login", method: ["POST"] }
  ]
};
