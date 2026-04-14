function decidePipelineContext({ hasTranscript = false, hasDoctorReview = false }) {
  return {
    mode: hasDoctorReview ? "review" : "extraction",
    hasTranscript
  };
}

module.exports = {
  decidePipelineContext
};
