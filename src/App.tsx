import React from 'react';
import CountDown from './features/countDown/CountDown';
import Transportation from './features/transportation/Transportation';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import DeadlineView from './features/deadline/Deadline';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(2),
    height: '100%',
    textAlign: 'center'
  }
}));


function App() {
  const styles = useStyles();
  return (
    <div className={styles.root}>

      <Grid container spacing={2} justify='center' >
        <Grid item xs={12}>
          <CountDown />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Transportation providerNames={""}></Transportation>
            </Grid>
            <Grid item xs={12} md={4}>
              <DeadlineView />
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
