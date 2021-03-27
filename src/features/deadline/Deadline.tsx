import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TimePicker, { TimePickerValue } from 'react-time-picker';
import { selectDeadlineList, selectCurrentDeadline, updateDeadlineList, updateCurrentDeadline } from './deadlineSlice';

export interface Deadline {
	name: string;
	deadline: string;
}

type DeadlineAddFunction = (item: Deadline) => void;
type DeadlineRemoveFunction = (item: Deadline) => void;
type DeadlineChangeFunction = (item: Deadline) => void;

const DeadlineView = ()=>{
    const deadlines = useSelector(selectDeadlineList);
    const currentDeadline = useSelector(selectCurrentDeadline);
    const dispatch = useDispatch();
	const handleDeadlineAdd = (newItem: Deadline) => {
        dispatch(updateDeadlineList(deadlines.concat(newItem)));
	}

	const hadleDeadlineRemove = (item: Deadline) => {
		dispatch(updateDeadlineList(deadlines.filter((t: Deadline) => (t !== item))));
	}

	const handleDeadlineChosen = (item: Deadline) => {
		// startPlayAudio();
		// setCurrentDeadline(item);
        dispatch(updateCurrentDeadline(item));
	}

    return (
        <div>
        <h1>Deadline List</h1>
        <DeadlineList deadlines={deadlines} onRemove={hadleDeadlineRemove} onUse={handleDeadlineChosen} /> 
        <h1>Add Deadline</h1>
        <DeadlineAddForm onAdd={handleDeadlineAdd} />
        </div>

    )

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


export default DeadlineView;