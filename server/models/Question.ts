import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';
import Template from './Template';

export type QuestionType = 'single-line' | 'multi-line' | 'integer' | 'checkbox';

interface QuestionAttributes {
    id: number;
    templateId: number;
    title: string;
    description: string;
    type: QuestionType;
    order: number;
    showInTable: boolean;
}

interface QuestionCreationAttributes extends Optional<QuestionAttributes, 'id'> {}

class Question extends Model<QuestionAttributes, QuestionCreationAttributes> implements QuestionAttributes {
    public id!: number;
    public templateId!: number;
    public title!: string;
    public description!: string;
    public type!: QuestionType;
    public order!: number;
    public showInTable!: boolean;

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
        templateId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('single-line', 'multi-line', 'integer', 'checkbox'),
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
    },
    {
        sequelize,
        tableName: 'questions',
    }
);

Template.hasMany(Question, { foreignKey: 'templateId', as: 'questions' });
Question.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

export default Question;