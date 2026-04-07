import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Question from './Question';
import Response from './Response';

interface AnswerAttributes {
  id: number;
  responseId: number;
  questionId: number;
  value: string;
}
interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

class Answer
  extends Model<AnswerAttributes, AnswerCreationAttributes>
  implements AnswerAttributes
{
  public id!: number;
  public responseId!: number;
  public questionId!: number;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Answer.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    responseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Response, key: 'id' },
      field: 'response_id',
    },
    questionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Question, key: 'id' },
      field: 'question_id',
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'answers',
    indexes: [
      { fields: ['response_id'] },
      { fields: ['question_id'] },
      { unique: true, fields: ['response_id', 'question_id'] },
    ],
  },
);

export default Answer;
