import { Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Paper, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startPlayAudio } from '../../util';
import { selectDeadlineList, updateCurrentDeadline, updateDeadlineList } from './deadlineSlice';
import AddIcon from '@material-ui/icons/Add';
import DeadlineAddForm from './DeadlineAddForm';
export interface Deadline {
    name: string;
    deadline: string;
}


type DeadlineRemoveFunction = (item: Deadline) => void;
type DeadlineChangeFunction = (item: Deadline) => void;

const useStyles = makeStyles((theme) => (
    {
        addDiv: {
            padding: theme.spacing(0.5),
            textAlign: 'right'
        }
    }
));

const DeadlineView = () => {
    const styles = useStyles()
    const deadlines = useSelector(selectDeadlineList);
    const [isFormOpen, setFormOpen] = useState(false);

    const dispatch = useDispatch();
    const handleDeadlineAdd = (newItem: Deadline) => {
        dispatch(updateDeadlineList(deadlines.concat(newItem)));
    }

    const hadleDeadlineRemove = (item: Deadline) => {
        dispatch(updateDeadlineList(deadlines.filter((t: Deadline) => (t !== item))));
    }

    const handleDeadlineChosen = (item: Deadline) => {
        startPlayAudio();
        dispatch(updateCurrentDeadline(item));
    }

    const handleDeadlineAddFormClose = () => {
        setFormOpen(false);
    }

    return (
        <Paper>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom>
                        Deadline
                   </Typography>
                </Grid>
                <Grid item xs={12}>
                    <DeadlineList deadlines={deadlines} onRemove={hadleDeadlineRemove} onUse={handleDeadlineChosen} />
                </Grid>
                <Grid item xs={12} className={styles.addDiv}>
                    <IconButton color="primary" data-testid="openAddForm" onClick={() => { setFormOpen(true) }}>
                        <AddIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <DeadlineAddForm open={isFormOpen} onClose={handleDeadlineAddFormClose} onAdd={handleDeadlineAdd} />
                </Grid>
            </Grid>
        </Paper>

    )

}


const DeadlineList = ({ deadlines, onRemove, onUse }: { deadlines: Deadline[], onRemove: DeadlineRemoveFunction, onUse: DeadlineChangeFunction }) => {
    return (
        <List>
            {
                deadlines.map((item, index) => {
                    return (
                        <ListItem key={index}>
                            <ListItemText primary={item.deadline} secondary={item.name} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="use" onClick={() => onUse(item)}>
                                    <PlayArrowIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => onRemove(item)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                })
            }
        </List>

    )

}


export default DeadlineView;