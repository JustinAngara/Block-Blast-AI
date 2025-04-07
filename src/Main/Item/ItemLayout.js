// src/ItemLayout.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { logic } from "../Game/Game";
import Item from "./Item";

const ItemLayout = () => {
    const [items, setItems] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateNewItems();
    }, []);

    const generateNewItems = () => {
        logic.initItems();
        setItems(logic.getItems());
    };

    const handleDragStart = (e, block, index) => {
        e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ ...block, index })
        );
    };

    const removeBlock = (index) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.filter((_, i) => i !== index);
            generateNewItems();
            return updatedItems;
        });
    };

    useEffect(() => {
        const handleBlockUsed = (e) => {
            removeBlock(e.detail.index);
            setScore(logic.getScore());
        };

        document.addEventListener("blockUsed", handleBlockUsed);
        return () =>
            document.removeEventListener("blockUsed", handleBlockUsed);
    });

    return (
        <ItemLayoutStyled>
            <h1>this better work</h1>
            <h1>Update Score: {score}</h1>
            {items.map((item, index) => (
                <BlockWrapper
                    key={index}
                    draggable
                    onDragStart={(e) =>
                        handleDragStart(e, { x: 0, y: 0, board: item }, index)
                    }
                >
                    <div>
                        this is the item
                        <Item block={item} />
                    </div>
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
