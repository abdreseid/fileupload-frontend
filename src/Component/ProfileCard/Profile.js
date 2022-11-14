import React from 'react'
import { Avatar, Card, CardContent, Typography, Button, Box, Dialog, Fade, Backdrop, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles ({
    
    UserCardBottom: {
        color: 'white',
        minHeight: '40%',
        overflow: 'auto',
        minWidth: '100%',
        maxWidth: '100%',
        padding: '0 10px 5px',
        overflowWrap: 'break-word'
      },
      avatar: {
        width: '100px',
        height: '70px',
        margin: '8px 0 0 0',
        borderRadius: '50%',
        border: '4px solid white',
        objectFit: 'cover'
      },
      box: {
        display: "flex",
        justifyContent: "space-evenly"
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
      paper1: {
          minWidth: '500px',
          minHeight: '100px',
          padding: '20px'
      },
      btn: {
            minWidth: "60px",  
            margin:"5px"
      }
  });
const Profile = ({student, getPaginatedData, handleDelete}) => {
    const [ name, setName ] = React.useState('');
    const [ size, setSize ] = React.useState('');
    const [ image, setImage ] = React.useState('');
    const [ open, setOpen ] = React.useState(false);
    const [ openDeleteModal, setOpenDeleteModal ] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState();
    const [errorMsg, setErrorMsg] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const MAX_FILE_SIZE = 5321 // 5MB


    let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format( new Date(student.createdAt))

    let classes = useStyles();
    
    const handleClose = () => {
        setOpen(false);
    }
    const handleOpen = () => {
        setOpen(true);
    }

    const handleEdit = (e) => {
      e.preventDefault()
      const formData = new FormData(e.target);
      formData.get('name');
      formData.append('_id', student._id)
      formData.append('image', image);
      const fileSizeKiloBytes = selectedFile.size / 1024;
      const size = fileSizeKiloBytes;
      if(fileSizeKiloBytes > MAX_FILE_SIZE){
        setErrorMsg("File size is greater than: "+MAX_FILE_SIZE/1024+"MB");
        setIsSuccess(false)
        return
      }
      setErrorMsg("")
    setIsSuccess(true)
    formData.append('size',size);
        let config = {
          method: "put",
          url: "http://localhost:5000/api/students/edit",
          headers: {
            "content-type": "application/json",
            "content-type": "multipart/form-data"
          },
          data: formData,
        };
        
        axios(config)
        .then((res) => {
          getPaginatedData()
          })
          .catch((error) => {
            console.log( error )
          })
        alert("Image Edited")
        
        handleClose()
      }
    
    React.useEffect(() => {
        setName(student.name)
        setSize(student.size)
        setImage(student.image)
    },[])

    const getImageName = ( url ) => {
      if(student.image) {
        let imgUrl = url.split("\\")
        return imgUrl[imgUrl.length-1]
      }
    }
      
    return (
      <React.Fragment>
         
            <TableRow key={student.Id}>
            <TableCell component="th" scope="row">
            <Avatar alt="profileImg" src={`./uploads/${getImageName(student.image)}`} className={classes.avatar} />
              </TableCell>
              <TableCell align="right">{student.name}</TableCell>
              <TableCell align="right">{(student.size/1024).toFixed(2)} MB</TableCell>
              <TableCell align="right">{date}</TableCell>
              <TableCell >
              <Box style={{display: "flex", justifyContent: "space-evenly", margin: 10}}><Button className={classes.btn} color="secondary" variant="outlined" onClick={() => setOpenDeleteModal(true)} >DELETE</Button>
                    <Button className={classes.btn} color="primary" variant="outlined" onClick={handleOpen} >EDIT</Button>
                    </Box>
                    </TableCell>
             </TableRow>
               
        
                      <Dialog
                        classes={{ paper: classes.paper1}}
                        open={openDeleteModal}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                        timeout: 500,
                      }} >
                          <Typography>Are You Sure You Wanna Delete?</Typography>
                          <Typography>Confirm Delete</Typography>
                          <Button onClick={() => handleDelete(student._id)} variant="contained" color="secondary" style={{margin: '10px'}}>CONFIRM</Button>
                          <Button onClick={() => setOpenDeleteModal(false) } variant="contained" color="primary" style={{margin: '10px'}}>CLOSE</Button>
                      </Dialog>
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
                        <form onSubmit={handleEdit} className={classes.margin}>
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
                                required
                                onChange={(e) => {setImage(e.target.value);setSelectedFile(e.target.files[0])}}
                                variant="outlined"
                                />
                            </Box>
                            <Box className={classes.margin}>
                            
                            <p className="error-message">{errorMsg}</p>
                             </Box>
                            <Box style={{display: "flex", justifyContent: "space-evenly", margin: 10}}>
                                <Button type='submit' variant="contained" color="secondary">
                                    DONE
                                </Button>
                                <Button onClick={handleClose} variant="contained" color="primary">
                                    CLOSE
                                </Button>
                            </Box>
                        </form>
                        </Fade>
                      </Dialog>
                      </React.Fragment>
    )
}

export  {Profile}
