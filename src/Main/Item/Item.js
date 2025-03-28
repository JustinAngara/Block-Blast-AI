import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/*
    this prop of tye board (2d array from Game.js) can be moved and dragged
    properties: snap back
    should update board on release if insertion is valid or not

*/
const Item = ({ prop }) => {
    let board = prop.board;
    return <ItemStyled>Item</ItemStyled>;
};

export default Item;

// prop-types
Item.propTypes = {
    prop: PropTypes.array,
};

const ItemStyled = styled.div``;
