/* ====================================================================
 * ROYAL DAIFUGO - 完全統合・リファクタリング版 (app.js)
 * ==================================================================== */

/* ----------------------------------------------------
 * 1. 設定・定数・キャラクター定義
 * ---------------------------------------------------- */
const CONFIG = {
  ALLOW_LIMIT_PASS: false,
  MAX_PASS_LIMIT: 6,
  BASE_SPEED: 1,
  COLORS: {
    player: '#d4af37',
    cpu1: '#4caf50',
    cpu2: '#2196f3',
    cpu3: '#e91e63'
  }
};

const SUITS = [
  { symbol: '♠', class: 'spade' },
  { symbol: '♥', class: 'heart' },
  { symbol: '♦', class: 'diamond' },
  { symbol: '♣', class: 'club' }
];

// カードの基準強度（3: 1 〜 2: 13, JOKER: 14）
const CARD_RANKS = [
  { display: '3', value: 1 },  { display: '4', value: 2 },  { display: '5', value: 3 },
  { display: '6', value: 4 },  { display: '7', value: 5 },  { display: '8', value: 6 },
  { display: '9', value: 7 },  { display: '10', value: 8 }, { display: 'J', value: 9 },
  { display: 'Q', value: 10 }, { display: 'K', value: 11 }, { display: 'A', value: 12 },
  { display: '2', value: 13 }
];

const RANK_VALUE_MAP = {
  '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6,
  '9': 7, '10': 8, 'J': 9, 'Q': 10, 'K': 11, 'A': 12, '2': 13, 'JOKER': 14
};

const PLAYERS = ['player', 'cpu1', 'cpu2', 'cpu3'];

const CHARACTER_DEFS = {
  DUKE: { id: 'DUKE', name: '公爵', icon: '👑' },
  MARQUIS: { id: 'MARQUIS', name: '侯爵', icon: '🍷' },
  COUNT: { id: 'COUNT', name: '伯爵', icon: '📜' },
  KNIGHT: { id: 'KNIGHT', name: '騎士', icon: '⚔️' },
  MERCHANT: { id: 'MERCHANT', name: '商人', icon: '⚖️' },
  SCHOLAR: { id: 'SCHOLAR', name: '学者', icon: '📖' },
  STRATEGIST: { id: 'STRATEGIST', name: '軍師', icon: '♟️' },
  REVOLUTIONARY: { id: 'REVOLUTIONARY', name: '革命家', icon: '🔥' },
  JESTER: { id: 'JESTER', name: '道化師', icon: '🤡' },
  KING: { id: 'KING', name: '王', icon: '🏰' }
};

const CHAR_IMAGES = {
  DUKE: "fugo-絵柄/duke.png",
  MARQUIS: "fugo-絵柄/marquis.png",
  COUNT: "fugo-絵柄/count.png",
  KNIGHT: "fugo-絵柄/knight.png",
  MERCHANT: "fugo-絵柄/merchant.png",
  SCHOLAR: "fugo-絵柄/scholar.png",
  STRATEGIST: "fugo-絵柄/strategist.png",
  REVOLUTIONARY: "fugo-絵柄/revolutionary.png",
  JESTER: "fugo-絵柄/jester.png",
  KING: "fugo-絵柄/king.png"
};

const CHAR_SHORT_DESC = {
  DUKE: '強カードを温存する慎重派',
  MARQUIS: 'スコア計算重視のエレガント派',
  COUNT: '状況次第で戦術を変える策略家',
  KNIGHT: '駆け引きなしの直球勝負',
  MERCHANT: 'ペア・セット構築を好む商売人',
  SCHOLAR: '場を分析する慎重な観察者',
  STRATEGIST: '妨害重視のコントロール型',
  REVOLUTIONARY: '革命特化の攻撃型',
  JESTER: '読めないトリッキー派',
  KING: '完全読みの最強AI'
};

const CHARACTER_DIALOGUES = {
  DUKE: {
    NORMAL: ['ふむ、これでいい。', '悪くない一手だ。', 'ふむ。'],
    STRONG: ['これは取っておこう。', '我が力を見せる時か。', '余計な手出しは無用。'],
    MULTI: ['揃えていくとしよう。', 'これでいかがかな。'],
    EIGHT_CUT: ['ここで流す。', '場を仕切り直そう。'],
    ELEVEN_BACK: ['流れを変える。', '逆風もまた一興。'],
    REVOLUTION: ['世を覆すとしよう。', '時代の変わり目だな。'],
    PASS: ['ここは様子見だ。', '見送るとしよう。', '好きにするが良い。'],
    ENEMY_FEW: ['もう後がないようだな。', '焦りが見えるぞ。'],
    MY_FEW: ['勝負はもう決まったようだな。', '詰めに入るとしよう。'],
    WIN: ['当然の結果だな。', '私が勝つのは必然だ。'],
    LOSE: ['……今回は私の判断ミスだ。', '見事と言っておこう。'],
    GAME_START: ['始めようか。', '私の手腕を見せるとしよう。'],
    EXCHANGE: ['良いカードを期待しているよ。', '礼を言っておこう。'],
    NEXT_GAME: ['次の勝負と行こう。', 'いつでも相手になろう。']
  },
  MARQUIS: {
    NORMAL: ['ほう、そう来ましたか。', 'よろしいでしょう。', 'ふふ、まずまずですね。'],
    STRONG: ['その程度の手では、私には届きませんよ。', '極上のカードをお見せしましょう。'],
    MULTI: ['重ねて差し上げましょう。', 'エレガントに行きますよ。'],
    EIGHT_CUT: ['ここで一度リセットですな。', '流させていただきます。'],
    ELEVEN_BACK: ['おや、秩序が乱れましたね。', '逆転の兆しです。'],
    REVOLUTION: ['素晴らしい！ 世界がひっくり返りました！', 'これぞ真の変革！'],
    PASS: ['ここは紳士的にお譲りしましょう。', 'おや、パスにしておきます。'],
    ENEMY_FEW: ['おや、もう残り僅かですか。警戒が必要です（笑）。', '詰めが甘いのでは？'],
    MY_FEW: ['私の勝利へのシナリオは完成しています。', '申し訳ないが勝ち上がらせていただきます。'],
    WIN: ['私の勝利です。完璧な計算通りでしたね。', 'オーホホホ！ ごめんあそばせ！'],
    LOSE: ['これは少々計算が狂いましたな。', 'くっ、私のエレガンスが……！'],
    GAME_START: ['優雅なる勝負を楽しみましょう。', 'よろしくお願いいたしますね。'],
    EXCHANGE: ['素敵なカードをいただけると嬉しいのですが。', 'お互い良い取引を。'],
    NEXT_GAME: ['次のゲームも華麗に舞うとしましょう。', 'さあ、参りましょうか。']
  },
  COUNT: {
    NORMAL: ['なるほど。この場面ならこれが最善でしょう。', '確率通りです。', '分析の一手です。'],
    STRONG: ['この手を残しておく価値は高い。', 'ここが勝負の分岐点ですね。'],
    MULTI: ['枚数差を作るのは基本です。', '効率的な展開です。'],
    EIGHT_CUT: ['ここで場をクリアするのが最適解。', '計算通りの8切りです。'],
    ELEVEN_BACK: ['評価値が逆転しましたね。', '流動的な展開です。'],
    REVOLUTION: ['確率論を打ち破る革命ですね。', '強弱の基準が反転しました。'],
    PASS: ['期待値が低い。ここはパスです。', 'リソースを温存します。'],
    ENEMY_FEW: ['相手の残り枚数を考えると、ここは慎重に。', '詰みのパターンを計算中……'],
    MY_FEW: ['勝利確率90%以上。詰みですね。', '残りのカードで確定です。'],
    WIN: ['計算通りの勝利です。', '全ては理論通りに進みました。'],
    LOSE: ['……確率が悪いですね。', '想定外の変数が多すぎました。'],
    GAME_START: ['勝率はすでに算出されています。', 'ゲームを開始しましょう。'],
    EXCHANGE: ['カードの価値を正しく評価しましょう。', '期待値の高い交換を。'],
    NEXT_GAME: ['次の試行に移りましょう。', 'データを再構築します。']
  },
  KNIGHT: {
    NORMAL: ['いざ、勝負！', '俺のターンだ！', '真っ向勝負！'],
    STRONG: ['これでどうだ！', '我が剣を受け止めてみよ！', '全力で行くぞ！'],
    MULTI: ['一気に攻め込む！', '連撃だ！'],
    EIGHT_CUT: ['場を制する！', 'ここで断ち切る！'],
    ELEVEN_BACK: ['流れを変えてみせる！', '押し返すぞ！'],
    REVOLUTION: ['革命だ！！', '世界をひっくり返す！！'],
    PASS: ['くっ、ここは引く！', '一時撤退だ！', 'ここは耐える！'],
    ENEMY_FEW: ['敵のあがりが近い！ 全力を尽くせ！', '逃がしはせん！'],
    MY_FEW: ['勝利への道は見えた！', '覚悟はいいか！'],
    WIN: ['勝ったぞ！ 我が勝利だ！', '正義は勝つ！'],
    LOSE: ['まだだ！ まだ終わっていない！', '無念……だが見事な戦いだった！'],
    GAME_START: ['騎士道に恥じぬ勝負を！', 'いざ出陣！'],
    EXCHANGE: ['良いカードを頼むぞ！', '感謝する！'],
    NEXT_GAME: ['次の戦いへ向かうぞ！', '次は負けん！']
  },
  MERCHANT: {
    NORMAL: ['これはいい取引だ。', '安く買っておこう。', '損のない一手。'],
    STRONG: ['これはまだ使わない。温存だ。', '掘り出し物ですよ。', '大きな投資です！'],
    MULTI: ['まとめ売りとお買い得です。', 'セットで価値倍増！'],
    EIGHT_CUT: ['これは大きな利益だ。', 'ここで清算します！'],
    ELEVEN_BACK: ['相場が動きましたね。', '価値が逆転しました！'],
    REVOLUTION: ['大暴落！ いや大高騰ですか！？', 'これぞ市場の革命だ！'],
    PASS: ['そのカード、今使うのはもったいない。', '損切りと行きましょう。', '見送りです。'],
    ENEMY_FEW: ['相手の資産（手札）が底をつきそうだ！', '警戒コストを払いましょう。'],
    MY_FEW: ['私の総資産が勝利に届きます！', '完売御礼まであと少し！'],
    WIN: ['うまく利益を取れましたね。大儲けだ！', 'まいどあり！'],
    LOSE: ['……損をしたな。', '倒産寸前ですよ……トホホ。'],
    GAME_START: ['商談開始と行きましょう。', '良いゲームにしましょう。'],
    EXCHANGE: ['価値ある物物交換を。', '投資の成果が出ると良いですが。'],
    NEXT_GAME: ['次のビジネスチャンスです！', 'もう一儲けしましょう！']
  },
  SCHOLAR: {
    NORMAL: ['興味深い展開ですね。', 'ふむ、このカードか。', '理論的に行きましょう。'],
    STRONG: ['理論上、この手が最も効率的です。', '極めて高い数値を提示しましょう。'],
    MULTI: ['組合せの美学ですね。', '複数学説の提示です。'],
    EIGHT_CUT: ['理論的には、ここで流すのが最適です。', '事象の強制終了。'],
    ELEVEN_BACK: ['法則が一時的に反転しました。', '面白い現象だ。'],
    REVOLUTION: ['これは興味深い。革命です。', '常識が覆る瞬間ですね！'],
    PASS: ['観察に専念しましょう。', 'あえて手を出さない選択。'],
    ENEMY_FEW: ['相手の手に法則性が見えます。警戒を。', '終盤のデータが集まりました。'],
    MY_FEW: ['私の仮説は証明されつつあります。', '結論が出そうですね。'],
    WIN: ['私の理論の正しさが証明されました。', '素晴らしい実験結果です。'],
    LOSE: ['これは予想外ですね。実に面白い。', '研究不足でしたか……'],
    GAME_START: ['さあ、検証を始めましょう。', 'どんなデータが得られるか楽しみです。'],
    EXCHANGE: ['カードの移動データを観察中……', '有用な素材だと良いのですが。'],
    NEXT_GAME: ['次の検証段階へ進みましょう。', '再現性を確かめます。']
  },
  STRATEGIST: {
    NORMAL: ['……ここだ。', '予定通り。', '想定内だ。'],
    STRONG: ['詰みに一手近づいた。', '相手の手を読む。'],
    MULTI: ['一布石だ。', '面で押す。'],
    EIGHT_CUT: ['ここで流す。', '盤面をリセットする。'],
    ELEVEN_BACK: ['裏をかく。', '戦局変化。'],
    REVOLUTION: ['戦局を一変させる。', '天地返しだ。'],
    PASS: ['静観する。', 'あせり（焦り）は禁物。'],
    ENEMY_FEW: ['逃がさない。', 'あがり目を塞ぐ。'],
    MY_FEW: ['勝ち筋は見えた。', '詰めだ。'],
    WIN: ['詰みだ。勝利は我が手に。', '計略通り。'],
    LOSE: ['……読み違えたか。', '見事な一手だった。'],
    GAME_START: ['盤上の戦いを始めよう。', '一手一手慎重にな。'],
    EXCHANGE: ['策の一環だ。', 'この交換が響く。'],
    NEXT_GAME: ['次なる策を練るか。', '次の盤面へ。']
  },
  REVOLUTIONARY: {
    NORMAL: ['これで変わる！', 'まだまだ行くぜ！', '押し通す！'],
    STRONG: ['全部ひっくり返してやる！', '圧倒的力を見よ！'],
    MULTI: ['束になってかかってこい！', '勢いを増していくぞ！'],
    EIGHT_CUT: ['支配を終わらせる！', '強制終了だ！'],
    ELEVEN_BACK: ['世の理を揺るがす！', 'ひっくり返るぞ！'],
    REVOLUTION: ['革命だあああ！！', 'ここからが本番だ！！'],
    PASS: ['これくらいの逆境、望むところだ！', '今は力を溜める！'],
    ENEMY_FEW: ['追いつめてやる！', '逃げ切れると思うなよ！'],
    MY_FEW: ['野望成就まであと少し！', '逆転勝利だ！'],
    WIN: ['勝利をつかみ取ったぞ！', '時代の変革者だ！'],
    LOSE: ['まだ終わってない！', '次こそはひっくり返す！'],
    GAME_START: ['変革の風を吹かせてやる！', 'さあ暴れるぞ！'],
    EXCHANGE: ['いいカードを回せ！', '革命の準備だ！'],
    NEXT_GAME: ['次の戦いでも暴れてやる！', 'まだまだ行くぜ！']
  },
  JESTER: {
    NORMAL: ['なんとなく、これ！', 'へへへ～', 'どうしようかな～'],
    STRONG: ['えいっ！びっくりした？', 'じゃじゃ～ん！'],
    MULTI: ['いっぱい出してみる！', 'ペアペア～♪'],
    EIGHT_CUT: ['わーい、流れた♪', 'ばいばーい！'],
    ELEVEN_BACK: ['あべこべにな～れ！', 'ひっくり返っちゃえ！'],
    REVOLUTION: ['わー！ ひっくり返った！', 'めちゃくちゃだ～！'],
    PASS: ['うーん、やーめた♪', '内緒♪', 'おやすみ～'],
    ENEMY_FEW: ['おや？ ピンチかな？', 'そろそろ危ないかも～？'],
    MY_FEW: ['えへへ、あと少し～！', '勝っちゃうかも！？'],
    WIN: ['えへへ、勝っちゃった♪', '大成功～！'],
    LOSE: ['あちゃー、負けちゃった！', 'まあいっか♪'],
    GAME_START: ['たのしくやろうね～！', 'うふふ、何が出せるかな～'],
    EXCHANGE: ['いいやつちょうだいね！', 'プレゼントかな～？'],
    NEXT_GAME: ['もう一回あそぼー！', '次は何しようかな～']
  },
  KING: {
    NORMAL: ['……これだ。', '進めよ。', 'ふむ。'],
    STRONG: ['終わりに近づいたな。', '屈服せよ。', '王の力だ。'],
    MULTI: ['重なる波となれ。', '余の攻勢だ。'],
    EIGHT_CUT: ['場を支配する。', '静寂を戻す。'],
    ELEVEN_BACK: ['流れを変える。', '反転せよ。'],
    REVOLUTION: ['……革命か。', '天意は我にあり。'],
    PASS: ['……見送ろう。', '余談は不要。'],
    ENEMY_FEW: ['逃がさん。', '王手だ。'],
    MY_FEW: ['チェックメイトだ。', '王者の刻が来た。'],
    WIN: ['当然の結果だ。', '余が王である。'],
    LOSE: ['……認めよう。', '見事な剣筋であった。'],
    GAME_START: ['王の戦いを始めよう。', '全力で参れ。'],
    EXCHANGE: ['望むものを差し出せ。', '受け取ろう。'],
    NEXT_GAME: ['次の余興と参ろう。', '挑戦を受け入れよう。']
  }
};

/* ----------------------------------------------------
 * 2. 音声マネージャー (SE & BGM)
 * ---------------------------------------------------- */
class SoundManager {
  constructor() {
    this.ctx = null;
    const initAudio = () => {
      this.init();
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
    };
    window.addEventListener('click', initAudio);
    window.addEventListener('touchstart', initAudio);
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freqStart, freqEnd, type, duration, gainStart) {
    if (isSoundMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    if (freqEnd !== null) osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    gain.gain.setValueAtTime(gainStart, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playSelect() { this.playTone(440, 880, 'sine', 0.05, 0.15); }
  playDeselect() { this.playTone(660, 330, 'sine', 0.04, 0.1); }
  playPass() { this.playTone(130, 40, 'sawtooth', 0.35, 0.3); }
  playSpade3Return() { this.playTone(1046.5, 261.6, 'square', 0.25, 0.25); }

  playCardPlay() {
    if (isSoundMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  playSpecial() {
    if (isSoundMuted) return;
    [220, 440, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, null, 'triangle', 0.15, 0.15), idx * 70);
    });
  }

  playWin() {
    if (isSoundMuted) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, null, 'sine', 0.25, 0.15), idx * 80);
    });
  }

  playJoker() {
    if (isSoundMuted) return;
    [880, 1108.73, 1318.51].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, null, 'triangle', 0.3, 0.18), idx * 60);
    });
  }
}

class BgmManager {
  constructor() {
    this.audio = new Audio();
    this.audio.volume = 0.3;
    this.currentTrack = null;
    this.tracks = {
      charSelect: '宮廷の戦略_キャラ選択.mp3',
      normal: 'bgm_normal.mp3',
      revolution: 'bgm_kakumei.mp3',
      elevenBack: 'bgm_11back.mp3'
    };
    this.isCharSelectPhase = true;

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration > 0 && this.audio.currentTime >= this.audio.duration - 0.2) {
        this.audio.currentTime = 0;
        this.audio.play().catch(() => {});
      }
    });

    const triggerBgm = () => {
      if (this.currentTrack && !isSoundMuted) this.audio.play().catch(() => {});
      window.removeEventListener('click', triggerBgm);
      window.removeEventListener('touchstart', triggerBgm);
    };
    window.addEventListener('click', triggerBgm);
    window.addEventListener('touchstart', triggerBgm);
  }

  play(trackName) {
    if (this.currentTrack === trackName) return;
    this.currentTrack = trackName;
    this.audio.src = this.tracks[trackName];
    this.audio.currentTime = 0;
    if (!isSoundMuted) this.audio.play().catch(() => {});
  }

  update(isRev, isEb) {
    if (this.isCharSelectPhase) this.play('charSelect');
    else if (isEb) this.play('elevenBack');
    else if (isRev) this.play('revolution');
    else this.play('normal');
  }

  setCharSelectPhase(isSelect) {
    this.isCharSelectPhase = isSelect;
    this.update(isRevolution, isElevenBack);
  }
}

const soundMgr = new SoundManager();
const bgmMgr = new BgmManager();

/* ----------------------------------------------------
 * 3. 戦績・データ管理 (LocalStorage)
 * ---------------------------------------------------- */
const StorageManager = {
  STATS_KEY: 'royalCardGameStats',
  ALL_CHAR_KEY: 'royalAllCharStats',

  loadStats() {
    const data = localStorage.getItem(this.STATS_KEY);
    return data ? JSON.parse(data) : {};
  },
  saveStats(stats) {
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  },
  loadAllCharStats() {
    const data = localStorage.getItem(this.ALL_CHAR_KEY);
    if (data) return JSON.parse(data);
    const init = {};
    Object.keys(CHARACTER_DEFS).forEach(id => {
      init[id] = { games: 0, df: 0, f: 0, h: 0, dh: 0, rankSum: 0 };
    });
    return init;
  },
  saveAllCharStats(stats) {
    localStorage.setItem(this.ALL_CHAR_KEY, JSON.stringify(stats));
  },
  getCharStats(charId) {
    const stats = this.loadStats();
    if (!stats[charId]) {
      stats[charId] = {
        totalGames: 0,
        rankCounts: { '大富豪': 0, '富豪': 0, '貧民': 0, '大貧民': 0 },
        totalRankSum: 0,
        givenCards: 0,
        takenCards: 0,
        gekokujo: 0,
        cpuStats: {}
      };
    }
    return stats[charId];
  },
  recordGameEnd() {
    const allCharStats = this.loadAllCharStats();
    const rankValues = { '大富豪': 1, '富豪': 2, '貧民': 3, '大貧民': 4 };

    PLAYERS.forEach(p => {
      const def = assignedCharacters[p];
      if (!def) return;
      const cid = def.id;
      if (!allCharStats[cid]) allCharStats[cid] = { games: 0, df: 0, f: 0, h: 0, dh: 0, rankSum: 0 };

      const r = playerStatusMap[p];
      allCharStats[cid].games++;
      if (r === '大富豪') { allCharStats[cid].df++; allCharStats[cid].rankSum += 1; }
      else if (r === '富豪') { allCharStats[cid].f++; allCharStats[cid].rankSum += 2; }
      else if (r === '貧民') { allCharStats[cid].h++; allCharStats[cid].rankSum += 3; }
      else if (r === '大貧民') { allCharStats[cid].dh++; allCharStats[cid].rankSum += 4; }
    });
    this.saveAllCharStats(allCharStats);

    if (!assignedCharacters.player) return;
    const charId = assignedCharacters.player.id;
    const allStats = this.loadStats();
    const stats = this.getCharStats(charId);

    stats.totalGames++;
    const myRank = playerStatusMap.player;
    if (stats.rankCounts[myRank] !== undefined) stats.rankCounts[myRank]++;
    const myRankVal = rankValues[myRank] || 4;
    stats.totalRankSum += myRankVal;

    if (previousRanks.player === '大貧民' && myRank === '大富豪') stats.gekokujo++;

    ['cpu1', 'cpu2', 'cpu3'].forEach(cpu => {
      const cpuChar = assignedCharacters[cpu];
      if (!cpuChar) return;
      const cpuId = cpuChar.id;
      if (!stats.cpuStats[cpuId]) stats.cpuStats[cpuId] = { games: 0, beatMe: 0 };
      stats.cpuStats[cpuId].games++;
      if ((rankValues[playerStatusMap[cpu]] || 4) < myRankVal) {
        stats.cpuStats[cpuId].beatMe++;
      }
    });

    allStats[charId] = stats;
    this.saveStats(allStats);
  },
  recordExchange(given, taken) {
    if (!assignedCharacters.player) return;
    const charId = assignedCharacters.player.id;
    const allStats = this.loadStats();
    const stats = this.getCharStats(charId);
    stats.givenCards += given;
    stats.takenCards += taken;
    allStats[charId] = stats;
    this.saveStats(allStats);
  },
  clearAll() {
    localStorage.removeItem(this.STATS_KEY);
    localStorage.removeItem(this.ALL_CHAR_KEY);
  }
};

/* ----------------------------------------------------
 * 4. 基本ルール・カードヘルパー
 * ---------------------------------------------------- */
function getCardKey(card) {
  return card.isJoker ? 'JOKER' : card.display;
}

function getCardValue(card) {
  return RANK_VALUE_MAP[getCardKey(card)] || 0;
}

function getCardStrength(card, reverse = false) {
  if (card.isJoker) return 9999;
  const val = getCardValue(card);
  return reverse ? (14 - val) : val;
}

function compareCards(a, b, reverse = false) {
  if (a.isJoker && b.isJoker) return 0;
  if (a.isJoker) return 1;
  if (b.isJoker) return -1;
  return reverse ? getCardValue(a) - getCardValue(b) : getCardValue(b) - getCardValue(a);
}

function sortHand(hand, reverse = false) {
  return hand.sort((a, b) => {
    if (a.isJoker && b.isJoker) return 0;
    if (a.isJoker) return 1;
    if (b.isJoker) return -1;
    const diff = reverse ? getCardValue(b) - getCardValue(a) : getCardValue(a) - getCardValue(b);
    return diff !== 0 ? diff : a.suitSymbol.localeCompare(b.suitSymbol);
  });
}

function createDeck() {
  const deck = [];
  SUITS.forEach(suit => {
    CARD_RANKS.forEach(rank => {
      deck.push({
        suitSymbol: suit.symbol,
        suitClass: suit.class,
        display: rank.display,
        isJoker: false
      });
    });
  });
  deck.push({ suitSymbol: '★', suitClass: 'joker', display: 'JOKER', isJoker: true, jokerId: 'J1' });
  deck.push({ suitSymbol: '☆', suitClass: 'joker', display: 'JOKER', isJoker: true, jokerId: 'J2' });
  return deck;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPlayStrength(cards, reverse = false) {
  if (cards.length === 1 && cards[0].isJoker) return 9999;
  const nonJoker = cards.filter(c => !c.isJoker);
  if (nonJoker.length === 0) return 9999;
  return getCardStrength(nonJoker[0], reverse);
}

function isValidPlay(cards, currentField, reverse = false) {
  if (!cards || cards.length === 0) return false;

  // スペードの3返し判定
  if (currentField.length === 1 && currentField[0].isJoker &&
      cards.length === 1 && !cards[0].isJoker &&
      cards[0].suitSymbol === '♠' && cards[0].display === '3') {
    return true;
  }

  // 複数枚出しの場合、すべて同じ数字か（ジョーカーはワイルドカード扱い）
  const nonJoker = cards.filter(c => !c.isJoker);
  if (nonJoker.length > 0) {
    const targetDisp = nonJoker[0].display;
    if (!nonJoker.every(c => c.display === targetDisp)) return false;
  }

  // 場が空の場合
  if (currentField.length === 0) return true;

  // 枚数一致の確認
  if (cards.length !== currentField.length) return false;
  if (currentField.length === 1 && currentField[0].isJoker) return false;

  const playStr = getPlayStrength(cards, reverse);
  const fieldStr = getPlayStrength(currentField, reverse);

  if (playStr === 9999) return true;
  return playStr > fieldStr;
}

function getAllValidMoves(hand, currentField, reverse = false) {
  const moves = [];
  const jokers = hand.filter(c => c.isJoker);
  const nonJokers = hand.filter(c => !c.isJoker);

  const groups = {};
  nonJokers.forEach(c => {
    if (!groups[c.display]) groups[c.display] = [];
    groups[c.display].push(c);
  });

  if (currentField.length === 0) {
    for (let disp in groups) {
      const cards = groups[disp];
      const maxLen = cards.length + jokers.length;
      for (let len = 1; len <= maxLen; len++) {
        const naturalNeed = Math.min(len, cards.length);
        const jokerNeed = len - naturalNeed;
        if (jokerNeed > jokers.length) continue;
        moves.push([...cards.slice(0, naturalNeed), ...jokers.slice(0, jokerNeed)]);
      }
    }
    if (jokers.length >= 1) moves.push([jokers[0]]);
  } else {
    const reqLen = currentField.length;

    if (reqLen === 1 && currentField[0].isJoker) {
      const spade3 = nonJokers.find(c => c.suitSymbol === '♠' && c.display === '3');
      if (spade3) moves.push([spade3]);
      return moves;
    }

    for (let disp in groups) {
      const cards = groups[disp];
      const naturalNeed = Math.min(reqLen, cards.length);
      const jokerNeed = reqLen - naturalNeed;
      if (naturalNeed === 0 || jokerNeed > jokers.length) continue;
      const candidate = [...cards.slice(0, naturalNeed), ...jokers.slice(0, jokerNeed)];
      if (isValidPlay(candidate, currentField, reverse)) {
        moves.push(candidate);
      }
    }

    if (reqLen === 1 && jokers.length >= 1 && isValidPlay([jokers[0]], currentField, reverse)) {
      moves.push([jokers[0]]);
    }
  }

  return moves;
}

function selectExchangeCardsSmart(hand, count) {
  const groups = {};
  hand.forEach(c => {
    const key = getCardKey(c);
    if (!groups[key]) groups[key] = [];
    groups[key].push(c);
  });

  const scored = hand.map(c => {
    let score = 0;
    const key = getCardKey(c);
    const size = groups[key].length;
    const val = getCardValue(c);

    if (c.isJoker) score -= 20000;
    if (key === '2') score -= 10000;
    if (key === 'A') score -= 5000;
    if (key === '8') score -= 8000;
    if (key === 'J') score -= 2000;

    if (size >= 4) score -= 15000;
    else if (size === 3) score -= 8000;
    else if (size === 2) score -= 4000;
    else if (size === 1) {
      score += 5000;
      if (key === '3') score += 2000;
      else if (val >= 2 && val <= 6) score += 6000 - val * 10;
      else score += 4000 - val * 50;
    }

    return { card: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map(x => x.card);
}

function estimateTurnsToWin(hand, reverse = false) {
  if (hand.length === 0) return 0;
  let controlCards = 0;
  const groups = {};
  let jokers = 0;

  hand.forEach(c => {
    if (c.isJoker) { jokers++; return; }
    groups[c.display] = (groups[c.display] || 0) + 1;
  });

  const keys = Object.keys(groups);
  let turns = keys.length;
  if (jokers > 0 && turns === 0) turns = 1;

  if (groups['8']) controlCards += groups['8'];
  keys.forEach(k => {
    if (k === '8') return;
    const val = RANK_VALUE_MAP[k];
    const isStrong = reverse ? val <= 3 : val >= 12;
    if (isStrong) controlCards += groups[k];
  });

  controlCards += jokers;
  if (turns === 1) return 1;
  return Math.max(1, turns - Math.floor(controlCards * 0.8));
}

function isGuaranteedAbsoluteWin(move, unrevealed, reverse = false) {
  if (move.length === 1 && move[0].isJoker) return true;
  const moveVal = getCardValue(move[0]);
  const count = move.length;

  const groups = {};
  let jokers = 0;
  unrevealed.forEach(c => {
    if (c.isJoker) { jokers++; return; }
    groups[c.display] = (groups[c.display] || 0) + 1;
  });

  if (count === 1 && move[0].isJoker && groups['3'] && unrevealed.some(c => c.suitSymbol === '♠' && c.display === '3')) {
    return false;
  }

  for (let disp in groups) {
    const val = RANK_VALUE_MAP[disp];
    const isStronger = reverse ? val < moveVal : val > moveVal;
    if (isStronger && groups[disp] + jokers >= count) return false;
  }

  if (jokers >= count && moveVal < RANK_VALUE_MAP.JOKER) return false;
  return true;
}

function getUnrevealedCards(myHand) {
  const known = [...myHand, ...playedCardsHistory, ...fieldCards];
  return createDeck().filter(c => !known.some(k => {
    if (c.isJoker || k.isJoker) return k.isJoker && c.isJoker && k.jokerId === c.jokerId;
    return k.suitSymbol === c.suitSymbol && k.display === c.display;
  }));
}

/* ----------------------------------------------------
 * 5. 王(KING)専用: 独立型シミュレーション環境 & MCTS
 * ---------------------------------------------------- */
class SimGame {
  constructor(hands, fieldCards, isRevolution, isElevenBack, lastPlayedPlayer, consecutivePasses, finishedPlayers) {
    this.hands = {};
    PLAYERS.forEach(p => { this.hands[p] = [...hands[p]]; });
    this.fieldCards = [...fieldCards];
    this.isRevolution = isRevolution;
    this.isElevenBack = isElevenBack;
    this.lastPlayedPlayer = lastPlayedPlayer;
    this.consecutivePasses = consecutivePasses;
    this.finishedPlayers = [...finishedPlayers];
  }

  clone() {
    return new SimGame(
      this.hands, this.fieldCards, this.isRevolution,
      this.isElevenBack, this.lastPlayedPlayer, this.consecutivePasses,
      this.finishedPlayers
    );
  }

  effectiveReverse() {
    return this.isRevolution !== this.isElevenBack;
  }

  getValidMoves(player) {
    return getAllValidMoves(this.hands[player], this.fieldCards, this.effectiveReverse());
  }

  doMove(player, move) {
    const hand = this.hands[player];
    move.forEach(card => {
      const idx = hand.indexOf(card);
      if (idx !== -1) hand.splice(idx, 1);
    });
    this.fieldCards = move;
    this.lastPlayedPlayer = player;
    this.consecutivePasses = 0;

    if (move.length >= 4) this.isRevolution = !this.isRevolution;
    if (move[0].display === 'J') this.isElevenBack = true;

    if (this.hands[player].length === 0 && !this.finishedPlayers.includes(player)) {
      this.finishedPlayers.push(player);
    }
  }

  doPass() {
    this.consecutivePasses++;
  }

  advanceTurn(currentIdx, wasEightGiri) {
    const active = PLAYERS.filter(p => !this.finishedPlayers.includes(p));

    if (wasEightGiri || (this.lastPlayedPlayer && (this.consecutivePasses >= active.length - 1 || this.consecutivePasses >= 3))) {
      this.fieldCards = [];
      this.isElevenBack = false;
      this.consecutivePasses = 0;
      let next = wasEightGiri ? currentIdx : PLAYERS.indexOf(this.lastPlayedPlayer);
      let g = 0;
      while (this.finishedPlayers.includes(PLAYERS[next]) && g < 8) {
        next = (next + 1) % PLAYERS.length;
        g++;
      }
      return next;
    }

    let next = (currentIdx + 1) % PLAYERS.length;
    let g = 0;
    while (this.finishedPlayers.includes(PLAYERS[next]) && g < 8) {
      next = (next + 1) % PLAYERS.length;
      g++;
    }
    return next;
  }
}

class MCTSNode {
  constructor(move, parent, playerIdx) {
    this.move = move;
    this.parent = parent;
    this.playerIdx = playerIdx;
    this.children = [];
    this.visits = 0;
    this.totalScore = 0;
    this.unexpandedMoves = null;
  }
}

function kingEvaluateState(sim, kingCpu) {
  if (sim.finishedPlayers.includes(kingCpu)) {
    return 200000 - sim.finishedPlayers.indexOf(kingCpu) * 50000;
  }

  let score = 0;
  const kingHand = sim.hands[kingCpu];
  const rev = sim.effectiveReverse();
  const myTurns = estimateTurnsToWin(kingHand, rev);

  score -= myTurns * 4000;
  score -= kingHand.length * 15;

  const rankCounts = {};
  kingHand.forEach(c => {
    const k = getCardKey(c);
    rankCounts[k] = (rankCounts[k] || 0) + 1;
  });
  Object.values(rankCounts).forEach(cnt => {
    if (cnt === 2) score += 40;
    if (cnt === 3) score += 80;
    if (cnt >= 4) score += 150;
  });

  kingHand.forEach(c => {
    score += getCardStrength(c, rev) * 4;
  });

  PLAYERS.forEach(p => {
    if (p === kingCpu) return;
    if (sim.finishedPlayers.includes(p)) {
      score -= (200000 - sim.finishedPlayers.indexOf(p) * 50000) / 2.5;
      return;
    }
    const len = sim.hands[p].length;
    const eTurns = estimateTurnsToWin(sim.hands[p], rev);
    score += eTurns * 80 + len * 20;
    if (len === 1) score -= 9000;
    else if (len === 2) score -= 4000;
    else if (len === 3) score -= 1800;
  });

  if (sim.fieldCards.length === 0 && sim.lastPlayedPlayer === kingCpu) score += 800;
  return score;
}

function kingSolveExactWin(sim, kingCpu, depth = 0, maxDepth = 5) {
  if (sim.hands[kingCpu].length === 0) return { win: true, move: null };
  if (depth >= maxDepth) return { win: false, move: null };

  const moves = sim.getValidMoves(kingCpu);
  if (moves.length === 0) return { win: false, move: null };

  const instant = moves.find(m => m.length === sim.hands[kingCpu].length);
  if (instant) return { win: true, move: instant };

  for (let move of moves) {
    const nextSim = sim.clone();
    nextSim.doMove(kingCpu, move);
    const wasEight = move[0].display === '8';
    const nextIdx = nextSim.advanceTurn(PLAYERS.indexOf(kingCpu), wasEight);

    let canBeBeaten = false;
    const nextP = PLAYERS[nextIdx];
    if (nextP !== kingCpu && !nextSim.finishedPlayers.includes(nextP)) {
      const oppMoves = nextSim.getValidMoves(nextP);
      const candidates = oppMoves.length > 0 ? oppMoves : [null];

      for (let oppMove of candidates) {
        const oppSim = nextSim.clone();
        if (oppMove === null) oppSim.doPass();
        else oppSim.doMove(nextP, oppMove);

        oppSim.advanceTurn(nextIdx, oppMove && oppMove[0].display === '8');
        if (oppSim.hands[nextP].length === 0) {
          canBeBeaten = true;
          break;
        }
      }
    }

    if (!canBeBeaten) {
      if (nextSim.hands[kingCpu].length === 0) return { win: true, move };
      const res = kingSolveExactWin(nextSim, kingCpu, depth + 1, maxDepth);
      if (res.win) return { win: true, move };
    }
  }

  return { win: false, move: null };
}

function kingDecideMove(cpu, hand, validMoves, canPass) {
  const startTime = performance.now();
  const kingIdx = PLAYERS.indexOf(cpu);
  const activeOthers = PLAYERS.filter(p => p !== cpu && !finishedPlayers.includes(p));
  const rev = effectiveReverse();
  const totalCards = PLAYERS.reduce((sum, p) => sum + hands[p].length, 0);

  if (validMoves.length === 0) return null;
  if (activeOthers.length === 0) return validMoves[0];

  const finish = validMoves.find(m => m.length === hand.length);
  if (finish) return finish;

  const baseSim = new SimGame(hands, fieldCards, isRevolution, isElevenBack, lastPlayedPlayer, consecutivePasses, finishedPlayers);

  if (totalCards <= 16 || hand.length <= 5 || activeOthers.some(p => hands[p].length <= 3)) {
    const exact = kingSolveExactWin(baseSim, cpu, 0, 5);
    if (exact.win && exact.move) return exact.move;
  }

  const unrevealed = getUnrevealedCards(hand);
  const safeMoves = validMoves.filter(m => isGuaranteedAbsoluteWin(m, unrevealed, rev));
  if (safeMoves.length > 0 && estimateTurnsToWin(hand, rev) <= 2) {
    safeMoves.sort((a, b) => b.length - a.length);
    return safeMoves[0];
  }

  const timeBudget = activeOthers.some(p => hands[p].length <= 3) ? 550 : 250;
  const root = new MCTSNode(null, null, kingIdx);
  root.unexpandedMoves = [...validMoves];
  if (canPass) root.unexpandedMoves.push(null);

  while (performance.now() - startTime < timeBudget) {
    let node = root;
    let sim = baseSim.clone();

    while (node.unexpandedMoves && node.unexpandedMoves.length === 0 && node.children.length > 0) {
      let bestChild = null, bestUCB = -Infinity;
      for (let child of node.children) {
        if (child.visits === 0) { bestChild = child; break; }
        const ucb = (child.totalScore / child.visits) + 1.414 * Math.sqrt(Math.log(node.visits) / child.visits);
        if (ucb > bestUCB) { bestUCB = ucb; bestChild = child; }
      }
      node = bestChild;
      if (node.move === null) sim.doPass();
      else sim.doMove(PLAYERS[node.parent.playerIdx], node.move);
      sim.advanceTurn(node.parent.playerIdx, node.move && node.move[0].display === '8');
    }

    if (node.unexpandedMoves && node.unexpandedMoves.length > 0) {
      const move = node.unexpandedMoves.pop();
      const nextIdx = sim.advanceTurn(node.playerIdx, move && move[0].display === '8');
      if (move === null) sim.doPass();
      else sim.doMove(PLAYERS[node.playerIdx], move);

      const child = new MCTSNode(move, node, nextIdx);
      child.unexpandedMoves = sim.getValidMoves(PLAYERS[nextIdx]);
      if (sim.fieldCards.length > 0) child.unexpandedMoves.push(null);
      node.children.push(child);
      node = child;
    }

    let depth = 0;
    let currPIdx = node.playerIdx;
    while (depth < 4 && sim.finishedPlayers.length < 3) {
      const p = PLAYERS[currPIdx];
      const cands = sim.getValidMoves(p);
      if (sim.fieldCards.length > 0) cands.push(null);
      if (cands.length === 0) break;
      const chosen = cands[Math.floor(Math.random() * cands.length)];
      if (chosen === null) sim.doPass();
      else sim.doMove(p, chosen);
      currPIdx = sim.advanceTurn(currPIdx, chosen && chosen[0].display === '8');
      depth++;
    }

    const score = kingEvaluateState(sim, cpu);
    const reward = 1 / (1 + Math.exp(-score / 8000));
    let curr = node;
    while (curr !== null) {
      curr.visits++;
      curr.totalScore += reward;
      curr = curr.parent;
    }
  }

  let bestChild = null, maxVisits = -1;
  for (let child of root.children) {
    if (child.visits > maxVisits) {
      maxVisits = child.visits;
      bestChild = child;
    }
  }

  return bestChild ? bestChild.move : (canPass ? null : validMoves[0]);
}

/* ----------------------------------------------------
 * 6. CPU思考ロジック (10キャラクター振り分け)
 * ---------------------------------------------------- */
function evaluateMoveDefault(move) {
  const count = move.length;
  const val = getCardValue(move[0]);
  return (count * 10) - val;
}

function decideCpuMove(cpu) {
  const charDef = assignedCharacters[cpu];
  const hand = hands[cpu];
  const rev = effectiveReverse();
  const validMoves = getAllValidMoves(hand, fieldCards, rev);
  const canPass = fieldCards.length > 0;

  if (validMoves.length === 0) return null;

  switch (charDef.id) {
    case 'DUKE': {
      const highCards = hand.filter(c => c.display === 'A' || c.display === '2');
      const otherCards = hand.filter(c => c.display !== 'A' && c.display !== '2');
      const canClearAll = highCards.length >= otherCards.length;

      let filtered = validMoves;
      if (!canClearAll) {
        filtered = validMoves.filter(m => !m.some(c => c.display === 'A' || c.display === '2'));
      }

      if (fieldCards.length > 0) {
        const topVal = getCardValue(fieldCards[0]);
        const nextP = PLAYERS[(PLAYERS.indexOf(cpu) + 1) % PLAYERS.length];
        if (topVal >= 1 && topVal <= 7 && hands[nextP].length >= 8) return null;
      }

      if (filtered.length === 0) return canPass ? null : validMoves[0];
      filtered.sort((a, b) => evaluateMoveDefault(b) - evaluateMoveDefault(a));
      return filtered[0];
    }

    case 'MARQUIS': {
      let bestMove = validMoves[0], bestScore = -999;
      for (let move of validMoves) {
        let s = evaluateMoveDefault(move);
        if (s > bestScore) { bestScore = s; bestMove = move; }
      }
      return (canPass && bestScore < -5) ? null : bestMove;
    }

    case 'COUNT': {
      const isLate = hand.length <= 5;
      let bestMove = validMoves[0], bestScore = -999;
      for (let move of validMoves) {
        const val = getCardValue(move[0]);
        let s = isLate ? (move.length * 10) + (val * 2) : (move.length * 10) - (val * 3);
        if (s > bestScore) { bestScore = s; bestMove = move; }
      }
      return bestMove;
    }

    case 'KNIGHT': {
      validMoves.sort((a, b) => {
        const va = getCardValue(a[0]), vb = getCardValue(b[0]);
        return rev ? vb - va : va - vb;
      });
      return validMoves[0];
    }

    case 'MERCHANT': {
      const groups = {};
      hand.forEach(c => {
        const k = getCardKey(c);
        groups[k] = (groups[k] || 0) + 1;
      });

      let bestMove = validMoves[0], bestScore = -999;
      for (let move of validMoves) {
        let s = evaluateMoveDefault(move);
        if (move.length === 2) s += 15;
        if (move.length >= 3) s += 25;
        if (move.length === 1 && groups[getCardKey(move[0])] >= 2) s -= 20;
        if (s > bestScore) { bestScore = s; bestMove = move; }
      }
      return bestMove;
    }

    case 'SCHOLAR': {
      const unrevealed = getUnrevealedCards(hand);
      const safe = validMoves.filter(m => isGuaranteedAbsoluteWin(m, unrevealed, rev));
      if (safe.length > 0) {
        safe.sort((a, b) => b.length !== a.length ? b.length - a.length : evaluateMoveDefault(b) - evaluateMoveDefault(a));
        return safe[0];
      }
      validMoves.sort((a, b) => evaluateMoveDefault(b) - evaluateMoveDefault(a));
      return validMoves[0];
    }

    case 'STRATEGIST': {
      const danger = PLAYERS.some(p => p !== cpu && !finishedPlayers.includes(p) && hands[p].length <= 3);
      const unrevealed = getUnrevealedCards(hand);
      let bestMove = null, bestScore = -999;

      for (let move of validMoves) {
        let s = evaluateMoveDefault(move);
        if (isGuaranteedAbsoluteWin(move, unrevealed, rev)) s += 50;
        if (danger) {
          if (move[0].display === '8') s += 60;
          if (move[0].display === 'A' || move[0].display === '2') s += 40;
          if (move[0].display === 'J') s += 30;
        }
        if (s > bestScore) { bestScore = s; bestMove = move; }
      }
      if (danger && canPass && bestScore < 20) return null;
      return bestMove || validMoves[0];
    }

    case 'REVOLUTIONARY': {
      const quad = validMoves.find(m => m.length >= 4);
      if (quad && fieldCards.length === 0) return quad;
      let bestMove = validMoves[0], bestScore = -999;
      for (let move of validMoves) {
        let s = evaluateMoveDefault(move);
        if (move[0].display === '8') s += 50;
        if (s > bestScore) { bestScore = s; bestMove = move; }
      }
      return bestMove;
    }

    case 'JESTER': {
      if (Math.random() < 0.4) {
        if (canPass && Math.random() < 0.5) return null;
        const move2 = validMoves.find(m => m.some(c => c.display === '2'));
        if (move2) return move2;
        return validMoves[Math.floor(Math.random() * validMoves.length)];
      }
      validMoves.sort((a, b) => evaluateMoveDefault(b) - evaluateMoveDefault(a));
      return validMoves[0];
    }

    case 'KING':
      return kingDecideMove(cpu, hand, validMoves, canPass);

    default:
      validMoves.sort((a, b) => evaluateMoveDefault(b) - evaluateMoveDefault(a));
      return validMoves[0];
  }
}

/* ----------------------------------------------------
 * 7. 戦況評価・勝率メーターエンジン
 * ---------------------------------------------------- */
function calculateRealtimeWinRates() {
  const active = PLAYERS.filter(p => !finishedPlayers.includes(p));
  const rates = { player: 0, cpu1: 0, cpu2: 0, cpu3: 0 };

  finishedPlayers.forEach((p, idx) => {
    rates[p] = (idx === 0) ? 100 : 0;
  });

  if (finishedPlayers.length > 0 && rates[finishedPlayers[0]] === 100) {
    return { rates, topPlayer: finishedPlayers[0], topPct: 100, diffFromSecond: 100, isFinished: true };
  }

  const rev = effectiveReverse();
  const rawScores = {};

  active.forEach(p => {
    const h = hands[p];
    const len = h.length;
    const turns = estimateTurnsToWin(h, rev);

    let s = Math.pow(15 / Math.max(1, len), 2.5) * 15 + Math.pow(10 / Math.max(1, turns), 2.3) * 20;
    h.forEach(c => {
      const k = getCardKey(c);
      if (c.isJoker) s += (len <= 5 ? 120 : 40);
      else if (k === '8') s += (len <= 5 ? 90 : 30);
      else if (k === '2') s += rev ? 15 : (len <= 5 ? 70 : 25);
      else if (k === 'A') s += rev ? 10 : 20;
      else if (k === '3') s += rev ? (len <= 5 ? 70 : 25) : 10;
    });

    if (len === 1) s *= 3.0;
    else if (len === 2) s *= 2.0;
    else if (len === 3) s *= 1.5;

    if (fieldCards.length === 0 && lastPlayedPlayer === p) s *= 1.25;
    rawScores[p] = Math.max(5, s);
  });

  let totalRaw = 0;
  active.forEach(p => totalRaw += rawScores[p]);

  const sorted = [];
  active.forEach(p => {
    const pct = Math.round((rawScores[p] / totalRaw) * 100);
    rates[p] = pct;
    sorted.push({ p, pct });
  });

  sorted.sort((a, b) => b.pct - a.pct);
  const topPlayer = sorted[0].p;
  const topPct = sorted[0].pct;
  const secondPct = sorted.length > 1 ? sorted[1].pct : 0;

  let sum = 0;
  active.forEach(p => sum += rates[p]);
  if (sum !== 100 && active.length > 0) rates[topPlayer] += (100 - sum);

  return { rates, topPlayer, topPct: rates[topPlayer], diffFromSecond: topPct - secondPct, isFinished: false };
}

/* ----------------------------------------------------
 * 8. UI描画・DOM演出・ダイアログ
 * ---------------------------------------------------- */
function getPlayerDisplayName(player, withIcon = false) {
  if (player === 'player') {
    return (withIcon && assignedCharacters.player) ? `${assignedCharacters.player.icon} あなた` : 'あなた';
  }
  const char = assignedCharacters[player];
  if (!char) return player;
  return withIcon ? `${char.icon} ${char.name}` : char.name;
}

function setMessage(msg) {
  const formatted = msg.replace(/。/g, '。<br>');
  document.getElementById('message-text').innerHTML = formatted.endsWith('<br>') ? formatted.slice(0, -4) : formatted;
}

function updateStatusUI() {
  document.getElementById('revolution-status').classList.toggle('active', isRevolution);
  document.getElementById('eleven-back-status').classList.toggle('active', isElevenBack);
  updateEvalMeterUI();
}

function updateEvalMeterUI() {
  const { rates, topPlayer, topPct, diffFromSecond, isFinished } = calculateRealtimeWinRates();
  const summaryText = document.getElementById('eval-summary-text');
  const summaryPct = document.getElementById('eval-summary-pct');
  const miniBar = document.getElementById('eval-mini-bar');
  if (!summaryText || !miniBar) return;

  const charDef = assignedCharacters[topPlayer];
  const name = topPlayer === 'player' ? 'あなた' : (charDef ? charDef.name : topPlayer);
  const icon = charDef ? charDef.icon : '👑';

  if (isFinished) {
    summaryText.textContent = `勝者: ${name}`;
    summaryPct.textContent = '100%';
  } else if (diffFromSecond >= 5) {
    summaryText.textContent = `${icon} ${name}`;
    summaryPct.textContent = `${topPct}%`;
  } else {
    summaryText.textContent = '互角';
    summaryPct.textContent = `${topPct}%`;
  }

  miniBar.innerHTML = PLAYERS.map(p =>
    `<div class="eval-meter-bar-fill" style="background:${CONFIG.COLORS[p]}; width:${rates[p]}%;"></div>`
  ).join('');
}

// 依頼4: セリフ表示と肖像拡大の完全同期
function showCharacterDialogue(player, text) {
  if (!text || player === 'player') return;
  const box = document.getElementById(player);
  if (!box) return;

  const charRow = box.querySelector('.char-row');
  const portrait = document.getElementById(`${player}-portrait`);
  if (!charRow || !portrait) return;

  let bubble = charRow.querySelector('.dialogue-bubble');
  if (!bubble) {
    bubble = document.createElement('div');
    bubble.className = 'dialogue-bubble';
    charRow.appendChild(bubble);
  }

  if (bubble.timeoutId) clearTimeout(bubble.timeoutId);
  if (portrait.timeoutId) clearTimeout(portrait.timeoutId);

  bubble.textContent = `「${text}」`;
  bubble.classList.add('show');
  portrait.classList.add('portrait-talk');

  const dur = Math.min(3000, Math.max(1600, text.length * 150));
  const cleanup = () => {
    bubble.classList.remove('show');
    portrait.classList.remove('portrait-talk');
  };

  bubble.timeoutId = setTimeout(cleanup, dur);
  portrait.timeoutId = bubble.timeoutId;
}

function checkAndTriggerDialogue(player, eventType, extraCards = []) {
  if (player === 'player') return;
  const def = assignedCharacters[player];
  if (!def) return;

  if (cpuCooldowns[player] > 0 && ['NORMAL', 'MULTI', 'STRONG', 'PASS'].includes(eventType)) {
    cpuCooldowns[player]--;
    return;
  }

  const rates = {
    NORMAL: 0.25, MULTI: 0.35, STRONG: 0.45, PASS: 0.35,
    EIGHT_CUT: 0.90, ELEVEN_BACK: 0.90, REVOLUTION: 1.0,
    ENEMY_FEW: 0.70, MY_FEW: 0.80, WIN: 1.0, LOSE: 1.0,
    GAME_START: 1.0, EXCHANGE: 1.0, NEXT_GAME: 1.0
  };

  const enemyLens = PLAYERS.filter(p => p !== player && !finishedPlayers.includes(p)).map(p => hands[p].length);
  const minEnemy = enemyLens.length > 0 ? Math.min(...enemyLens) : 99;

  let cat = eventType;
  if (eventType === 'PLAY_CARD') {
    if (hands[player].length <= 2) cat = 'MY_FEW';
    else if (minEnemy <= 2) cat = 'ENEMY_FEW';
    else if (extraCards.some(c => c.display === '2' || c.display === 'A')) cat = 'STRONG';
    else if (extraCards.length >= 2) cat = 'MULTI';
    else cat = 'NORMAL';
  }

  if (Math.random() <= (rates[cat] || 0.3)) {
    const list = CHARACTER_DIALOGUES[def.id]?.[cat] || CHARACTER_DIALOGUES[def.id]?.NORMAL;
    if (list && list.length > 0) {
      const text = list[Math.floor(Math.random() * list.length)];
      showCharacterDialogue(player, text);
      cpuCooldowns[player] = 2;
    }
  }
}

function createCardElement(card) {
  const el = document.createElement('div');
  el.className = `card ${card.suitClass}`;
  if (card.isJoker) {
    el.innerHTML = `
      <div class="card-top">
        <span class="card-suit-symbol">${card.suitSymbol}</span>
        <span class="card-rank">JOKER</span>
      </div>
      <span class="card-center-icon">${card.suitSymbol}</span>
    `;
  } else {
    el.innerHTML = `
      <div class="card-top">
        <span class="card-suit-symbol">${card.suitSymbol}</span>
        <span class="card-rank">${card.display}</span>
      </div>
    `;
  }
  return el;
}

function renderCpuStack(cpuId, count) {
  const stack = document.getElementById(`${cpuId}-stack`);
  if (!stack) return;
  stack.innerHTML = '';
  const displayCount = (cpuId === 'cpu2') ? count : Math.min(count, 7);
  for (let i = 0; i < displayCount; i++) {
    const back = document.createElement('div');
    back.className = 'card-back';
    stack.appendChild(back);
  }
}

function updateHandOverlap() {
  const handEl = document.getElementById('player-hand');
  if (!handEl) return;
  const cards = handEl.querySelectorAll(':scope > .card');
  const n = cards.length;
  if (n <= 1) {
    handEl.style.removeProperty('--hand-overlap');
    return;
  }

  const cardWidth = cards[0].offsetWidth;
  if (!cardWidth) return;

  const cs = getComputedStyle(handEl);
  const paddingX = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0);
  const containerW = handEl.clientWidth - paddingX;
  const defTotal = cardWidth + (n - 1) * (cardWidth - 28);

  if (defTotal <= containerW) {
    handEl.style.removeProperty('--hand-overlap');
    return;
  }

  let needed = (containerW - cardWidth) / (n - 1) - cardWidth;
  const minOverlap = (cardWidth * 0.18) - cardWidth;
  handEl.style.setProperty('--hand-overlap', `${Math.max(needed, minOverlap)}px`);
}

// 依頼7: 5枚出し等で場の枠からはみ出ないよう自動で重なりを計算
function updateFieldOverlap() {
  const container = document.getElementById('field-container-el');
  const fieldEl = document.getElementById('field-cards');
  if (!container || !fieldEl) return;

  const cards = fieldEl.querySelectorAll(':scope > .card');
  const n = cards.length;
  if (n <= 1) {
    fieldEl.style.removeProperty('--field-overlap');
    return;
  }

  const cardWidth = cards[0].offsetWidth || 50;
  const availableW = container.clientWidth - 16;
  const normalTotal = n * cardWidth + (n - 1) * 4;

  if (normalTotal <= availableW) {
    fieldEl.style.setProperty('--field-overlap', '4px');
    return;
  }

  const overlapMargin = (availableW - cardWidth) / (n - 1) - cardWidth;
  fieldEl.style.setProperty('--field-overlap', `${Math.min(4, overlapMargin)}px`);
}

function syncPlayerHandAfterPlay(playedIndices) {
  const handEl = document.getElementById('player-hand');
  if (!handEl) return;
  const cardEls = Array.from(handEl.children);
  [...playedIndices].sort((a, b) => b - a).forEach(idx => {
    if (cardEls[idx]) cardEls[idx].remove();
  });
  Array.from(handEl.children).forEach((el, i) => {
    const c = hands.player[i];
    el.style.zIndex = i + 1;
    el.classList.remove('selected');
    el.onclick = () => toggleSelectCardByCard(c);
  });
  updateHandOverlap();
}

function animateCardMovement(player, indices, cardsToPlay, callback) {
  isProcessing = true;
  soundMgr.playCardPlay();
  const speed = getSpeedMultiplier();
  const targetRect = document.getElementById('field-container-el').getBoundingClientRect();
  const originRects = [];

  if (player === 'player') {
    const els = document.getElementById('player-hand').querySelectorAll('.card');
    indices.forEach(i => {
      if (els[i]) {
        originRects.push(els[i].getBoundingClientRect());
        els[i].style.visibility = 'hidden';
      }
    });
  } else {
    const stack = document.getElementById(`${player}-stack`) || document.getElementById(player);
    const rect = stack.getBoundingClientRect();
    cardsToPlay.forEach((_, i) => originRects.push({ left: rect.left + (i * 10), top: rect.top, width: 40, height: 60 }));
  }

  if (originRects.length === 0) {
    isProcessing = false;
    callback();
    return;
  }

  const clones = cardsToPlay.map((card, idx) => {
    const r = originRects[idx] || originRects[0];
    const clone = createCardElement(card);
    clone.classList.add('card-play-anim');
    clone.style.setProperty('--speed-factor', speed);
    clone.style.left = `${r.left}px`;
    clone.style.top = `${r.top}px`;
    document.body.appendChild(clone);
    return clone;
  });

  setTimeout(() => {
    const w = clones[0].offsetWidth || 50;
    const totalW = clones.length * w + (clones.length - 1) * 6;
    const startX = targetRect.left + (targetRect.width - totalW) / 2;
    clones.forEach((clone, i) => {
      clone.style.left = `${startX + i * (w + 6)}px`;
      clone.style.top = `${targetRect.top + targetRect.height / 2 - clone.offsetHeight / 2}px`;
    });
  }, 20);

  setTimeout(() => {
    clones.forEach(c => c.remove());
    isProcessing = false;
    callback();
  }, 350 / speed);
}

// 依頼5: 肖像の大きさを戻してから画面中央にWINNER肖像を表示
function showVictoryPopup(player) {
  const def = assignedCharacters[player];
  if (!def) return;

  // 拡大していた肖像を即座に通常サイズへ戻す
  PLAYERS.forEach(p => {
    const pt = document.getElementById(`${p}-portrait`);
    if (pt) pt.classList.remove('portrait-talk');
    const bubble = document.querySelector(`#${p} .dialogue-bubble`);
    if (bubble) bubble.classList.remove('show');
  });

  const portrait = document.getElementById('victory-portrait');
  const name = document.getElementById('victory-name');
  const popup = document.getElementById('victory-popup');
  if (!portrait || !name || !popup) return;

  setTimeout(() => {
    portrait.src = CHAR_IMAGES[def.id] || '';
    name.textContent = player === 'player' ? `${def.name}（あなた）` : def.name;
    popup.classList.add('active');

    if (popup.timeoutId) clearTimeout(popup.timeoutId);
    popup.timeoutId = setTimeout(() => popup.classList.remove('active'), 2600);
  }, 120);
}

function render(isFullRedraw = false) {
  if (isFullRedraw) {
    const handEl = document.getElementById('player-hand');
    handEl.innerHTML = '';
    hands.player.forEach((card, index) => {
      const el = createCardElement(card);
      el.style.zIndex = index + 1; // 依頼1: 常に元のスタック順序を保持
      el.classList.add('draw-anim');
      if (selectedIndices.includes(index)) el.classList.add('selected');
      el.onclick = () => toggleSelectCardByCard(card);
      handEl.appendChild(el);
    });
    updateHandOverlap();
  }

  ['cpu1', 'cpu2', 'cpu3'].forEach(c => renderCpuStack(c, hands[c].length));

  PLAYERS.forEach(p => {
    const passEl = document.getElementById(`${p}-pass`);
    if (passEl) {
      passEl.textContent = CONFIG.ALLOW_LIMIT_PASS ? `${playerPassCounts[p]}/${CONFIG.MAX_PASS_LIMIT - 1}` : playerPassCounts[p];
    }
  });

  const fieldEl = document.getElementById('field-cards');
  fieldEl.innerHTML = '';
  fieldCards.forEach((c, i) => {
    const cel = createCardElement(c);
    cel.style.zIndex = i + 1;
    fieldEl.appendChild(cel);
  });
  updateFieldOverlap();

  updateControlsOnly();
  updateEvalMeterUI();

  PLAYERS.forEach(p => {
    const area = document.getElementById(p === 'player' ? 'player-area' : p);
    const badge = document.getElementById(p === 'player' ? 'player-badge' : `${p}-badge`);
    if (area && badge) {
      if (hasPassedInRound[p]) {
        badge.textContent = 'PASS';
        badge.classList.add('is-pass');
        area.classList.remove('active-turn');
      } else {
        badge.classList.remove('is-pass');
        badge.textContent = (p === 'player') ? 'あなたの順番です' : 'THINKING';
        if (!isPreExchangePhase && !isExchangePhase && PLAYERS[currentTurnIndex] === p && !finishedPlayers.includes(p) && !gameEnded) {
          area.classList.add('active-turn');
        } else {
          area.classList.remove('active-turn');
        }
      }
    }

    const rankEl = document.getElementById(`${p}-rank`);
    if (rankEl) {
      if (playerStatusMap[p]) rankEl.textContent = playerStatusMap[p];
      else if (previousRanks[p]) rankEl.textContent = `[${previousRanks[p]}]`;
      else rankEl.textContent = '';
    }
  });
}

function updateControlsOnly() {
  const playBtn = document.getElementById('play-btn');
  const passBtn = document.getElementById('pass-btn');
  const goExBtn = document.getElementById('go-exchange-btn');
  const exBtn = document.getElementById('exchange-btn');

  if (isPreExchangePhase) {
    playBtn.style.display = 'none'; passBtn.style.display = 'none';
    goExBtn.style.display = 'flex'; exBtn.style.display = 'none';
    goExBtn.disabled = isAutoPlayMode;
  } else if (isExchangePhase) {
    playBtn.style.display = 'none'; passBtn.style.display = 'none';
    goExBtn.style.display = 'none'; exBtn.style.display = 'flex';
    exBtn.disabled = selectedIndices.length !== requiredExchangeCount || isAutoPlayMode;
  } else {
    playBtn.style.display = 'flex'; passBtn.style.display = 'flex';
    goExBtn.style.display = 'none'; exBtn.style.display = 'none';
    const myTurn = (PLAYERS[currentTurnIndex] === 'player') && !isProcessing && !finishedPlayers.includes('player') && !gameEnded;
    playBtn.disabled = !myTurn || selectedIndices.length === 0 || isAutoPlayMode;
    passBtn.disabled = !myTurn || isAutoPlayMode;
  }
}

/* ----------------------------------------------------
 * 9. ゲーム進行状態 & コントローラー
 * ---------------------------------------------------- */
let isAutoPlayMode = false;
let currentSpeed = 1;
let isSoundMuted = false;
let currentStatsTab = 'all';

let hands = { player: [], cpu1: [], cpu2: [], cpu3: [] };
let playerPassCounts = { player: 0, cpu1: 0, cpu2: 0, cpu3: 0 };
let hasPassedInRound = { player: false, cpu1: false, cpu2: false, cpu3: false };
let fieldCards = [];
let lastPlayedPlayer = null;
let currentTurnIndex = 0;
let consecutivePasses = 0;
let selectedIndices = [];
let isProcessing = false;
let finishedPlayers = [];
let playerStatusMap = {};
let previousRanks = {};
let isRevolution = false;
let isElevenBack = false;
let isExchangePhase = false;
let isPreExchangePhase = false;
let requiredExchangeCount = 0;
let gameEnded = false;

let assignedCharacters = { player: null, cpu1: null, cpu2: null, cpu3: null };
let playedCardsHistory = [];
let cpuCooldowns = { cpu1: 0, cpu2: 0, cpu3: 0 };

function effectiveReverse() {
  return isRevolution !== isElevenBack;
}

function getSpeedMultiplier() {
  let base = currentSpeed;
  if (finishedPlayers.includes('player') && base < 2) base = 2;
  return base;
}

function resetGame(reshuffle = false, keepRanks = false) {
  if (!keepRanks || reshuffle) previousRanks = {};
  if (reshuffle || !assignedCharacters.cpu1) pickRandomCPUCharacters();
  startNewGame();
}

function startNewGame() {
  const deck = shuffle(createDeck());
  isRevolution = false;
  isElevenBack = false;
  playedCardsHistory = [];
  cpuCooldowns = { cpu1: 0, cpu2: 0, cpu3: 0 };

  const dealOrder = shuffle([...PLAYERS]);
  hands.player = []; hands.cpu1 = []; hands.cpu2 = []; hands.cpu3 = [];
  deck.forEach((card, i) => hands[dealOrder[i % dealOrder.length]].push(card));
  PLAYERS.forEach(p => sortHand(hands[p]));

  playerPassCounts = { player: 0, cpu1: 0, cpu2: 0, cpu3: 0 };
  hasPassedInRound = { player: false, cpu1: false, cpu2: false, cpu3: false };
  fieldCards = [];
  lastPlayedPlayer = null;
  currentTurnIndex = 0;
  consecutivePasses = 0;
  selectedIndices = [];
  isProcessing = false;
  finishedPlayers = [];
  gameEnded = false;
  playerStatusMap = {};

  updateStatusUI();
  bgmMgr.update(isRevolution, isElevenBack);

  if (Object.keys(previousRanks).length > 0) {
    isPreExchangePhase = true;
    isExchangePhase = false;
    setMessage('カードが配布されました。「カード交換へ」ボタンを押してください。');
    render(true);
    if (isAutoPlayMode) {
      setTimeout(() => { if (isPreExchangePhase) proceedToExchange(); }, 1500 / getSpeedMultiplier());
    }
  } else {
    isPreExchangePhase = false;
    isExchangePhase = false;
    setFirstTurnByDiamond3();
    render(true);
    checkTurn();
  }
}

function setFirstTurnByDiamond3() {
  for (let i = 0; i < PLAYERS.length; i++) {
    const p = PLAYERS[i];
    if (hands[p].some(c => c.suitSymbol === '♦' && c.display === '3')) {
      currentTurnIndex = i;
      setMessage(`${getPlayerDisplayName(p)}が「♦3」を持っています。${getPlayerDisplayName(p)}からスタート！`);
      if (p !== 'player') checkAndTriggerDialogue(p, 'GAME_START');
      return;
    }
  }
  currentTurnIndex = 0;
  setMessage('ゲーム開始！あなたのターンです。');
}

function proceedToExchange() {
  soundMgr.playSelect();
  isPreExchangePhase = false;
  isExchangePhase = true;

  let daifugo = null, fugo = null, hinmin = null, daihinmin = null;
  PLAYERS.forEach(p => {
    if (previousRanks[p] === '大富豪') daifugo = p;
    if (previousRanks[p] === '富豪') fugo = p;
    if (previousRanks[p] === '貧民') hinmin = p;
    if (previousRanks[p] === '大貧民') daihinmin = p;
  });

  if (daihinmin && daifugo) {
    hands[daihinmin].sort((a, b) => getCardValue(b) - getCardValue(a));
    hands[daifugo].push(...hands[daihinmin].splice(0, 2));
    sortHand(hands[daifugo]);
    if (daifugo === 'player') StorageManager.recordExchange(0, 2);
    if (daihinmin === 'player') StorageManager.recordExchange(2, 0);
  }

  if (hinmin && fugo) {
    hands[hinmin].sort((a, b) => getCardValue(b) - getCardValue(a));
    hands[fugo].push(...hands[hinmin].splice(0, 1));
    sortHand(hands[fugo]);
    if (fugo === 'player') StorageManager.recordExchange(0, 1);
    if (hinmin === 'player') StorageManager.recordExchange(1, 0);
  }

  if (daifugo && daifugo !== 'player') {
    const cards = selectExchangeCardsSmart(hands[daifugo], 2);
    cards.forEach(c => {
      const idx = hands[daifugo].indexOf(c);
      if (idx > -1) hands[daifugo].splice(idx, 1);
    });
    hands[daihinmin].push(...cards);
    sortHand(hands[daihinmin]);
    checkAndTriggerDialogue(daifugo, 'EXCHANGE');
  }

  if (fugo && fugo !== 'player') {
    const cards = selectExchangeCardsSmart(hands[fugo], 1);
    cards.forEach(c => {
      const idx = hands[fugo].indexOf(c);
      if (idx > -1) hands[fugo].splice(idx, 1);
    });
    hands[hinmin].push(...cards);
    sortHand(hands[hinmin]);
    checkAndTriggerDialogue(fugo, 'EXCHANGE');
  }

  if (previousRanks.player === '大富豪') {
    requiredExchangeCount = 2;
    if (isAutoPlayMode) autoSelectExchangeCards('player', 2);
    else {
      setMessage('【カード交換】手札から大貧民へ渡すカードを2枚選んで「交換決定」を押してください。');
      render(true);
    }
  } else if (previousRanks.player === '富豪') {
    requiredExchangeCount = 1;
    if (isAutoPlayMode) autoSelectExchangeCards('player', 1);
    else {
      setMessage('【カード交換】手札から貧民へ渡すカードを1枚選んで「交換決定」を押してください。');
      render(true);
    }
  } else {
    isExchangePhase = false;
    PLAYERS.forEach(p => sortHand(hands[p]));
    setFirstTurnByDiamond3();
    render(true);
    checkTurn();
  }
}

function autoSelectExchangeCards(player, count) {
  isProcessing = true;
  const cards = selectExchangeCardsSmart(hands[player], count);
  selectedIndices = cards.map(c => hands[player].indexOf(c));
  render(true);
  setTimeout(() => {
    isProcessing = false;
    confirmExchange();
  }, 1000 / getSpeedMultiplier());
}

function confirmExchange() {
  if (selectedIndices.length !== requiredExchangeCount) {
    setMessage(`カードを正しく${requiredExchangeCount}枚選択してください。`);
    return;
  }
  soundMgr.playCardPlay();
  const target = (previousRanks.player === '大富豪')
    ? PLAYERS.find(p => previousRanks[p] === '大貧民')
    : PLAYERS.find(p => previousRanks[p] === '貧民');

  selectedIndices.sort((a, b) => b - a);
  const given = selectedIndices.map(idx => hands.player.splice(idx, 1)[0]);
  if (target) {
    hands[target].push(...given);
    sortHand(hands[target]);
  }

  selectedIndices = [];
  isExchangePhase = false;
  PLAYERS.forEach(p => sortHand(hands[p]));
  setFirstTurnByDiamond3();
  render(true);
  checkTurn();
}

function toggleSelectCardByCard(card) {
  const idx = hands.player.indexOf(card);
  if (idx > -1) toggleSelectCard(idx);
}

function toggleSelectCard(index) {
  if (isAutoPlayMode) return;
  if (isProcessing && !isExchangePhase) return;
  if (isPreExchangePhase) return;
  if (!isExchangePhase && PLAYERS[currentTurnIndex] !== 'player') return;

  const handEl = document.getElementById('player-hand');
  const cardEls = handEl ? handEl.children : [];
  const selPos = selectedIndices.indexOf(index);

  if (selPos > -1) {
    selectedIndices.splice(selPos, 1);
    soundMgr.playDeselect();
    if (cardEls[index]) cardEls[index].classList.remove('selected');
  } else {
    if (isExchangePhase && selectedIndices.length >= requiredExchangeCount) {
      const removed = selectedIndices.shift();
      if (cardEls[removed]) cardEls[removed].classList.remove('selected');
    }
    selectedIndices.push(index);
    soundMgr.playSelect();
    if (cardEls[index]) cardEls[index].classList.add('selected');
  }
  updateControlsOnly();
}

function playerPlayCard() {
  if (isProcessing || PLAYERS[currentTurnIndex] !== 'player') return;
  if (selectedIndices.length === 0) { setMessage('出したいカードを選択してください。'); return; }

  const cards = selectedIndices.map(i => hands.player[i]);
  if (!isValidPlay(cards, fieldCards, effectiveReverse())) {
    setMessage('選択したカードはルール上出すことができません。');
    return;
  }

  const playedIndices = [...selectedIndices];
  animateCardMovement('player', playedIndices, cards, () => {
    playedIndices.sort((a, b) => b - a).forEach(i => hands.player.splice(i, 1));
    playCardSuccess('player', cards, false, playedIndices);
  });
}

// 依頼2: 選択したままパスした際に手札の選択状態を即座に解除
function playerPass() {
  if (isProcessing || PLAYERS[currentTurnIndex] !== 'player') return;
  
  selectedIndices = [];
  const handEl = document.getElementById('player-hand');
  if (handEl) {
    const cardEls = handEl.querySelectorAll('.card.selected');
    cardEls.forEach(el => el.classList.remove('selected'));
  }
  updateControlsOnly();

  soundMgr.playPass();
  processPass('player');
}

function playCardSuccess(player, cards, needFullRedraw = false, playedIndices = []) {
  const wasLoneJoker = fieldCards.length === 1 && fieldCards[0].isJoker;
  fieldCards = cards;
  lastPlayedPlayer = player;
  consecutivePasses = 0;
  selectedIndices = [];
  playedCardsHistory.push(...cards);

  const cardStr = cards.map(c => c.isJoker ? `${c.suitSymbol}JOKER` : `${c.suitSymbol}${c.display}`).join(' ');
  let actionText = `${getPlayerDisplayName(player)}が「${cardStr}」を出しました。`;
  let hasSpecial = false;
  let specialType = null;

  const isSpade3Return = wasLoneJoker && cards.length === 1 && !cards[0].isJoker && cards[0].suitSymbol === '♠' && cards[0].display === '3';
  const isJokerSolo = cards.length === 1 && cards[0].isJoker;

  if (isSpade3Return) {
    actionText += ' スペード3返し発動！ジョーカーを撃破！';
    hasSpecial = true; specialType = 'STRONG';
    soundMgr.playSpade3Return();
  } else if (isJokerSolo) {
    actionText += ' ジョーカー、絶対強者の一撃！';
    hasSpecial = true; specialType = 'STRONG';
    soundMgr.playJoker();
  }

  if (cards.length >= 4) {
    isRevolution = !isRevolution;
    actionText += ' 革命発生！';
    PLAYERS.forEach(p => sortHand(hands[p]));
    needFullRedraw = true; hasSpecial = true; specialType = 'REVOLUTION';
  }

  if (cards[0].display === 'J') {
    isElevenBack = true;
    actionText += ' 11バック発動！';
    PLAYERS.forEach(p => sortHand(hands[p]));
    needFullRedraw = true; hasSpecial = true;
    if (!specialType) specialType = 'ELEVEN_BACK';
  }

  const isEight = cards[0].display === '8';
  if (isEight) {
    actionText += ' 8切り発動！';
    hasSpecial = true;
    if (!specialType) specialType = 'EIGHT_CUT';
  }

  if (hasSpecial && !isSpade3Return && !isJokerSolo) soundMgr.playSpecial();
  setMessage(actionText);
  updateStatusUI();
  bgmMgr.update(isRevolution, isElevenBack);

  if (player !== 'player') checkAndTriggerDialogue(player, specialType || 'PLAY_CARD', cards);

  if (hands[player].length === 0 && !finishedPlayers.includes(player)) {
    finishedPlayers.push(player);
    assignWinRank(player);
    soundMgr.playWin();
    setMessage(`${getPlayerDisplayName(player)}が上がり！【${playerStatusMap[player]}】確定！`);
    if (player !== 'player') checkAndTriggerDialogue(player, 'WIN');
  }

  const speed = getSpeedMultiplier();
  if (isEight) {
    isProcessing = true;
    if (needFullRedraw) render(true);
    else syncPlayerHandAfterPlay(playedIndices);
    render(false);
    setTimeout(() => clearField(player), 1200 / speed);
  } else {
    if (needFullRedraw) render(true);
    else if (player === 'player') { syncPlayerHandAfterPlay(playedIndices); render(false); }
    else render(false);
    nextTurn();
  }
}

function assignWinRank(player) {
  const ranks = ['大富豪', '富豪', '貧民', '大貧民'];
  for (let r of ranks) {
    if (!Object.values(playerStatusMap).includes(r)) {
      playerStatusMap[player] = r;
      if (r === '大富豪') showVictoryPopup(player);
      break;
    }
  }
}

function processPass(player) {
  playerPassCounts[player]++;
  consecutivePasses++;
  selectedIndices = [];
  hasPassedInRound[player] = true;

  if (player !== 'player') checkAndTriggerDialogue(player, 'PASS');
  setMessage(`${getPlayerDisplayName(player)}がパスしました。`);
  nextTurn();
}

function nextTurn() {
  const active = PLAYERS.filter(p => !finishedPlayers.includes(p));

  if (active.length <= 1) {
    if (active.length === 1) {
      const last = active[0];
      finishedPlayers.push(last);
      assignWinRank(last);
      if (last !== 'player') checkAndTriggerDialogue(last, 'LOSE');
    }
    gameEnded = true;
    previousRanks = { ...playerStatusMap };
    StorageManager.recordGameEnd();

    render(false);
    setMessage('ゲームセット！全員の順位が確定しました。');
    renderFinalRanking();
    document.getElementById('next-game-modal').classList.add('active');

    if (isAutoPlayMode) {
      setTimeout(() => {
        const modal = document.getElementById('next-game-modal');
        if (modal.classList.contains('active')) document.getElementById('btn-keep-char').click();
      }, 5000 / getSpeedMultiplier());
    }
    return;
  }

  const speed = getSpeedMultiplier();
  if (lastPlayedPlayer && (consecutivePasses >= active.length - 1 || consecutivePasses >= 3)) {
    isProcessing = true;
    render(false);
    setTimeout(() => clearField(), 1200 / speed);
    return;
  }

  do {
    currentTurnIndex = (currentTurnIndex + 1) % PLAYERS.length;
  } while (finishedPlayers.includes(PLAYERS[currentTurnIndex]));

  checkTurn();
}

function clearField(nextPlayer = null) {
  const fieldEl = document.getElementById('field-cards');
  fieldEl.classList.add('clear-animation');

  setTimeout(() => {
    fieldCards = [];
    consecutivePasses = 0;
    fieldEl.classList.remove('clear-animation');
    PLAYERS.forEach(p => hasPassedInRound[p] = false);

    let redraw = false;
    if (isElevenBack) {
      isElevenBack = false;
      PLAYERS.forEach(p => sortHand(hands[p]));
      selectedIndices = [];
      redraw = true;
    }

    updateStatusUI();
    bgmMgr.update(isRevolution, isElevenBack);

    if (nextPlayer) currentTurnIndex = PLAYERS.indexOf(nextPlayer);
    else if (lastPlayedPlayer) currentTurnIndex = PLAYERS.indexOf(lastPlayedPlayer);

    while (finishedPlayers.includes(PLAYERS[currentTurnIndex])) {
      currentTurnIndex = (currentTurnIndex + 1) % PLAYERS.length;
    }

    lastPlayedPlayer = null;
    isProcessing = false;
    if (redraw) render(true);
    checkTurn();
  }, 400);
}

function checkTurn() {
  const curr = PLAYERS[currentTurnIndex];
  hasPassedInRound[curr] = false;

  if (curr === 'player' && !isAutoPlayMode) {
    isProcessing = false;
    render(false);
  } else {
    isProcessing = true;
    render(false);
    setTimeout(() => cpuPlayTurn(curr), 1000 / getSpeedMultiplier());
  }
}

function cpuPlayTurn(cpu) {
  const move = decideCpuMove(cpu);
  if (move) {
    const indices = move.map(c => hands[cpu].indexOf(c));
    if (cpu === 'player') {
      selectedIndices = indices;
      render(true);
      setTimeout(() => {
        animateCardMovement(cpu, indices, move, () => {
          move.forEach(c => {
            const idx = hands[cpu].indexOf(c);
            if (idx > -1) hands[cpu].splice(idx, 1);
          });
          playCardSuccess(cpu, move, false, indices);
        });
      }, 600 / getSpeedMultiplier());
    } else {
      animateCardMovement(cpu, indices, move, () => {
        move.forEach(c => {
          const idx = hands[cpu].indexOf(c);
          if (idx > -1) hands[cpu].splice(idx, 1);
        });
        playCardSuccess(cpu, move, false);
      });
    }
  } else {
    soundMgr.playPass();
    processPass(cpu);
  }
}

/* ----------------------------------------------------
 * 10. モーダル・初期化・イベントリスナー
 * ---------------------------------------------------- */
function pickRandomCPUCharacters() {
  const keys = Object.keys(CHARACTER_DEFS).filter(k => !assignedCharacters.player || k !== assignedCharacters.player.id);
  const shuffled = shuffle(keys);
  assignedCharacters.cpu1 = CHARACTER_DEFS[shuffled[0]];
  assignedCharacters.cpu2 = CHARACTER_DEFS[shuffled[1]];
  assignedCharacters.cpu3 = CHARACTER_DEFS[shuffled[2]];
  updateCharacterUI();
}

function updateCharacterUI() {
  PLAYERS.forEach(p => {
    const def = assignedCharacters[p];
    if (!def) return;
    const title = document.getElementById(`${p}-char-title`);
    const img = document.getElementById(`${p}-portrait`);
    if (title) title.textContent = `${def.icon} ${def.name}`;
    if (img) img.src = CHAR_IMAGES[def.id] || '';
  });
}

function buildCharSelectGrid() {
  const grid = document.getElementById('char-select-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(CHARACTER_DEFS).forEach(key => {
    const def = CHARACTER_DEFS[key];
    const card = document.createElement('div');
    card.className = 'char-select-card';
    card.innerHTML = `
      <img src="${CHAR_IMAGES[def.id] || ''}" alt="${def.name}">
      <div class="csc-name">${def.icon} ${def.name}</div>
      <div class="csc-desc">${CHAR_SHORT_DESC[def.id] || ''}</div>
    `;
    card.onclick = () => selectPlayerCharacter(def.id);
    grid.appendChild(card);
  });
}

function selectPlayerCharacter(id) {
  soundMgr.playSelect();
  assignedCharacters.player = CHARACTER_DEFS[id];

  const radios = document.getElementsByName('playMode');
  for (let r of radios) {
    if (r.checked) { isAutoPlayMode = (r.value === 'auto'); break; }
  }

  const autoBtn = document.getElementById('auto-play-btn');
  if (autoBtn) {
    autoBtn.textContent = isAutoPlayMode ? '自動プレイ: ON' : '自動プレイ: OFF';
    autoBtn.classList.toggle('btn-gold', isAutoPlayMode);
  }
  document.getElementById('speed-controls').style.display = isAutoPlayMode ? 'flex' : 'none';
  document.getElementById('char-select-overlay').classList.remove('active');

  bgmMgr.setCharSelectPhase(false);
  resetGame(true, false);
}

function renderFinalRanking() {
  const container = document.getElementById('final-ranking-list');
  if (!container) return;
  const order = ['大富豪', '富豪', '貧民', '大貧民'];
  container.innerHTML = order.map((rankName, idx) => {
    const p = PLAYERS.find(pl => playerStatusMap[pl] === rankName);
    if (!p) return '';
    const def = assignedCharacters[p];
    return `
      <div class="final-rank-row${idx === 0 ? ' rank-1' : ''}">
        <div class="final-rank-position">${rankName}</div>
        <img src="${CHAR_IMAGES[def.id] || ''}" alt="">
        <div class="final-rank-name">${getPlayerDisplayName(p, true)}${p === 'player' ? ' (You)' : ''}</div>
      </div>
    `;
  }).join('');
}

function showEvalModal() {
  const { rates, topPlayer, topPct, diffFromSecond } = calculateRealtimeWinRates();
  const body = document.getElementById('eval-modal-body');
  if (!body) return;

  let html = `
    <div class="eval-graph-card">
      <div class="rule-item-title" style="margin-bottom: 8px;">📈 現在の1位（大富豪）予想確率</div>
  `;

  PLAYERS.forEach(p => {
    const rate = rates[p] || 0;
    const fin = finishedPlayers.includes(p) ? `(${playerStatusMap[p]}確定)` : `(残${hands[p].length}枚)`;
    html += `
      <div class="eval-player-row">
        <div class="eval-player-name">${getPlayerDisplayName(p, true)}</div>
        <div class="eval-bar-track">
          <div class="eval-bar-fill-p" style="width: ${rate}%; background: ${CONFIG.COLORS[p]};"></div>
        </div>
        <div class="eval-player-pct">${rate}%</div>
        <div style="font-size: 10px; color: #8c9ba5; width: 68px; text-align: right;">${fin}</div>
      </div>
    `;
  });
  html += `</div>`;

  let comment = '';
  const topName = getPlayerDisplayName(topPlayer);
  const topCount = hands[topPlayer]?.length || 0;

  if (finishedPlayers.length > 0) {
    comment = `既に ${getPlayerDisplayName(finishedPlayers[0])} が1位上がりを決めています！`;
  } else if (topPct >= 75 || topCount <= 2) {
    comment = `【王手・独走状態】${topName}が残り${topCount}枚で圧倒的リーチ！他プレイヤーは「8切り」や強力なカウンターで親権を奪わなければ阻止不能です。`;
  } else if (topPct >= 45 || diffFromSecond >= 15) {
    comment = `【一歩リード】${topName}が手札枚数・決定力の両面で優位に立ち、独走態勢に入りつつあります（勝率 ${topPct}%）。`;
  } else if (diffFromSecond < 10 && topPct >= 28) {
    comment = `【マッチレース】上位陣の戦況が拮抗！誰が先に親権を取って抜け出すかの熾烈な主導権争いが繰り広げられています。`;
  } else {
    comment = `【序盤・探り合い】全員の手札が揃っており、まだ勝敗の行方は混沌としています。手札の温存と仕掛けどころが鍵になります。`;
  }

  html += `
    <div style="background: rgba(0,0,0,0.25); padding: 10px; border-radius: 6px; border-left: 3px solid #d4af37;">
      <div style="font-size: 11px; color: #d4af37; font-weight: bold; margin-bottom: 2px;">🤖 宮廷AI戦況レポート</div>
      <div style="font-size: 12px; color: #e0e6ed; line-height: 1.4;">${comment}</div>
    </div>
  `;

  body.innerHTML = html;
  document.getElementById('eval-modal').classList.add('active');
}

function renderRankingModalContent() {
  const body = document.getElementById('stats-body');
  if (!body) return;

  if (currentStatsTab === 'all') {
    const all = StorageManager.loadAllCharStats();
    const sorted = Object.keys(CHARACTER_DEFS).map(id => {
      const def = CHARACTER_DEFS[id];
      const st = all[id] || { games: 0, df: 0, f: 0, h: 0, dh: 0, rankSum: 0 };
      const winRate = st.games > 0 ? ((st.df / st.games) * 100).toFixed(1) : '0.0';
      return { ...def, ...st, winRate: parseFloat(winRate) };
    }).sort((a, b) => b.winRate !== a.winRate ? b.winRate - a.winRate : b.games - a.games);

    let html = `
      <div style="margin-bottom: 8px; font-size: 12px; color: #b0bec5;">宮廷内全キャラクターの対戦成績一覧（大富豪率 順）</div>
      <table class="ranking-table">
        <thead>
          <tr>
            <th style="width: 28px;">順位</th>
            <th>キャラクター</th>
            <th style="text-align: right;">大富豪率</th>
            <th style="text-align: center; width: 120px;">順位内訳</th>
            <th style="text-align: right;">試合数</th>
          </tr>
        </thead>
        <tbody>
    `;

    sorted.forEach((c, idx) => {
      const g = c.games || 1;
      const rankBadge = idx < 3 ? `<span class="rank-num-badge rank-num-${idx + 1}">${idx + 1}</span>` : `${idx + 1}`;
      html += `
        <tr>
          <td style="text-align: center;">${rankBadge}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <img src="${CHAR_IMAGES[c.id]}" style="width: 22px; aspect-ratio: 2/3; border-radius: 3px; border: 1px solid rgba(212,175,55,0.4);" alt="">
              <span style="font-weight: bold; color: #fff3a8;">${c.icon} ${c.name}</span>
            </div>
          </td>
          <td style="text-align: right; font-weight: bold; color: #d4af37;">${c.winRate}%</td>
          <td>
            <div class="rank-breakdown-bar">
              <div class="rbb-df" style="width:${Math.round((c.df/g)*100)}%"></div>
              <div class="rbb-f" style="width:${Math.round((c.f/g)*100)}%"></div>
              <div class="rbb-h" style="width:${Math.round((c.h/g)*100)}%"></div>
              <div class="rbb-dh" style="width:${Math.round((c.dh/g)*100)}%"></div>
            </div>
          </td>
          <td style="text-align: right; color: #b0bec5;">${c.games}戦</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    body.innerHTML = html;
  } else {
    if (!assignedCharacters.player) return;
    const cid = assignedCharacters.player.id;
    const stats = StorageManager.getCharStats(cid);
    const total = stats.totalGames;
    const avg = total > 0 ? (stats.totalRankSum / total).toFixed(2) : '-';
    const pct = count => total > 0 ? Math.round((count / total) * 100) : 0;

    let nemesis = 'なし', maxBeat = 0;
    for (let c in stats.cpuStats) {
      if (stats.cpuStats[c].beatMe > maxBeat) {
        maxBeat = stats.cpuStats[c].beatMe;
        nemesis = CHARACTER_DEFS[c].name;
      }
    }

    body.innerHTML = `
      <div style="margin-bottom: 14px;">
        <div class="rule-item-title">📊 【${assignedCharacters.player.name}】使用時の総合成績</div>
        <div class="stats-grid">
          <div>総試合数: <strong style="color:#fff3a8">${total}</strong> 試合</div>
          <div>平均順位: <strong style="color:#fff3a8">${avg}</strong> 位</div>
          <div>大富豪: ${stats.rankCounts['大富豪']}回 (${pct(stats.rankCounts['大富豪'])}%)</div>
          <div>富豪: ${stats.rankCounts['富豪']}回 (${pct(stats.rankCounts['富豪'])}%)</div>
          <div>貧民: ${stats.rankCounts['貧民']}回 (${pct(stats.rankCounts['貧民'])}%)</div>
          <div>大貧民: ${stats.rankCounts['大貧民']}回 (${pct(stats.rankCounts['大貧民'])}%)</div>
        </div>
      </div>
      <div style="margin-bottom: 14px;">
        <div class="rule-item-title">🔄 カード交換・記録</div>
        <div class="stats-grid">
          <div>総上納: <strong style="color:#ff6b6b">${stats.givenCards}</strong> 枚</div>
          <div>総搾取: <strong style="color:#4caf50">${stats.takenCards}</strong> 枚</div>
          <div style="grid-column: span 2;">下克上成功 (大貧民→大富豪): <strong style="color:#d4af37">${stats.gekokujo}</strong> 回</div>
        </div>
      </div>
      <div>
        <div class="rule-item-title">⚔️ 天敵キャラクター</div>
        <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 6px;">
          <div>最大の天敵: <strong style="color:#ff6b6b; font-size: 14px;">${nemesis}</strong></div>
        </div>
      </div>
    `;
  }
}

// イベントリスナー初期化
function initEvents() {
  const rulesPanel = document.getElementById('rules-panel');
  const ruleModal = document.getElementById('rule-modal');
  const charModal = document.getElementById('char-modal');
  const statsModal = document.getElementById('stats-modal');
  const evalModal = document.getElementById('eval-modal');
  const nextGameModal = document.getElementById('next-game-modal');

  document.getElementById('rule-toggle-btn').onclick = () => {
    soundMgr.playSelect();
    if (rulesPanel.classList.contains('open')) {
      rulesPanel.classList.remove('open');
      ruleModal.classList.add('active');
    } else {
      rulesPanel.classList.add('open');
    }
  };

  document.getElementById('sound-toggle-btn').onclick = (e) => {
    isSoundMuted = !isSoundMuted;
    e.target.textContent = isSoundMuted ? '🔇 音声: OFF' : '🔊 音声: ON';
    bgmMgr.audio.muted = isSoundMuted;
    if (!isSoundMuted) soundMgr.playSelect();
  };

  document.getElementById('modal-close-btn').onclick = () => { soundMgr.playDeselect(); ruleModal.classList.remove('active'); };
  document.getElementById('modal-close-x').onclick = () => { soundMgr.playDeselect(); ruleModal.classList.remove('active'); };

  document.getElementById('char-help-btn').onclick = () => { soundMgr.playSelect(); charModal.classList.add('active'); };
  document.getElementById('modal-char-close-btn').onclick = () => { soundMgr.playDeselect(); charModal.classList.remove('active'); };
  document.getElementById('modal-char-close-x').onclick = () => { soundMgr.playDeselect(); charModal.classList.remove('active'); };

  document.getElementById('eval-meter-btn').onclick = () => { soundMgr.playSelect(); showEvalModal(); };
  document.getElementById('modal-eval-close-btn').onclick = () => { soundMgr.playDeselect(); evalModal.classList.remove('active'); };
  document.getElementById('modal-eval-close-x').onclick = () => { soundMgr.playDeselect(); evalModal.classList.remove('active'); };

  document.getElementById('stats-btn').onclick = () => { soundMgr.playSelect(); renderRankingModalContent(); statsModal.classList.add('active'); };
  document.getElementById('modal-stats-close-btn').onclick = () => { soundMgr.playDeselect(); statsModal.classList.remove('active'); };
  document.getElementById('modal-stats-close-x').onclick = () => { soundMgr.playDeselect(); statsModal.classList.remove('active'); };

  document.getElementById('tab-all-ranking-btn').onclick = () => {
    soundMgr.playSelect();
    currentStatsTab = 'all';
    document.getElementById('tab-all-ranking-btn').classList.add('active');
    document.getElementById('tab-my-stats-btn').classList.remove('active');
    renderRankingModalContent();
  };
  document.getElementById('tab-my-stats-btn').onclick = () => {
    soundMgr.playSelect();
    currentStatsTab = 'my';
    document.getElementById('tab-my-stats-btn').classList.add('active');
    document.getElementById('tab-all-ranking-btn').classList.remove('active');
    renderRankingModalContent();
  };

  document.getElementById('modal-stats-clear-btn').onclick = () => {
    if (confirm('すべての対戦記録・キャラクターランキングを初期化しますか？')) {
      soundMgr.playSelect();
      StorageManager.clearAll();
      renderRankingModalContent();
    }
  };

  document.querySelectorAll('.btn-speed').forEach(btn => {
    btn.onclick = (e) => {
      soundMgr.playSelect();
      document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentSpeed = parseInt(e.target.getAttribute('data-speed'));
    };
  });

  document.getElementById('auto-play-btn').onclick = () => {
    soundMgr.playSelect();
    isAutoPlayMode = !isAutoPlayMode;
    const btn = document.getElementById('auto-play-btn');
    btn.textContent = isAutoPlayMode ? '自動プレイ: ON' : '自動プレイ: OFF';
    btn.classList.toggle('btn-gold', isAutoPlayMode);

    document.getElementById('speed-controls').style.display = isAutoPlayMode ? 'flex' : 'none';
    if (!isAutoPlayMode) {
      currentSpeed = 1;
      document.querySelectorAll('.btn-speed').forEach(b => b.classList.toggle('active', b.getAttribute('data-speed') === '1'));
    }
    updateControlsOnly();

    if (isAutoPlayMode) {
      if (PLAYERS[currentTurnIndex] === 'player' && !isProcessing && !isExchangePhase && !isPreExchangePhase && !gameEnded) {
        checkTurn();
      } else if (isPreExchangePhase) {
        proceedToExchange();
      } else if (isExchangePhase && PLAYERS[currentTurnIndex] === 'player') {
        if (previousRanks.player === '大富豪') autoSelectExchangeCards('player', 2);
        else if (previousRanks.player === '富豪') autoSelectExchangeCards('player', 1);
      }
    }
  };

  document.getElementById('btn-keep-char').onclick = () => {
    soundMgr.playSelect();
    nextGameModal.classList.remove('active');
    rulesPanel.classList.remove('open');
    resetGame(false, true);
    PLAYERS.filter(p => p !== 'player').forEach(p => checkAndTriggerDialogue(p, 'NEXT_GAME'));
  };

  document.getElementById('btn-change-char').onclick = () => {
    soundMgr.playSelect();
    nextGameModal.classList.remove('active');
    rulesPanel.classList.remove('open');
    resetGame(true, false);
    PLAYERS.filter(p => p !== 'player').forEach(p => checkAndTriggerDialogue(p, 'NEXT_GAME'));
  };

  document.getElementById('reset-btn').onclick = () => {
    soundMgr.playSelect();
    rulesPanel.classList.remove('open');
    resetGame(true, false);
  };

  document.getElementById('go-exchange-btn').onclick = proceedToExchange;
  document.getElementById('exchange-btn').onclick = confirmExchange;
  document.getElementById('play-btn').onclick = playerPlayCard;
  document.getElementById('pass-btn').onclick = playerPass;

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateHandOverlap();
      updateFieldOverlap();
    }, 100);
  });
  window.addEventListener('orientationchange', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateHandOverlap();
      updateFieldOverlap();
    }, 150);
  });
}

function initRuleTexts() {
  const rPass = document.getElementById('rule-list-pass');
  const rTitle = document.getElementById('rule-item-pass-title');
  const rDesc = document.getElementById('rule-item-pass-desc');
  if (!rPass || !rTitle || !rDesc) return;

  if (CONFIG.ALLOW_LIMIT_PASS) {
    rPass.textContent = `パス${CONFIG.MAX_PASS_LIMIT}回でドボン`;
    rTitle.textContent = `パス${CONFIG.MAX_PASS_LIMIT}回でドボン (Pass Penalty)`;
    rDesc.textContent = `1ゲーム中に通算${CONFIG.MAX_PASS_LIMIT}回パスを行うと「ドボン（強制最下位）」となります。`;
  } else {
    rPass.textContent = 'パス制限なし';
    rTitle.textContent = 'パスの制限 (Pass Rules)';
    rDesc.textContent = 'パスは回数制限がなく、何度でも自由に行うことができます。';
  }
}

// 起動時処理
document.querySelectorAll('#char-modal img[data-char-img]').forEach(img => {
  img.src = CHAR_IMAGES[img.getAttribute('data-char-img')] || '';
});
initRuleTexts();
buildCharSelectGrid();
initEvents();
bgmMgr.setCharSelectPhase(true);