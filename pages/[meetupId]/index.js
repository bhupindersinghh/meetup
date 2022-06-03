import { MongoClient, ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.MeetupData.title}</title>
        <meta name="description" content={props.MeetupData.description}></meta>
      </Head>
      <MeetupDetail
        img={props.MeetupData.image}
        title={props.MeetupData.title}
        address={props.MeetupData.address}
        description={props.MeetupData.description}
      ></MeetupDetail>
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Bhupindersingh:DBbhupinder@cluster0.m07g0.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const result = await meetupCollection.find({}, { _id: 1 }).toArray();
  client.close();
  return {
    fallback: "blocking",
    paths: result.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for single meetup
  const meetupId = context.params.meetupId;
  console.log(meetupId);
  const client = await MongoClient.connect(
    "mongodb+srv://Bhupindersingh:DBbhupinder@cluster0.m07g0.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupCollection = db.collection("meetups");
  const result = await meetupCollection.findOne({ _id: ObjectId(meetupId) });
  console.log(result);
  client.close();
  return {
    props: {
      MeetupData: {
        id: result._id.toString(),
        title: result.title,
        address: result.address,
        image: result.image,
        description: result.description,
      },
    },
  };
}

export default MeetupDetails;
