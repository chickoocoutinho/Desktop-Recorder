import React, {useRef, useState, useEffect} from 'react';
import SourceDropdown from '../SourceDropdown/SourceDropdown';
import VideoControls from './VideoControls';

import styles from './Video.module.css';

const Video = () => {
  const [recordingSource, setRecordingSource]= useState([]);
  const [mediaRecorder,setMediaRecorder]= useState(null);
  const [selectedOptionId,setSelectedOptionId]= useState(null);

  useEffect(()=>{
    window.api.getVideoSources()
    .then((response)=>{
      let sources= [];
      response.forEach((value)=>{
        if( value.name !== 'Entire Screen' && value.name !== 'My app' )
          sources.push(value)
      })
      setRecordingSource(sources)
    })
    .catch((err)=>alert("Please try again"));
  },[]);

  const recordedChunks = [];

  const videoTag = useRef(null);

  const selectSource= async (source)=>{
    setSelectedOptionId(source.id);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
        }
      }
    })  

    videoTag.current.srcObject= stream;
    videoTag.current.play();

    const mediaRecorderTemp = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    mediaRecorderTemp.ondataavailable = (e)=>recordedChunks.push(e.data);
    mediaRecorderTemp.onstop = handleFileSave;
    setMediaRecorder(mediaRecorderTemp);
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleFileSave= (e)=>{
      window.api.send('get-file-path');
      //wait for ipc main to communicate
      window.api.receive('receive-file-path',async ({filePath})=>{
        if(filePath===null)
          alert('Please try again')
        else if(typeof(filePath) === 'undefined')
          return(null)
        else{
          let chunks= await toBase64(recordedChunks[0]);
          console.log(chunks)
          window.api.saveRecordedFile(chunks,filePath)
          .then(()=> console.log(recordedChunks))//.length=0)
          .catch((err)=>{
            console.log(err)
            alert('Please try again 2')
          })
        }
      });
  }

  return (
    <div className={styles.container}>
      <SourceDropdown list={recordingSource} selectSource={selectSource}
      selectedOptionId={selectedOptionId}/>
      <video ref={videoTag} className={styles.video} />
      <VideoControls mediaRecorder={mediaRecorder} selectedOptionId={selectedOptionId} />
    </div>
  );
}

export default Video;