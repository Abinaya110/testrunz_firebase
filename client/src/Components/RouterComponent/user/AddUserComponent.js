import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ReactHTMLDatalist from "react-html-datalist";
import ApiService from "../../../Sevices/ApiService";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { laboratries } from "./data";
import { useStateValue } from '../../../data/StateProvider';
import { IoIosArrowRoundBack } from 'react-icons/io';
import ApiUrl from "../../../ServerApi";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
      zIndex: "200%",
      padding:"2%", height:"30%"
    },
  },
}));

const formContainer = {
  display: "flex",
  flexFlow: "column wrap",
  alignContent: "space-between",
  zIndex:"100%"
};

const style = {
  marginTop: "60px",
  display: "flex",
  justifyContent: "center",
};

const intialValue = {
  studentName: "",
  procedureDescription: "",
  labType: "",
  experimentName: "",
};

const AddUserComponent = (props) => {
  
  const classes = useStyles();
  const [data, setData] = useState(intialValue);
  const [options, setOptions] = useState([]);
  const [options1, setOptions1] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState(null);
  const [{user}, dispatch] = useStateValue();
  const username = user.name
  const useridval = user._id
  const [descriptionerror, setDescriptionerror] = useState();
  const [laberror, setLaberror] = useState();
  const [procedureerror, setProcedureerrorr] = useState();

  useEffect(() => {
    laboratries.then((res) => setOptions(res));
  }, [options]);

  useEffect(() => {
    axios.get(`${ApiUrl}/labrotories`).then((result) => {
      const resultant = Object.getOwnPropertyDescriptor(
        result.data[0],
        data.labType || "Physics"
      ).value;
      const res = resultant.map((val) => ({ text: val, value: val }));
      setOptions1(res);
    });
  }, [data.labType]);

  const saveUser = (e) => {
    e.preventDefault();
    setProcedureerrorr()
    setLaberror()
    setDescriptionerror()
    if (data.procedureDescription === ""||null ) {
      setDescriptionerror("*Write some descriptions*")
    }
  else if (data.labType === ""||null ) {
    setLaberror("*choose a lab type*")
  } 
  else if (data.experimentName === ""||null ) {
    setProcedureerrorr("*select a experiment from the list*")
  }
else{
  let user = {
    studentName: username,
    procedureDescription: data.procedureDescription,
    labType: data.labType,
    experimentName: data.experimentName,
    userId: useridval
  };
  console.log("list user",user)
  ApiService.addUser(user).then((res) => {
    setMessage("User Added successfully.");
    setTimeout(() => {
      props.closeModal();
    }, 1000);
  });
  setOpen(true);
}
  
    


  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className={classes.root}>
     
      <Typography variant="h4" style={style}>
        Add Runz &nbsp;&nbsp;&nbsp;&nbsp;
        <IoIosArrowRoundBack
        onClick={props.closeModal}
        style={{
          // color: "red",
          // border: "1px solid black",
          // borderRadius: "50%",
          // background: "white",
          alignItems:"center"
        
         
        }}
      />
      </Typography>
      <form style={formContainer}>
        {/* <TextField
          type="text"
          placeholder="Experiment Name"
          fullWidth
          margin="normal"
          name="studentName"
          value={data.studentName}
          onChange={onChange}
        /> */}
         <label>Description</label>
        <TextField
          type="text"
          placeholder="Experiment Description"
          fullWidth
          margin="normal"
          name="procedureDescription"
          value={data.procedureDescription}
          onChange={onChange}
        />
        <p className='errormsg'>{descriptionerror}</p>
        <label>Lab Type</label>
        <ReactHTMLDatalist
          name="labType"
          placeholder="Lab Type"
          onChange={onChange}
          options={options}
          value={data.labType}
        />
<p className='errormsg'>{laberror}</p>
        <label>Procedure Name</label>
        <ReactHTMLDatalist
          name="experimentName"
          onChange={onChange}
          options={options1}
          value={data.experimentName}
        />
        <p className='errormsg'>{procedureerror}</p>
        <br/>
        <Button variant="contained" color="primary" onClick={saveUser}>
          Save
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddUserComponent;
