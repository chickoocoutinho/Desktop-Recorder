import React, {useRef} from 'react';

const Video = () => {
    let mediaRecorder;
    const recordedChunks = [];

    const videoTag = useRef(null);

    const selectSource= async (source)=>{
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

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
        mediaRecorder.ondataavailable = (e)=>recordedChunks.push(e.data);
        mediaRecorder.onstop = (e)=> window.api.saveRecordedFile(recordedChunks);
      }

    return (
        <video ref={videoTag}>

        </video>
    );
}

export default Video;