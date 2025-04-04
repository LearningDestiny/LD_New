'use client'
import WorkshopDetails from '../../../enrollpages/WorkShopDetails'; // Ensure the path is correct
import Loader from '../../../components/ui/loader';
import React, { useEffect, useState } from 'react';

const Page = ({ params }) => {
  const { id } = params;
  const [workshop, setWorkshop] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await fetch(`/api/workshops/${id}`);// Call API route
        if (!res.ok) throw new Error('Failed to fetch workshop');
        const data = await res.json();
        setWorkshop(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching workshop:', error);
      }
    };

    if (id) {
      fetchWorkshop();
    }
  }, [id]);

 

  if (!id) {
    return <div>Error: Workshop ID not found</div>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <WorkshopDetails id={id} workshopDetails={workshop} />
    </>
  );
};

export default Page;