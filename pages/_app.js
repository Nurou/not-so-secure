function MyApp({ Component, pageProps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '3rem' }}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
