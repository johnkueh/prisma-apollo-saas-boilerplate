import * as yup from 'yup';
import validate from './validate';

const schema = yup.object().shape({
  name: yup.string().min(1, 'Team name must be at least 1 character')
});

export const validateTeam = input => validate({ input, schema });

export default {
  validateTeam
};
