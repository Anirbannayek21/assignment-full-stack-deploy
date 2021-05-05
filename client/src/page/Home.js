import { Box, Container, CssBaseline, makeStyles, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../App';

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.grey[300],
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: "60px"
    }
}))
const Home = () => {
    const { role, dispatch1 } = useContext(userContext)
    const { state, dispatch } = useContext(userContext)
    const classes = useStyles();
    const [name, setname] = useState("")


    useEffect(() => {
        document.title = "Home page"
        axios.get("/user/about", {
            withCredentials: true
        }).then((result) => {
            dispatch({ type: "USER", payload: true });
            (result.data.role === "admin") ? dispatch1({ type: "admin", payload: true }) : dispatch1({ type: "admin", payload: false })
            setname(result.data.name)
        })
            .catch((error) => console.log(error.response))
    }, [])


    return (
        <>
            <CssBaseline />
            <Container maxWidth className={classes.root}>
                <Box align="center">
                    {name !== "" ? <Typography variant="h4" color="secondary">Hello , {name}</Typography> : null}
                    <Typography variant="h2" color="secondary" className={classes.text}>welcome to my website</Typography>
                </Box>
            </Container>
        </>
    )
}

export default Home
