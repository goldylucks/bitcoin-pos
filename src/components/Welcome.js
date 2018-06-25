import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { paper, magicNumber, loader } from '../styles';
import { getURLparams } from '../utils';
import * as actions from '../actions';

const styles = theme => ({
  paper,
  loader,
  btcInputField: {
    flexBasis: (magicNumber - theme.spacing.unit) * magicNumber * magicNumber
  },
  currencyInputField: {
    flexBasis: (magicNumber + theme.spacing.unit) * magicNumber
  },
  margin: {
    margin: theme.spacing.unit
  },
  inputFields: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

class Welcome extends Component {
  componentDidMount = () => {
    this.props.fetchExchangeRateData();

    const { currency, btcAddress } = getURLparams();
    if (currency) {
      this.props.setCurrency(currency);
    }
    if (btcAddress) {
      this.props.setBTCaddress(btcAddress);
    }
  };

  handleSubmit = () => {
    console.log('handling submit..');
  };

  handleChange = event => {
    const { value, name } = event.target;
    if (name === 'currency') {
      this.props.setCurrency(value);
    } else if (name === 'btcAddress') {
      this.props.setBTCaddress(value);
    }
  };

  render() {
    const {
      classes,
      exchangeRateData,
      btcAddress,
      currency,
      loading
    } = this.props;

    let content;
    if (loading) {
      content = <CircularProgress className={classes.loader} />;
    } else {
      const currencies = Object.keys(exchangeRateData).map(currency => (
        <MenuItem value={currency} key={currency}>
          {currency} ({exchangeRateData[currency].symbol})
        </MenuItem>
      ));
      content = (
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="headline" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="subheading" gutterBottom>
              Quickly and easily generate a QR code to accept the Bitcoin
              equivalent of an amount in the fiat currency of your choice.
            </Typography>
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="headline" gutterBottom>
              Quick setup
            </Typography>
            <Typography variant="body1" gutterBottom>
              All you need to do is set the Bitcoin address you want BTC sent
              to, and what fiat currency you want to use for your sales.
            </Typography>
            <div className={classes.inputFields}>
              <TextField
                label="Your Bitcoin address"
                value={btcAddress}
                name="btcAddress"
                className={`${classes.btcInputField} ${classes.margin}`}
                onChange={this.handleChange}
              />
              <FormControl
                className={`${classes.currencyInputField} ${classes.margin}`}
              >
                <InputLabel htmlFor="currency">Fiat currency</InputLabel>
                <Select
                  value={currency}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'currency',
                    id: 'currency'
                  }}
                >
                  {currencies}
                </Select>
              </FormControl>
            </div>
            <Button
              variant="raised"
              color="primary"
              className={classes.margin}
              disabled={btcAddress === '' || currency === ''}
              onClick={this.generateQRcode}
            >
              Begin
            </Button>
          </Paper>
          <Paper className={classes.paper}>
            <Typography variant="headline" gutterBottom>
              Super fast setup
            </Typography>
            <Typography variant="body1" gutterBottom>
              To avoid having to enter your Bitcoin address everytime here when
              you load this app, you can simply bookmark the next page in your
              browser.
            </Typography>
            <Typography variant="body1" gutterBottom>
              To view a demo of a bookmarked URL in action,{' '}
              <a href="/?currency=USD&btcAddress=1CXxYSYKTxTGhXsECmAQfe4sPkUgaedNmH">
                click here
              </a>.
            </Typography>
          </Paper>
        </Grid>
      );
    }

    return content;
  }
}

const mapStateToProps = ({
  currency,
  btcAddress,
  exchangeRateData,
  loading
}) => {
  return { currency, btcAddress, exchangeRateData, loading };
};

export default connect(mapStateToProps, actions)(withStyles(styles)(Welcome));

// <Typography variant="caption" gutterBottom>
//   format:
//   https://bitcoin-pos.golightlyplus.com/?currency=[currency]&btcAddress=[public
//   address]
// </Typography>
// <Typography variant="body1">Where:</Typography>
// <Typography variant="body1">
//   * currency is an acronym like USD.{' '}
//   <a href="https://blockchain.info/api/exchange_rates_api">
//     View available currencies
//   </a>.
// </Typography>
// <Typography variant="body1" gutterBottom>
//   * public address is your public bitcoin address.
// </Typography>
// <Typography variant="body1">
//   To view a working URL demo,{' '}
//
// </Typography>
// </Paper>
// <Paper className={classes.paper}>
// <Typography variant="headline" gutterBottom>
//   How to use the app
// </Typography>
// <Typography variant="body1" gutterBottom>
//   Simply enter the sale price in your chosen currency, and everything
//   else will be done for you to generate the QR code to allow the buyer
//   to send the bitcoin equivalent amount to your bitcoin address.
// </Typography>
// <TextField
//   label="Your local currency"
//   value={currency}
//   className={classes.inputField}
//   onChange={event =>
//     this.setState({ currency: event.target.value })
//   }
// />
