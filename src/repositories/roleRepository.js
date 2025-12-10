// repositories/roleRepository.js
const { Role, Permission } = require('../models');

exports.findRoleById = async (id) => {
  return await Role.findByPk(id, {
    include: [{ model: Permission, as: 'permissions' }]
  });
};

exports.addPermissionToRole = async (role, permission) => {
  await role.addPermission(permission);
};

exports.removePermissionFromRole = async (role, permission) => {
  await role.removePermission(permission);
};
