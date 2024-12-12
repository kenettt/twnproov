interface ButtonProps {
  onClick: () => void;
  text: string;
}

export const Button = (props: ButtonProps) => {
  return (
    <button className="custom-button" onClick={props.onClick}>
      {props.text}
    </button>
  );
};
