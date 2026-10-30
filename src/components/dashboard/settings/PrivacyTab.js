"use client";
import { useState } from "react";

const securityItems = [
  {
    title: "Two-factor Authentication",
    text: "Two-factor authentication is an enhanced security measure. Once enabled, you'll be required to give two types of identification when you log in. Google Authentication and SMS are supported.",
    button: "Enable Two-factor Authentication",
  },
  {
    title: "Secondary Verification",
    text: "The first factor is a password and the second commonly includes a text with a code sent to your smartphone, or biometrics using your fingerprint, face, or retina.",
    button: "Set up secondary method",
  },
  {
    title: "Backup Codes",
    text: "A backup code is automatically generated for you when you turn on two-factor authentication. You can also generate a backup code manually.",
    button: "Generate backup codes",
  },
];

const notificationItems = [
  { key: "direct", label: "Direct messages", text: "Messages from people you follow" },
  { key: "desktop", label: "Show desktop notifications", text: "Choose the option you want as your default setting." },
  { key: "email", label: "Show email notifications", text: "Under Settings, choose Notifications, then pick the account to enable them for." },
  { key: "chat", label: "Show chat notifications", text: "To prevent duplicate mobile notifications, turn off Chat notifications in settings." },
  { key: "purchase", label: "Show purchase notifications", text: "Get real-time purchase alerts to protect yourself from fraudulent charges." },
];

export default function PrivacyTab({ onDeleteAccount }) {
  const [notifications, setNotifications] = useState({
    direct: true, desktop: true, email: false, chat: false, purchase: false,
  });
  const [password, setPassword] = useState("");

  const toggle = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className="mb-4 pb-2">
        <h5 className="card-title text-decoration-underline mb-3">Security:</h5>
        {securityItems.map((item) => (
          <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2" key={item.title}>
            <div className="flex-grow-1">
              <h6 className="fs-14 mb-1">{item.title}</h6>
              <p className="text-muted">{item.text}</p>
            </div>
            <div className="flex-shrink-0 ms-sm-3">
              <button type="button" className="btn btn-sm btn-primary">{item.button}</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <h5 className="card-title text-decoration-underline mb-3">Application Notifications:</h5>
        <ul className="list-unstyled mb-0">
          {notificationItems.map((n) => (
            <li className="d-flex mt-2" key={n.key}>
              <div className="flex-grow-1">
                <label htmlFor={n.key} className="form-check-label fs-14">{n.label}</label>
                <p className="text-muted">{n.text}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id={n.key}
                    checked={notifications[n.key]}
                    onChange={() => toggle(n.key)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="card-title text-decoration-underline mb-3">Delete This Account:</h5>
        <p className="text-muted">
          Enter your password to confirm. This action can't be undone.
        </p>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          style={{ maxWidth: 265 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="hstack gap-2 mt-3">
          <button
            type="button"
            className="btn btn-soft-danger"
            disabled={!password}
            onClick={() => onDeleteAccount?.(password)}
          >
            Close &amp; Delete This Account
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPassword("")}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}