import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Slide, TextField, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import React, { useState } from 'react';
import TimePicker, { TimePickerValue } from 'react-time-picker';
import DateFnsUtils from '@date-io/date-fns';
import { Deadline } from './Deadline';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
type DeadlineAddFunction = (item: Deadline) => void;
// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

const Transition = function Transition(props: any) {
    return <Slide direction="up" {...props} />;
};


const DeadlineAddForm = ({ open, onClose, onAdd }: { open: boolean, onClose: () => void, onAdd: DeadlineAddFunction }) => {
    const [deadlineItem, setDeadLineItem] = useState<Deadline>({
        name: "default",
        deadline: "10:00"
    })

    const handleDateChange = (date:MaterialUiPickersDate ) => {
        if (date === null){
            return;
        }
        setDeadLineItem({...deadlineItem, deadline: convertDatetoTime(date)});
    };
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeadLineItem({ ...deadlineItem, name: event.target.value })
    }
    
    const handleAdd = ()=>{
        onAdd(deadlineItem);
        onClose();
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <DialogTitle>
                Add Deadline
            </DialogTitle>
            <DialogContent>
                <div>
                    <TextField id="deadlineName" label="Name" value={deadlineItem.name} onChange={handleNameChange} />
                </div>
                <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Time picker"
                            value={convertTimetoDate(deadlineItem.deadline)}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>

                <DialogActions>
                    <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )

}

function convertTimetoDate(datetime:string):Date{
    const temp = new Date();
    const [hours, minutes ] = datetime.split(":")
    temp.setHours(parseInt(hours));
    temp.setMinutes(parseInt(minutes));
    return temp;
}

function convertDatetoTime(date:Date){
    return date.getHours()+":"+date.getMinutes()
}



export default DeadlineAddForm;