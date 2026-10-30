"use client";
import { useState } from "react";

const defaultSessions = [
  { id: 1, icon: "ri-smartphone-line", device: "iPhone 12 Pro", info: "Los Angeles, United States - March 16 at 2:47PM" },
  { id: 2, icon: "ri-tablet-line", device: "Apple iPad Pro", info: "Washington, United States - November 06 at 10:43AM" },
  { id: 3, icon: "ri-smartphone-line", device: "Galaxy S21 Ultra 5G", info: "Connecticut, United States - June 12 at 3:24PM" },
  { id: 4, icon: "ri-macbook-line", device: "Dell Inspiron 14", info: "Phoenix, United States - July 26 at 8:10AM" },
];

export default function ChangePasswordTab({ sessions = defaultSessions, onChangePassword, onLogout, onLogoutAll }) {
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

      <div className="mt-4 mb-3 border-bottom pb-2">
        <div className="float-end">
          <button type="button" className="btn btn-link link-primary p-0" onClick={onLogoutAll}>
            All Logout
          </button>
        </div>
        <h5 className="card-title">Login History</h5>
      </div>

      {sessions.map((s) => (
        <div className="d-flex align-items-center mb-3" key={s.id}>
          <div className="flex-shrink-0 avatar-sm">
            <div className="avatar-title bg-light text-primary rounded-3 fs-18">
              <i className={s.icon} />
            </div>
          </div>
          <div className="flex-grow-1 ms-3">
            <h6>{s.device}</h6>
            <p className="text-muted mb-0">{s.info}</p>
          </div>
          <button type="button" className="btn btn-link p-0" onClick={() => onLogout?.(s.id)}>
            Logout
          </button>
        </div>
      ))}
    </>
  );
}