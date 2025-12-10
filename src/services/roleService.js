// services/roleService.js
const roleRepo = require('../repositories/roleRepository');
const permissionRepo = require('../repositories/permissionRepository');

exports.assignPermission = async (roleId, permissionId) => {
  const role = await roleRepo.findRoleById(roleId);
  const perm = await permissionRepo.findPermissionById(permissionId);
  if (!role || !perm) throw new Error('Role or Permission not found');

  await roleRepo.addPermissionToRole(role, perm);
  return { message: 'Permission added to role' };
};

exports.removePermission = async (roleId, permissionId) => {
  const role = await roleRepo.findRoleById(roleId);
  const perm = await permissionRepo.findPermissionById(permissionId);
  if (!role || !perm) throw new Error('Role or Permission not found');

  await roleRepo.removePermissionFromRole(role, perm);
  return { message: 'Permission removed from role' };
};
