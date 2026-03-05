// types/tetris.ts
// Core type definitions for 3D Tetris game

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Cell {
  filled: boolean;
  color: string;
  type: TetrominoType | null;
}

export type Board = Cell[][][]; // 10x20x10 (width x height x depth)

export interface Tetromino {
  type: TetrominoType;
  position: Position;
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  color: string;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameState {
  // Board state
  board: Board;
  
  // Current piece
  currentPiece: Tetromino | null;
  
  // Next pieces queue (preview of upcoming pieces)
  nextPieces: TetrominoType[];
  
  // Hold piece (player can hold one piece)
  holdPiece: TetrominoType | null;
  canHold: boolean; // Can only hold once per piece
  
  // Game statistics
  score: number;
  level: number;
  linesCleared: number;
  
  // Game status
  status: GameStatus;
  
  // 3D camera/view settings
  cameraRotation: {
    x: number;
    y: number;
  };
  zoom: number;
}

// Constants for board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BOARD_DEPTH = 10;

// Tetromino colors
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
};

// Initial tetromino shapes (3D representation)
export const TETROMINO_SHAPES: Record<TetrominoType, Position[]> = {
  I: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 3, y: 0, z: 0 }],
  O: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }],
  T: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }],
  S: [{ x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }],
  Z: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }],
  J: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }],
  L: [{ x: 2, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }],
};
