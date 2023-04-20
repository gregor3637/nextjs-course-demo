import Head from "next/head";
import React from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  // this func is used only when the page is dynamic (it is [id] or [...slug])
  //and it ONLY uses `getStaticProps` (not if you are using getServerSideProps and not when you are not using `getStaticPaths`)

  const client = await MongoClient.connect(
    `mongodb+srv://user_nextjs:user_nextjs@fb-alike.nx1cb1o.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    //tells whether your paths contains all supported parameters values or just some of them
    //which means that if the user enters anything tha is not in supported in the `paths` array
    //(for example `m3`) the user will see a 404 error
    //if `falback: true` -> nextJS will try to generate a page for the new params dynamically on the server
    //for the incoming request.
    //so `fallback` allows us to pre-generate some of the pages (the most visited ones) and pre-generate
    //the missing ones dinamically when request for them are comming in
    // paths: [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
    paths: meetups.map((x) => ({
      params: { meetupId: x._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    `mongodb+srv://user_nextjs:user_nextjs@fb-alike.nx1cb1o.mongodb.net/?retryWrites=true&w=majority`
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
