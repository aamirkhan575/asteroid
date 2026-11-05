/**
 * Lightweight, code-drawn previews of each project (no heavy screenshots → fast LCP).
 * Swap for real <Image> screenshots later if desired — keep width/height set to avoid CLS.
 */
export const projectPreviews: Record<string, React.ReactNode> = {
  infinia: (
    <div className="proj-inner w1"><div className="chrome"><i></i><i></i><i></i><em>infiniachain.infinialabs.ai</em></div>
            <div className="pv-nav"><b>INFINIA</b><span>Wallet · Explorer · FINF</span></div>
            <div className="glow"></div>
            <div className="pv-h">Post-quantum money <em>for everyone.</em></div>
            <div className="pv-sub">Simple enough for anyone. Strong enough for what&apos;s coming.</div>
            <div className="pv-btn">Get the wallet</div>
            <div className="stat">BLOCK #1,284,903 · 0.4s</div>
            <div className="phone"><small>BALANCE</small><b>12,480 FINF</b><i></i><i></i><i></i><i></i></div>
    </div>
  ),
  token2049: (
    <div className="proj-inner w2"><div className="chrome"><i></i><i></i><i></i><em>token2049-dubai.vercel.app</em></div>
            <div className="dune"></div><div className="dune b"></div>
            <svg viewBox="0 0 100 62.5" preserveAspectRatio="none" aria-hidden="true"><g stroke="rgba(255,180,110,.28)" strokeWidth=".12" fill="#FFB36B">
              <path d="M60 12L72 20L84 14L90 26L78 32L72 20M84 14L94 8M78 32L88 40" fill="none"/>
              <circle cx="60" cy="12" r=".5" /><circle cx="72" cy="20" r=".6" /><circle cx="84" cy="14" r=".5" /><circle cx="90" cy="26" r=".4" /><circle cx="78" cy="32" r=".5" /><circle cx="94" cy="8" r=".4" /><circle cx="88" cy="40" r=".4" /></g></svg>
            <div className="pv-nav"><b>TOKEN2049</b><span>Dubai · 21–22 Apr</span></div>
            <div className="pv-h">The desert is <em>calling.</em></div>
            <div className="count"><div>172<small>DAYS</small></div><div>08<small>HRS</small></div><div>41<small>MIN</small></div><div>22<small>SEC</small></div></div>
            <div className="coords">25.1336° N · 55.1849° E<br />TRANSMITTING · DXB → WORLD</div>
    </div>
  ),
  fasset: (
    <div className="proj-inner w3"><div className="chrome"><i></i><i></i><i></i><em>fasset-uae.vercel.app</em></div>
            <div className="pv-nav"><b>Fasset</b><span>Invest · Spend · OTC</span></div>
            <div className="pv-h">Own a piece of what <em>moves the world.</em></div>
            <div className="pv-btn">Start investing</div>
            <div className="card"></div>
            <div className="pf"><small>Example portfolio</small><b>AED 84,210</b>
              <div className="r"><span>Bitcoin</span><span>+2.4%</span></div><div className="r"><span>Tokenised gold</span><span>+0.8%</span></div><div className="r"><span>Ethereum</span><span>+1.9%</span></div></div>
    </div>
  ),
  xphoto: (
    <div className="proj-inner w4"><div className="chrome"><i></i><i></i><i></i><em>xphoto.vercel.app</em></div>
            <div className="pv-nav"><b>xPhoto</b><span>Free · No sign-up</span></div>
            <div className="eb">LinkedIn ready</div>
            <div className="pv-h">Selfie in. <em>Headshot out.</em></div>
            <div className="pv-btn">Upload a selfie</div>
            <div className="fr a"></div><div className="ar">→</div><div className="fr b"></div>
            <div className="tag">✦ Studio quality</div>
    </div>
  ),
  arsh: (
    <div className="proj-inner w5"><div className="chrome"><i></i><i></i><i></i><em>arshbalqees.com</em></div>
            <div className="pv-nav"><b>Arsh Balqees</b><span>Signage · Print · Vehicles</span></div>
            <div className="dim w"><span>W 3.78 m</span></div>
            <div className="sign">YOUR NAME</div>
            <div className="dim h">H 60 cm</div>
            <div className="pv-h">Make your name <em>impossible to miss.</em></div>
            <div className="pv-btn">WhatsApp for a quote</div>
            <div className="since">since 1985</div>
    </div>
  ),
  falak: (
    <div className="proj-inner w6"><div className="chrome"><i></i><i></i><i></i><em>falak-bank.vercel.app</em></div>
            <div className="orb o1"></div><div className="orb o2"><i></i></div><div className="orb o3"><i></i></div>
            <div className="pv-nav"><b>Falak</b><span>Everyday money · UAE</span></div>
            <div className="pv-h">Your dirhams, <em>kept in orbit.</em></div>
            <div className="ar">فلك</div>
            <div className="ph"><small>TOTAL</small><b>AED 24,580</b><i></i><i></i><i></i><i></i></div>
    </div>
  ),
  akc: (
    <div className="proj-inner w7"><div className="chrome"><i></i><i></i><i></i><em>akc-stablecoin.vercel.app</em></div>
            <div className="pv-nav"><b>AKC</b><span>Wallet · Card · Vault</span></div>
            <div className="peg">1 AKC = 1 AED</div>
            <div className="pv-h">The dirham, <em>on-chain.</em></div>
            <div className="pv-btn">Try the prototype</div>
            <div className="coin">AKC</div>
            <div className="ph"><small>BALANCE</small><b>5,000 AKC</b><i></i><i></i><i></i><div className="slide">Slide to pay →</div></div>
    </div>
  ),
};
