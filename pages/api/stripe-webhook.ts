import type { NextApiRequest, NextApiResponse } from "next";

// Stripe is no longer used in this project. Keep the endpoint as a
// harmless no-op that returns 200 so any incoming webhook requests
// won't cause retries or build-time errors.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    received: true,
    message: "Stripe webhooks are disabled — using mock payment system.",
  });
}
