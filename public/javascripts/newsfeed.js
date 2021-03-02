'use strict';

var jumpLetter = document.querySelectorAll('.jump-letter');
var i = 0;
for (i = 0; i < jumpLetter.length; i++) {
  jumpLetter[i].addEventListener('mouseover', function () {
    this.style.animationName = 'animateJump';
  });
}

var allComments = document.querySelectorAll('.Comments');
var CommentHide = document.querySelectorAll('.Comments-Hide');
var i = 0;
var toggled = false;
for (i = 0; i < allComments.length; i++) {
  allComments[i].addEventListener('click', function () {
    var index = this.dataset.wow - 1;
    if (!toggled) CommentHide[index].style.display = 'block';
    else CommentHide[index].style.display = 'none';
    toggled = !toggled;
  });
}

const allImgOrVideo = document.querySelectorAll('.img-or-video');

for (i = 0; i < allImgOrVideo.length; i++) {
  allImgOrVideo[i].addEventListener('click', function openFullscreen() {
    if (this.requestFullscreen) {
      this.requestFullscreen();
    } else if (this.webkitRequestFullscreen) {
      /* Safari */
      this.webkitRequestFullscreen();
    } else if (this.msRequestFullscreen) {
      /* IE11 */
      this.msRequestFullscreen();
    }
  });
}

//like here
var liketoggle = document.querySelectorAll('.like-color-toggle');
for (var i = 0; i < liketoggle.length; i++) {
  liketoggle[i].addEventListener('click', async (event) => {
    var id = event.target
      .closest('.post-data-with-information')
      .getAttribute('data-id');
    console.log(id);
    // try {
    //   const res = await axios({
    //     method: 'POST',
    //     url: '/v1/posts/`${id}`/like',
    //   });
    // } catch (err) {
    //   console.log('haagg diye beta');
    // }
  });
}
// Onwards post modal window
var postModalBtn = document.querySelector('.post-input');
var postModal = document.querySelector('.Post-Modal');
var postModalClose = document.querySelector('.closeModalWindow');
postModalBtn.addEventListener('click', () => {
  postModal.style.display = 'block';
});
window.onclick = function (event) {
  if (event.target == postModal) {
    postModal.style.display = 'none';
  }
};
postModalClose.addEventListener('click', () => {
  postModal.style.display = 'none';
});
