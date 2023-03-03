export default async function handler(req, res) {
    console.log("PING");
    res.status(200);
    res.end();
}
