import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface TemplateAttributes {
    id: number;
    title: string;
    description: string;
    topic: string;
    image?: string | null;
    tags: string; 
    isPublic: boolean;
}

interface TemplateCreationAttributes extends Optional<TemplateAttributes, 'id' | 'image'> {}

class Template extends Model<TemplateAttributes, TemplateCreationAttributes> implements TemplateAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public topic!: string;
    public image!: string | null;
    public tags!: string;
    public isPublic!: boolean;

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
            allowNull: false,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        tableName: 'templates',
    }
);

export default Template;