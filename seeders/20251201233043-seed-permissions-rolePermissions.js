'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // تعريف الصلاحيات لكل دور
    const rolePermissions = [
      // Citizens
      { role_id: 3, permission_id: 2 }, // citizen_create_complaint
      { role_id: 3, permission_id: 3 }, // citizen_view_complaints
      { role_id: 3, permission_id: 4 }, // citizen_delete_complaint


      // Employees
      { role_id: 2, permission_id: 5 }, // employee_view_assigned_complaints
      { role_id: 2, permission_id: 6 }, // employee_update_complaint

      // Admin
      { role_id: 1, permission_id: 1 }, // admin_register_employee
      { role_id: 1, permission_id: 7 }, // admin_view_all_complaints
      { role_id: 1, permission_id: 8 }, // admin_manage_roles
      {role_id: 1,  permission_id: 9} ,  //view_complaint_history
      {role_id: 1, permission_id: 10}    //get_all_permission
    
    ];

    await queryInterface.bulkInsert('role_permissions', rolePermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
