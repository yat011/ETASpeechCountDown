import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ETADateInformation } from '../transportation/provider/Provider';
import { selectETAList } from '../transportation/transportationSlice';
import { selectCurrentDeadline } from '../deadline/deadlineSlice';
import { Deadline } from '../deadline/Deadline';
import { speak } from '../../util';
import { makeStyles, Paper, Typography } from '@material-ui/core';


const REMAINING_TEXT = "仲翻REMAINING分鐘";
const LAST_ETA = "依家最遲搭島係NAME";

const useStyles = makeStyles({
	countDown: {
		'font-size': '20rem',
	}
});

function CountDown() {

	const currentDeadline = useSelector(selectCurrentDeadline);
	const etaList = useSelector(selectETAList);
	const etaBeforeDeadline = getSortedETABeforeDeadline(etaList, currentDeadline);
	const lastValidETA = getLastETA(etaBeforeDeadline);

	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	useEffect(updateDate(setCurrentDate), []);
	const remainingMinutes = getRemainingMiutes(lastValidETA, currentDate);

	useEffect(() => {
		speakRemainingTime(remainingMinutes);
	}, [remainingMinutes]);
	useEffect(() => {
		speakLastETA(lastValidETA);
	}, [lastValidETA]);


	return (
		<Paper>
			<CountDownView remainingMinutes={remainingMinutes} />
		</Paper>
	);


}

const CountDownView = ({ remainingMinutes }: { remainingMinutes: number | null }) => {
	const styles = useStyles();
	if (remainingMinutes === null) {
		return (
			<div className={styles.countDown}>
				{/* <Typography  variant="h1" > */}
					00
				{/* </Typography> */}
			</div>
		)
	}

	return (
		<div className={styles.countDown}>
			{/* <Typography> */}
			{remainingMinutes}
			{/* </Typography> */}
		</div>
	)
}


function getSortedETABeforeDeadline(etaList: ETADateInformation[], deadline: Deadline | null) {
	if (!deadline) {
		return [];
	}
	const deadlineDateObj = getDateObjectFromDatetime(deadline.deadline);
	let formattedETAList = getValidFormattedEtaList(etaList, deadlineDateObj);
	formattedETAList = sortBy(formattedETAList, 'eta');
	return formattedETAList;

}

function getLastETA(etaBeforeDeadline: ETADateInformation[]) {
	return etaBeforeDeadline.length > 0 ? etaBeforeDeadline[etaBeforeDeadline.length - 1] : null;
}

function getRemainingMiutes(lastValidETA: ETADateInformation | null, currentDate: Date) {
	if (lastValidETA === null) {
		return null;
	}
	return substractMinutes(lastValidETA.eta, currentDate);
}

function updateDate(setCurrentDate: React.Dispatch<React.SetStateAction<Date>>) {
	return () => {
		let id = setInterval(function () {
			setCurrentDate(new Date());
		}, 60000);

		return () => clearInterval(id)
	}

}

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


async function speakRemainingTime(remainingMinutes: number | null) {
	if (remainingMinutes === null) {
		return;
	}
	const text = REMAINING_TEXT.replace("REMAINING", remainingMinutes.toString());
	await speak(text);

}


async function speakLastETA(lastETA: ETADateInformation | null) {
	if (lastETA === null) {
		return;
	}
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