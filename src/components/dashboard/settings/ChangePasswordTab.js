"use client";
import { useState } from "react";

export default function ChangePasswordTab() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password don't match.");
      return;
    }
    setError("");
    onChangePassword?.(form);
  };

  const inputs = [
    { name: "oldPassword", label: "Old Password*", placeholder: "Enter current password" },
    { name: "newPassword", label: "New Password*", placeholder: "Enter new password" },
    { name: "confirmPassword", label: "Confirm Password*", placeholder: "Confirm password" },
  ];

  return (
    <>
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
                value={form[i.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && <div className="col-lg-12 text-danger">{error}</div>}

          <div className="col-lg-12">
            <div className="mb-3">
              <a href="#" className="link-primary text-decoration-underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="text-end">
              <button type="submit" className="btn btn-success">Change Password</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}