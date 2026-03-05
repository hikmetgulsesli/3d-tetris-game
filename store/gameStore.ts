// store/gameStore.ts
// Zustand store for 3D Tetris game state management

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  GameState,
  GameStatus,
  Tetromino,
  TetrominoType,
  Board,
  Cell,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BOARD_DEPTH,
  TETROMINO_COLORS,
  TETROMINO_SHAPES,
  Position,
} from '../types/tetris';

// Create empty board
const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(null).map(() =>
      Array(BOARD_DEPTH).fill(null).map(() => ({
        filled: false,
        color: '',
        type: null,
      } as Cell))
    )
  );
};

// Generate random tetromino type
const getRandomTetrominoType = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
};

// Create a new tetromino
const createTetromino = (type: TetrominoType): Tetromino => ({
  type,
  position: {
    x: Math.floor(BOARD_WIDTH / 2) - 1,
    y: 0,
    z: Math.floor(BOARD_DEPTH / 2) - 1,
  },
  rotation: { x: 0, y: 0, z: 0 },
  color: TETROMINO_COLORS[type],
});

// Generate next pieces queue
const generateNextPieces = (count: number = 3): TetrominoType[] => {
  return Array(count).fill(null).map(() => getRandomTetrominoType());
};

// Calculate score based on lines cleared
const calculateScore = (lines: number, level: number): number => {
  const baseScores: Record<number, number> = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  return (baseScores[lines] || 0) * (level + 1);
};

// Calculate level based on lines cleared
const calculateLevel = (linesCleared: number): number => {
  return Math.floor(linesCleared / 10);
};

// Helper function for collision detection
const checkValidPosition = (
  board: Board,
  piece: Tetromino,
  position: Position,
  rotation: { x: number; y: number; z: number }
): boolean => {
  const shape = TETROMINO_SHAPES[piece.type];
  
  for (const offset of shape) {
    const x = position.x + offset.x;
    const y = position.y + offset.y;
    const z = position.z + offset.z;

    // Check bounds
    if (
      x < 0 ||
      x >= BOARD_WIDTH ||
      y >= BOARD_HEIGHT ||
      z < 0 ||
      z >= BOARD_DEPTH
    ) {
      return false;
    }

    // Check collision with locked pieces (ignore if above board)
    if (y >= 0 && board[y][x][z].filled) {
      return false;
    }
  }

  return true;
};

// Game store interface
interface GameStore extends GameState {
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  
  // Piece management
  spawnPiece: () => void;
  holdCurrentPiece: () => void;
  
  // Movement
  movePiece: (direction: 'left' | 'right' | 'down' | 'forward' | 'backward') => boolean;
  rotatePiece: (axis: 'x' | 'y' | 'z') => boolean;
  hardDrop: () => void;
  
  // Board operations
  lockPiece: () => void;
  clearLines: () => number;
  
  // Camera
  setCameraRotation: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
}

// Initial state factory
const createInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieces: generateNextPieces(),
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 0,
  linesCleared: 0,
  status: 'menu',
  cameraRotation: { x: 30, y: 45 },
  zoom: 1,
});

// Create the store
export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      ...createInitialState(),

      startGame: () => {
        set({
          ...createInitialState(),
          status: 'playing',
        });
        get().spawnPiece();
      },

      pauseGame: () => {
        const { status } = get();
        if (status === 'playing') {
          set({ status: 'paused' });
        }
      },

      resumeGame: () => {
        const { status } = get();
        if (status === 'paused') {
          set({ status: 'playing' });
        }
      },

      resetGame: () => {
        set(createInitialState());
      },

      spawnPiece: () => {
        const { nextPieces } = get();
        const nextType = nextPieces[0];
        const newPiece = createTetromino(nextType);
        
        // Shift queue and add new piece
        const newNextPieces = [...nextPieces.slice(1), getRandomTetrominoType()];
        
        set({
          currentPiece: newPiece,
          nextPieces: newNextPieces,
          canHold: true,
        });
      },

      holdCurrentPiece: () => {
        const { currentPiece, holdPiece, canHold } = get();
        if (!canHold || !currentPiece) return;

        const currentType = currentPiece.type;
        
        if (holdPiece) {
          // Swap with held piece
          set({
            currentPiece: createTetromino(holdPiece),
            holdPiece: currentType,
            canHold: false,
          });
        } else {
          // First hold - get next piece
          set({
            holdPiece: currentType,
            canHold: false,
          });
          get().spawnPiece();
        }
      },

      movePiece: (direction) => {
        const { currentPiece, board } = get();
        if (!currentPiece) return false;

        const newPosition = { ...currentPiece.position };
        
        switch (direction) {
          case 'left':
            newPosition.x -= 1;
            break;
          case 'right':
            newPosition.x += 1;
            break;
          case 'down':
            newPosition.y += 1;
            break;
          case 'forward':
            newPosition.z += 1;
            break;
          case 'backward':
            newPosition.z -= 1;
            break;
        }

        // Check collision
        if (checkValidPosition(board, currentPiece, newPosition, currentPiece.rotation)) {
          set({
            currentPiece: { ...currentPiece, position: newPosition },
          });
          return true;
        }
        return false;
      },

      rotatePiece: (axis) => {
        const { currentPiece, board } = get();
        if (!currentPiece) return false;

        const newRotation = { ...currentPiece.rotation };
        newRotation[axis] = (newRotation[axis] + 90) % 360;

        if (checkValidPosition(board, currentPiece, currentPiece.position, newRotation)) {
          set({
            currentPiece: { ...currentPiece, rotation: newRotation },
          });
          return true;
        }
        return false;
      },

      hardDrop: () => {
        const { currentPiece } = get();
        if (!currentPiece) return;

        while (get().movePiece('down')) {
          // Keep moving down until collision
        }
        
        // Lock piece after drop
        get().lockPiece();
      },

      lockPiece: () => {
        const { currentPiece, board } = get();
        if (!currentPiece) return;

        const newBoard = board.map(layer => 
          layer.map(row => 
            row.map(cell => ({ ...cell }))
          )
        );
        
        const shape = TETROMINO_SHAPES[currentPiece.type];
        
        // Place piece on board
        shape.forEach((offset) => {
          const x = currentPiece.position.x + offset.x;
          const y = currentPiece.position.y + offset.y;
          const z = currentPiece.position.z + offset.z;
          
          if (
            y >= 0 &&
            y < BOARD_HEIGHT &&
            x >= 0 &&
            x < BOARD_WIDTH &&
            z >= 0 &&
            z < BOARD_DEPTH
          ) {
            newBoard[y][x][z] = {
              filled: true,
              color: currentPiece.color,
              type: currentPiece.type,
            };
          }
        });

        const linesCleared = get().clearLines();
        const totalLinesCleared = get().linesCleared + linesCleared;
        const newLevel = calculateLevel(totalLinesCleared);
        const scoreIncrease = calculateScore(linesCleared, newLevel);

        set({
          board: newBoard,
          score: get().score + scoreIncrease,
          linesCleared: totalLinesCleared,
          level: newLevel,
        });

        // Check game over (if piece locked at top)
        if (currentPiece.position.y <= 0) {
          set({ status: 'gameover' });
        } else {
          get().spawnPiece();
        }
      },

      clearLines: () => {
        const { board } = get();
        let linesCleared = 0;
        const newBoard = board.filter((layer) => {
          const isFull = layer.every((row) =>
            row.every((cell) => cell.filled)
          );
          if (isFull) {
            linesCleared++;
            return false;
          }
          return true;
        });

        // Add new empty layers at top
        while (newBoard.length < BOARD_HEIGHT) {
          newBoard.unshift(
            Array(BOARD_WIDTH).fill(null).map(() =>
              Array(BOARD_DEPTH).fill(null).map(() => ({
                filled: false,
                color: '',
                type: null,
              } as Cell))
            )
          );
        }

        if (linesCleared > 0) {
          set({ board: newBoard });
        }

        return linesCleared;
      },

      setCameraRotation: (x, y) => {
        set({ cameraRotation: { x, y } });
      },

      setZoom: (zoom) => {
        set({ zoom });
      },
    }),
    { name: 'tetris-game-store' }
  )
);
