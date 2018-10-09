import { UserEmailExists as emailExists } from "./user-email-exists";
import { UserByEmail as getByEmail } from "./user-by-email";
import { UserById as getById } from "./user-by-id";
import { UserProfilePicture as getProfilePhoto } from "./user-profile-picture";
import { UserList as list } from "./user-list";
import { UpdateProfilePicture as updateProfilePicture } from "./update-profile-picture";
import { UserNew as add } from "./user-new";
import { UserUpdate as update } from "./user-update";
import { UserDelete as remove } from "./user-delete";

export const UserService = {
  add,
  remove,
  emailExists,
  getByEmail,
  getById,
  getProfilePhoto,
  list,
  update,
  updateProfilePicture
};
