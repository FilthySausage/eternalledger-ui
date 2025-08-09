"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "~~/components/ui/Button";
import { useRoleStore } from "~~/services/store/roleStore";

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole } = useRoleStore();
  const [selected, setSelected] = useState(role ?? "user");

  useEffect(() => {
    if (role) {
      router.replace(role === "hospital" ? "/hospital" : "/user");
    }
  }, [role, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selected as any);
    router.push(selected === "hospital" ? "/hospital" : "/user");
  };

  return (
    <main className="max-w-md mx-auto py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center">Login</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-6 flex flex-col gap-4">
        <label className="form-control w-full">
          <span className="label-text">Select Portal</span>
          <select
            className="select select-bordered"
            value={selected}
            onChange={e => setSelected(e.target.value as "hospital" | "user")}
          >
            <option value="user">User Portal</option>
            <option value="hospital">Hospital Portal</option>
          </select>
        </label>
        <Button type="submit" variant="primary">
          LOG IN
        </Button>
      </form>
    </main>
  );
}
