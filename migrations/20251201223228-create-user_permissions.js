'use strict';


module.exports = {
up: async (queryInterface, Sequelize) => {
await queryInterface.createTable('user_permissions', {
user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
permission_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' }
});
await queryInterface.addConstraint('user_permissions', {
fields: ['user_id', 'permission_id'],
type: 'primary key',
name: 'pk_user_permissions'
});
},
down: async (queryInterface) => {
await queryInterface.dropTable('user_permissions');
}
};