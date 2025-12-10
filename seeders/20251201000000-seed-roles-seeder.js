module.exports = {
up: async (queryInterface) => {
await queryInterface.bulkInsert('roles', [
{ name: 'admin', created_at: new Date(), updated_at: new Date() },
{ name: 'employee', created_at: new Date(), updated_at: new Date() },
{ name: 'citizen', created_at: new Date(), updated_at: new Date() }
], {});
},
down: async (queryInterface) => {
await queryInterface.bulkDelete('roles', null, {});
}
};