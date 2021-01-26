const Assets = {
  ELEMENTS: 'elements',
  VDRS: 'vdrs',
  FORMULAS: 'formulas',
};

const ArtifactStatus = {
  CREATED: 'created',
  INPROGRESS: 'inprogress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

const JobType = {
  EXPORT: 'export',
  IMPORT: 'import',
  PROMOTE_EXPORT: 'promote_export',
  PROMOTE_IMPORT: 'promote_import',
};

module.exports = {
  Assets,
  ArtifactStatus,
  JobType,
};
