// src/Item/Item.js
import React from "react";
import styled from "styled-components";

const Item = ({ block }) => {
    return (
        <BlockStyled
            rows={block.length}
            cols={block[0].length}
        >
            {block.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        $filled={cell === 1}
                    />
                ))
            )}
        </BlockStyled>
    );
};

export default Item;

const BlockStyled = styled.div`
    display: grid;
    grid-template-rows: ${({ rows }) => `repeat(${rows}, 30px)`};
    grid-template-columns: ${({ cols }) => `repeat(${cols}, 30px)`};
    gap: 2px;
`;

const Cell = styled.div`
    // width: 30px;
    // height: 30px;
    border: 1px solid #ccc;
    background-color: ${({ $filled }) => ($filled ? "black" : "white")};
`;
