import './InlineAlert.scss';

interface Props {
  title: string;
  message: string;
}

export const InlineAlert: React.FC<Props> = ({ title, message }) => (
  <div className="inlineAlert" role="alert">
    <strong>{title}</strong>
    <span>{message}</span>
  </div>
);

export default InlineAlert;
