import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';

function Home() {
  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.username) {
    loggedIn = true;
  }
  return (
    <div>
      <Head>
        <title>Welcome to your personal medical app where your personal information is guaranteed to be safe!</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <h1>Medical4You: the safest personal health app out there!</h1>
      {loggedIn && (
        <>
          <p>Welcome {data.username}!</p>
          <div style={{ marginBottom: '1rem' }}>
            <Link href={`/patient/${data.username}`}>Go to your profile</Link>
          </div>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}
          >
            Logout
          </button>
        </>
      )}
      {!loggedIn && (
        <>
          <Link href='/login'>Login</Link>
        </>
      )}
    </div>
  );
}

export default Home;
