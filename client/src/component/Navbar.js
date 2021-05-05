import { AppBar, Button, makeStyles, Toolbar, Box, Typography, Hidden, IconButton, SwipeableDrawer, List, ListItem, ListItemText, Divider } from '@material-ui/core'
import React, { useState, useEffect, useContext } from 'react'
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { userContext, userContext1 } from '../App';

const useStyles = makeStyles((theme) => ({
    header: {
        flexGrow: 1
    },
    btn: {
        marginLeft: "10px",
        marginRight: "5px",
    }
}))

const Navbar = () => {
    const { state, role, dispatch, dispatch1 } = useContext(userContext)

    const classes = useStyles();
    const history = useHistory();
    const [drawer, setdrawer] = useState(false)

    const logoutuser = () => {
        dispatch({ type: "USER", payload: false })
        dispatch1({ type: "admin", payload: false })
        axios.get("/user/logout").then(() => {
            history.push('/signin')
        })
    }





    return (
        <>
            <AppBar>
                <Toolbar>
                    <Hidden smUp>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setdrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Hidden>

                    <Typography variant="h5" className={classes.header}>Assignment</Typography>
                    <Hidden xsDown>
                        <Button component={NavLink} to="/" color="inherit" className={classes.btn} variant="outlined">Home</Button>
                        {role === false ? null : <Button component={NavLink} to="/admin" color="inherit" className={classes.btn} variant="outlined">Admin List</Button>}
                        <Button component={NavLink} to="/logs" color="inherit" className={classes.btn} variant="outlined">logs</Button>
                        {state !== true ? <Button component={NavLink} to="/signin" color="inherit" className={classes.btn} variant="outlined">sign In</Button> :
                            <Button onClick={logoutuser} color="inherit" className={classes.btn} variant="outlined">log out</Button>}
                    </Hidden>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer open={drawer} onClose={() => setdrawer(false)}>
                <List component={Box} width="250px">
                    <ListItem onClick={() => setdrawer(false)} component={NavLink} to="/" button>
                        <ListItemText primary={<Typography variant="h6" color="secondary">Assignment</Typography>} />
                    </ListItem>
                    <Divider />
                    <ListItem onClick={() => setdrawer(false)} component={NavLink} to="/" button>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <Divider />
                    {role === false ? null : <ListItem onClick={() => setdrawer(false)} component={NavLink} to="/admin" button>
                        <ListItemText primary="Admin Table" />
                    </ListItem>}
                    <Divider />
                    <ListItem onClick={() => setdrawer(false)} component={NavLink} to="/logs" button>
                        <ListItemText primary="logs" />
                    </ListItem>
                    <Divider />
                    {state !== true ? <><ListItem onClick={() => setdrawer(false)} component={NavLink} to="/signin" button>
                        <ListItemText primary="Sign In" />
                    </ListItem>
                        <Divider /></> :
                        <><ListItem onClick={() => {
                            setdrawer(false)
                            logoutuser()
                        }} button>
                            <ListItemText primary="log out" />
                        </ListItem>
                            <Divider /></>}
                </List>
            </SwipeableDrawer>
        </>
    )
}

export default Navbar
