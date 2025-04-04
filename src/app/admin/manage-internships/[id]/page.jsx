// pages/event/[id].js
'use client';
import InternshipDetails from '../../../../enrollpages/Intenshipdetail';
import React from 'react';
import Loader  from "../../../../components/ui/loader";

const Page = ({ params }) => {
  const { id } = params;
  const [loading,setLoading] = React.useState(true);
  const [internship, setInternship] = React.useState(null);
  React.useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await fetch(`/api/internships/${id}`); // Call API route
        if (!res.ok) throw new Error('Failed to fetch internship');
        const data = await res.json();
        setInternship(data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching internship:', error);
      }
    };

    if (id) {
      fetchInternship();
    }
  }, [id]);

  if (!id) {
    return <div>Error: Internship ID not found</div>;
  }
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <InternshipDetails id={id} InternshipDetails={internship}/>
    </>
  );
};

export default Page;
