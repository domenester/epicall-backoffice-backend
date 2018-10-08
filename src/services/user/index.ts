import { emailExists } from "./emailExists";
import { getByEmail } from "./getByEmail";
import { getById } from "./getById";
import { getProfilePhoto } from "./getProfilePhoto";
import { list } from "./list";
import { updateProfilePicture } from "./updateProfilePicture";

export const UserService = {
  emailExists,
  getByEmail,
  getById,
  getProfilePhoto,
  list,
  updateProfilePicture
};
