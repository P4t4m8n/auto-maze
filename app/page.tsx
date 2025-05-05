"use client"; 

import React, { useState, useEffect } from "react";


const ROWS = 10;
const COLS = 10;
const CELL_SIZE = 30; 


interface Cell {
  row: number;
  col: number;
  topWall: boolean;
  bottomWall: boolean;
  leftWall: boolean;
  rightWall: boolean;
  visited: boolean;
}




const initializeGrid = (rows: number, cols: number): Cell[][] => {
  const grid: Cell[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = {
        row: r,
        col: c,
        topWall: true,
        bottomWall: true,
        leftWall: true,
        rightWall: true,
        visited: false,
      };
    }
  }
  return grid;
};


const getUnvisitedNeighbors = (cell: Cell, grid: Cell[][]): Cell[] => {
  const neighbors: Cell[] = [];
  const { row, col } = cell;

  
  if (row > 0 && !grid[row - 1][col].visited) {
    neighbors.push(grid[row - 1][col]);
  }
  
  if (col < COLS - 1 && !grid[row][col + 1].visited) {
    neighbors.push(grid[row][col + 1]);
  }
  
  if (row < ROWS - 1 && !grid[row + 1][col].visited) {
    neighbors.push(grid[row + 1][col]);
  }
  
  if (col > 0 && !grid[row][col - 1].visited) {
    neighbors.push(grid[row][col - 1]);
  }

  return neighbors;
};


const removeWall = (current: Cell, next: Cell) => {
  const rowDiff = current.row - next.row;
  const colDiff = current.col - next.col;

  if (rowDiff === 1) {
    
    current.topWall = false;
    next.bottomWall = false;
  } else if (rowDiff === -1) {
    
    current.bottomWall = false;
    next.topWall = false;
  }

  if (colDiff === 1) {
    
    current.leftWall = false;
    next.rightWall = false;
  } else if (colDiff === -1) {
    
    current.rightWall = false;
    next.leftWall = false;
  }
};


const generateMaze = (rows: number, cols: number): Cell[][] => {
  const grid = initializeGrid(rows, cols);
  const stack: Cell[] = [];
  let currentCell = grid[0][0]; 
  currentCell.visited = true;
  stack.push(currentCell);

  while (stack.length > 0) {
    currentCell = stack[stack.length - 1]; 
    const neighbors = getUnvisitedNeighbors(currentCell, grid);

    if (neighbors.length > 0) {
      
      const randomIndex = Math.floor(Math.random() * neighbors.length);
      const nextCell = neighbors[randomIndex];

      
      removeWall(currentCell, nextCell);

      
      nextCell.visited = true;
      stack.push(nextCell);
    } else {
      
      stack.pop();
    }
  }

  
  grid[0][0].leftWall = false; 
  grid[rows - 1][cols - 1].rightWall = false; 

  return grid;
};


export default function Home() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [characterPos, setCharacterPos] = useState({ row: 0, col: 0 }); 

  useEffect(() => {
    
    const newGrid = generateMaze(ROWS, COLS);
    setGrid(newGrid);
    
    
  }, []); 

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!grid.length) return; 

      const { row, col } = characterPos;
      const currentCell = grid[row][col];
      let newRow = row;
      let newCol = col;
      let moved = false;

      switch (event.key) {
        case "ArrowUp":
          if (!currentCell.topWall && row > 0) {
            newRow--;
            moved = true;
          }
          break;
        case "ArrowDown":
          if (!currentCell.bottomWall && row < ROWS - 1) {
            newRow++;
            moved = true;
          }
          break;
        case "ArrowLeft":
          if (!currentCell.leftWall && col > 0) {
            newCol--;
            moved = true;
          }
          break;
        case "ArrowRight":
          if (!currentCell.rightWall && col < COLS - 1) {
            newCol++;
            moved = true;
          }
          break;
        default:
          break; 
      }

      if (moved) {
        setCharacterPos({ row: newRow, col: newCol });

        
        if (newRow === ROWS - 1 && newCol === COLS - 1) {
          
          setTimeout(() => {
            alert("Congratulations! You reached the exit!");
            
          }, 0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [characterPos, grid]); 

  
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
    border: "1px solid black", 
    width: COLS * CELL_SIZE,
    margin: "20px auto", 
  };

  const getCellStyle = (cell: Cell): React.CSSProperties => ({
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderTop: cell.topWall ? "1px solid black" : "none",
    borderBottom: cell.bottomWall ? "1px solid black" : "none",
    borderLeft: cell.leftWall ? "1px solid black" : "none",
    borderRight: cell.rightWall ? "1px solid black" : "none",
    boxSizing: "border-box", 
    position: "relative", 
    
  });

  
  const characterStyle: React.CSSProperties = {
    width: CELL_SIZE * 0.6,
    height: CELL_SIZE * 0.6,
    backgroundColor: "red",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", 
    transition: "all 0.1s linear", 
  };

  return (
    <div>
      <h1>Maze Generator</h1>
      {grid.length > 0 ? (
        <div style={gridStyle}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} style={getCellStyle(cell)}>
                {/* Render character if it's in this cell */}
                {characterPos.row === rowIndex &&
                  characterPos.col === colIndex && (
                    <div style={characterStyle}></div>
                  )}
                {/* Optional: Visually mark the exit */}
                {rowIndex === ROWS - 1 && colIndex === COLS - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 255, 0, 0.2)", 
                      pointerEvents: "none", 
                    }}
                  ></div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <p>Generating maze...</p>
      )}
    </div>
  );
}
