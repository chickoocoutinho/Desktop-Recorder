import React,{useState,useEffect} from 'react';

const VideoControls = ({mediaRecorder,selectedOptionId}) => {
    const[mediaRecorderStatus, setMediaRecorderStatus]= useState('inactive')

    useEffect(()=>{
        if(mediaRecorder)
            setMediaRecorderStatus(mediaRecorder.state);
    },[mediaRecorder]);

    return (
        <>
        <button disabled={selectedOptionId===null} onClick={()=>mediaRecorder.start()}>
            Start
        </button>
        <button disabled={mediaRecorderStatus!=='recording'} onClick={()=>mediaRecorder.stop()}>
            Stop
        </button>
        </>
    );
}

export default VideoControls;