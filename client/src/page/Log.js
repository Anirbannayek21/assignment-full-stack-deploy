import { Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Container, CssBaseline, Button, makeStyles, Paper, Dialog, DialogTitle, DialogContent, TextField, InputAdornment, Grid } from '@material-ui/core'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AddIcon from '@material-ui/icons/Add';
import PhoneIcon from '@material-ui/icons/Phone';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { userContext } from '../App';
import { Search } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        marginTop: theme.spacing(2),
        width: "90%",
        maxHeight: "90%",
        height: "max-content",
        padding: theme.spacing(3),
        overflow: "scoll",
        boxShadow: theme.shadows[20]
    },
    rowcontent: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main
    },
    text: {
        fontWeight: "bolder"
    }

}))

const defaultData = {
    phone: "",
    text: "",
    date: new Date().toLocaleDateString()
}

const Log = () => {
    const classes = useStyles();
    const [open, setopen] = useState(false)
    const [users, setusers] = useState([])
    const [page, setpage] = useState(0)
    const [rowCount, setrowCount] = useState(10)
    const [data, setdata] = useState(defaultData)
    const [viewOpen, setviewOpen] = useState(false)
    const [searchValue, setsearchValue] = useState("")

    const { role, dispatch1 } = useContext(userContext)
    const { state, dispatch } = useContext(userContext)

    const loadData = () => {
        axios.get("/user/logs").then((result) => {
            setusers(result.data.reverse()
            )
        }).catch((error) => console.log(error))
    }


    useEffect(() => {
        document.title = "logs"
        axios.get("/user/about", {
            withCredentials: true
        }).then((result) => {
            dispatch({ type: "USER", payload: true });
            (result.data.role === "admin") ? dispatch1({ type: "admin", payload: true }) : dispatch1({ type: "admin", payload: false })
        })
            .catch((error) => console.log(error.response))
        loadData()
    }, [])

    const onChange = (event, nextPage) => {
        setpage(nextPage)
    }

    const onChangeRow = (event) => {
        setrowCount(event.target.value)
    }

    const submit = () => {
        axios.post("/user/addlogs", data).then((result) => {
            toast.success(result.data.message, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
            });

            setdata(defaultData)
            setopen(false)
            loadData()
        }).catch((error) => {
            toast.error(error.response.data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
            })
        })
    }

    const searchData = async () => {
        if (searchValue === "") {
            loadData()
        }
        else {
            const result = await axios.get("/user/logs")
            setusers(result.data.filter((value) => value.phone == searchValue))
            setsearchValue("")
        }

    }

    const refresh = () => {
        setsearchValue("")
        loadData()
    }

    const view = (id) => {
        axios.post("/user/viewlog", { _id: id }).then((result) => {
            setviewOpen(true)
            setdata({ ...data, phone: result.data.phone, text: result.data.text, date: result.data.date })
        }).catch((error) => console.log(error))
    }

    return (
        <>
            <CssBaseline />
            <Container maxWidth className={classes.root}>
                <Paper component={Box} className={classes.box}>
                    <Typography variant="h4" className={classes.text} color="primary" align="center">LOGS</Typography>
                    <Grid container>
                        <Grid item md={9} lg={9}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <TextField
                                    margin="dense"
                                    variant="outlined"
                                    label="phone No"
                                    placeholder="enter exact phone No"
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
                                <AddIcon />Add logs
                                </Button>
                        </Grid>
                    </Grid>


                    <TableContainer style={{ maxHeight: 300 }} >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow >
                                    <TableCell className={classes.rowcontent} align="center">ID</TableCell>
                                    <TableCell className={classes.rowcontent} align="center" >DATE</TableCell>
                                    <TableCell className={classes.rowcontent} align="center">PHONE NO</TableCell>
                                    <TableCell className={classes.rowcontent} align="center">TEXT</TableCell>
                                    <TableCell className={classes.rowcontent} align="center" >ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users.slice(page * rowCount, page * rowCount + rowCount).map((user, index) => (
                                        <TableRow>
                                            <TableCell align="center">{(page * rowCount) + index + 1}</TableCell>
                                            <TableCell align="center" >{user.date}</TableCell>
                                            <TableCell align="center">{user.phone}</TableCell>
                                            <TableCell align="center">{user.text.slice(0, 50) + (" ...........")}</TableCell>
                                            <TableCell align="center" >
                                                <Button variant="outlined" color="primary" component={Box} ml={1} onClick={() => view(user._id)} >View</Button>
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
                <ToastContainer />
            </Container>
            <Dialog open={open} onClose={() => setopen(false)}>
                <Box pb={2} width="300px">
                    <DialogTitle>add Logs</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            value={data.phone}
                            onChange={(e) => setdata({ ...data, phone: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="Phone No"
                            placeholder="enter phone number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        < PhoneIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={data.text}
                            onChange={(e) => setdata({ ...data, text: e.target.value })}
                            variant="outlined"
                            margin="normal"
                            label="your text"
                            placeholder="enter your text"
                            helperText="Maximum 160 characters"
                        />
                        <Button variant="contained" color="primary" onClick={submit}>Submit</Button>

                    </DialogContent>
                </Box>
            </Dialog>
            <Dialog open={viewOpen} onClose={() => {
                setviewOpen(false)
                setdata(defaultData)
            }}>
                <Box pb={2} width="300px">
                    <DialogTitle>view Logs</DialogTitle>
                    <DialogContent>
                        <TextField
                            disabled
                            fullWidth
                            value={data.date}
                            variant="outlined"
                            margin="normal"
                            label="Date"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            disabled
                            fullWidth
                            value={data.phone}
                            variant="outlined"
                            margin="normal"
                            label="Phone No"
                            placeholder="enter phone number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            disabled
                            fullWidth
                            multiline
                            rows={4}
                            value={data.text}
                            variant="outlined"
                            margin="normal"
                            label="your text"
                            placeholder="enter your text"
                        />
                    </DialogContent>
                </Box>
            </Dialog>
        </>
    )
}

export default Log
