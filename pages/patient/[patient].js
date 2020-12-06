import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { useState } from 'react';

export default function Patient() {
  const router = useRouter();
  const { patient } = router.query;
  const [message, setMessage] = useState('');

  // get health info based on patient name
  const { data, error } = useSWR(`/api/patient/${patient}/healthInfo`, async function (args) {
    const res = await fetch(args);

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }

    return res.json();
  });

  if (error) {
    return <h1>You are not meant to be looking at this.</h1>;
  }
  if (!data) return <h1>Loading...</h1>;
  if (data.patient) {
    console.log(data.messages);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/patient/${data.patient.name}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.patient.id,
        message: message,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          console.log(data.error);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, { expires: 2 });
          Router.push('/');
        }
      });
  };

  return (
    <>
      <h1>Hello {patient}</h1>
      <h3>You are suffering from: </h3>
      <ul>
        {data?.patient?.health_conditions?.split(',').map((condition, index) => {
          return <li key={index}>{condition}</li>;
        })}
      </ul>
      <h3>Send a message to your doctor</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea name='message' onChange={(e) => setMessage(e.target.value)} value={message} rows='4' cols='50'>
            {message}
          </textarea>
          <button type='submit' style={{ display: 'block' }}>
            Send
          </button>
        </div>
      </form>
      <h3>What you've sent: </h3>
      <div>
        <ul>
          {' '}
          {data.messages?.map((msg) => (
            <li>{msg.message}</li>
          ))}{' '}
        </ul>
      </div>
    </>
  );
}
