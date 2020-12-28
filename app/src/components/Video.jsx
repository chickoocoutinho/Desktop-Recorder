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

  const handleFileSave= (e)=>{
    console.log(e,recordedChunks)
    window.api.send('get-file-path')
    window.api.receive('receive-file-path',({filePath})=>{
      if(filePath===null)
        alert('Please try again')
      else if(typeof(filePath) === 'undefined')
        console.log(filePath)
      else{
        window.api.saveRecordedFile(recordedChunks,filePath)
        .then(()=> recordedChunks.length=0)
        .catch(()=>alert('Please try again 2'))
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