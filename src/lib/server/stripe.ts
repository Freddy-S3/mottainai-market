import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// The single config point for payments. No real key is committed anywhere in
// this repo - set STRIPE_SECRET_KEY in the deployment environment (or a local
// .env, which is gitignored) before going live. See .env.example.
const PLACEHOLDER = 'sk_test_PLACEHOLDER_REPLACE_ME';

const key = env.STRIPE_SECRET_KEY ?? PLACEHOLDER;

export const STRIPE_IS_CONFIGURED = key !== PLACEHOLDER && key.length > 0;

export const stripe = new Stripe(key, { apiVersion: '2024-06-20' });
