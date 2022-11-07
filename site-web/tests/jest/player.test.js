import { jest } from "@jest/globals";
import Player from "../../src/assets/js/player";
import { random } from "../../src/assets/js/utils";

describe.only("Player tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  const MAX_TEST_ITERATIONS = 10;
  let player;
  let songStubs;
  let songStub;

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    player = new Player();
    songStubs = [
      { name: "Whip", src: "./assets/media/01_song.mp3" },
      { name: "Overflow", src: "./assets/media/02_song.mp3" },
      { name: "Intrigue Fun", src: "./assets/media/03_song.mp3" },
      { name: "Bounce", src: "./assets/media/04_song.mp3" },
      { name: "Summer Pranks", src: "./assets/media/05_song.mp3" },
    ];
    songStub = songStubs[0];
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
  });

  it("Player should be instanciated correctly", () => {
    expect(player.audio).toEqual(new Audio());
    expect(player.currentIndex).toEqual(0);
    expect(player.songsInPlayList).toEqual([]);
    expect(player.shuffle).toBeFalsy();
  });

  it("loadSongs should load songs in playlist", () => {
    expect(player.songsInPlayList).toEqual([]);
    expect(player.audio.src).toEqual("");

    // TODO
    player.loadSongs(songStubs);

    expect(player.songsInPlayList).toEqual(songStubs);
    // Should pass
    // expect(player.audio.src).toEqual(songStub.src);
  });

  it("getSongFromIndex should not get song for an invalid index", () => {
    const invalidIndexes = [undefined, -1, "a", "$%afab124", songStubs.length, songStubs.length + 1, true, false];
    player.songsInPlayList = songStubs;
    for (const invalidIndex of invalidIndexes) {
      const songFromIndex = player.getSongFromIndex(invalidIndex);
      if (!songFromIndex) continue;
      expect(songFromIndex).toEqual(songStubs[0]);
    }
  });

  it("getSongFromIndex should get song for a valid index", () => {
    // TODO
    player.songsInPlayList = songStubs;

    for (let i = 0; i < songStubs.length; i++) {
      const songFromIndex = player.getSongFromIndex(i);
      expect(songFromIndex).toEqual(songStubs[i]);
    }
  });

  it("playAudio should resume correctly given an index of -1", () => {
    const playerAudioPlaySpy = jest.spyOn(player.audio, "play").mockImplementation(() => {});
    const playerAudioPauseSpy = jest.spyOn(player.audio, "pause").mockImplementation(() => {});
    const playerAudioLoadSpy = jest.spyOn(player.audio, "load").mockImplementation(() => {});
    const playerGetSongFromIndexSpy = jest.spyOn(player, "getSongFromIndex").mockImplementation(() => {});
    jest.spyOn(player.audio, "paused", "get").mockReturnValue(true);
    player.playAudio();
    expect(playerAudioPlaySpy).toBeCalled();
    expect(playerAudioPauseSpy).not.toBeCalled();
    expect(playerAudioLoadSpy).not.toBeCalled();
    expect(playerGetSongFromIndexSpy).not.toBeCalled();
  });

  it("playAudio should pause correctly given an index of -1", () => {
    // TODO
    const playerAudioPlaySpy = jest.spyOn(player.audio, "play").mockImplementation(() => {});
    const playerAudioPauseSpy = jest.spyOn(player.audio, "pause").mockImplementation(() => {});
    const playerAudioLoadSpy = jest.spyOn(player.audio, "load").mockImplementation(() => {});
    const playerGetSongFromIndexSpy = jest.spyOn(player, "getSongFromIndex").mockImplementation(() => {});
    jest.spyOn(player.audio, "paused", "get").mockReturnValue(false);
    player.playAudio();
    expect(playerAudioPlaySpy).not.toBeCalled();
    expect(playerAudioPauseSpy).toBeCalled();
    expect(playerAudioLoadSpy).not.toBeCalled();
    expect(playerGetSongFromIndexSpy).not.toBeCalled();
  });

  it("playAudio should play audio for any given index except -1", () => {
    const playerAudioPlaySpy = jest.spyOn(player.audio, "play").mockImplementation(() => {});
    const playerAudioPauseSpy = jest.spyOn(player.audio, "pause").mockImplementation(() => {});
    jest.spyOn(player.audio, "load").mockImplementation(() => {});
    jest.spyOn(player, "getSongFromIndex").mockImplementation(() => songStub);
    for (let i = 0; i < MAX_TEST_ITERATIONS; ++i) {
      player.playAudio(random(0, songStubs.length - 1));
      expect(player.audio.src.search(songStub)).not.toEqual(-1);
      expect(playerAudioPlaySpy).toHaveBeenCalled();
      expect(playerAudioPauseSpy).not.toBeCalled();
    }
  });

  it("playPreviousSong should call playAudio", () => {
    // TODO
    const playAudioSpy = jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.playPreviousSong();
    expect(playAudioSpy).toBeCalled();
  });

  it("playNextSong should call playAudio", () => {
    // TODO
    const playAudioSpy = jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.playNextSong();
    expect(playAudioSpy).toBeCalled();
  });

  it("playPreviousSong & playNextSong should return a random index between 0 and playlist's length if shuffled", () => {
    jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.shuffle = true;
    const probMaxIter = MAX_TEST_ITERATIONS ** 2;
    const epsilon = 0.1;
    let shuffledIndexesPreviousSong;
    let shuffledIndexesNextSong;
    const doRetry = () => {
      shuffledIndexesPreviousSong = [];
      shuffledIndexesNextSong = [];
      for (let i = 0; i < probMaxIter; ++i) {
        player.playPreviousSong();
        shuffledIndexesPreviousSong.push(player.currentIndex);
        player.playNextSong();
        shuffledIndexesNextSong.push(player.currentIndex);
      }
    };
    doRetry();
    expect(shuffledIndexesPreviousSong.length).toEqual(probMaxIter);
    expect(shuffledIndexesPreviousSong.length).toEqual(shuffledIndexesNextSong.length);
    let maxCategoryPartition = probMaxIter / songStubs.length;
    maxCategoryPartition += Math.floor(maxCategoryPartition * epsilon);
    for (const nShuffledIndex of shuffledIndexesPreviousSong.concat(shuffledIndexesNextSong)) {
      if (nShuffledIndex > maxCategoryPartition) {
        maxCategoryPartition += Math.floor(maxCategoryPartition * epsilon);
        doRetry();
        break;
      }
    }
    for (const nShuffledIndex of shuffledIndexesPreviousSong.concat(shuffledIndexesNextSong)) {
      expect(nShuffledIndex <= maxCategoryPartition).toBeTruthy();
    }
  });

  it("playPreviousSong should decrement currentIndex when shuffle is disabled", () => {
    // TODO
    jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.shuffle = false;
    player.currentIndex = songStubs.length - 1;
    player.loadSongs(songStubs);
    player.playPreviousSong();
    expect(player.currentIndex).toEqual(player.songsInPlayList.length - 2);
  });

  it("playNextSong should increment currentIndex when shuffle is disabled", () => {
    // TODO
    jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.shuffle = false;
    player.loadSongs(songStubs);
    player.playNextSong();
    expect(player.currentIndex).toEqual(1);
  });

  it("playPreviousSong should return currentIndex % playlist's length if not shuffled", () => {
    jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.shuffle = false;
    player.loadSongs(songStubs);
    player.playPreviousSong();
    expect(player.currentIndex).toEqual(player.songsInPlayList.length - 1);
  });

  it("playNextSong should return currentIndex % playlist's length if not shuffled", () => {
    // TODO
    jest.spyOn(player, "playAudio").mockImplementation(() => {});
    player.shuffle = false;
    player.loadSongs(songStubs);
    player.currentIndex = songStubs.length - 1;
    player.playNextSong();
    expect(player.currentIndex).toEqual(0);
  });

  it("audioSeek should correctly add stepper & current time", () => {
    for (let i = 0; i < MAX_TEST_ITERATIONS; ++i) {
      player.audio.currentTime = 0;
      jest.spyOn(player.audio, "duration", "get").mockReturnValue(i);
      player.audioSeek(i);
      expect(player.audio.currentTime).toEqual((i * i) / 100);
    }
  });

  it("muteToggle should return true if audio is muted", () => {
    // TODO
    jest.spyOn(player.audio, "volume", "get").mockReturnValue(0);
    expect(player.muteToggle()).toBeTruthy();
  });

  it("muteToggle should return false if audio is not muted", () => {
    jest.spyOn(player.audio, "volume", "get").mockReturnValue(1);
    expect(player.muteToggle()).toBeFalsy();
  });

  it("shuffleToggle should inverse shuffle state", () => {
    // TODO
    player.shuffle = false;
    expect(player.shuffleToggle()).toBeTruthy();
    player.shuffle = true;
    expect(player.shuffleToggle()).toBeFalsy();
  });

  it("scrubTime should correctly add delta stepper", () => {
    // TODO
    const DEFAULT_CURRENT_TIME = 30;
    const NEGATIVE_TIME_DELTA = -20;
    const ZERO_TIME_DELTA = 0;
    const POSITIVE_TIME_DELTA = 20;
    const timeDeltas = [NEGATIVE_TIME_DELTA, ZERO_TIME_DELTA, POSITIVE_TIME_DELTA];

    timeDeltas.forEach((delta) => {
      player.audio.currentTime = DEFAULT_CURRENT_TIME;
      player.scrubTime(delta);
      expect(player.audio.currentTime).toEqual(DEFAULT_CURRENT_TIME + delta);
    });
  });

  it("currentSong getter should correctly get the current song", () => {
    player.loadSongs(songStubs);
    songStubs.forEach((song, index) => {
      player.currentIndex = index;
      expect(player.currentSong).toEqual(song);
    });
  });
});
