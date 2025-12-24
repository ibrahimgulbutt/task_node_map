'use client';

import dynamic from 'next/dynamic';

const IonicSetup = dynamic(() => import('./IonicSetup'), {
  ssr: false,
});

export default function ClientIonicSetup() {
  return <IonicSetup />;
}
