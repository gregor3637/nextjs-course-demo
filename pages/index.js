import Head from "next/head";
import { MongoClient } from "mongodb";
import React, { useEffect, useState } from "react";

import MeetupList from "../components/meetups/MeetupList";
import Layout from "../components/layout/Layout";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
};

// export async function getServerSideProps(context) {
//   //if you need access to the `req` object (this is not available in `getStaticProps`)
//   //or you really have data that changes multiple times every second and then
//   // even 'getStaticProps`revaluete' wont help you

//   const req = context.req;
//   const res = context.res;
//   //fetch data from API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  const client = await MongoClient.connect(
    `mongodb+srv://user_nextjs:user_nextjs@fb-alike.nx1cb1o.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((x) => ({
        title: x.title,
        address: x.address,
        image: x.image,
        id: x._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
