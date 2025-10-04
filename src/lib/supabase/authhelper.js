import { createClient } from "./client";

export const syncUserToBackend = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const token = (await supabase.auth.getSession()).data.session?.access_token;
  // Send to backend
  await fetch(`http://localhost:5000/auth/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
      provider: user.app_metadata.provider,
    }),
  });

  return user;
};
