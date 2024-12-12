import React, { useState, useEffect, useRef } from "react";
import "../style/gameoflife.css";
import Controls from "../components/Controls";

type GridType = boolean[][];

const GameOfLife: React.FC = () => {
  const [gridWidth, setGridWidth] = useState<number>(70);
  const [gridHeight, setGridHeight] = useState<number>(30);
  const [grid, setGrid] = useState<GridType>(
    createGrid(gridWidth, gridHeight, 0.5)
  );
  const gridDimensionsRef = useRef({ width: gridWidth, height: gridHeight });
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(100);
  const [initialLifeProbability, setInitialLifeProbability] =
    useState<number>(0.5);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setGrid((prevGrid) => nextGeneration(prevGrid));
      }, speed);
    } else {
      clearInterval(interval as any);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isRunning, speed]);

  const applySettings = () => {
    setGrid(createGrid(gridWidth, gridHeight, initialLifeProbability));
  };

  const calculateAlivePercentage = (): number => {
    const { width, height } = gridDimensionsRef.current;
    const totalCells = width * height;
    const aliveCells = grid.flat().filter((cell) => cell).length;
    return (aliveCells / totalCells) * 100;
  };

  return (
    <div className="game-container">
      <h1>Conway's Game of Life</h1>
      <Controls
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        speed={speed}
        initialLifeProbability={initialLifeProbability}
        isRunning={isRunning}
        onWidthChange={setGridWidth}
        onHeightChange={setGridHeight}
        onSpeedChange={setSpeed}
        onProbabilityChange={setInitialLifeProbability}
        onToggleRunning={() => setIsRunning(!isRunning)}
        onApplySettings={applySettings}
      />
      <div className="alive-percentage">
        <label>Currently alive</label>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${calculateAlivePercentage()}%`,
              textAlign: "end",
              display: "block",
              boxSizing: "border-box",
              zIndex: 100,
            }}
          >
            {" "}
            <div
              className="progress-label"
              style={{
                display: "block",
                padding: "0 0.625rem",
              }}
            >
              {calculateAlivePercentage().toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      <Grid grid={grid} />
    </div>
  );
};

const createGrid = (
  width: number,
  height: number,
  probability: number
): GridType => {
  const grid: GridType = [];
  for (let row = 0; row < height; row++) {
    grid.push(
      Array(width)
        .fill(false)
        .map(() => Math.random() < probability)
    );
  }
  return grid;
};

const nextGeneration = (grid: GridType): GridType => {
  const newGrid = grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const neighbors = countNeighbors(grid, rowIndex, colIndex);
      if (cell) {
        return neighbors === 2 || neighbors === 3;
      } else {
        return neighbors === 3;
      }
    })
  );
  return newGrid;
};

const countNeighbors = (
  grid: GridType,
  rowIndex: number,
  colIndex: number
): number => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  let count = 0;
  directions.forEach(([x, y]) => {
    const newRow = rowIndex + x;
    const newCol = colIndex + y;

    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length
    ) {
      count += grid[newRow][newCol] ? 1 : 0;
    }
  });
  return count;
};

interface GridProps {
  grid: GridType;
}

const Grid: React.FC<GridProps> = ({ grid }) => (
  <div
    className="grid"
    style={{
      gridTemplateColumns: `repeat(${grid[0].length}, minmax(2px, 12px))`,
    }}
  >
    {grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={cell ? "alive" : "dead"}
        />
      ))
    )}
  </div>
);

export default GameOfLife;
