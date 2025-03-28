import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "./Game/Game";
import ItemLayout from "./Item/ItemLayout";

// Grid to accept drag-and-drop
const Grid = () => {
    const [board, setBoard] = useState([]);

    // Load initial board on component mount
    useEffect(() => {
        logic.initBoard();
        setBoard([...logic.getBoard()]);
    }, []);

    // Handle dropping block onto grid
    const handleDrop = (e, row, col, onBlockUsed) => {
        e.preventDefault();
        const { board: block } = JSON.parse(
            e.dataTransfer.getData("application/json")
        );

        // Place the block at the drop location
        const newBlock = {
            x: col, // X corresponds to col
            y: row, // Y corresponds to row
            board: block,
        };

        // Try inserting the block
        if (logic.insert(newBlock)) {
            setBoard([...logic.getBoard()]); // Update board if inserted
            onBlockUsed(); // Notify that the block was used and trigger new item
        } else {
            console.log("Invalid placement!");
        }
    };

    // Prevent default drag-over behavior
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <Container>
            {/* Pass onBlockUsed to regenerate items after placing */}
            <ItemLayout onBlockUsed={() => setBoard([...logic.getBoard()])} />
            <GridStyled>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            filled={cell === 1}
                            onDrop={(e) => handleDrop(e, rowIndex, colIndex, () => {
                                // Update after successful drop
                                setBoard([...logic.getBoard()]);
                            })}
                            onDragOver={handleDragOver}
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
`;
