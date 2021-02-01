const EventEmitter = require('events');

let emitter;

/* istanbul ignore next */
const singleton = () => {
  if (!emitter) {
    emitter = new EventEmitter();
  }
  return emitter;
};

const EventTopic = {
  ASSET_STATUS: 'ASSET_STATUS',
  JOB_CREATED: 'JOB_CREATED',
  JOB_CANCELLED_SERVICE: 'JOB_CANCELLED_SERVICE',
  PROMOTE_JOB_STATUS_UPDATE: 'PROMOTE_JOB_STATUS_UPDATE',
};

module.exports = {
  emitter: singleton(),
  EventTopic,
};
