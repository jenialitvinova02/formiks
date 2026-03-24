import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Template from './Template';

interface QuestionAttributes {
  id: number;
  title: string;
  description: string;
  type: string;
  order: number;
  showInTable: boolean;
  templateId?: number;
  // убрали formId, в БД его нет
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id' | 'order' | 'showInTable' | 'templateId'> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public type!: string;
  public order!: number;
  public showInTable!: boolean;
  public templateId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Question.init(
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
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    showInTable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    templateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Template,
        key: 'id',
      },
      field: 'template_id'
    },
    // удалили declaration for formId
  },
  {
    sequelize,
    tableName: 'questions',
    underscored: true,  // если не задано глобально
  }
);

export default Question;
// никаких ассоциаций здесь