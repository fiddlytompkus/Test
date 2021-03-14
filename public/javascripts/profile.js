//post-window or simple modal window for post
var postModalBtn = document.querySelector('.post-input');
var postModal = document.querySelector('.Post-Modal');
var postModalClose = document.querySelector('.closeModalWindow');
postModalBtn.addEventListener('click', () => {
  postModal.style.display = 'block';
  // console.log(postModal);
});
window.onclick = function (event) {
  if (event.target == postModal) {
    postModal.style.display = 'none';
  }
};
postModalClose.addEventListener('click', () => {
  postModal.style.display = 'none';
});

///Post implementation here
// already declared in newsdfeed.js

//navbar
const POST_BTN = document.getElementById('POST_BTN');
const profileContent = document.querySelector('.profile-content');
const aboutUser = document.querySelector('.about-user');
const profileFriendSection = document.querySelector('.profile-friend-section');
const profilePhotoSection = document.querySelector('.profile-photo-section');

POST_BTN.addEventListener('click', () => {
  profileContent.style.display = 'block';
  aboutUser.style.display = 'none';
  profileFriendSection.style.display = 'none';
  profilePhotoSection.style.display = 'none';
});
const ABOUT_BTN = document.getElementById('ABOUT_BTN');
ABOUT_BTN.addEventListener('click', () => {
  profileContent.style.display = 'none';
  aboutUser.style.display = 'block';
  profileFriendSection.style.display = 'none';
  profilePhotoSection.style.display = 'none';
});
const FRIENDS_BTN = document.getElementById('FRIENDS_BTN');
FRIENDS_BTN.addEventListener('click', () => {
  profileContent.style.display = 'none';
  aboutUser.style.display = 'none';
  profileFriendSection.style.display = 'block';
  profilePhotoSection.style.display = 'none';
});
const PHOTOS_BTN = document.getElementById('PHOTOS_BTN');
PHOTOS_BTN.addEventListener('click', () => {
  profileContent.style.display = 'none';
  aboutUser.style.display = 'none';
  profileFriendSection.style.display = 'none';
  profilePhotoSection.style.display = 'block';
});
///
const uploadCoverPhoto = document.getElementById('upload-cover-photo-form');
document.getElementById('upload-cover-photo').onchange = () => {
  document.querySelector('.upload-cover-photo-confirm').style.display = 'block';
};
const CancelCoverPhotoUpload = document.getElementById(
  'cancel-upload-cover-photo'
);
CancelCoverPhotoUpload.addEventListener('click', () => {
  document.querySelector('.upload-cover-photo-confirm').style.display = 'none';
});
uploadCoverPhoto.addEventListener('submit', async (event) => {
  event.preventDefault();
  const newFormData = new FormData();
  newFormData.append(
    'coverPhoto',
    document.getElementById('upload-cover-photo').files[0]
  );
  console.log(document.getElementById('upload-cover-photo').files[0]);
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/v1/users/updateMe',
      data: newFormData,
    });
    if (response.data.status == 'success') {
      window.setTimeout(() => {
        location.assign('/profile');
      }, 50);
    }
  } catch (err) {
    console.log(err.message);
  }
});
