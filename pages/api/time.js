// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "../../utils/supabase";

export default async function handler(req, res) {
  console.time("supabase req timer");

  var response = await supabase.from("donations").select().limit(250);
  console.timeEnd("supabase req timer");
  res.status(200).json(response);
}
