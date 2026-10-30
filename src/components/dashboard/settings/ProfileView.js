export default function ProfileView() {
  return (
    <div className="card mt-n5">
      <div className="card-body p-4">
        <div className="text-center">
          <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
            <img
              src="assets/images/users/avatar-1.jpg"
              className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
              alt="user-profile-image"
            />
            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
              <input
                id="profile-img-file-input"
                type="file"
                className="profile-img-file-input"
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
          <h5 className="fs-16 mb-1">Anna Adame</h5>
          <p className="text-muted mb-0">Lead Designer / Developer</p>
        </div>
      </div>
    </div>
  );
}
