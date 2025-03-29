import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "./Game/Game";
import ItemLayout from "./Item/ItemLayout";

// Grid to accept drag-and-drop
const Grid = () => {
    const [board, setBoard] = useState([]);
    const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });
    const [validPosition, setValidPosition] = useState(false);

    // Load initial board on component mount
    useEffect(() => {
        logic.initBoard();
        setBoard([...logic.getBoard()]);
    }, []);

    // Check if a block can be placed at the hovered position
    const checkValidPosition = (block, row, col) => {
        const tempBoard = logic.getBoard();
        const height = block.board.length;
        const width = block.board[0].length;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (row + i >= 8 ||
                    col + j >= 8 ||
                    (block.board[i][j] === 1 &&
                    tempBoard[row + i][col + j] === 1)) {

                        return false;
                }
            }
        }
        return true; 
    };

    // Handle dropping block onto grid
    const handleDrop = (e, row, col) => {
        e.preventDefault();
        const { board: block, index } = JSON.parse(
            e.dataTransfer.getData("application/json")
        );

        // Place the block at the drop location
        const newBlock = {
            x: col,
            y: row,
            board: block,
        };

        // Try inserting the block
        if (logic.insert(newBlock)) {
            setBoard([...logic.getBoard()]); // Update board if inserted
            handleBlockUsed(index); // Remove block after placing
        } else {
            console.log("Invalid placement!");
        }

        // Reset hovered cell after drop
        setHoveredCell({ row: -1, col: -1 });
        setValidPosition(false);
    };

    // Handle drag over to update hovered cell position and check validity
    const handleDragOver = (e, row, col) => {
        // ✅ Call preventDefault to allow the cell to receive drag events
        e.preventDefault();

        const blockData = e.dataTransfer.getData("application/json");
        if (!blockData) return;

        const block = JSON.parse(blockData);
        setHoveredCell({ row, col });

        // Check if the block can fit at the target coordinates
        if (checkValidPosition(block, row, col)) {
            setValidPosition(true);
        } else {
            setValidPosition(false);
        }
    };

    // Handle removing block after successful drop
    const handleBlockUsed = (index) => {
        document.dispatchEvent(
            new CustomEvent("blockUsed", { detail: { index } })
        );
    };

    return (
        <Container>
            <ItemLayout />
            {/* Ensure preventDefault() at grid level for drag-over */}
            <GridStyled onDragOver={(e) => e.preventDefault()}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            filled={cell === 1}
                            hover={
                                hoveredCell.row === rowIndex &&
                                hoveredCell.col === colIndex
                            }
                            valid={validPosition}
                            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                            onDragOver={(e) =>
                                handleDragOver(e, rowIndex, colIndex)
                            }
                            onDragLeave={() =>
                                setHoveredCell({ row: -1, col: -1 })
                            } // Reset hover on leave
                        />
                    ))
                )}
            </GridStyled>
        </Container>
    );
};

export default Grid;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const GridStyled = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 2px;
    background-color: lightblue;
    width: 85vw;
    height: 85vw;
    max-width: 670px;
    max-height: 670px;
    border: 2px solid black;
`;

const Cell = styled.div`
    background-color: ${({ filled }) => (filled ? "black" : "white")};
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border: 1px solid #ccc;

    // Highlight valid positions with a glowing effect
    ${({ hover, valid }) =>
        hover &&
        valid &&
        `
        box-shadow: 0 0 10px 2px rgba(0, 255, 0, 0.8); // Green glow if valid
        border: 2px solid green;
    `};

    ${({ hover, valid }) =>
        hover &&
        !valid &&
        `
        box-shadow: 0 0 10px 2px rgba(255, 0, 0, 0.8); // Red glow if invalid
        border: 2px solid red;
    `};
`;
