'use client';

import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CountyTable from '@/components/CountyTable';

export interface County {
    id: number;
    countyName: string;
    state: string;
    urlMain: string;
    urlTaxOffice: string;
    urlTaxOther?: string;
    phone?: string;
    email?: string;
    nextAuctionDate?: string | null;
    auctionFormat: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export default function Home() {
  // const [counties, setCounties] = useState<County[]>([]);

  // useEffect(() => {
  //   fetch('/api/counties')
  //     .then((res) => res.json())
  //     .then((data) => setCounties(data));
  // }, []);

  return (
    <div className="container mt-5">
      {/* counties={counties} */}
      <h1>County Tax Auctions</h1>
      <CountyTable/>
    </div>
  );
}