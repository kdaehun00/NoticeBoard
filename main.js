/********* 더미 데이터 및 상태 변수 *********/
// user의 리스트들이 들어가있다 -> 현재는 테스트용으로 한 명 들어가있는데, 회원가입하면 계속 안에 들어간다.
let users = [
  { username: "test", password: "test", name: "김대훈", nickname: "daniel", profilePic: "https://via.placeholder.com/40" }
];

let currentUser = null; //현재 로그인한 사용자가 누구인지 파악, 로그아웃을 하면 다시 null로 변화

// 게시글 데이터 예시
let posts = [
  { 
    id: 1, 
    title: "첫 번째 게시글", 
    body: "이곳은 게시글 내용입니다.", 
    nickname: "daniel", 
    username: "test", 
    createdAt: new Date().toLocaleString(), 
    updatedAt: null, 
    likes: 10, 
    comments: 2, 
    views: 100 
  }
];
let currentPostId = 2; // 새로운 게시글 ID 생성용

//----------------------------------------함수 정의----------------------------------------------//

/********* 페이지 전환 함수 *********/
// 모든 페이지를 숨긴다.
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });
  // 선택한 페이지만 보이도록 설정한다.
  document.getElementById(pageId).style.display = 'block';
}
// 초기 페이지: 로그인
showPage('login-page');

/********* 로그인 처리 *********/
//html에 정의된 login-form에서, 제출버튼을 누르면 이벤트 실행.
document.getElementById('login-form').addEventListener('submit', function(e) {
    //안이 비었으면 안 됨.
  e.preventDefault();
  // 그 외에 사용자가 작성한 내용을 가져와서 저장.
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  //user가 등록되어있는지 찾아보자.
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    alert("로그인 성공!");
    //성공하면 프로필 띄우고, 게시판 띄우고, 페이지 전환
    updateProfileMenu();
    loadBoard();
    showPage('board-page');
  } else {
    alert("아이디 또는 비밀번호가 틀렸습니다.");
  }
});

/********* 페이지 전환 이벤트 *********/
//show-register는 회원이 아니신가요? 텍스트 의미
document.getElementById('show-register').addEventListener('click', function(e) {
  e.preventDefault();
  //이거 클릭하면 회원가입 페이지로 전환
  showPage('register-page');
});

// 회원가입 창에 실수로 들어갔을 때, 이미 회원이신가요? 텍스트를 누르면 다시 로그인 페이지로 안내해준다.
document.getElementById('show-login').addEventListener('click', function(e) {
  e.preventDefault();
  showPage('login-page');
});

/********* 회원가입 처리 *********/
//회원가입 폼으로 진입/ 
document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  const passwordConfirm = document.getElementById('reg-password-confirm').value;
  const name = document.getElementById('reg-name').value;
  const nickname = document.getElementById('reg-nickname').value;
  const profileInput = document.getElementById('reg-profile');
  
  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  // 중복 아이디 검사
  if (users.find(u => u.username === username)) {
    alert("이미 존재하는 아이디입니다.");
    return;
  }
  // 프로필 사진 처리 (업로드한 파일이 없으면 기본 이미지 사용)
  let profilePic = "";
  if (profileInput.files && profileInput.files[0]) {
    profilePic = URL.createObjectURL(profileInput.files[0]);
  } else {
    profilePic = "https://via.placeholder.com/40";
  }
  const newUser = { username, password, name, nickname, profilePic };
  users.push(newUser);
  alert("회원가입이 완료되었습니다. 로그인 해주세요.");
  showPage('login-page');
});

/********* 프로필 메뉴 업데이트 *********/
function updateProfileMenu() {
  const profileMenu = document.getElementById('profile-menu');
  if (currentUser) {
    profileMenu.style.display = 'block';
    document.getElementById('current-profile').src = currentUser.profilePic;
  } else {
    profileMenu.style.display = 'none';
  }
}
// 프로필 사진 클릭 시 드롭다운 토글
document.addEventListener("DOMContentLoaded", function () {
  const profile = document.getElementById("current-profile"); // 프로필 아이콘
  const dropdown = document.getElementById("profile-dropdown"); // 드롭다운 메뉴

  // 프로필 클릭 시 드롭다운 메뉴 토글 (보였다가, 다시 클릭하면 사라짐)
  profile.addEventListener("click", function (event) {
    event.stopPropagation(); // body 클릭 이벤트로 인해 닫히는 것 방지
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  // 빈 화면을 클릭하면 드롭다운 메뉴 닫기
  document.addEventListener("click", function () {
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    }
  });

  // 드롭다운 내부 클릭 시 닫히지 않도록 설정
  dropdown.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});



//추후 회원정보 수정과 비밀번호 수정 페이지 제작.


// 로그아웃 처리
document.getElementById('logout').addEventListener('click', function(e) {
  e.preventDefault();
  currentUser = null;
  updateProfileMenu();
  showPage('login-page');
});

/********* 게시판 로드 *********/
function loadBoard() {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = "";
  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview';
    postDiv.dataset.index = index;
    postDiv.innerHTML = `
      <div class="post-title">${post.title}</div>
      <div class="post-meta">
        <div class="post-author">
          <img src="${post.profilePic}" alt="프로필">
          <span>${post.nickname}</span>
        </div>
        <span>${post.createdAt}</span>
      </div>
    `;
    postDiv.addEventListener('click', function() {
      openPost(index);
    });
    postsList.appendChild(postDiv);
  });
}

/********* 게시글 작성 *********/
document.getElementById('create-post').addEventListener('click', function() {
  document.getElementById('post-form').reset();
  showPage('post-form-page');
});

document.getElementById('edit-post').addEventListener('click', function() {
  const postIndex = parseInt(document.getElementById('post-detail-page').dataset.index);
  const post = posts[postIndex];

  if (!post) return;

  // 기존 데이터를 입력 필드에 불러오기
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-body').value = post.body;

  // 저장 버튼 클릭 시, 수정 모드로 설정
  document.getElementById('post-form').dataset.mode = "edit";
  document.getElementById('post-form').dataset.index = postIndex;

  // 게시글 작성 페이지로 이동
  showPage('post-form-page');
});

// 게시글 저장(작성 & 수정)
document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  const mode = e.target.dataset.mode;

  if (mode === "edit") {
      const postIndex = parseInt(e.target.dataset.index);
      posts[postIndex].title = title;
      posts[postIndex].body = body;
      posts[postIndex].updatedAt = new Date().toLocaleString();
      alert("게시글이 수정되었습니다.");
  } else {
      posts.unshift({
          title,
          body,
          nickname: currentUser.nickname,
          profilePic: currentUser.profilePic,
          createdAt: new Date().toLocaleString()
      });
      alert("게시글이 작성되었습니다.");
  }

  loadBoard();
  showPage('board-page');
});


/********* 게시글 상세보기 *********/
function openPost(index) {
  const post = posts[index];
  if (!post) return;

  document.getElementById('post-detail-page').dataset.index = index; // 게시글 인덱스 저장

  document.getElementById('post-content').innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <div class="post-meta">
      <div class="post-author">
        <img src="${post.profilePic}" alt="프로필">
        <span>${post.nickname}</span>
      </div>
      <span>${post.createdAt}</span>
    </div>
  `;

  showPage('post-detail-page');
}


document.getElementById('delete-post').addEventListener('click', function() {
  const postIndex = parseInt(document.getElementById('post-detail-page').dataset.index);
  
  if (confirm("정말 삭제하시겠습니까?")) {
      posts.splice(postIndex, 1);
      alert("게시글이 삭제되었습니다.");
      loadBoard();
      showPage('board-page');
  }
});


/********* 취소 버튼 처리 *********/
document.getElementById('cancel-post').addEventListener('click', function() {
  showPage('board-page');
});

document.getElementById('back-to-board').addEventListener('click', function() {
  showPage('board-page');
});
