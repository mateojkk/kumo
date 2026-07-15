export default async function (req: any, res: any) {
  try {
    // Dynamically import the handler to catch module initialization errors
    const module = await import('../apps/api/src/functions/discover.js');
    await module.default(req, res);
  } catch (err: any) {
    console.error("Discover Shim Error:", err);
    res.status(500).json({
      error: "Shim Caught Error",
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    });
  }
}
