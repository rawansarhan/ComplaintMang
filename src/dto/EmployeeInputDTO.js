class EmployeeInputDTO {
  constructor ({ user_id, government_entity }) {
    this.user_id = user_id
    this.government_entity = government_entity
  }
}

module.exports = {
  EmployeeInputDTO
}
