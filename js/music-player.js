// Danganronpa v1 – Shared Music Player
(function() {
  const trackNames = [
    "36. チャプターリザルト.mp3",
    "35. フェイズリザルト.mp3",
    "34. ラジオ体操暗殺拳.mp3",
    "33. あの人は見た！.mp3",
    "32. 起動・電子生徒手帳.mp3",
    "31. モノモノマシーン！.mp3",
    "30. レアプレゼントゲット.mp3",
    "29. プレゼントゲット.mp3",
    "28. コトダマゲット.mp3",
    "27. クライマックス推理.mp3",
    "27. あなたと私の通信簿.mp3",
    "26. チャプター６.mp3",
    "26. Beautiful Morning.mp3",
    "25. 補習 for 不運.mp3",
    "25. チャプター５.mp3",
    "24. チャプター４.mp3",
    "24. ショベルの達人.mp3",
    "23. チャプター３.mp3",
    "23. ようこそ絶望学園.mp3",
    "22. チャプター２.mp3",
    "22. SUPER M.T.B..mp3",
    "21. 週刊少年ゼツボウマガジン.mp3",
    "21. チャプター１.mp3",
    "20. ベルサイユ産火あぶり魔女狩り仕立て.mp3",
    "20. プロローグ・クレジット.mp3",
    "19. 絶望症候群.mp3",
    "19. 再生 -rebuild-.mp3",
    "18. 絶望汚染ノイズミュージック.mp3",
    "18. さよなら絶望学園.mp3",
    "17. 議論 -BREAK-.mp3",
    "17. ニュー・ワールド・オーダー.mp3",
    "16. クライマックス再現.mp3",
    "16. M.T.B..mp3",
    "15. 開廷アンダーグラウンド.mp3",
    "15. 超高校級の絶望的おしおき.mp3",
    "14. 猛太亜最苦婁弟酢華恵慈.mp3",
    "14. オール・オール・アポロジーズ.mp3",
    "13. 補習 for ミステリアス.mp3",
    "13. イキキル.mp3",
    "12. 議論 -HOPE VS DESPAIR-.mp3",
    "12. 処刑に願いを….mp3",
    "11. 閃きアナグラム.mp3",
    "11. 千本ノック.mp3",
    "10. 議論 -HEAT UP-.mp3",
    "10. DISTRUST.mp3",
    "09. 疾走する青春のジャンクフード.mp3",
    "09. 学級裁判太陽編.mp3",
    "08. 学級裁判乱世編.mp3",
    "08. BOX 15.mp3",
    "07. 議論 -MIX-(EDGE Version).mp3",
    "07. モノクマ先生の課外授業.mp3",
    "06. 学級裁判黎明編.mp3",
    "06. BOX 16.mp3",
    "05. SUPER FINAL M.T.B..mp3",
    "05. Beautiful Dead.mp3",
    "04. ゼツボウシンドローム.mp3",
    "04. Beautiful Days.mp3",
    "03. モノクマ先生の授業.mp3",
    "03. おしおきロケット.mp3",
    "02. モモモモノクマ！.mp3",
    "02. だんがんろんぱ！.mp3",
    "01. DANGANRONPA.mp3",
    "01. DANGANRONPA(DR Version).mp3"
  ];

  // Get root path for music folder
  const getAudioPath = (trackName) => {
    // If in character_pages subdirectory, go up one level to find music
    const isInCharacterPages = window.location.pathname.includes('character_pages');
    const root = isInCharacterPages ? '../music/' : 'music/';
    return root + trackName;
  };

  // Create or reuse global audio element
  if (!window.sharedAudio) {
    window.sharedAudio = new Audio();
    window.sharedAudio.id = 'bgAudio';
    window.sharedAudio.preload = 'metadata';
    document.body.appendChild(window.sharedAudio);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const audio = window.sharedAudio;
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const trackSelect = document.getElementById('trackSelect');
    const trackTitle = document.getElementById('trackTitle');

    if (!playPauseBtn || !prevBtn || !nextBtn || !trackSelect || !trackTitle) return;

    // Use the global current index if this is a page switch, otherwise load from storage
    let current = window.playerIndex !== undefined ? window.playerIndex : parseInt(localStorage.getItem('bgplayer_index') || '0', 10);

    function prettyName(path) {
      const name = path.split('/').pop();
      return name.replace(/^\d+\.\s*/, '');
    }

    function populate() {
      trackSelect.innerHTML = '';
      trackNames.forEach((t, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = prettyName(t);
        trackSelect.appendChild(opt);
      });
      updateDisplay();
    }

    function updateDisplay() {
      trackSelect.value = current;
      trackTitle.textContent = prettyName(trackNames[current]);
    }

    function loadTrack(index, play = false) {
      if (index < 0) index = trackNames.length - 1;
      if (index >= trackNames.length) index = 0;
      current = index;
      audio.src = getAudioPath(trackNames[current]);
      try { audio.load(); } catch (e) {}
      updateDisplay();
      if (play) {
        audio.play().then(() => {
          localStorage.setItem('musicWasPlaying', 'true');
          updatePlayBtn();
        }).catch(() => {
          trackTitle.textContent = 'Playback blocked — click Play';
        });
      }
      updatePlayBtn();
    }

    function updatePlayBtn() {
      playPauseBtn.textContent = audio.paused ? 'Play' : 'Pause';
    }

    playPauseBtn.addEventListener('click', () => {
      if (audio.src === '') loadTrack(current);
      if (audio.paused) {
        audio.play().then(() => {
          localStorage.setItem('musicWasPlaying', 'true');
          window.playerIndex = current;
          updatePlayBtn();
        }).catch(() => {
          trackTitle.textContent = 'Playback blocked — allow audio';
        });
      } else {
        audio.pause();
        localStorage.setItem('musicWasPlaying', 'false');
        window.playerIndex = current;
        updatePlayBtn();
      }
    });

    prevBtn.addEventListener('click', () => {
      current--;
      loadTrack(current, true);
      window.playerIndex = current;
      localStorage.setItem('bgplayer_index', current);
    });

    nextBtn.addEventListener('click', () => {
      current++;
      loadTrack(current, true);
      window.playerIndex = current;
      localStorage.setItem('bgplayer_index', current);
    });

    trackSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      if (!Number.isNaN(idx)) {
        current = idx;
        window.playerIndex = current;
        loadTrack(idx, true);
        localStorage.setItem('bgplayer_index', current);
      }
    });

    audio.addEventListener('play', updatePlayBtn);
    audio.addEventListener('pause', updatePlayBtn);
    audio.addEventListener('error', () => trackTitle.textContent = 'Error loading track');
    audio.addEventListener('ended', () => {
      current++;
      window.playerIndex = current;
      loadTrack(current, true);
      localStorage.setItem('bgplayer_index', current);
    });

    populate();

    // Load initial track if not already loaded
    if (!audio.src || !audio.src.includes(trackNames[current])) {
      loadTrack(current, false);
    } else {
      updateDisplay();
    }

    // Restore playback state
    const wasPlaying = localStorage.getItem('musicWasPlaying') === 'true';
    const savedTime = parseInt(localStorage.getItem('bgplayer_time') || '0', 10);

    function restorePlayback() {
      if (savedTime > 0) audio.currentTime = savedTime;
      if (wasPlaying) {
        audio.play().catch(() => {
          trackTitle.textContent = 'Click Play to start music';
        });
      }
    }

    if (audio.readyState >= 1) {
      restorePlayback();
    } else {
      audio.addEventListener('loadedmetadata', restorePlayback, { once: true });
    }

    // Save state periodically
    setInterval(() => {
      if (!audio.paused) {
        try {
          localStorage.setItem('bgplayer_index', current);
          localStorage.setItem('bgplayer_time', Math.floor(audio.currentTime));
        } catch (e) {}
      }
    }, 1000);

    window.addEventListener('beforeunload', () => {
      try {
        localStorage.setItem('bgplayer_index', current);
        localStorage.setItem('bgplayer_time', Math.floor(audio.currentTime));
        localStorage.setItem('musicWasPlaying', !audio.paused ? 'true' : 'false');
      } catch (e) {}
    });

    // Dragging functionality
    const playerEl = document.querySelector('.player');
    if (playerEl) {
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      // Restore saved position
      const savedX = localStorage.getItem('playerX');
      const savedY = localStorage.getItem('playerY');
      if (savedX !== null && savedY !== null) {
        playerEl.style.right = 'auto';
        playerEl.style.bottom = 'auto';
        playerEl.style.left = savedX + 'px';
        playerEl.style.top = savedY + 'px';
      }

      playerEl.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
        isDragging = true;
        playerEl.classList.add('dragging');
        offsetX = e.clientX - playerEl.getBoundingClientRect().left;
        offsetY = e.clientY - playerEl.getBoundingClientRect().top;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Keep within viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - playerEl.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - playerEl.offsetHeight));

        playerEl.style.right = 'auto';
        playerEl.style.bottom = 'auto';
        playerEl.style.left = newX + 'px';
        playerEl.style.top = newY + 'px';
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          playerEl.classList.remove('dragging');
          // Save position
          localStorage.setItem('playerX', playerEl.offsetLeft);
          localStorage.setItem('playerY', playerEl.offsetTop);
        }
      });
    }
  });
})();

