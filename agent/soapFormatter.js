function formatToSoap(medicalEntities) {
  return medicalEntities?.soap || {
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  };
}

module.exports = {
  formatToSoap
};
