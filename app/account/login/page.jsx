"use client";

import { useEffect } from "react";

const SHOPIFY_ACCOUNTS_URL = "https://accounts.setpiecesclothing.com";

export default function LoginPage() {
  useEffect(() => {
    window.location.replace(SHOPIFY_ACCOUNTS_URL);
  }, []);

  return null;
}
