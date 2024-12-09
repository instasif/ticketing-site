 const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `http//${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

export default baseUrl;