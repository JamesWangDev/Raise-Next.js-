export const config = {
  runtime: "edge",
};

export default function handler(req) {
  return Response.json({
    random: Math.random(),
  });
}
