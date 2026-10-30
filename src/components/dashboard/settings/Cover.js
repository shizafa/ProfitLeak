export default function Cover() {
  return (
    <div className="position-relative mx-n4 mt-n4">
      <div className="profile-wid-bg profile-setting-img">
        <img
          src="assets/images/profile-bg.jpg"
          className="profile-wid-img"
          alt=""
        />
        <div className="overlay-content">
          <div className="text-end p-3">
            <div className="p-0 ms-auto rounded-circle profile-photo-edit">
              <input
                id="profile-foreground-img-file-input"
                type="file"
                className="profile-foreground-img-file-input"
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
