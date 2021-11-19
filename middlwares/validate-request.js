const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Errore in scrittura Ricontrolla i tuoi Dati" });
  }
  next();
};

module.exports = { validateRequest };
