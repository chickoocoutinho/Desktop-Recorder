import React,{useState, useEffect} from 'react';
import styles from './SourceDropdown.module.css';


const SourceDropdown = ({list,selectSource,selectedOptionId}) => {
    const [isDropdownOpen, setIsDropdownOpen]= useState(false);
    const [isLoading, setIsLoading]= useState(false);

    useEffect(()=>{
        setIsLoading(list.length===0);
    },[list]);

    const handleSourceSelect=(value)=>{
        setIsDropdownOpen(false);
        selectSource(value);
    }

    const toggleDropdown= ()=>{
        setIsDropdownOpen( !isDropdownOpen )
    }

    return (
        <div className={styles.container}>
        <button onClick={toggleDropdown} className={styles.button}> 
            Select Video Source
        </button>
        {
            isDropdownOpen &&
            <div className={styles.dropdown}>
                
                {   
                    isLoading?
                    <p>Loaging</p>:
                    list.map((value)=>(
                        <div key={value.id} onClick={()=>handleSourceSelect(value)}
                        className={selectedOptionId==value.id? styles.selected: null}>
                            {value.name}
                        </div>
                    ))
                }
                
            </div>
        }
        </div>
    );
}

export default SourceDropdown;