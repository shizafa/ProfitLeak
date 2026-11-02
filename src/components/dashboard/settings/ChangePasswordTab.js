"use client";
import { useState } from "react";

const emptyForm = { oldPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordTab() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side checks (the API checks these too)
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }
    if (form.oldPassword === form.newPassword) {
      setError("New password must be different from the old one.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: form.oldPassword,
          new_password: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data.message || "Password updated successfully.");
      setForm(emptyForm);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { name: "oldPassword", label: "Old Password*", placeholder: "Enter current password", autoComplete: "current-password" },
    { name: "newPassword", label: "New Password*", placeholder: "Enter new password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Confirm Password*", placeholder: "Confirm password", autoComplete: "new-password" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-2">
        {inputs.map((i) => (
          <div className="col-lg-4" key={i.name}>
            <label htmlFor={i.name} className="form-label">{i.label}</label>
            <input
              type="password"
              className="form-control"
              id={i.name}
              name={i.name}
              placeholder={i.placeholder}
              autoComplete={i.autoComplete}
              value={form[i.name]}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        ))}

        {error && <div className="col-lg-12 text-danger">{error}</div>}
        {success && <div className="col-lg-12 text-success">{success}</div>}

        <div className="col-lg-12">
          <div className="mb-3">
            <a href="#" className="link-primary text-decoration-underline">
              Forgot Password?
            </a>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="text-end">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}