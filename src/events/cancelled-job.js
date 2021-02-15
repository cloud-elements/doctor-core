let set;

const getIdSet = () => {
  if (!set) set = new Set();
  return set;
};

/* istanbul ignore next */
const addCancelledJobId = (jobId) => {
  const idSet = getIdSet();
  // eslint-disable-next-line no-unused-expressions
  !idSet.has(jobId) && idSet.add(jobId);
  console.log('addCancelledJobId - Content of the Cancelled Job Id Queue', idSet);
};

const isJobCancelled = (jobId) => {
  if (!jobId) {
    return;
  }
  const idSet = getIdSet();
  console.log('isJobCancelled - Content of the Cancelled Job Id Queue', idSet);
  // eslint-disable-next-line consistent-return
  return idSet && idSet.has(jobId);
};

/* istanbul ignore next */
const removeCancelledJobId = (jobId) => {
  const idSet = getIdSet();
  idSet.delete(jobId);
  console.log('removeCancelledJobId - Content of the Cancelled Job Id Queue', idSet);
};

module.exports = {
  addCancelledJobId,
  isJobCancelled,
  removeCancelledJobId,
};
