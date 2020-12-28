import React from 'react';
import Select from 'react-select';


const SourceDropdown = ({title,list,setList,selectedOtioon,setSelectedOtioon}) => {

    const resetThenSet = (id,key) => {
        console.log(id,key);
        setList((prevState)=>{
            let temp= [...prevState];
            temp.forEach((item) => item.selected = false);
            temp[id].selected = true;   
            return temp; 
        })
    }

    return (
        null
    );
}

export default SourceDropdown;