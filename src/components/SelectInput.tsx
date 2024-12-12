import "../style/input.css";

interface SelectDropdownProps {
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[] | number[];
  label: string;
  style?: React.CSSProperties;
}

const SelectDropdown: React.FC<SelectDropdownProps> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onChange(Number(e.target.value));
  };

  return (
    <div className="dropdown-container">
      <label htmlFor="grid-width">{props.label}</label>
      <div className="select-wrapper" style={props.style}>
        <select
          id="grid-width"
          value={props.value}
          onChange={handleChange}
          className="styled-select"
          style={{ width: "100%" }}
        >
          {props.options.map((option) => {
            if (typeof option === "object") {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            } else {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            }
          })}
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={5}
          stroke="currentColor"
          className="custom-arrow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default SelectDropdown;
