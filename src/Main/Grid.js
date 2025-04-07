import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "./Game/Game";
import ItemLayout from "./Item/ItemLayout";

// Grid to accept drag-and-drop
const Grid = () => {
    const [board, setBoard] = useState([]);
    const [hoveredCell, setHoveredCell] = useState({ row: -1, col: -1 });

    // Load initial board on component mount
    useEffect(() => {
        logic.initBoard();
        setBoard([...logic.getBoard()]);
    }, []);

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
        console.log(newBlock);

        // Try inserting the block
        if (logic.insert(newBlock)) {
            handleBlockUsed(index); // Remove block after placing
            setBoard([...logic.getBoard()]); // Update board if inserted

            console.log('insertion should work');
        } else {
            console.log("Invalid placement!");
        }

        // Reset hovered cell after drop
        setHoveredCell({ row: -1, col: -1 });
    };

    // Handle drag over to update hovered cell
    const handleDragOver = (e, row, col) => {
        e.preventDefault();
        setHoveredCell({ row, col });
    };

    // Handle removing block after successful drop
    const handleBlockUsed = (index) => {
        document.dispatchEvent(
            new CustomEvent("blockUsed", { detail: { index } })
        );
    };

    // Check if the current cell is the one being hovered
    const isCellHovered = (row, col) => {
        return hoveredCell.row === row && hoveredCell.col === col;
    };

    return (
        <Container>
            <ItemLayout />
            <GridStyled onDragOver={(e) => e.preventDefault()}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            $filled={cell === 1}
                            $hovering={isCellHovered(rowIndex, colIndex)}
                            onDrop={(e) => {
                                    handleDrop(e, rowIndex, colIndex)
                                    console.log('this is on drop');
                                }
                            }
                            onDragOver={(e) =>
                                handleDragOver(e, rowIndex, colIndex)
                            }
                            onDragLeave={() =>{
                                    console.log('on drag leave');
                                    setHoveredCell({ row: -1, col: -1 })
                                }
                            }
                        />
                    ))
                )}
            </GridStyled>
        </Container>
    );
};

export default Grid;

// Styled Components

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
    background-color: ${({ $filled }) => ($filled ? "black" : "white")};
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    border: 1px solid #ccc;

    ${({ $hovering }) =>
        $hovering &&
        `
        box-shadow: 0 0 12px 4px rgba(0, 128, 255, 0.8);
        border: 2px solid rgba(0, 128, 255, 0.9);
    `}
`;
