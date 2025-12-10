class UserPermissionOutputDTO {
  constructor({ id,user_id, permission_id ,created_at, updated_at}) {
    this.id = id,
    this.user_id = user_id;
    this.permission_id = permission_id;
     this.created_at = created_at
    this.updated_at = updated_at
  }
}



module.exports = {
UserPermissionOutputDTO
}