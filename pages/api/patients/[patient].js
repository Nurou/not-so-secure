import { useRouter } from 'next/router';

export default function Patient() {
  const router = useRouter();
  const { patient } = router.query;
  return <h2>Hello {patient}</h2>;
}
