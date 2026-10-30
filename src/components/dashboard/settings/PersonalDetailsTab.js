"use client";
import { useState } from "react";
import Field from "./Field";

const SKILLS = ["Illustrator", "Photoshop", "CSS", "HTML", "Javascript", "Python", "PHP"];

const empty = {
  firstName: "", lastName: "", phone: "", email: "", joiningDate: "",
  skills: [], designation: "", website: "", city: "", country: "",
  zipCode: "", description: "",
};

export default function PersonalDetailsTab({ user, onSave }) {
  const [form, setForm] = useState({ ...empty, ...user });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSkills = (e) =>
    setForm({
      ...form,
      skills: Array.from(e.target.selectedOptions, (o) => o.value),
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  const handleCancel = () => setForm({ ...empty, ...user });

  const shared = (name) => ({ id: name, name, value: form[name], onChange: handleChange });

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <Field label="First Name" placeholder="Enter your first name" {...shared("firstName")} />
        <Field label="Last Name" placeholder="Enter your last name" {...shared("lastName")} />
        <Field label="Phone Number" placeholder="Enter your phone number" {...shared("phone")} />
        <Field label="Email Address" type="email" placeholder="Enter your email" {...shared("email")} />
        <Field label="Joining Date" type="date" col={12} {...shared("joiningDate")} />

        <div className="col-lg-12">
          <div className="mb-3">
            <label htmlFor="skills" className="form-label">Skills</label>
            <select
              id="skills"
              name="skills"
              className="form-control"
              multiple
              value={form.skills}
              onChange={handleSkills}
            >
              {SKILLS.map((s) => (
                <option key={s} value={s.toLowerCase()}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <Field label="Designation" placeholder="Designation" {...shared("designation")} />
        <Field label="Website" placeholder="www.example.com" {...shared("website")} />
        <Field label="City" col={4} placeholder="City" {...shared("city")} />
        <Field label="Country" col={4} placeholder="Country" {...shared("country")} />
        <Field label="Zip Code" col={4} minLength={5} maxLength={6} placeholder="Enter zipcode" {...shared("zipCode")} />

        <div className="col-lg-12">
          <div className="mb-3 pb-2">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter your description"
              {...shared("description")}
            />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="hstack gap-2 justify-content-end">
            <button type="submit" className="btn btn-primary">Update</button>
            <button type="button" className="btn btn-soft-success" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}