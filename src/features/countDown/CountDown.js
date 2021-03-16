import { sortBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocalStorageState, speak, startPlayAudio } from "../../util";
import TimePicker from 'react-time-picker';

const REMAINING_TEXT = "仲翻REMAINING分鐘";
const LAST_ETA="依家最遲搭島係NAME";

function CountDown() {

  const [deadlines, setDeadlines] = useLocalStorageState('deadlines', []);
  const [currentDeadline, setCurrentDeadline] = useState(null);

  const handleDeadlineAdd = (newItem) => {
    setDeadlines(deadlines.concat(newItem));
  }

  const hadleDeadlineRemove = (item) => {
    setDeadlines(deadlines.filter((t) => (t !== item)));
  }

  const handleDeadlineChosen = (item) => {
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

const DeadlineCountDown = ({ currentDeadline }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const etaList = useSelector(state => state.transportation.etaList)

  useEffect(updateDate(setCurrentDate), []);



  const formattedETAList = useMemo(() => {
    if (currentDeadline === null) {
      return [];
    }
    const deadlineDateObj = getDateObjectFromDatetime(currentDeadline.deadline);
    let formattedETAList = getValidFormattedEtaList(etaList, deadlineDateObj);
    formattedETAList = sortBy(formattedETAList, 'eta');
    return formattedETAList;
  }, [etaList, currentDeadline]);


  const lastValidETA = formattedETAList.length > 0 ? formattedETAList[formattedETAList.length - 1] : null;




  let remainingMinutes = null;
  if (lastValidETA !== null) {
    remainingMinutes = substractMinutes(lastValidETA.eta, currentDate);
  }

  useEffect(()=>{
    if (remainingMinutes !== null){
      speakRemainingTime(remainingMinutes);
    }
  }, [remainingMinutes]);

  useEffect(()=>{
    if (lastValidETA !== null){
      speakLastETA(lastValidETA);
    }
  }, [lastValidETA]);
  
  if (currentDeadline === null) {
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

const DeadlineList = ({ deadlines, onRemove, onUse }) => {

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

const DeadlineAddForm = ({ onAdd }) => {
  const [deadlineItem, setDeadLineItem] = useState({
    name: "",
    deadline: "10:00"
  })

  const handleTimePickerChange = (value) => {
    setDeadLineItem({
      ...deadlineItem, deadline: value
    })
  };

  const handleNameChange = (event) => {
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


function updateDate(setCurrentDate) {
  return () => {
    let id = setInterval(function () {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(id)
  }

}

function getDateTime(date) {
  return date.getHours() + ":" + date.getMinutes();
};

function getDateObjectFromDatetime(datetimeStr) {
  const currentDate = new Date();
  const tempDate = new Date();
  const [hour, minute] = datetimeStr.split(':');
  tempDate.setHours(hour);
  tempDate.setMinutes(minute);

  if (tempDate < currentDate) {
    tempDate.setDate(tempDate.getDate() + 1);
  }

  return tempDate;
}


async function speakRemainingTime(remainingMinutes){
  const text = REMAINING_TEXT.replace("REMAINING", remainingMinutes);
  await speak(text);

}


async function speakLastETA(lastETA){
  const text = LAST_ETA.replace("NAME", lastETA.name);
  await speak(text);

}


function substractMinutes(date1, date2) {
  return Math.floor((date1 - date2) / 60000);
  // return (date1.get()  - date2.getHours()) * 24 + (date1.getHours()  - date2.getHours()) * 60  +  (date1.getMinutes() - date2.getMinutes())
}

function getValidFormattedEtaList(etaList, currentDeadline) {
  const filteredList = etaList.filter(item => item.eta !== "Invalid DateTime");

  let tempList = filteredList.map((item) => {
    return {
      ...item,
      eta: new Date(item.eta)
    }
  });
  tempList = tempList.filter((item) => {
    const diff = substractMinutes(item.eta, currentDeadline);
    return diff <= 0;
  });
  return tempList;
}

export default CountDown;