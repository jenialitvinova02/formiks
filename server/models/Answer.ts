import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Question from './Question';

interface AnswerAttributes {
  id: number;
  responseId: number;
  questionId: number;
  value: string;
}
interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  public id!: number;
  public responseId!: number;
  public questionId!: number;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Answer.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    responseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    questionId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: 'answers',
  }
);

export default Answer;