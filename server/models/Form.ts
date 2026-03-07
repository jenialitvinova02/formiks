import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Template from './Template';

interface FormAttributes {
  id: number;
  userId: number;
  templateId?: number | null;
  title: string;
  description: string;
  questions: any;
}

interface FormCreationAttributes extends Optional<FormAttributes, 'id' | 'templateId'> {}

class Form extends Model<FormAttributes, FormCreationAttributes> implements FormAttributes {
  public id!: number;
  public userId!: number;
  public templateId!: number | null;
  public title!: string;
  public description!: string;
  public questions!: any;

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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, 
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'forms',
  }
);

User.hasMany(Form, { foreignKey: 'userId', as: 'forms' });
Form.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Template.hasMany(Form, { foreignKey: 'templateId', as: 'forms' });
Form.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

export default Form;