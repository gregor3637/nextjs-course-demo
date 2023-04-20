// /api/new-meetup
//POST /api/new-meetup

import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body; //the data of the incomming request

    const client = await MongoClient.connect(
      `mongodb+srv://user_nextjs:user_nextjs@fb-alike.nx1cb1o.mongodb.net/?retryWrites=true&w=majority`
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");
    const result = await meetupsCollection.insertOne(data);

    client.close();
    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
