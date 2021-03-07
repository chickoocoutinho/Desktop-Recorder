import React,{useState,useEffect} from 'react';

import clsx from 'clsx';
import styles from './Video.module.css';

const VideoControls = ({mediaRecorder,selectedOptionId}) => {

    const[mediaRecorderStatus, setMediaRecorderStatus]= useState('inactive')

    useEffect(()=>{
        if(mediaRecorder)
            setMediaRecorderStatus(mediaRecorder.status)
    },[mediaRecorder]);

    const handelRecord= ()=>{
        setMediaRecorderStatus('recording');
        mediaRecorder.start();
    };

    const handleStop= ()=>{
        setMediaRecorderStatus('inactive');
        mediaRecorder.stop();
    }

    return (
        <>
        {
            mediaRecorderStatus==='recording'
            &&
            <div className="ring-container-fixed">
                <div className="ring-container">
                    <div className="ringring"></div>
                    <div className="circle"></div>
                </div>
            </div>
        }
        <div className={styles.control}>
        <button className={clsx(styles.controlButton,styles.green)} 
            disabled={selectedOptionId===null || mediaRecorderStatus==='recording'} onClick={handelRecord}>
            Start
        </button>
        <button className={clsx(styles.controlButton,styles.Red)} 
            disabled={mediaRecorderStatus!=='recording'} onClick={handleStop}>
            Stop
        </button>
        </div>
        </>
    );
}

export default VideoControls;