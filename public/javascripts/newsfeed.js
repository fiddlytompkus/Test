'use strict';

var jumpLetter = document.querySelectorAll('.jump-letter');
var i = 0;
for (i = 0; i < jumpLetter.length; i++) {
  jumpLetter[i].addEventListener('mouseover', function () {
    this.style.animationName = 'animateJump';
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
    // console.log(id);
    // console.log('/v1/posts/' + id + '/like');
    const urrl = '/v1/posts/' + id + '/like';
    try {
      const res = await axios({
        method: 'PATCH',
        url: urrl,
      }).then((res) => {
        if (res.data.status == 'OK') {
          if (res.data.liked) {
            // console.log('I came Here');
            var element = event.target
              .closest('.post-data-with-information')
              .querySelector('.not-liked');
            // console.log(element);
            element.classList.remove('not-liked');
            element.classList.add('liked-already');
          } else {
            var element = event.target
              .closest('.post-data-with-information')
              .querySelector('.liked-already');
            // console.log(element);
            element.classList.add('not-liked');
            element.classList.remove('liked-already');
          }
        }
      });
    } catch (err) {
      console.log('Sry for Inconvinience');
    }
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

// Posting post
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

//Posting comment
const commentSection = document.querySelectorAll('.commentSection');
for (var i = 0; i < commentSection.length; i++) {
  commentSection[i].addEventListener('click', async (event) => {
    var elementPost = event.target.closest('.post-data-with-information');
    var commentHideSection = elementPost.querySelector('.Comments-Hide').style
      .display;
    if (commentHideSection == 'block') {
      elementPost.querySelector('.Comments-Hide').style.display = 'none';
      // console.log(elementPost.querySelector('.Comments-Hide'));
      // elementPost
      //   .querySelector('.Comments-Hide')
      //   .removeChild(elementPost.querySelector('.Comments-Hide').firstChild);
      // FIXME remove element
      return;
    }
    var id = elementPost.getAttribute('data-id');
    const urrl = '/v1/posts/' + id + '/comments';
    try {
      const response = await axios({
        method: 'GET',
        url: urrl,
      });
      if (response.data.status == 'Ok') {
        var full = '';
        var short = response.data.data.comments;
        for (var i = 0; i < short.length; i++) {
          var commentData = `<div class="who-commented">
              <img class="avatar avatar-margin dis-inline-block" src="/img/profileD.png" alt="" /> <div class="comment-section dis-inline-block">
                  ${short[i].text}
              </div>

              <div class="feature-on-comment">
                  <div class="row" style="margin-left: 1vw">
                      <div class="col-4 add-on">👍like</div>
                      <div class="col-4 add-on">
                          <a data-wow="2" class="Comments"> reply </a>
                      </div>
                      <div class="col-4">report</div>
                  </div>
              </div>

              <!-- <div class="comment-inherited">tu galat hai</div> -->
          </div>`;
          full += commentData;
        }
        var doc = new DOMParser().parseFromString(full, 'text/html');
        elementPost
          .querySelector('.Comments-Hide')
          .appendChild(doc.documentElement);
      }
      elementPost.querySelector('.Comments-Hide').style.display = 'block';
    } catch (error) {
      console.log(
        'Error occur while requesting for comments in nesfeed.js on line 127 approx'
      );
    }
  });
}

// auto resizing comment textarea
const allCommentPostData = document.querySelectorAll('.commentPostData');
for (var i = 0; i < allCommentPostData.length; i++) {
  allCommentPostData[i].addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
}
// implement posting comment
const commentPost = document.querySelectorAll('.commentPost');
for (var i = 0; i < commentPost.length; i++) {
  commentPost[i].addEventListener('submit', async (event) => {
    event.preventDefault();
    const commentDiv = event.target.closest('.post-data-with-information');
    const id = commentDiv.getAttribute('data-id');
    const commentData = commentDiv.querySelector('.commentPostData').value;
    if (!commentData) return;
    const urrl = '/v1/posts/' + id + '/comments';
    try {
      const response = await axios({
        method: 'POST',
        url: urrl,
        data: {
          text: commentData,
        },
      });
      if (response.data.status == 'Ok')
        commentDiv.querySelector('.commentPostData').value = '';
    } catch (error) {
      console.log(
        'error occured in newsfeed.js on line 176 apporx, while posting comment'
      );
      console.log(error.message);
    }
  });
}
