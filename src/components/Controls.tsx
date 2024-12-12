import SelectDropdown from "./SelectInput";
import { Button } from "./Button";

export const GRID_CONFIG = {
  WIDTH_OPTIONS: [10, 20, 30, 40, 50, 60, 70, 80],
  HEIGHT_OPTIONS: [10, 20, 30, 40, 50],
  SPEED_OPTIONS: [
    { value: 150, label: "Slow" },
    { value: 100, label: "Normal" },
    { value: 50, label: "Fast" },
  ],
  PROBABILITY_OPTIONS: [
    { value: 0.1, label: "10%" },
    { value: 0.3, label: "30%" },
    { value: 0.5, label: "50%" },
    { value: 0.7, label: "70%" },
    { value: 0.9, label: "90%" },
  ],
};

interface ControlsProps {
  gridWidth: number;
  gridHeight: number;
  speed: number;
  initialLifeProbability: number;
  isRunning: boolean;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onProbabilityChange: (value: number) => void;
  onToggleRunning: () => void;
  onApplySettings: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  gridWidth,
  gridHeight,
  speed,
  initialLifeProbability,
  isRunning,
  onWidthChange,
  onHeightChange,
  onSpeedChange,
  onProbabilityChange,
  onToggleRunning,
  onApplySettings,
}) => (
  <div className="controls">
    <div className="select-container">
      <SelectDropdown
        value={gridWidth}
        onChange={onWidthChange}
        options={GRID_CONFIG.WIDTH_OPTIONS}
        label="Grid width"
        style={{ minWidth: "100px" }}
      />
      <SelectDropdown
        value={gridHeight}
        onChange={onHeightChange}
        options={GRID_CONFIG.HEIGHT_OPTIONS}
        label="Grid height"
        style={{ minWidth: "100px" }}
      />
      <SelectDropdown
        value={speed}
        onChange={onSpeedChange}
        options={GRID_CONFIG.SPEED_OPTIONS}
        label="Speed"
        style={{ minWidth: "100px" }}
      />
      <SelectDropdown
        value={initialLifeProbability}
        onChange={onProbabilityChange}
        options={GRID_CONFIG.PROBABILITY_OPTIONS}
        label="Initial life probability"
        style={{ minWidth: "100px" }}
      />
    </div>
    <div className="button-container">
      <Button text={isRunning ? "Pause" : "Resume"} onClick={onToggleRunning} />
      <Button text="Apply" onClick={onApplySettings} />
    </div>
  </div>
);

export default Controls;
