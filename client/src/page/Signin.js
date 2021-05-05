import { Button, CssBaseline, Container, makeStyles, Paper, TextField, Box, Typography, InputAdornment, IconButton } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import Visibility from '@material-ui/icons/Visibility';
import { VisibilityOff } from '@material-ui/icons';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router';
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
    box: {
        width: "350px",
        height: "450px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    heading: {
        fontWeight: 'bolder',
        textShadow: "0 1px 2px black",
        marginBottom: theme.spacing(1)
    }
}))

const defaultData = {
    email: "",
    password: ""
};

const Signin = () => {
    const { state, dispatch } = useContext(userContext)
    const history = useHistory();
    const classes = useStyles();
    const [text, settext] = useState(false)
    const [detailes, setdetailes] = useState(defaultData)
    useEffect(() => document.title = "sign in page")

    const handlesignin = async (e) => {
        e.preventDefault();

        await axios.post("/user/login", detailes)
            .then((result) => {
                dispatch({ type: "USER", payload: true })
                toast.success(result.data.message, {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                });
                setdetailes(defaultData);
                settext(false)
                setTimeout(() => { history.push("/") }, 1000)
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                })
            })
    }

    return (
        <>
            <CssBaseline />
            <Container maxWidth className={classes.root}>
                <Paper className={classes.box} >
                    <Typography variant="h2" color="secondary" className={classes.heading}>Sign in </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        margin="normal"
                        variant="outlined"
                        label="email"
                        placeholder="enter your email"
                        value={detailes.email}
                        onChange={(e) => setdetailes({ ...detailes, email: e.target.value })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        fullWidth
                        type={text === false ? "password" : "text"}
                        margin="normal"
                        variant="outlined"
                        label="password"
                        placeholder="enter your password"
                        value={detailes.password}
                        onChange={(e) => setdetailes({ ...detailes, password: e.target.value })}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => settext(!text)}>
                                        {text === false ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button component={Box} mt={2} onClick={handlesignin} variant="contained" color="primary">Sign in</Button>
                </Paper>
                <ToastContainer />
            </Container>
        </>
    )
}

export default Signin
