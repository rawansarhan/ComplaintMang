class UserPermissionInputDTO {
  constructor({ user_id, permission_id }) {
    this.user_id = user_id;
    this.permission_id = permission_id;
  }
}



module.exports = {
UserPermissionInputDTO
}