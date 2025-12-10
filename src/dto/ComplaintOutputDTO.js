// ComplaintOutputDTO: لإرجاع بيانات الشكوى
class ComplaintCreateOutputDTO {
  constructor({ id, reference_number, description, governorate, location, government_entity, citizen_id, images, attachments, status, created_at, updated_at }) {
    this.id = id;
    this.reference_number = reference_number;
    this.description = description;
    this.governorate = governorate;
    this.location = location;
    this.government_entity = government_entity;
    this.citizen_id = citizen_id;
    this.images = images || [];
    this.attachments = attachments || [];
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

class ComplaintUpdateOutputDTO {
  constructor({ id, reference_number, description, governorate, location, government_entity,responsible_id, citizen_id, images, attachments, status, created_at, updated_at }) {
    this.id = id;
    this.reference_number = reference_number;
    this.description = description;
    this.governorate = governorate;
    this.location = location;
    this.government_entity = government_entity;
    this.citizen_id = citizen_id;
    this.images = images || [];
    this.attachments = attachments || [];
    this.responsible_id = responsible_id
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = {
  ComplaintCreateOutputDTO,
  ComplaintUpdateOutputDTO
};
