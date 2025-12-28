'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [admins] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role_id = 1;`
    );

    const adminPermissions = [1, 10, 11, 12,13];

    const userPermissionsData = [];
    admins.forEach(admin => {
      adminPermissions.forEach(permission_id => {
        userPermissionsData.push({
          user_id: admin.id,
          permission_id,  
        });
      });
    });

    if (userPermissionsData.length > 0) {
      await queryInterface.bulkInsert('user_permissions', userPermissionsData, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [admins] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role_id = 1;`
    );

    const adminUserIds = admins.map(u => u.id);

    if (adminUserIds.length > 0) {
      await queryInterface.bulkDelete('user_permissions', {
        user_id: adminUserIds
      }, {});
    }
  }
};
