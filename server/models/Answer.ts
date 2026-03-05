import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Form from './Form';
import Question from './Question';

interface AnswerAttributes {
    id: number;
    formId: number;
    questionId: number;
    value: string;
}

interface AnswerCreationAttributes extends Optional<AnswerAttributes, 'id'> {}

class Answer extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
    public id!: number;
    public formId!: number;
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
        formId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'answers',
    }
);

Form.hasMany(Answer, { foreignKey: 'formId', as: 'answers' });
Answer.belongsTo(Form, { foreignKey: 'formId', as: 'form' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

export default Answer;