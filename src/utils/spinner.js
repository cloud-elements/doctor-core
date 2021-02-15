const {Spinner} = require('cli-spinner');

const spinner = new Spinner().setSpinnerString(18);

module.exports = {
  setSpinnerString: parm => spinner.setSpinnerString(parm),
  startSpinner: () => spinner.start(),
  stopSpinner: () => spinner.stop(),
};
