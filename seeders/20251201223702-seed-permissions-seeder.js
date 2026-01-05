module.exports = {
up: async (queryInterface) => {
const perms = [
'admin_register_employee',//1
'login_adminAndEmployee',//2
'login_citizen',//3
'citizen_create_complaint',//4
'citizen_view_complaints',//5
'citizen_delete_complaint',//6
'citizen_update_complaint',//7
'employee_view_assigned_complaints',//8
'employee_update_complaint',//9
'admin_view_all_complaints',//10
'admin_manage_permissions',//11
'view_complaint_history',//12
'get_all_permission',//13
'citizen_view_complaint_Id',//14
'delete_complaint',//15
'get_all_users',//16
];


await queryInterface.bulkInsert('permissions', perms.map(p => ({ name: p, created_at: new Date(), updated_at: new Date() })), {});
},
down: async (queryInterface) => {
await queryInterface.bulkDelete('permissions', null, {});
}
};