import { useEffect, useState } from 'react';

const audioPlayer = new Audio();

function useLocalStorageState(itemName, defaultValue) {


  let temp = localStorage.getItem(itemName);
  console.log(temp);
  if (temp !== null) {
    temp = JSON.parse(temp)
  }
  const [value, setState] = useState(temp || []);

  useEffect(() => {
    localStorage.setItem(itemName, JSON.stringify(value));
  }, [value]);
  return [value, setState];
}

async function speak(text) {
  const fetchAudio = async (word) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "text": word })
    };
    let url = '/speech/';

    console.log("calling speech");
    // fetch() returns a promise that
    // resolves once headers have been received
    return fetch(url, requestOptions)
      .then(res => {
        if (!res.ok)
          throw new Error(`${res.status} = ${res.statusText}`);
        // response.body is a readable stream.
        // Calling getReader() gives us exclusive access to
        // the stream's content
        var reader = res.body.getReader();
        // read() returns a promise that resolves
        // when a value has been received
        return reader
          .read()
          .then((result) => {
            return result;
          });
      })
  }

  const response = await fetchAudio(text);
  const blob = new Blob([response.value], { type: 'audio/mp3' });
  const url = window.URL.createObjectURL(blob)
  audioPlayer.src = url;
  try{
    audioPlayer.play();
  }catch(err){
    console.log(err);
  }
}

function startPlayAudio(){
  //https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari
  //getting the permission
  audioPlayer.src = null;
  audioPlayer.play();
}

export { useLocalStorageState, speak, startPlayAudio };


