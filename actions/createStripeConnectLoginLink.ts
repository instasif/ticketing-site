"use server";

import { stripe } from "@/lib/stripe";

export async function createStripeConnectLoginLink(stripeConnectId: string) {
  if (!stripeConnectId) {
    throw new Error("No stripe account ID provided");
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(stripeConnectId);
    return loginLink;
  } catch (error) {
    console.error("Error creating stripe connect login link: ", error);
    throw new Error("Failed to create Stripe connect login link");
  }
}
