function buildReviewState(record) {
  return {
    status: "pending_review",
    approvedByDoctor: false,
    record
  };
}

module.exports = {
  buildReviewState
};
