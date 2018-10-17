export default (userFromApi: any) => ({
  id: userFromApi.id,
  name: userFromApi.first_name,
  lastName: "",
  fullName: `${userFromApi.first_name}`,
  username: userFromApi.username,
  email: userFromApi.email,
  department: userFromApi.last_name,
  extension: "",
  profile: "",
  profilePhoto: `${process.env.APP_API}/photos/${userFromApi.id}.jpg`
});