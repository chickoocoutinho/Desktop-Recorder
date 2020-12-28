import React, {useRef, useState, useEffect} from 'react';
import Select from 'react-select';

const Video = () => {
  const [recordingSource, setRecordingSource]= useState([]);
  const [selectedRecordingSource, setSelectedRecordingSource]= useState([]);
  const [sourceLoading, setSourceLoading]= useState(true);

  const [mediaRecorder,setMediaRecorder]= useState(null);

  //const [recordedChunks, setRecordedChunks]= useState([])

  useEffect(()=>{console.log('rerendered')},[])

  useEffect(()=>{
    window.api.getVideoSources()
    .then((response)=>{
      response.forEach(element =>({
        ...element,
        selected: false
      }));
      console.log(response);
      setRecordingSource(response)
    })
    .catch((err)=>alert("Please try again"));
  },[]);

  const recordedChunks = [];

  const videoTag = useRef(null);

  const selectSource= async (source)=>{
    setSelectedRecordingSource(source)
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
    mediaRecorderTemp.ondataavailable = (e)=>/*{console.log(e);setRecordedChunks([e.data])}*/recordedChunks.push(e.data);
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
    <div>
      <Select
        isLoading={sourceLoading}
        defaultValue={selectedRecordingSource}
        onChange={selectSource}
        options={recordingSource}
      />
      <video ref={videoTag} />
      <button onClick={()=>{mediaRecorder.start();console.log(mediaRecorder.state);}}>
        Start
      </button>
      <button onClick={()=>mediaRecorder.stop()}>
        Stop
      </button>
    </div>
  );
}

export default Video;