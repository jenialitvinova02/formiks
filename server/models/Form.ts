import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';

interface FormAttributes {
  id: number;
  title: string;
  description: string;
  questions: any;
  userId: number;
  templateId: number | null; 
}

interface FormCreationAttributes extends Optional<FormAttributes, 'id' | 'templateId'> {}

class Form extends Model<FormAttributes, FormCreationAttributes> implements FormAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public questions!: any;
  public userId!: number;
  public templateId!: number | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,      
      defaultValue: null,     
    },
  },
  {
    sequelize,
    tableName: 'forms',
  }
);

User.hasMany(Form, { foreignKey: 'userId', as: 'forms' });
Form.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Form;