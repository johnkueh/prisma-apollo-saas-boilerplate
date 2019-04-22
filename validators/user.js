import * as yup from 'yup';
import validate from './validate';

const schema = yup.object().shape({
  firstName: yup
    .string()
    .label('First name')
    .min(1)
    .max(15),
  lastName: yup
    .string()
    .label('Last name')
    .min(1)
    .max(15),
  email: yup
    .string()
    .email()
    .min(1),
  password: yup.string().min(6)
});

export const validateUser = input => validate({ input, schema });

export default {
  validateUser
};
