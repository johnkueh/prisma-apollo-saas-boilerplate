import * as yup from 'yup';

export default yup.object().shape({
  name: yup.string().min(1, 'Team name must be at least 1 character')
});
