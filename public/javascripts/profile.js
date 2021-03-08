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
const submitPostBTN = document.getElementById('postForm');
submitPostBTN.addEventListener('submit', async (e) => {
  e.preventDefault();
  const postContent = document.getElementById('postContent').value;
  try {
    const response = await axios({
      method: 'POST',
      url: '/v1/posts/',
      data: { postContent },
    });
    if (response.data.status == 'OK') {
      window.setTimeout(() => {
        location.assign('/newsfeed');
      }, 50);
    }
  } catch (err) {
    console.log('Error occured while posting post');
  }
});
