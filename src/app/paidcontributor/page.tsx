"use client";
export default function BecomeSeller() {
  console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  const start = async () => {
    const r1 = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}stripe/create-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "abc123", email: "seller@email.com" }),
    });
    const { url } = await r1.json();
    console.log(url)
    window.location.href = url;
  };

  return <button onClick={start}>Start Seller Onboarding</button>;
}
