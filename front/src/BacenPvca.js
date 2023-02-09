import React, { useState } from "react";
import './App.css';
import Container from '@material-ui/core/Container';
import { Alert } from '@material-ui/lab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    myButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        color: 'white',
        flexGrow: 1,
    }
}));

function BacenPvca() {

    const classes = useStyles();

    return (
        <header className="App-header">
            <Container>
                <Box>
                    <Alert severity="info">Carreguei uma nova rota para uma nova regulação</Alert>
                </Box>
            </Container>
        </header>
    );

}

export default BacenPvca;