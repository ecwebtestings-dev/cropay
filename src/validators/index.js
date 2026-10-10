import { validateName } from "./name";
import { validateEmail } from "./email";
import { validatePassword, validateLoginPassword } from "./password";
import { ValidatePhone } from "./phone";


export { validateName, validateEmail, validatePassword, validateLoginPassword,ValidatePhone };


const removeEmptyErrors =(errors)=> Object.fromEntries(Object.entries(errors).filter(([, message])=> message));

//VALIDATE REGISTER INPUTS
export const validateSignUp = ({ name, phone, email, password }) =>
  removeEmptyErrors({
    name: validateName(name),
    phone: ValidatePhone(phone),
    email: validateEmail(email),
    password: validatePassword(password),   
  });

export const validateLogin = ({ email, password }) =>
  removeEmptyErrors({
    email: validateEmail(email),
    password: validateLoginPassword(password),
  });

