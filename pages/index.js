import MeetupList from "../components/meetups/MeetupList";
// import { useState, useEffect } from "react";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";

const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A first meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/26/Altes_Rathaus_in_M%C3%BCnchen_Ostseite.jpg",
    address: "Some address 3, 1213 some city",
    description: "This is a first meetup",
  },
  {
    id: "m2",
    title: "A Second meetup",
    image:
      "https://journeyswithstephen.com/wp-content/uploads/2015/10/Munich-Old-Town-Altstadt.jpg",
    address: "Some address 3, 424 Some city",
    description: "This is a second meetup",
  },
];

function HomePage(props) {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);
  // useEffect(() => {
  //   // send a http request and fetch data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </Fragment>
  );
}

// IT does not run or prereder every time, the data provided at the build is used but using revalidate helps in rendering data in every {value provided} seconds
export async function getStaticProps() {
  // fetch data from an api
  const client = await MongoClient.connect(
    "mongodb+srv://Bhupindersingh:DBbhupinder@cluster0.m07g0.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const result = await meetupCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: result.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

// IT runs for every request and by this the data will never be outdated
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data from an api
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export default HomePage;
