import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import User from './User';
import Template from './Template';

interface ResponseAttributes {
  id: number;
  templateId: number;
  userId: number;
}
interface ResponseCreationAttributes
  extends Optional<ResponseAttributes, 'id'> {}

class Response
  extends Model<ResponseAttributes, ResponseCreationAttributes>
  implements ResponseAttributes
{
  public id!: number;
  public templateId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Response.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    templateId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Template, key: 'id' },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: User, key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'responses',
  },
);

export default Response;
