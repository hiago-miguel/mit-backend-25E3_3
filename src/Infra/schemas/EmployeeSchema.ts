import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  _id: string;
  fullName: string;
  jobRole: string;
  department: string;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
  fullName: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
    trim: true,
    minlength: [2, 'Nome completo deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome completo deve ter no máximo 100 caracteres'],
    match: [/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome completo deve conter apenas letras e espaços']
  },
  jobRole: {
    type: String,
    required: [true, 'Cargo é obrigatório'],
    trim: true,
    minlength: [2, 'Cargo deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Cargo deve ter no máximo 100 caracteres'],
    match: [/^[a-zA-ZÀ-ÿ\s\-.]+$/, 'Cargo deve conter apenas letras, espaços, hífens e pontos']
  },
  department: {
    type: String,
    required: [true, 'Departamento é obrigatório'],
    trim: true,
    minlength: [2, 'Departamento deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Departamento deve ter no máximo 100 caracteres'],
    match: [/^[a-zA-ZÀ-ÿ\s\-.]+$/, 'Departamento deve conter apenas letras, espaços, hífens e pontos']
  },
  contact: {
    type: String,
    required: [true, 'Contato é obrigatório'],
    trim: true,
    minlength: [5, 'Contato deve ter pelo menos 5 caracteres'],
    maxlength: [100, 'Contato deve ter no máximo 100 caracteres'],
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[+]?[1-9][\d]{0,15}$/, 'Contato deve ser um email válido ou telefone']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para melhor performance
EmployeeSchema.index({ fullName: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ jobRole: 1 });
EmployeeSchema.index({ contact: 1 });

// Índice de texto para busca
EmployeeSchema.index({
  fullName: 'text',
  jobRole: 'text',
  department: 'text'
});

// Middleware para transformar o _id em string
EmployeeSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete (ret as any)._id;
    delete (ret as any).__v;
    return ret;
  }
});

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema);
