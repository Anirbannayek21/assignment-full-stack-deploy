import { Typography, Box, Button, CssBaseline, Container, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router';
import { userContext } from '../App';


const useStyles = makeStyles((theme) => ({
    root: {
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.grey[300],
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    box: {
        marginTop: theme.spacing(2),
        width: "90%",
        maxHeight: "90%",
        height: "max-content",
        padding: theme.spacing(3),
        overflow: "scoll"
    },
    rowcontent: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main
    },
    gridButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    dialog: {
        width: "290px",
        paddingBottom: "50px"
    },
    add: {
        align: "right"
    },
    text: {
        fontWeight: "bolder"
    }
}))


const defaultData = {
    name: "",
    email: "",
    password: ""
}

const defaulteditData = {
    _id: "",
    name: "",
    email: "",
    password: ""
}

const Admin = () => {
    const { role, dispatch1 } = useContext(userContext)
    const { state, dispatch } = useContext(userContext)
    const history = useHistory();
    const classes = useStyles();
    const [open, setopen] = useState(false)
    const [users, setusers] = useState([])
    const [signupData, setsignupData] = useState(defaultData)
    const [editData, seteditData] = useState(defaulteditData)
    const [page, setpage] = useState(0)
    const [rowCount, setrowCount] = useState(10)
    const [openedit, setopenedit] = useState(false)
    const [searchValue, setsearchValue] = useState("")

    useEffect(() => {
        document.title = "admin desk"
        dispatch1({ type: "admin", payload: true })
        dispatch({ type: "USER", payload: true })
        loadUsers();
    }, [signupData])

    const loadUsers = () => {
        axios.get("/user/userdata").then((result) => {
            setusers(result.data);
        }).catch((error) => history.push("/signin"))

    }

    const onChange = (event, nextPage) => {
        setpage(nextPage)
    }

    const onChangeRow = (event) => {
        setrowCount(event.target.value)
    }

    const signup = async () => {
        await axios.post("/user/register", signupData).then((result) => {
            toast.success(result.data.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
            });
            setsignupData(defaultData)
            setopen(false)
        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
            })
        })
    }

    const showedit = async (id) => {
        setopenedit(true)
        const userdata = await axios.post('/user/getuser', { _id: id });

        seteditData({ ...editData, _id: userdata.data._id, name: userdata.data.name, email: userdata.data.email })
    }

    const update = () => {
        axios.post("/user/update", editData).then((result) => {
            toast.success(result.data.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
            });
            seteditData(defaulteditData)
        }).catch((error) => console.log(error))

        setopenedit(false)
        loadUsers();
    }

    const searchData = async () => {
        if (searchValue === "") {
            loadUsers();
        }
        else {
            const result = await axios.get("/user/userdata")
            setusers(result.data.filter((value) => value.name.toLowerCase().includes(searchValue.toLowerCase())))
            setsearchValue("")
        }

    }

    const refresh = () => {
        setsearchValue("")
        loadUsers()
    }

    const changeAdmin = (id) => {
        axios.post('/user/adminupdate', { _id: id }).then((result) => loadUsers()).catch((error) => console.log(error))
    }

    return (
        <>
            <CssBaseline />
            <Container maxWidth className={classes.root}>
                <Paper className={classes.box}>
                    <Typography variant="h4" className={classes.text} color="primary" align="center">USERS</Typography>
                    <Grid container>
                        <Grid item md={9} lg={9}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TextField
                                    margin="dense"
                                    variant="outlined"
                                    label="name"
                                    placeholder="search user name"
                                    value={searchValue}
                                    onChange={(e) => setsearchValue(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" width="10px">
                                                <Search />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button component={Box} onClick={searchData} mt={.5} ml={1} variant="contained" color="primary">
                                    search
                            </Button>
                                <Button component={Box} onClick={refresh} mt={.5} ml={1} variant="contained" color="primary">
                                    refresh
                            </Button>
                            </Box>
                            <Box style={{ flexGrow: 1 }}></Box>
                        </Grid>
                        <Grid item md={3} lg={3} align="right">
                            <Button component={Box} mt={1.5} ml={1} mb={2} variant="contained" color="primary" onClick={() => setopen(true)}>
                                <PersonOutlineOutlinedIcon />Add user
                                </Button>
                        </Grid>
                    </Grid>
                    <TableContainer style={{ maxHeight: 300 }} >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow >
                                    <TableCell className={classes.rowcontent} align="center">ID</TableCell>
                                    <TableCell className={classes.rowcontent} align="center">NAME</TableCell>
                                    <TableCell className={classes.rowcontent} align="center">EMAIL</TableCell>
                                    <TableCell className={classes.rowcontent} align="center" >ROLE</TableCell>
                                    <TableCell className={classes.rowcontent} align="center" >ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.slice(page * rowCount, page * rowCount + rowCount).map((user, index) => (
                                        <TableRow>
                                            <TableCell align="center">{(page * rowCount) + index + 1}</TableCell>
                                            <TableCell align="center">{user.name}</TableCell>
                                            <TableCell align="center">{user.email}</TableCell>
                                            <TableCell align="center">{user.role}</TableCell>
                                            <TableCell align="center" >
                                                {user.role === "user" ?
                                                    <>
                                                        <Button variant="outlined" color="primary" component={Box} ml={1} my={1} onClick={() => showedit(user._id)}  >EDIT</Button>
                                                        <Button variant="outlined" color="secondary" component={Box} ml={1} onClick={() => changeAdmin(user._id)}>set admin</Button>
                                                    </> :
                                                    <Button variant="outlined" color="primary" component={Box} ml={1} onClick={() => showedit(user._id)}  >EDIT</Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        showFirstButton="true"
                        component="div"
                        rowsPerPageOptions={[5, 10, 15, 25, 50]}
                        count={users.length}
                        rowsPerPage={rowCount}
                        page={page}
                        onChangePage={onChange}
                        onChangeRowsPerPage={onChangeRow}
                    />
                </Paper>
                <Dialog open={open} onClose={() => setopen(false)}>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogContent className={classes.dialog}>
                        <TextField
                            fullWidth
                            value={signupData.name}
                            onChange={(e) => setsignupData({ ...signupData, name: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="name"
                            placeholder="enter name"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            value={signupData.email}
                            onChange={(e) => setsignupData({ ...signupData, email: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="email"
                            placeholder="enter email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            value={signupData.password}
                            onChange={(e) => setsignupData({ ...signupData, password: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="password"
                            placeholder="enter password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button component={Box} mt={2} variant="contained" color="primary" onClick={signup}> add</Button>
                    </DialogContent>
                </Dialog>
                <Dialog open={openedit} onClose={() => setopenedit(false)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent className={classes.dialog}>
                        <TextField
                            fullWidth
                            value={editData.name}
                            onChange={(e) => seteditData({ ...editData, name: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="name"
                            placeholder="enter name"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            value={editData.email}
                            onChange={(e) => seteditData({ ...editData, email: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="email"
                            placeholder="enter email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailOutlineOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            value={editData.password}
                            onChange={(e) => seteditData({ ...editData, password: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="password"
                            placeholder="enter password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button component={Box} mt={2} variant="contained" color="primary" onClick={update}> edit</Button>
                    </DialogContent>
                </Dialog>
                <ToastContainer />
            </Container >
        </>
    )
}

export default Admin
