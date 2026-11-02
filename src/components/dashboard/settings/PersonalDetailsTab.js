"use client";
import { useState } from "react";
import Field from "./Field";

const empty = { full_name: "", phone: "", city: "", country: "" };

export default function PersonalDetailsTab({ user, onSave }) {
  const [form, setForm] = useState({ ...empty, ...user });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { full_name, phone, city, country } = form;
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, phone, city, country }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Profile updated");
      onSave?.(form);
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Something went wrong");
    }
  };

  const handleCancel = () => setForm({ ...empty, ...user });

  const shared = (name) => ({
    id: name,
    name,
    value: form[name] ?? "",
    onChange: handleChange,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <Field label="Full Name" placeholder={"full_name"} {...shared("full_name")} />
        <Field label="Phone Number" placeholder="Enter your phone number" {...shared("phone")} />
        <Field label="Email Address" type="email" placeholder="Enter your email" {...shared("email")} />

        <Field label="City" col={4} placeholder="City" {...shared("city")} />
        <Field label="Country" col={4} placeholder="Country" {...shared("country")} />

        <div className="col-lg-12">
          {message && <p className="mb-2">{message}</p>}
          <div className="hstack gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Updating..." : "Update"}
            </button>
            <button type="button" className="btn btn-soft-success" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}