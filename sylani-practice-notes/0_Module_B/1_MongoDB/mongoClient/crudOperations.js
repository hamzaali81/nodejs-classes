
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://testuser:password!123@cluster0.07r1b.mongodb.net/testDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connected to MongoDB server')
    const collection = client.db("testDB").collection("myusers");
    // console.log('collection ', collection)

    // // insert
    // const insertId = collection.insertOne({
    //     username: "user1",
    //     password: "pass1",
    // }, function(r) {
    //     console.log('insertId ', r);
    // });

    // // insertMany
    // const insertIds = collection.insertMany([
    //     {
    //         username: "user2",
    //         password: "pass2",
    //     },
    //     {
    //         username: "user3",
    //         password: "pass3",
    //     },
    // ], function(r) {
    //     console.log('insertIds ', insertIds);
    // });

    // // findOne
    // const findUserPromise = collection.findOne({ name: 'test user name' });
    // findUserPromise.then(u => console.log('Prom Then: ', u));
    // collection.findOne({ name: 'test user name' }, (err, u) => {
    //     console.log('u Calllback', u);
    // });

    // // find
    // collection.find({ username: { $ne: null } }, (err, users) => {
    //     users.forEach((item, indx) => {
    //         console.log(indx, item);
    //     });
    // });

    // count
    // collection.count({ username: { $ne: null } }, (err, count) => {
    //     console.log('count ', err, count);
    // });

    // // updateOne
    // const { matchedCount, modifiedCount, upsertedId } = collection.updateOne(
    //     { username: { $ne: null } },
    //     { $set: { username: "USERNAME" } }
    // );

    // // updateMany
    // const { matchedCount, modifiedCount, upsertedId } = collection.updateMany(
    //     { username: { $ne: null } },
    //     { $set: { username: "USERNAME" } }
    // );

    // // deleteOne
    // const deleteCount = collection.deleteOne({ _id: insertId });

    // // deleteMany
    // const deleteCount2 = collection.deleteMany({ username: "test" });

    // closing connection
    setTimeout(() => closeConntion(client), 3000);
});

function closeConntion(client) {
    console.log('closing Conection...')
    client.close();
}
