import axios from 'axios';

const login = async (email: string, password: string) => {
  console.log(email, password);
  try {
    const result = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

const formTag = document.querySelector('.form')!;

formTag.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  const passwordTag = document.getElementById('password') as HTMLInputElement;
  const emailTag = document.getElementById('email') as HTMLInputElement;
  if (passwordTag && emailTag) {
    console.log('tag is exists')
    const email = emailTag.value;
    const password = passwordTag.value;
    login(email, password);
  }
  // Your code here
});
