import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Question from './Question';

interface TemplateAttributes {
  id: number;
  title: string;
  description: string;
  topic: string;
  image?: string;
  tags?: string;
  isPublic: boolean;
  userId: number;
}

interface TemplateCreationAttributes extends Optional<TemplateAttributes, 'id' | 'image' | 'tags'> {}

class Template extends Model<TemplateAttributes, TemplateCreationAttributes> implements TemplateAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public topic!: string;
  public image?: string;
  public tags?: string;
  public isPublic!: boolean;
  public userId!: number;

  // Добавляем ассоциированное свойство вопросов
  public questions?: Question[]; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Template.init(
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
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'templates',
  }
);

export default Template;