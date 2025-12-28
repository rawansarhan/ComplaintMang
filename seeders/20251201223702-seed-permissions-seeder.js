module.exports = {
up: async (queryInterface) => {
const perms = [
'admin_register_employee',
'login_adminAndEmployee',
'login_citizen',
'citizen_create_complaint',
'citizen_view_complaints',
'citizen_delete_complaint',
'citizen_update_complaint',
'employee_view_assigned_complaints',
'employee_update_complaint',
'admin_view_all_complaints',
'admin_manage_permissions',
'view_complaint_history',
'get_all_permission',
'citizen_view_complaint_Id'
];


await queryInterface.bulkInsert('permissions', perms.map(p => ({ name: p, created_at: new Date(), updated_at: new Date() })), {});
},
down: async (queryInterface) => {
await queryInterface.bulkDelete('permissions', null, {});
}
};