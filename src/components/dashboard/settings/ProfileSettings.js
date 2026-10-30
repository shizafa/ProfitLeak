"use client";
import { useState } from "react";
import PersonalDetailsTab from "./PersonalDetailsTab";
import ChangePasswordTab from "./ChangePasswordTab";
import PrivacyTab from "./PrivacyTab";

const tabs = [
  { id: "personal", label: "Personal Details", icon: "fas fa-home", Component: PersonalDetailsTab },
  { id: "password", label: "Change Password", icon: "far fa-user", Component: ChangePasswordTab },
  { id: "privacy", label: "Privacy Policy", icon: "far fa-envelope", Component: PrivacyTab },
];

export default function ProfileSettings({ user }) {
  const [active, setActive] = useState("personal");
  const ActiveTab = tabs.find((t) => t.id === active).Component;

  return (
    <div className="card mt-xxl-n5">
      <div className="card-header">
        <ul className="nav nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
          {tabs.map((t) => (
            <li className="nav-item" key={t.id}>
              <a
                href="#"
                role="tab"
                className={`nav-link ${active === t.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActive(t.id);
                }}
              >
                <i className={t.icon} /> {t.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-body p-4">
        <ActiveTab user={user} />
      </div>
    </div>
  );
}