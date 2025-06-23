// 스크롤 진행률, 헤더 축소, TOP 버튼 표시, fade-in 효과
let ticking = false;
function updateScrollProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
  }
  const header = document.getElementById('header');
  if (header) {
    if (scrollTop > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    if (scrollTop > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  // fade-in
  document.querySelectorAll('.fade-in:not(.visible)').forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    if (elementTop < window.innerHeight && elementBottom > 0) element.classList.add('visible');
  });
  ticking = false;
}
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollProgress);
    ticking = true;
  }
}
window.addEventListener('scroll', requestTick, { passive: true });

// TOP 버튼 클릭시 맨 위로 부드럽게 이동
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// FAQ 아코디언 & 접근성
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', function(e) {
    e.preventDefault();
    const faqItem = this.parentElement;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item.active').forEach(item => {
      if (item !== faqItem) item.classList.remove('active');
    });
    faqItem.classList.toggle('active');
    this.setAttribute('aria-expanded', !isActive);
  });
  question.setAttribute('role','button');
  question.setAttribute('aria-expanded','false');
  question.setAttribute('tabindex','0');
  question.addEventListener('keydown', function(e) {
    if (e.key==='Enter'||e.key===' '){ e.preventDefault(); this.click(); }
  });
});

// 부드러운 앵커 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (!document.querySelector(this.getAttribute('href'))) return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    const headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
    const targetPosition = target.offsetTop - headerHeight - 10;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
});

// 공유 기능
function shareContent() {
  const shareData = {
    title: '한약으로 불임치료? 절반이 아기를 잃었습니다',
    text: '정부 지원 연구에서 밝혀진 무서운 결과. 한약 불임치료로 13명 중 6명이 유산. 안전이천탕은 7명 중 4명이 유산. 한약 먹은 시기와 명확한 관련성.',
    url: window.location.href
  };
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    navigator.share(shareData).then(()=>{}).catch(()=>{fallbackShare(shareData);});
  } else { fallbackShare(shareData); }
}
function fallbackShare(shareData) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(shareText).then(()=>{
      alert('링크가 복사되었습니다. 카카오톡이나 다른 곳에 붙여넣기 해주세요!');
    });
  }
}

// 모바일 내비게이션 토글
function setupMobileNav() {
  if(window.innerWidth < 900) {
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.setAttribute('aria-label','메뉴 열기');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-controls','navLinks');
    navToggle.setAttribute('tabindex','0');
    for(let i=0;i<3;i++) {
      const bar = document.createElement('span');
      bar.className = 'nav-toggle-bar';
      navToggle.appendChild(bar);
    }
    const header = document.getElementById('header');
    const nav = header.querySelector('nav');
    nav.insertBefore(navToggle, nav.firstChild);

    const navLinks = document.getElementById('navLinks');
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded','false');
      });
    });
  }
}

// DOMContentLoaded 초기화
document.addEventListener('DOMContentLoaded', function() {
  updateScrollProgress();
  setupMobileNav();
  // 초기 fade-in
  document.querySelectorAll('.fade-in').forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  });
  // 스크롤 진행률 접근성
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    progressBar.setAttribute('aria-valuemin','0');
    progressBar.setAttribute('aria-valuemax','100');
    progressBar.setAttribute('aria-valuenow','0');
  }
});
