import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "../Game/Game";

// Display 3 draggable items
const ItemLayout = () => {
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateNewItems();
    }, []);

    const generateNewItems = () => {
        logic.initItems();
        setItems(logic.getItems()); // store the new items
    };

    // Dynamically create drag preview to match block size
    const handleDragStart = (e, block, index) => {
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ ...block, index })
        );

        // Generate a temporary drag preview block to match the original item
        const dragPreview = document.createElement("div");
        dragPreview.style.position = "absolute";
        dragPreview.style.top = "-999px"; // Move out of view
        dragPreview.style.left = "-999px";
        dragPreview.style.display = "inline-grid";
        dragPreview.style.gridTemplateRows = `repeat(${block.board.length}, 60px)`;
        dragPreview.style.gridTemplateColumns = `repeat(${block.board[0].length}, 60px)`;
        dragPreview.style.gap = "1px";

        // Create cell preview
        block.board.forEach((row) => {
            row.forEach((cell) => {
                const cellDiv = document.createElement("div");
                cellDiv.style.width = "200px";
                cellDiv.style.height = "200px";
                cellDiv.style.aspectRatio = 1;
                cellDiv.style.border = "1px solid #ccc";
                cellDiv.style.backgroundColor = cell === 1 ? "black" : "white";
                dragPreview.appendChild(cellDiv);
                console.log(`this creates temp cell div`);
            });
        });

        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 0, 0);

        // cleanup after drag ends
        setTimeout(() => document.body.removeChild(dragPreview), 0);
    };

    // Remove block after successful placement
    const removeBlock = (index) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.filter((_, i) => i !== index);

            generateNewItems();
            return updatedItems;
        });
    };

    // Listen for blockUsed event and remove the block
    useEffect(() => {
        const handleBlockUsed = (e) => {
            removeBlock(e.detail.index);
            setScore(logic.getScore())

        };

        document.addEventListener("blockUsed", handleBlockUsed);
        return () =>
            document.removeEventListener("blockUsed", handleBlockUsed);
    });

    return (
        <ItemLayoutStyled>
            <h1>Update Score: {score}</h1>
            {items.map((item, index) => (
                <BlockWrapper
                    key={index}
                    draggable
                    onDragStart={(e) =>
                        handleDragStart(e, { x: 0, y: 0, board: item }, index)
                    }>

                    {item.map((row, rowIndex) => (
                        <Row key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    $filled={cell === 1}
                                />
                            ))}
                        </Row>
                    ))}
                </BlockWrapper>
            ))}
        </ItemLayoutStyled>
    );
};

export default ItemLayout;

const ItemLayoutStyled = styled.div`
    margin-top: 5px;
    position: relative;
    width: 100%;
    height: 220px;
    background-color: lightgray;
    display: flex;
    justify-content: space-around;
    padding: 10px;
`;

const BlockWrapper = styled.div`
    display: inline-block;
    padding: 5px;
    background-color: white;
    border: 1px solid black;
    cursor: grab;
`;

const Row = styled.div`
    display: flex;
`;

const Cell = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: ${({ $filled }) => ($filled ? "black" : "white")};
`;
