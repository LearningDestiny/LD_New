import Events from '../../components/ui/Events'
import React from 'react'
import { Header } from '../../components/landing-page'
import EventDetail from '../../enrollpages/EventsDetails'

export async function generateMetadata() {
  return {
    title: "Events",
    description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
    openGraph: {
      title: "Events - Learning Destiny",
      description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
      url: "https://learningdestiny.in/Events",
      images: [
        {
          url: "https://learningdestiny.in/HomeBG.png",
          width: 1200,
          height: 630,
          alt: "Events Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Events - Learning Destiny",
      description: "Get in touch with us at Learning Destiny. We'd love to hear from you!",
      images: ["https://learningdestiny.in/HomeBG.png"],
    },
  };
}

const page = () => {
  return (
    <>
    <Header/>
    <Events/>
    <EventDetail/>
 

   
    
    </>
  )
}

export default page