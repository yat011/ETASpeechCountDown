import { sortBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';


function CountDown() {

  const [deadlines, setDeadlines] = useState((() => { //default TODO
    const tempDate = new Date();
    tempDate.setHours(12);
    tempDate.setMinutes(30);
    return [{
      name: "A",
      deadline: tempDate
    }];
  })());

  const [currentIndex, setCurrentIndex] = useState(0);
  const etaList = useSelector(state => state.transportation.etaList)
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentDeadline = deadlines[currentIndex];

  const formattedETAList = useMemo(() => {
    let formattedETAList = getValidFormattedEtaList(etaList, currentDeadline.deadline);
    formattedETAList = sortBy(formattedETAList, 'eta');
    return formattedETAList;
  }, [etaList, currentDeadline]);

  const lastValidETA = formattedETAList.length > 0 ? formattedETAList[formattedETAList.length - 1] : null;
  let remainingMinutes = null;
  if (lastValidETA != null) {
    remainingMinutes = substractMinutes(lastValidETA.eta, currentDate);
  }

  useEffect(updateDate(setCurrentDate), []);

  return (
    <div>
      <div>Current Deadline: {getDateTime(currentDeadline.deadline)}</div>
      <div>Last Valid: {lastValidETA != null && getDateTime(lastValidETA.eta)}</div>
      <div>Remaining: {remainingMinutes} min</div>
      <hr />
    </div>
  );

}

function updateDate(setCurrentDate){
  return () => {
    let id = setInterval(function (){
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(id)
  }

}

function getDateTime(date) {
  return date.getHours() + ":" + date.getMinutes();
};

function compareDatetime(date1, date2) {
  if (date1.getHours() === date2.getHours()) {
    return date1.getMinutes() - date2.getMinutes();
  } else {
    return date1.getHours() - date2.getHours();
  }
}

function substractMinutes(date1, date2) {
  return Math.floor((date1 - date2) / 60000);
  // return (date1.get()  - date2.getHours()) * 24 + (date1.getHours()  - date2.getHours()) * 60  +  (date1.getMinutes() - date2.getMinutes())
}

function getValidFormattedEtaList(etaList, currentDeadline) {
  console.log("called once")
  const filteredList = etaList.filter(item => item.eta !== "Invalid DateTime");

  let tempList = filteredList.map((item) => {
    return {
      ...item,
      eta: new Date(item.eta)
    }
  });
  tempList = tempList.filter((item) => {
    return compareDatetime(item.eta, currentDeadline) <= 0;
  });
  return tempList;
}

export default CountDown;