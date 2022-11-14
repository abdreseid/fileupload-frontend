import React from 'react';
import './App.css'
import axios from 'axios';
import  {Profile} from './Component/ProfileCard/Profile';
import { Container, Grid, Button, Box, Dialog, Fade, Backdrop, TextField } from '@material-ui/core';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';
import { AddButton } from './Component/AddButton/AddButton';
import Pagination from '@material-ui/lab/Pagination';
let fs = require('fs');

const useStyles = makeStyles ({
    gridContainer: {
      maxWidth: "50%",
      paddingLeft: '10px',
    },
    innerGrid: {
    },
    margin: {
      margin: 10,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    paper: {
        minWidth: '400px',
        minHeight: '200px'
    },
    btn: {
        width: '80px',
        margin: '10px'
    },
    table: {
        width: 300,
        margin: "auto"
      }
  }); 

const App = () => {
    const [ name, setName ] = React.useState('');
    const [ image, setImage ] = React.useState('');
    const [ students, setStudents ] = React.useState([]);
    const [ loading, setLoading ] = React.useState( false );
    const [currPage, setCurrPage] = React.useState(1);
    const [next, setNext] = React.useState(false);
    const [previous, setPrevious] = React.useState(false);
    const [totalPages, setTotalPages] = React.useState(1)
    const [ open, setOpen ] = React.useState(false);
    const MAX_FILE_SIZE = 5321 // 5MB
    const [errorMsg, setErrorMsg] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState();

    let classes = useStyles();
    
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }
    
    const limit = 4;

    const getPaginatedData = () => {
        axios.get(`http://localhost:5000/api/students/?page=${currPage}&limit=${limit}`)
        .then((res) => {
            if( res.data.prev === undefined ) {
                setPrevious( true)
            }
            else {
                setPrevious( false )
            }
            if( res.data.next === undefined ) {
                setNext( true) 
            }
            else {
                setNext( false )
            }
            setTotalPages(res.data.totalPages)
            setStudents([...res.data.current])
            setLoading( false )
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/students/${id}`)
             .then((res) => {
                 if( students.length == 1 && currPage > 1 ) {
                     setCurrPage(prev => prev - 1 )
                 }
                setStudents([...res.data])
                setLoading( false )
             })
             .catch((error) => {
               console.log( error )
             })
        getPaginatedData()
        alert("image Deleted Successfully")
      }
    


    // const handlePrevious = () => {
    //     setCurrPage(prev => prev - 1)
    // }

    // const handleNext = () => {
    //     setCurrPage(prev => prev + 1)
    // }

    const handleAdd = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        formData.get('name');
        formData.append('image', image);
        const fileSizeKiloBytes = selectedFile.size / 1024;
        const size = fileSizeKiloBytes;
        if( !name  || !image  ) {
        return( alert("all fields are required"))
        }
        if(fileSizeKiloBytes > MAX_FILE_SIZE){
            setErrorMsg("File size is greater than: "+MAX_FILE_SIZE/1024+"MB");
            setIsSuccess(false)
            return
          }
          setErrorMsg("")
        setIsSuccess(true)
        formData.append('size',size);
        let config = {
        method: "post",
        url: "http://localhost:5000/api/students/add",
        headers: {
           "content-type": "application/json",
           "content-type": "multipart/form-data"
        },
        data: formData,
    };
        axios(config)
            .then((res) => {
                setStudents([...res.data.reverse()])
                setLoading( false )
            })
            .catch((error) => {
                console.log( error.response )
            })
        alert("New image Data Added")
        getPaginatedData()
        handleClose()
    }

    React.useEffect(() => {
        getPaginatedData()
    },[currPage, open])

    return (
        <div className="App">
          <Container>
            <div style={{ margin: 'auto'}}>
              <AddButton handleOpen={handleOpen} />
           </div>
           {/* <div style={{marginLeft: "-17px"}}>
                <Button className={classes.btn} color="primary" variant="contained" onClick = { () => handlePrevious() } disabled={previous === true}  >PREVIOUS</Button>
                <Button className={classes.btn} color="secondary" variant="contained" onClick = { () => handleNext()} disabled={next === true} >NEXT</Button>
           </div> */}
           <div style={{display: 'flex', justifyContent: 'center'}}>
               <Pagination count={totalPages} variant="outlined" shape="rounded" color="secondary" page={currPage} onChange={(e, p) => setCurrPage(p)} />
           </div>
            <Dialog
                classes={{ paper: classes.paper}}
                open={open}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
                    >
                        <Fade in={open}>
                        <form className={classes.margin} onSubmit={handleAdd} method="post" encType="multipart/form-data" >
                            <Box className={classes.margin}>
                                <TextField
                                name="name"
                                value={name}
                                color="secondary"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                variant="outlined"
                                label="Name"
                                />
                            </Box>
                            <Box className={classes.margin}>
                                <TextField
                                color="secondary"
                                type="file"
                                name="image"
                                value={image}
                                onChange={(e) => {setImage(e.target.value);setSelectedFile(e.target.files[0])}}
                                variant="outlined"
                                />
                            </Box>
                            <Box className={classes.margin}>
                            
                           <p className="error-message">{errorMsg}</p>
                            </Box>
                            <Box style={{display: "flex", justifyContent: "space-evenly", margin: 10}}>
                                <Button type = "submit" variant="contained" color="primary">
                                    ADD
                                </Button>
                                <Button onClick={handleClose} variant="contained" color="secondary">
                                    CLOSE
                                </Button>
                            </Box>
                        </form>
                        </Fade>
                </Dialog>
          </Container>
          <div style={{display: 'flex', justifyContent:'center', alignItems: 'center',margin: '20px'}}> 
          <TableContainer component={Paper} className={classes.gridContainer}>
      <Table aria-label="simple table" className={classes.table}>
        <TableHead>
          <TableRow>
          <TableCell>Image</TableCell>
           <TableCell align="right">Caption</TableCell>
           <TableCell align="right">Size&nbsp;(MB)</TableCell>
           <TableCell align="right">Created Date</TableCell>
           <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
                {
                    students.map((student) => {
                    return (
                           
                                <Profile getPaginatedData={getPaginatedData} student={student} handleDelete={handleDelete} />
                           
                    )
                    })
                }
             </TableBody>
      </Table>
    </TableContainer>   
           
          </div>
      </div>
    )
}

export default App