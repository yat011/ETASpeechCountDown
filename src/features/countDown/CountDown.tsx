import { sortBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocalStorageState, speak, startPlayAudio } from "../../util";
import TimePicker, { TimePickerValue } from 'react-time-picker';
import { ETADateInformation } from '../transportation/provider/Provider';
import { selectETAList } from '../transportation/transportationSlice';

const REMAINING_TEXT = "仲翻REMAINING分鐘";
const LAST_ETA = "依家最遲搭島係NAME";

interface Deadline {
	name: string;
	deadline: string;
}

type DeadlineAddFunction = (item: Deadline) => void;
type DeadlineRemoveFunction = (item: Deadline) => void;
type DeadlineChangeFunction = (item: Deadline) => void;


function CountDown() {

	const [deadlines, setDeadlines] = useLocalStorageState('deadlines', []);
	const [currentDeadline, setCurrentDeadline] = useState<Deadline>();

	const handleDeadlineAdd = (newItem: Deadline) => {
		setDeadlines(deadlines.concat(newItem));
	}

	const hadleDeadlineRemove = (item: Deadline) => {
		setDeadlines(deadlines.filter((t: Deadline) => (t !== item)));
	}

	const handleDeadlineChosen = (item: Deadline) => {
		startPlayAudio();
		setCurrentDeadline(item);
	}

	return (
		<div>
			<div>
				<DeadlineCountDown currentDeadline={currentDeadline} />
			</div>
			<div>
				<h2>Deadline List</h2>
				<DeadlineList deadlines={deadlines} onRemove={hadleDeadlineRemove} onUse={handleDeadlineChosen} />
			</div>
			<h2>Add Deadline</h2>
			<DeadlineAddForm onAdd={handleDeadlineAdd} />
			<hr />
		</div>
	);

}

const DeadlineCountDown = ({ currentDeadline }: { currentDeadline: Deadline | undefined }) => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const etaList = useSelector(selectETAList);

	useEffect(updateDate(setCurrentDate), []);



	const formattedETAList = useMemo(() => {
		if (!currentDeadline) {
			return [];
		}
		const deadlineDateObj = getDateObjectFromDatetime(currentDeadline.deadline);
		let formattedETAList = getValidFormattedEtaList(etaList, deadlineDateObj);
		formattedETAList = sortBy(formattedETAList, 'eta');
		return formattedETAList;
	}, [etaList, currentDeadline]);


	const lastValidETA = formattedETAList.length > 0 ? formattedETAList[formattedETAList.length - 1] : null;

	let remainingMinutes: number | null = null;
	if (lastValidETA !== null){
		remainingMinutes = substractMinutes(lastValidETA.eta, currentDate);
	}

	useEffect(() => {
		if (remainingMinutes !== null) {
			speakRemainingTime(remainingMinutes);
		}
	}, [remainingMinutes]);

	useEffect(() => {
		if (lastValidETA !== null) {
			speakLastETA(lastValidETA);
		}
	}, [lastValidETA]);

	if (!currentDeadline) {
		return (<div>No existing deadline</div>);
	}
	return (
		<div>
			<div>Current Deadline: {currentDeadline.deadline}</div>
			<div>Last Valid: {lastValidETA != null && getDateTime(lastValidETA.eta)}</div>
			<div>Remaining: {remainingMinutes} min</div>
		</div>
	);
}

const DeadlineList = ({ deadlines, onRemove, onUse }: { deadlines: Deadline[], onRemove: DeadlineRemoveFunction, onUse: DeadlineChangeFunction }) => {

	return (
		<ul>
			{
				deadlines.map((item) => {
					return (<li key={item.name}>{item.name} {item.deadline}
						<button onClick={() => onRemove(item)}>Remove</button>
						<button onClick={() => onUse(item)}>Use</button>
					</li>)
				})
			}
		</ul>
	)

}

const DeadlineAddForm = ({ onAdd }: { onAdd: DeadlineAddFunction }) => {
	const [deadlineItem, setDeadLineItem] = useState<Deadline>({
		name: "",
		deadline: "10:00"
	})

	const handleTimePickerChange = (value: TimePickerValue) => {
		if (value instanceof Date) {
			throw new Error("It should be string");
		}

		setDeadLineItem({
			...deadlineItem, deadline: value
		})
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDeadLineItem({ ...deadlineItem, name: event.target.value })
	}

	return (
		<div>
			<label htmlFor="deadlineName" >Name:</label>
			<input type='text' name="deadlineName" value={deadlineItem.name} onChange={handleNameChange} />
			<TimePicker onChange={handleTimePickerChange} value={deadlineItem.deadline} />
			<button onClick={() => onAdd(deadlineItem)}>Add</button>
		</div>
	)

}


function updateDate(setCurrentDate: React.Dispatch<React.SetStateAction<Date>>) {
	return () => {
		let id = setInterval(function () {
			setCurrentDate(new Date());
		}, 60000);

		return () => clearInterval(id)
	}

}

function getDateTime(date: Date) {
	return date.getHours() + ":" + date.getMinutes();
};

function getDateObjectFromDatetime(datetimeStr: string) {
	const currentDate = new Date();
	const tempDate = new Date();
	const [hour, minute] = datetimeStr.split(':');

	const hourNumber = parseInt(hour);
	const minuteNumber = parseInt(minute);
	tempDate.setHours(hourNumber);
	tempDate.setMinutes(minuteNumber);

	if (tempDate < currentDate) {
		tempDate.setDate(tempDate.getDate() + 1);
	}

	return tempDate;
}


async function speakRemainingTime(remainingMinutes: number) {
	const text = REMAINING_TEXT.replace("REMAINING", remainingMinutes.toString());
	await speak(text);

}


async function speakLastETA(lastETA: ETADateInformation) {
	const text = LAST_ETA.replace("NAME", lastETA.name);
	await speak(text);

}


function substractMinutes(date1: Date, date2: Date) {
	return Math.floor((date1.getTime() - date2.getTime()) / 60000);
}

function getValidFormattedEtaList(etaList: ETADateInformation[], currentDeadline: Date) {
	const tempList = etaList.filter((item: ETADateInformation) => {
		const diff = substractMinutes(item.eta, currentDeadline);
		return diff <= 0;
	});
	return tempList;
}

export default CountDown;