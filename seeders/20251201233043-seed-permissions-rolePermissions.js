'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const rolePermissions = [
      // Citizens
      { role_id: 3, permission_id: 4 }, // citizen_create_complaint
      { role_id: 3, permission_id: 5 }, // citizen_view_complaints
      { role_id: 3, permission_id: 6 }, // citizen_delete_complaint
      { role_id: 3, permission_id: 7 }, // citizen_update_complaint


      // Employees
      { role_id: 2, permission_id: 8 }, // employee_view_assigned_complaints
      { role_id: 2, permission_id: 9 }, // employee_update_complaint
      {role_id: 2,  permission_id: 12} ,  //view_complaint_history

      // Admin
      { role_id: 1, permission_id: 1 }, // admin_register_employee
      { role_id: 1, permission_id: 10 }, // admin_view_all_complaints
      { role_id: 1, permission_id: 11 }, // admin_manage_permissions
      {role_id: 1,  permission_id: 12} ,  //view_complaint_history
      {role_id: 1, permission_id: 13}    //get_all_permission
    
    ];

    await queryInterface.bulkInsert('role_permissions', rolePermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
