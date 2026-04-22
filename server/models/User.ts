import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'role'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

export default User;
