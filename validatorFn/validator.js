import { body, validationResult } from "express-validator";

export const userValidate = () => {
  return [
    body("email").isEmail().withMessage("Please enter a valid email address."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long."),
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
