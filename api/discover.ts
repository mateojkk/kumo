export default async function (req: any, res: any) {
  res.status(200).json({ status: "ok", message: "Shim is alive!" });
}
