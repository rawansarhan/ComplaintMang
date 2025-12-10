class ComplaintCreateInputDTO {
  constructor ({
    description,
    governorate,
    location,
    government_entity,
    citizen_id,
    images,
    status,
    attachments
  }) {
    this.citizen_id = citizen_id;
    this.governorate = governorate;
    this.government_entity = government_entity;
    this.location = location || null;
    this.description = description || null;
    this.images = images || [];
    this.status = status;
    this.attachments = attachments || [];
  }
}

class ComplaintUpdateInputDTO {
  constructor ({
    responsible_id,
    status
  }) {
    
    this.responsible_id = responsible_id;
    this.status = status ;
  }
}

module.exports = {
  ComplaintCreateInputDTO,
  ComplaintUpdateInputDTO
}
