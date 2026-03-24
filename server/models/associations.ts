import Template from './Template';
import Question from './Question';
import User from './User';
import Response from './Response';
import Answer from './Answer';

export default function initAssociations(): void {
  // Template ↔ Question
  Template.hasMany(Question, { foreignKey: 'templateId', as: 'questions' });
  Question.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

  // User ↔ Template
  User.hasMany(Template, { foreignKey: 'userId', as: 'templates' });
  Template.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

  // Template ↔ Response
  Template.hasMany(Response, { foreignKey: 'templateId', as: 'responses' });
  Response.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

  // User ↔ Response
  User.hasMany(Response, { foreignKey: 'userId', as: 'responses' });
  Response.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Response ↔ Answer
  Response.hasMany(Answer, { foreignKey: 'responseId', as: 'answers' });
  Answer.belongsTo(Response, { foreignKey: 'responseId', as: 'response' });

  // Question ↔ Answer
  Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
  Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
}