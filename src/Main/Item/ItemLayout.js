import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "../Game/Game";

// Display 1 draggable item
const ItemLayout = ({ onBlockUsed }) => {
    const [currentItem, setCurrentItem] = useState(null);
    const [remainingItems, setRemainingItems] = useState([]);

    // Load 3 items on component mount
    useEffect(() => {
        generateNewItems(); // Generate items on first load
    }, []);

    // Generate 3 new items and display the first one
    const generateNewItems = () => {
        logic.initItems(); // Generate new items
        const items = logic.getItems(); // Get generated items
        setRemainingItems(items); // Store remaining items
        if (items.length > 0) {
            setCurrentItem(items[0]);
        }
    };

    // Drag handler: pass block data on drag
    const handleDragStart = (e, block) => {
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ x: 0, y: 0, board: block })
        );

        // Transparent drag image to avoid default drag icon
        const dragImg = new Image();
        dragImg.src = "/transparent.png"; // 1x1 transparent image
        e.dataTransfer.setDragImage(dragImg, 0, 0);
    };

    // Handle removing used item and generating the next one
    const handleBlockUsed = () => {
        const newItems = remainingItems.slice(1); // Remove used item
        setRemainingItems(newItems);

        if (newItems.length > 0) {
            setCurrentItem(newItems[0]);
        } else {
            generateNewItems(); // Regenerate when all items are used
        }

        // Notify parent (Grid) to update board
        if (onBlockUsed) {
            onBlockUsed(); // Notify that block was placed successfully
        }
    };

    return (
        <ItemLayoutStyled>
            {currentItem && (
                <BlockWrapper
                    draggable
                    onDragStart={(e) => handleDragStart(e, currentItem)}
                >
                    {currentItem.map((row, rowIndex) => (
                        <Row key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    filled={cell === 1}
                                />
                            ))}
                        </Row>
                    ))}
                </BlockWrapper>
            )}
        </ItemLayoutStyled>
    );
};

export default ItemLayout;

const ItemLayoutStyled = styled.div`
    margin-top: 5px;
    position: relative;
    width: 100%;
    height: auto;
    background-color: lightgray;
    display: flex;
    justify-content: center;
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
    background-color: ${({ filled }) => (filled ? "black" : "white")};
`;
