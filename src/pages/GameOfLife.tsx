import React, { useState, useEffect } from "react";

type GridType = boolean[][];

const GameOfLife: React.FC = () => {
  const [grid, setGrid] = useState<GridType>(createGrid(70, 30)); // Initialize a grid (70x30)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500); // Speed of simulation in ms

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null; // Initialize with null
    if (isRunning) {
      interval = setInterval(() => {
        setGrid((prevGrid) => nextGeneration(prevGrid));
      }, speed);
    } else {
      clearInterval(interval as any);
    }
    return () => {
      if (interval !== null) clearInterval(interval); // Cleanup on unmount or when stopped
    };
  }, [isRunning, speed]);

  const toggleCell = (rowIndex: number, colIndex: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === rowIndex && cIndex === colIndex ? !cell : cell
        )
      );
      return newGrid;
    });
  };

  return (
    <div>
      <h1>Conway's Game of Life</h1>
      <Grid grid={grid} toggleCell={toggleCell} />
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
    </div>
  );
};

// Function to create a grid with random live cells
const createGrid = (width: number, height: number): GridType => {
  const grid: GridType = [];
  for (let row = 0; row < height; row++) {
    grid.push(Array(width).fill(false)); // All cells start dead
  }
  return grid;
};

// Function to calculate the next generation
const nextGeneration = (grid: GridType): GridType => {
  const newGrid = grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const neighbors = countNeighbors(grid, rowIndex, colIndex);
      if (cell) {
        return neighbors === 2 || neighbors === 3; // Alive cells remain if 2-3 neighbors
      } else {
        return neighbors === 3; // Dead cells become alive if exactly 3 neighbors
      }
    })
  );
  return newGrid;
};

// Function to count the live neighbors of a cell
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

// Grid component for rendering the cells
interface GridProps {
  grid: GridType;
  toggleCell: (rowIndex: number, colIndex: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, toggleCell }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${grid[0].length}, 20px)`,
    }}
  >
    {grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          onClick={() => toggleCell(rowIndex, colIndex)}
          style={{
            width: 20,
            height: 20,
            backgroundColor: cell ? "black" : "white",
            border: "1px solid lightgray",
          }}
        />
      ))
    )}
  </div>
);

export default GameOfLife;
