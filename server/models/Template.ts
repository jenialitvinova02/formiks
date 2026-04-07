import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Question from './Question';
import User from './User';

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

interface TemplateCreationAttributes
  extends Optional<TemplateAttributes, 'id' | 'image' | 'tags'> {}

class Template
  extends Model<TemplateAttributes, TemplateCreationAttributes>
  implements TemplateAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public topic!: string;
  public image?: string;
  public tags?: string;
  public isPublic!: boolean;
  public userId!: number;
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
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 150],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    topic: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(255),
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
      references: {
        model: User,
        key: 'id',
      },
      field: 'user_id',
    },
  },
  {
    sequelize,
    tableName: 'templates',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['topic'] },
      { fields: ['is_public'] },
    ],
  },
);

export default Template;
