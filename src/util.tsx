import { Dispatch, SetStateAction, useEffect, useState } from 'react';


class ArrayWithPushEvent<T> extends Array<T>{
	pushListeners:any[] = [];
	addPushListener = (listener:any)=>{
		this.pushListeners.push(listener);
	}	

	push = (...items:any[]) : number => {
		console.log("push", items);
		const returnValue = super.push(...items);
		for (let listener of this.pushListeners){
			listener();
		}
		return returnValue;
	}
}

const audioList: ArrayWithPushEvent<string> = new ArrayWithPushEvent<string>();

const audioPlayer = new Audio();

audioList.addPushListener(()=>{
	console.log("end?", audioPlayer.ended, audioPlayer.src)
	if (audioPlayer.src == "" || audioPlayer.ended || audioPlayer.error !== null){
		popAudioAndPlay();
	}
})
audioPlayer.addEventListener("ended", ()=>{
	popAudioAndPlay();
});

function useLocalStorageState(itemName: string, defaultValue: any): [any, Dispatch<SetStateAction<any>>] {
	let temp = getLocalStorage(itemName);
	const [value, setState] = useState(temp || defaultValue);

	useEffect(() => {
		setLocalStorage(itemName, value);
	}, [value]);
	return [value, setState];
}

function getLocalStorage(itemName:string): any{
	let temp = localStorage.getItem(itemName);
	if (temp !== null) {
		temp = JSON.parse(temp);
	}	
	return temp;
}

function setLocalStorage(itemName:string, value: any): void{
	localStorage.setItem(itemName, JSON.stringify(value));	
}

async function speak(text: string) {
	console.log("add text", text)
	const fetchAudio = async (word: string) => {
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ "text": word })
		};
		let url = '/speech/';

		console.log("calling speech");
		return fetch(url, requestOptions)
			.then(res => {
				if (!res.ok)
					throw new Error(`${res.status} = ${res.statusText}`);

				if (!res.body) {
					throw new Error("No response body");
				}

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
	if (!response.value) {
		return;
	}
	const blob = new Blob([response.value], { type: 'audio/mp3' });
	const url = window.URL.createObjectURL(blob);
	audioList.push(url);
	// audioPlayer.src = url;
	// try {
	// 	audioPlayer.play();
	// } catch (err) {
	// 	console.log(err);
	// }
}



async function startPlayAudio() {
	//https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari
	//getting the permission
	// return
	try{
		audioPlayer.src = "";
		await audioPlayer.play();
	}catch(err)	{
		// console.log(err);
		console.log(audioPlayer.error)
	}finally{
		audioPlayer.pause();
	}

}

function popAudioAndPlay(){
	if (audioList.length > 0){
		const nextUrl = audioList.pop();
		if (!nextUrl){
			return;
		}
		audioPlayer.src = nextUrl;
		console.log("Play NOW!")
		audioPlayer.play();
	}
}


export { useLocalStorageState, getLocalStorage, setLocalStorage, speak, startPlayAudio };


