import React from 'react';
import CountDown from './features/countDown/CountDown';
import Transportation from './features/transportation/Transportation';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import DeadlineView from './features/deadline/Deadline';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    backgroundColor: '#f5f5f5',
    height: '100%'
  },
  paper: {
    // padding: theme.spacing(1),
    textAlign: 'center',
  },
}));
function App() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Grid container spacing={2} justify='center' >
        <Grid item xs={12} sm={6}>
          <Grid container justify='center' direction='column' >
            <Grid item xs={12}>
              <Paper className={styles.paper}>
                <CountDown />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={styles.paper}>
                <Transportation providerNames={"hi"}></Transportation>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper className={styles.paper} >
            <DeadlineView />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
