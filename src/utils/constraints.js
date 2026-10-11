import { Landmark, Smartphone } from "lucide-react";

// If you already have utils/constants.js, copy these exports into it.

export const PAYMENT_METHODS = [
  { value: "mobile_money", label: "Mobile Money", Icon: Smartphone },
  { value: "bank_transfer", label: "Bank Transfer", Icon: Landmark },
];

export const MIN_GOAL_AMOUNT = 1000; // UGX
export const MIN_DEPOSIT_AMOUNT = 1000; // UGX