"use client";
import React, { useEffect, useState } from "react";

function initials(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ProfileView() {
  const [fullName, setFullName] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

    useEffect(() => {
      fetch('/api/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.full_name) setFullName(data.full_name);
          if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        })
        .catch(() => {});
    }, []);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/me/avatar", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) setError(data?.error ?? "Upload failed");
      else setAvatarUrl(data.avatar_url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // let the same file be picked again after an error
    }
  }

  return (
    <div className="card mt-n5">
      <div className="card-body p-4">
        <div className="text-center">
          <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                alt=""
              />
            ) : (
              <div className="avatar-xl">
                <span className="avatar-title rounded-circle bg-primary-subtle text-primary fs-24">
                  {initials(fullName)}
                </span>
              </div>
            )}
            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
              <input
                id="profile-img-file-input"
                type="file"
                className="profile-img-file-input"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={handleFileChange}
              />
              <label
                htmlFor="profile-img-file-input"
                className="profile-photo-edit avatar-xs"
              >
                <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                  <i className="ri-camera-fill" />
                </span>
              </label>
            </div>
          </div>
          <h5 className="fs-16 mb-1">{fullName || "Anna Adame"}</h5>
          <p className="text-muted mb-0">Lead Designer / Developer</p>
          {uploading && <p className="text-muted mt-2 mb-0">Uploading...</p>}
          {error && <p className="text-danger mt-2 mb-0">{error}</p>}
        </div>
      </div>
    </div>
  );
}
