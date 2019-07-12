const register_form_template = [
  {
    id: 'username',
    type: 'text',
    label: 'Username',
    required: true
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    required: true
  },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    required: true
  },
  {
    id: 'passwordConf',
    type: 'password',
    label: 'Password Confirmation',
    required: true
  },
  {
    id: 'submit',
    type: 'submit',
    label: 'Sign In'
  }
];
export default register_form_template;
