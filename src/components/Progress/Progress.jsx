import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    // -webkit-transform: translate(-50%, -50%);
    // transform: translate(-50%, -50%);
  }
});

function Progress(props) {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <CircularProgress size={100} className={classes.progress} />
      {/* <CircularProgress className={classes.progress} color="secondary" /> */}
    </div>
  );
}

Progress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Progress);