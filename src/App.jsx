import Form from 'react-bootstrap/Form';
import { CiHeart } from 'react-icons/ci';

function App() {
  return (
    <>
      <CiHeart />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          console.log(formData.get('name'));
        }}
      >
        <Form.Label htmlFor='inputPassword5'>Password</Form.Label>
        <Form.Control type='password' id='inputPassword5' aria-describedby='passwordHelpBlock' />
        <Form.Text id='passwordHelpBlock' muted>
          Your password must be 8-20 characters long, contain letters and numbers, and must not
          contain spaces, special characters, or emoji.
        </Form.Text>
      </Form>
    </>
  );
}

export default App;
