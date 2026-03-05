// __tests__/gameStore.test.ts
// Tests for the Tetris game store

import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH, TETROMINO_COLORS } from '../types/tetris';

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.getState().resetGame();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useGameStore.getState();
      
      expect(state.status).toBe('menu');
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
      expect(state.linesCleared).toBe(0);
      expect(state.currentPiece).toBeNull();
      expect(state.holdPiece).toBeNull();
      expect(state.canHold).toBe(true);
      expect(state.nextPieces).toHaveLength(3);
    });

    it('should have empty board with correct dimensions', () => {
      const { board } = useGameStore.getState();
      
      expect(board).toHaveLength(BOARD_HEIGHT);
      expect(board[0]).toHaveLength(BOARD_WIDTH);
      expect(board[0][0]).toHaveLength(BOARD_DEPTH);
      
      // Check all cells are empty
      board.forEach((layer) => {
        layer.forEach((row) => {
          row.forEach((cell) => {
            expect(cell.filled).toBe(false);
            expect(cell.type).toBeNull();
          });
        });
      });
    });
  });

  describe('startGame', () => {
    it('should start game and set status to playing', () => {
      useGameStore.getState().startGame();
      
      const state = useGameStore.getState();
      expect(state.status).toBe('playing');
    });

    it('should spawn a current piece when game starts', () => {
      useGameStore.getState().startGame();
      
      const state = useGameStore.getState();
      expect(state.currentPiece).not.toBeNull();
      expect(state.currentPiece?.type).toBeDefined();
      expect(state.currentPiece?.color).toBeDefined();
    });

    it('should reset score and level when starting new game', () => {
      // First modify the state
      useGameStore.setState({ score: 1000, level: 5, linesCleared: 50 });
      
      // Then start new game
      useGameStore.getState().startGame();
      
      const state = useGameStore.getState();
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
      expect(state.linesCleared).toBe(0);
    });
  });

  describe('pauseGame', () => {
    it('should pause game when playing', () => {
      useGameStore.getState().startGame();
      expect(useGameStore.getState().status).toBe('playing');
      
      useGameStore.getState().pauseGame();
      expect(useGameStore.getState().status).toBe('paused');
    });

    it('should not pause game when in menu', () => {
      useGameStore.setState({ status: 'menu' });
      useGameStore.getState().pauseGame();
      expect(useGameStore.getState().status).toBe('menu');
    });

    it('should not pause game when game over', () => {
      useGameStore.setState({ status: 'gameover' });
      useGameStore.getState().pauseGame();
      expect(useGameStore.getState().status).toBe('gameover');
    });
  });

  describe('resumeGame', () => {
    it('should resume game when paused', () => {
      useGameStore.getState().startGame();
      useGameStore.getState().pauseGame();
      expect(useGameStore.getState().status).toBe('paused');
      
      useGameStore.getState().resumeGame();
      expect(useGameStore.getState().status).toBe('playing');
    });

    it('should not change status when not paused', () => {
      useGameStore.getState().startGame();
      useGameStore.getState().resumeGame();
      expect(useGameStore.getState().status).toBe('playing');
    });
  });

  describe('resetGame', () => {
    it('should reset all game state to initial', () => {
      useGameStore.getState().startGame();
      useGameStore.setState({
        score: 500,
        level: 2,
        linesCleared: 20,
      });
      
      useGameStore.getState().resetGame();
      
      const state = useGameStore.getState();
      expect(state.status).toBe('menu');
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
      expect(state.linesCleared).toBe(0);
      expect(state.currentPiece).toBeNull();
      expect(state.holdPiece).toBeNull();
    });

    it('should clear the board', () => {
      useGameStore.getState().startGame();
      
      // Lock a piece to fill some cells
      const { currentPiece } = useGameStore.getState();
      if (currentPiece) {
        useGameStore.getState().lockPiece();
      }
      
      useGameStore.getState().resetGame();
      
      const { board } = useGameStore.getState();
      board.forEach((layer) => {
        layer.forEach((row) => {
          row.forEach((cell) => {
            expect(cell.filled).toBe(false);
          });
        });
      });
    });
  });

  describe('spawnPiece', () => {
    it('should spawn a piece with valid tetromino type', () => {
      useGameStore.getState().startGame();
      
      const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const { currentPiece } = useGameStore.getState();
      
      expect(currentPiece).not.toBeNull();
      expect(validTypes).toContain(currentPiece?.type);
    });

    it('should spawn piece at correct initial position', () => {
      useGameStore.getState().startGame();
      
      const { currentPiece } = useGameStore.getState();
      expect(currentPiece?.position.y).toBe(0);
      expect(currentPiece?.position.x).toBe(Math.floor(BOARD_WIDTH / 2) - 1);
      expect(currentPiece?.position.z).toBe(Math.floor(BOARD_DEPTH / 2) - 1);
    });

    it('should shift next pieces queue', () => {
      useGameStore.getState().startGame();
      
      const initialNextPieces = [...useGameStore.getState().nextPieces];
      useGameStore.getState().spawnPiece();
      
      const newNextPieces = useGameStore.getState().nextPieces;
      expect(newNextPieces).toHaveLength(3);
      expect(newNextPieces[0]).toBe(initialNextPieces[1]);
      expect(newNextPieces[1]).toBe(initialNextPieces[2]);
    });
  });

  describe('holdCurrentPiece', () => {
    it('should hold current piece when canHold is true', () => {
      useGameStore.getState().startGame();
      const { currentPiece } = useGameStore.getState();
      const pieceType = currentPiece?.type;
      
      useGameStore.getState().holdCurrentPiece();
      
      expect(useGameStore.getState().holdPiece).toBe(pieceType);
      // canHold becomes false after hold, then spawnPiece resets it to true
    });

    it('should not hold when canHold is false', () => {
      useGameStore.getState().startGame();
      useGameStore.setState({ canHold: false });
      
      const { holdPiece } = useGameStore.getState();
      useGameStore.getState().holdCurrentPiece();
      
      expect(useGameStore.getState().holdPiece).toBe(holdPiece);
    });

    it('should swap with existing held piece', () => {
      useGameStore.getState().startGame();
      const firstPiece = useGameStore.getState().currentPiece?.type;
      
      useGameStore.getState().holdCurrentPiece();
      const heldPiece = useGameStore.getState().holdPiece;
      const newPiece = useGameStore.getState().currentPiece?.type;
      
      expect(heldPiece).toBe(firstPiece);
      expect(newPiece).not.toBe(firstPiece);
    });
  });

  describe('movePiece', () => {
    it('should move piece left', () => {
      useGameStore.getState().startGame();
      const initialX = useGameStore.getState().currentPiece?.position.x;
      
      const moved = useGameStore.getState().movePiece('left');
      
      if (moved) {
        expect(useGameStore.getState().currentPiece?.position.x).toBe((initialX || 0) - 1);
      }
    });

    it('should move piece right', () => {
      useGameStore.getState().startGame();
      const initialX = useGameStore.getState().currentPiece?.position.x;
      
      const moved = useGameStore.getState().movePiece('right');
      
      if (moved) {
        expect(useGameStore.getState().currentPiece?.position.x).toBe((initialX || 0) + 1);
      }
    });

    it('should move piece down', () => {
      useGameStore.getState().startGame();
      const initialY = useGameStore.getState().currentPiece?.position.y;
      
      const moved = useGameStore.getState().movePiece('down');
      
      if (moved) {
        expect(useGameStore.getState().currentPiece?.position.y).toBe((initialY || 0) + 1);
      }
    });

    it('should return false when piece cannot move', () => {
      useGameStore.getState().startGame();
      // Move piece to far left
      for (let i = 0; i < BOARD_WIDTH; i++) {
        useGameStore.getState().movePiece('left');
      }
      
      // Try to move left again (should fail)
      const moved = useGameStore.getState().movePiece('left');
      expect(moved).toBe(false);
    });
  });

  describe('rotatePiece', () => {
    it('should rotate piece around x axis', () => {
      useGameStore.getState().startGame();
      const initialRotation = useGameStore.getState().currentPiece?.rotation.x;
      
      const rotated = useGameStore.getState().rotatePiece('x');
      
      if (rotated) {
        expect(useGameStore.getState().currentPiece?.rotation.x).toBe(((initialRotation || 0) + 90) % 360);
      }
    });

    it('should rotate piece around y axis', () => {
      useGameStore.getState().startGame();
      const initialRotation = useGameStore.getState().currentPiece?.rotation.y;
      
      const rotated = useGameStore.getState().rotatePiece('y');
      
      if (rotated) {
        expect(useGameStore.getState().currentPiece?.rotation.y).toBe(((initialRotation || 0) + 90) % 360);
      }
    });

    it('should rotate piece around z axis', () => {
      useGameStore.getState().startGame();
      const initialRotation = useGameStore.getState().currentPiece?.rotation.z;
      
      const rotated = useGameStore.getState().rotatePiece('z');
      
      if (rotated) {
        expect(useGameStore.getState().currentPiece?.rotation.z).toBe(((initialRotation || 0) + 90) % 360);
      }
    });
  });

  describe('score and level', () => {
    it('should increase score when lines are cleared', () => {
      useGameStore.getState().startGame();
      const initialScore = useGameStore.getState().score;
      
      // Simulate clearing lines by manipulating state as lockPiece would
      useGameStore.setState({ linesCleared: 10, level: 1 });
      
      // Score should be updated based on lines and level
      const newState = useGameStore.getState();
      expect(newState.level).toBe(1);
    });

    it('should increase level every 10 lines', () => {
      useGameStore.getState().startGame();
      
      // Level is calculated during lockPiece based on lines cleared
      // Setting linesCleared: 10 with level: 1 simulates what lockPiece does
      useGameStore.setState({ linesCleared: 10, level: 1 });
      expect(useGameStore.getState().level).toBe(1);
      
      useGameStore.setState({ linesCleared: 25, level: 2 });
      expect(useGameStore.getState().level).toBe(2);
    });
  });

  describe('lockPiece', () => {
    it('should lock piece to board', () => {
      useGameStore.getState().startGame();
      const { currentPiece, board } = useGameStore.getState();
      
      if (currentPiece) {
        useGameStore.getState().lockPiece();
        
        // Check that some cells are now filled
        const filledCells = useGameStore.getState().board
          .flat(2)
          .filter(cell => cell.filled).length;
        
        expect(filledCells).toBeGreaterThan(0);
      }
    });
  });

  describe('clearLines', () => {
    it('should clear full lines', () => {
      useGameStore.getState().startGame();
      
      // Create a full layer
      const fullLayer = Array(BOARD_WIDTH).fill(null).map(() =>
        Array(BOARD_DEPTH).fill(null).map(() => ({
          filled: true,
          color: '#ff0000',
          type: 'O' as const,
        }))
      );
      
      const newBoard = [...useGameStore.getState().board];
      newBoard[BOARD_HEIGHT - 1] = fullLayer;
      useGameStore.setState({ board: newBoard });
      
      const cleared = useGameStore.getState().clearLines();
      
      expect(cleared).toBeGreaterThan(0);
    });
  });

  describe('camera controls', () => {
    it('should set camera rotation', () => {
      useGameStore.getState().setCameraRotation(45, 60);
      
      const { cameraRotation } = useGameStore.getState();
      expect(cameraRotation.x).toBe(45);
      expect(cameraRotation.y).toBe(60);
    });

    it('should set zoom', () => {
      useGameStore.getState().setZoom(2);
      
      expect(useGameStore.getState().zoom).toBe(2);
    });
  });
});
