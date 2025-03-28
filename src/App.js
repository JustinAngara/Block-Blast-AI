import React from "react";
import styled from "styled-components";
import Grid from "./Main/Grid.js";
const App = () => {
    return (
        <AppStyled>
            <div className="center">
                <Grid />
            </div>

        </AppStyled>
    );
};

export default App;

const AppStyled = styled.div`
    background-image: linear-gradient(rgba(0, 0, 0, 0.31) 2px, transparent 2px),
        linear-gradient(to right, rgba(0, 0, 0, 0.31) 2px, transparent 2px);
    background-size: 32px 32px;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers horizontally */

    .center {
        display: flex;
        flex-direction: column; /* Stack Grid and ItemLayout vertically */
        align-items: center;
        gap: 20px; /* Adds space between Grid and ItemLayout */
    }
`;
