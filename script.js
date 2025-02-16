/********* 더미 데이터 및 상태 변수 *********/
// user의 리스트들이 들어가있다 -> 현재는 테스트용으로 한 명 들어가있는데, 회원가입하면 계속 안에 들어간다.
let users = [
  { username: "test", password: "test", name: "홍길동", nickname: "길동", profilePic: "https://via.placeholder.com/40" }
];

let currentUser = null; //현재 로그인한 사용자가 누구인지 파악, 로그아웃을 하면 다시 null로 변화

// 게시글 데이터 예시
let posts = [
  { 
    id: 1, 
    title: "첫 번째 게시글", 
    body: "이곳은 게시글 내용입니다.", 
    author: "길동", 
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
//show-register는 회원이 아니신가요? 텍스트를 클릭한다는 의미
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
document.getElementById('current-profile').addEventListener('click', function() {
  const dropdown = document.getElementById('profile-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});
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
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-preview';
    postDiv.dataset.postId = post.id;
    postDiv.innerHTML = `
      <h3>${post.title}</h3>
      <p>작성자: ${post.author} | 등록시간: ${post.createdAt} ${post.updatedAt ? "(수정됨: " + post.updatedAt + ")" : ""}</p>
      <p>좋아요: ${post.likes} | 댓글: ${post.comments} | 조회수: ${post.views}</p>
    `;
    postDiv.addEventListener('click', function() {
      openPost(post.id);
    });
    postsList.appendChild(postDiv);
  });
}

/********* 게시글 작성/수정 페이지 전환 *********/
document.getElementById('create-post').addEventListener('click', function() {
  document.getElementById('post-form-title').innerText = "게시글 작성";
  document.getElementById('post-form').reset();
  document.getElementById('post-form').dataset.mode = "create";
  showPage('create-edit-post-page');
});
// 게시글 작성/수정 폼 제출
document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  const mode = e.target.dataset.mode;
  if (mode === "create") {
    const newPost = {
      id: currentPostId++,
      title,
      body,
      author: currentUser.nickname,
      username: currentUser.username,
      createdAt: new Date().toLocaleString(),
      updatedAt: null,
      likes: 0,
      comments: 0,
      views: 0
    };
    // 최신 글이 위에 보이도록 배열 앞에 추가
    posts.unshift(newPost);
    alert("게시글이 작성되었습니다.");
  } else if (mode === "edit") {
    const postId = parseInt(e.target.dataset.postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.title = title;
      post.body = body;
      post.updatedAt = new Date().toLocaleString();
      alert("게시글이 수정되었습니다.");
    }
  }
  loadBoard();
  showPage('board-page');
});
// 게시글 작성 취소
document.getElementById('cancel-post').addEventListener('click', function() {
  showPage('board-page');
});

/********* 게시글 상세보기 *********/
function openPost(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  // 게시글 조회수 증가
  post.views++;
  const postContent = document.getElementById('post-content');
  postContent.innerHTML = `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    <p>작성자: ${post.author} | 등록시간: ${post.createdAt} ${post.updatedAt ? "(수정됨: " + post.updatedAt + ")" : ""}</p>
    <p>좋아요: ${post.likes} | 댓글: ${post.comments} | 조회수: ${post.views}</p>
  `;
  // 현재 사용자가 작성자라면 수정/삭제 버튼 표시
  if (currentUser && currentUser.username === post.username) {
    document.getElementById('post-actions').style.display = 'block';
    document.getElementById('post-actions').dataset.postId = post.id;
  } else {
    document.getElementById('post-actions').style.display = 'none';
  }
  showPage('post-page');
}

/********* 게시글 수정 *********/
document.getElementById('edit-post').addEventListener('click', function() {
  const postId = parseInt(document.getElementById('post-actions').dataset.postId);
  const post = posts.find(p => p.id === postId);
  if (post && currentUser.username === post.username) {
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-body').value = post.body;
    const form = document.getElementById('post-form');
    form.dataset.mode = "edit";
    form.dataset.postId = post.id;
    document.getElementById('post-form-title').innerText = "게시글 수정";
    showPage('create-edit-post-page');
  }
});

/********* 게시글 삭제 *********/
document.getElementById('delete-post').addEventListener('click', function() {
  const postId = parseInt(document.getElementById('post-actions').dataset.postId);
  if (confirm("정말 삭제하시겠습니까?")) {
    posts = posts.filter(p => p.id !== postId);
    alert("게시글이 삭제되었습니다.");
    loadBoard();
    showPage('board-page');
  }
});

/********* 게시글 상세보기에서 목록으로 *********/
document.getElementById('back-to-board').addEventListener('click', function() {
  loadBoard();
  showPage('board-page');
});
