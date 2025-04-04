'use client'
import Events from '../../../components/ui/Events';
import EventDetails from '../../../enrollpages/EventsDetails';
import React, { useEffect, useState } from 'react';
import Loader from '../../../components/ui/loader';

const Page = ({ params }) => {
  const { id } = params;
  const [event, setEvent] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`); // Call API route
        if (!res.ok) throw new Error('Failed to fetch event');
        const data = await res.json();
        setEvent(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // useEffect(() => {
  //   const fetchEvent = async () => {
  //     try {
  //       const res = await fetch(`/api/events/${id}`); // Call API route
  //       if (!res.ok) throw new Error('Failed to fetch event');
  //       const data = await res.json();
  //       setEvent(data);
  //     } catch (error) {
  //       console.error('Error fetching event:', error);
  //     }
  //   };

  //   if (id) {
  //     fetchEvent();
  //   }
  // }, [id]);

  if (!id) {
    return <div>Error: Event ID not found</div>;
  }

  if (loading) {
    return <Loader />;
  } 


  return (
    <>

      <EventDetails id={id} eventDetails={event} />
    </>
  );
};

export default Page;
