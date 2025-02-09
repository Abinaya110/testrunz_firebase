import React from "react";
import * as html2json from "html2json";
import parse from "html-react-parser";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { FaDownload } from 'react-icons/fa';
import { ImCloudUpload } from 'react-icons/im';
import { BsFillCalculatorFill } from 'react-icons/bs';
import "./layout.css"
import ApiUrl from "../../ServerApi";
import Swal from 'sweetalert2'
import { GridLoadingOverlay } from "@material-ui/data-grid";
import Lodaing from "../RouterComponent/user/Lodaing";
// import { stableValueHash } from "react-query/types/core/utils";





const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const fetchexperiment = async () => {
  const res = await fetch(`${ApiUrl}/experiments/${window.location.href.split("/")[5]}`);
  return res.json();
}
const Context = ({ value, dataV }) => {
  const classes = useStyles();
  const [data, setData] = React.useState({});
  const [data1, setData1] = React.useState({});
  const [isData, setIsData] = React.useState(false);
  const [result, setResult] = React.useState({});
  const [errorvalue, setErrorvalue]=React.useState();
  const [output,setOutput]=React.useState({})
  const [accord, setAccord] = React.useState(false);
  

  let inputEl = document.querySelectorAll("input");
  let inputElArr = Array.from(inputEl).slice(1);




  function init() {
    console.log(inputEl)
    inputElArr.forEach((ele) => {
      const { name, value } = ele;
      setData((prev) => ({ ...prev, [name]: value ?? "1" }));
      ele.onChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
      };
    });
  }

  const retrive = async(event) => {
    event.preventDefault();
    let expid =  localStorage.getItem("userId")
    fetch(`${ApiUrl}/experiments/${expid}`)
    .then((res)=>res.json())
    .then(data =>{
      console.log("i am ", data)
      console.log("i am here", data.datas)
      const filtered = Object.entries(data.datas).filter(([key, value]) => key != '');
      const obj = Object.fromEntries(filtered)
      console.log("i am here too",obj)
      for (const [key, values] of Object.entries(obj)) {

        document.getElementById(key).value=values
         }
     
    
    } );
 
 


  //   setData1(ress.datas)
    
   
  }
  React.useEffect(init, [isData]);
 
  const accordchange=()=>{
    setAccord(!accord)
  }


  const Calculate = (event) => {
    event.preventDefault();
    setAccord(true)
    init()

    let vals = Object.values(data)
   
    const empty = vals.filter(item => item  === "");
    const tosent  = delete data[""]
    console.log("data",data)

    if (empty.length > 0){
      setErrorvalue("Must fill all Required Readings")
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Must fill all Required Readings',
        footer:"Values Missing",
        showConfirmButton: false,
        timer: 1500
      })
    }
    else if(empty.length === 0){
      setErrorvalue()
      setResult({})
      let resultval ={}
    
   
    fetch(`${ApiUrl}/runPython/`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        title: `${dataV && dataV?.experimentName}`,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((responce)=>responce.json())
    .then((data)=>{
     setResult( data)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Calculation Completed',
        showConfirmButton: false,
        timer: 1500
      })
    })
    .catch((error) => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Check the values you have Entered',
        footer:"calculation Error",
        showConfirmButton: false,
        timer: 1500
      })
      setErrorvalue("Check the values you have Entered")
    });
  
  //   setIsData((prev) => !prev);
  // if(resultval){
  //   setResult(resultval)
  // }
  }
  }



  const updateval = (event) => {
    event.preventDefault();
    console.log("check", event.detail)
    fetch(`${ApiUrl}/experiments/`, {
      method: "PATCH",
      body: JSON.stringify({ ...data, id: window.location.href.split("/")[5] }),
      headers: { "Content-type": "application/json" },
    })
      .then(res => {console.log("result", res)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
    }
      )
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'something went wrong Try again',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }




  const uses = value?.html.child.map((ele) => ele);


  return (
    <div className={classes.root}>
   

      {value? 
         <div >
          <div className="containeer">
            <form >
              {value?.html &&
                uses.map((el) =>
                  parse(value?.html && html2json.json2html(el))
                )}
              <Button variant="contained"
                style={{ position: "relative", left: "40%", top: "2%" }}
                onClick={Calculate}
              >
                Calculate Result &nbsp;&nbsp;&nbsp;
                <BsFillCalculatorFill/>
                </Button>
            </form>
          </div>
          <br /><br />
         
          <Accordion  expanded={accord}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"    
            onClick={accordchange}         
            >
              <Typography className={classes.heading}>Result</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <p>Result will be shown here</p>
                {errorvalue? <p style={{color:"red"}}>*{errorvalue}*</p>:
                Object.keys(result).map((item) => {
                  return Object.keys(result[item][0]).map((i) => {
                    return (
                      
                       <p>{i} : {result[item][0][i]}</p> 
                         
                        
                      
                    );
                  });
                })
                // <p>{output}</p>
              }
              </Typography>
            </AccordionDetails>
          </Accordion>
          <br /><br />
          <Stack spacing={2} direction="row" style={{ position: "relative", left: "25%" }}>
      
      <Button variant="contained" onClick={retrive}>Retrive &nbsp;&nbsp;&nbsp;<FaDownload/></Button>
      <Button variant="contained" onClick={updateval}>Save &nbsp;&nbsp;&nbsp;<ImCloudUpload/></Button>
     
    </Stack>

         
          <hr />
        </div> 
        :<Lodaing/>}
     
    </div>
  );
};
export default Context;