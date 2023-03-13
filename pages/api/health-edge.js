// eslint-disable-next-line no-unused-vars
export const config = {
    runtime: "edge",
};
export default async function handler(req, res) {
    res.status(200);
    res.end();
}
