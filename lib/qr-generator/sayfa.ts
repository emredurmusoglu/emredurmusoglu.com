/**
 * QR kod üretici (/qr-generator): çocuk dövmesi / etiketi için telefon
 * numarasından ortası emojili QR ve 2 × 4 cm PDF. Eskiden Vercel'de ayrı bir
 * projeydi (github.com/emredurmusoglu/qr-generator), sayfa olduğu gibi buraya
 * taşındı. Her şey tarayıcıda çalışır; sunucuya hiçbir şey gitmez.
 *
 * String.raw: içerideki düzenli ifadelerin ters bölüleri olduğu gibi kalsın.
 * Bu yüzden sayfada ters tırnak (`) ve dolar-süslü parantez kullanılmıyor.
 */
export const QR_SAYFASI = String.raw`<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Kod Üretici</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
            min-height: 100vh;
            padding: 28px 16px 48px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .card {
            background: #fff;
            border-radius: 28px;
            padding: 40px 36px;
            width: 100%;
            max-width: 700px;
            box-shadow: 0 28px 72px rgba(0, 0, 0, 0.28);
        }

        /* ── Header ── */
        .header {
            text-align: center;
            margin-bottom: 36px;
        }

        .header h1 {
            font-size: 2.1rem;
            font-weight: 800;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
            margin-bottom: 8px;
        }

        .header p {
            color: #64748b;
            font-size: 1rem;
        }

        /* ── Section labels ── */
        .section { margin-bottom: 28px; }

        .label {
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #475569;
            margin-bottom: 12px;
        }

        /* ── Phone input ── */
        .phone-wrap { position: relative; }

        .phone-wrap .icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.25rem;
            pointer-events: none;
        }

        .phone-wrap input {
            width: 100%;
            padding: 16px 16px 16px 52px;
            border: 2.5px solid #e2e8f0;
            border-radius: 14px;
            font-size: 1.1rem;
            color: #1e293b;
            outline: none;
            font-family: 'Courier New', monospace;
            letter-spacing: 0.04em;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .phone-wrap input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.13);
        }

        .phone-wrap input.err {
            border-color: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.13);
        }

        .error-msg {
            display: none;
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 8px;
        }

        /* ── Icon grid ── */
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
            gap: 8px;
        }

        .icon-btn {
            aspect-ratio: 1;
            border: 2.5px solid transparent;
            border-radius: 14px;
            background: #f8fafc;
            cursor: pointer;
            font-size: 1.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s, background 0.15s, box-shadow 0.15s, border-color 0.15s;
            padding: 0;
            user-select: none;
        }

        .icon-btn:hover {
            background: #ede9fe;
            transform: scale(1.14);
            box-shadow: 0 4px 14px rgba(139, 92, 246, 0.22);
        }

        .icon-btn.active {
            border-color: #6366f1;
            background: #ede9fe;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.22);
            transform: scale(1.08);
        }

        /* ── Generate button ── */
        .gen-btn {
            width: 100%;
            padding: 17px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            border: none;
            border-radius: 14px;
            font-size: 1.05rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .gen-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(99, 102, 241, 0.38);
        }

        .gen-btn:active { transform: translateY(0); }

        /* ── Result ── */
        .result {
            display: none;
            text-align: center;
            margin-top: 36px;
            animation: rise 0.4s ease;
        }

        .result.show { display: block; }

        @keyframes rise {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .divider {
            height: 1px;
            background: #f1f5f9;
            margin-bottom: 32px;
        }

        .qr-preview {
            display: inline-block;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.13);
            line-height: 0;
        }

        #qrCanvas {
            display: block;
            max-width: 270px;
            width: 100%;
        }

        .dl-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-top: 22px;
            padding: 15px 36px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: #fff;
            border: none;
            border-radius: 14px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 0.02em;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .dl-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(16, 185, 129, 0.38);
        }

        .dl-btn:active { transform: translateY(0); }

        .tel-hint {
            margin-top: 12px;
            font-size: 0.82rem;
            color: #94a3b8;
        }

        .label-textarea {
            width: 100%;
            padding: 13px 16px;
            border: 2.5px solid #e2e8f0;
            border-radius: 14px;
            font-size: 0.97rem;
            font-family: 'Courier New', monospace;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: #1e293b;
            outline: none;
            resize: none;
            line-height: 1.55;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .label-textarea:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.13);
        }

        .hint-text {
            margin-top: 8px;
            font-size: 0.8rem;
            color: #94a3b8;
        }

        /* ── Responsive ── */
        @media (max-width: 520px) {
            .card { padding: 28px 20px; }
            .header h1 { font-size: 1.65rem; }
            .icon-grid { grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); }
        }
    </style>
</head>
<body>
<div class="card">

    <div class="header">
        <h1>✨ QR Kod Üretici</h1>
        <p>Numara girin &bull; İkon seçin &bull; QR oluşturun!</p>
    </div>

    <!-- Phone -->
    <div class="section">
        <div class="label">📱 Telefon Numarası</div>
        <div class="phone-wrap">
            <span class="icon">📞</span>
            <input type="tel" id="phoneInput" placeholder="+905373191788" autocomplete="tel" />
        </div>
        <div class="error-msg" id="errorMsg">
            Ülke koduyla birlikte geçerli bir numara girin — örn. +905373191788
        </div>
    </div>

    <!-- Icon picker -->
    <div class="section">
        <div class="label">🎨 İkon Seçin</div>
        <div class="icon-grid" id="iconGrid"></div>
    </div>

    <!-- PDF label -->
    <div class="section">
        <div class="label">📝 PDF Üst Yazısı</div>
        <textarea id="labelInput" class="label-textarea" rows="2">IF FOUND, SCAN QR CODE TO REACH PARENT</textarea>
        <div class="hint-text">Bu metin QR kodun üstünde PDF'e yazdırılır. İstediğiniz gibi düzenleyebilirsiniz.</div>
    </div>

    <button class="gen-btn" onclick="generate()">
        <span>⚡</span> QR Kodu Oluştur
    </button>

    <!-- Result -->
    <div class="result" id="result">
        <div class="divider"></div>
        <div class="qr-preview">
            <canvas id="qrCanvas"></canvas>
        </div>
        <br>
        <button class="dl-btn" onclick="downloadPDF()">
            📥 PDF Olarak İndir (2 × 4 cm)
        </button>
        <div class="tel-hint" id="telHint"></div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
// ── Icon list ────────────────────────────────────────────────────────────────
const ICONS = [
    ['🐘','Fil'],          ['🦒','Zürafa'],        ['😄','Gülen Surat'],   ['🦁','Aslan'],
    ['🐯','Kaplan'],       ['🐸','Kurbağa'],        ['🦋','Kelebek'],       ['🐬','Yunus'],
    ['🦄','Unicorn'],      ['🐧','Penguen'],         ['🦊','Tilki'],         ['🐼','Panda'],
    ['🐳','Balina'],       ['🦩','Flamingo'],        ['🐙','Ahtapot'],       ['🦜','Papağan'],
    ['🐨','Koala'],        ['🦔','Kirpi'],           ['🦓','Zebra'],         ['🐊','Timsah'],
    ['🦈','Köpekbalığı'], ['🦀','Yengeç'],          ['🐶','Köpek'],         ['🐱','Kedi'],
    ['🐰','Tavşan'],       ['⭐','Yıldız'],          ['❤️','Kalp'],          ['🌈','Gökkuşağı'],
    ['🚀','Roket'],        ['🎈','Balon'],            ['🌸','Çiçek'],         ['🌟','Parlayan Yıldız'],
];

let selectedEmoji = ICONS[0][0];

// Build grid
const grid = document.getElementById('iconGrid');
ICONS.forEach(([emoji, label], i) => {
    const btn = document.createElement('button');
    btn.className = 'icon-btn' + (i === 0 ? ' active' : '');
    btn.textContent = emoji;
    btn.title = label;
    btn.addEventListener('click', () => {
        grid.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedEmoji = emoji;
    });
    grid.appendChild(btn);
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function normalizePhone(raw) {
    return raw.replace(/[\s\-\(\)]/g, '');
}

function isValidPhone(phone) {
    return /^\+\d{7,15}$/.test(phone);
}

function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ── Generate ─────────────────────────────────────────────────────────────────
function generate() {
    const raw   = document.getElementById('phoneInput').value.trim();
    const phone = normalizePhone(raw);
    const inp   = document.getElementById('phoneInput');
    const err   = document.getElementById('errorMsg');

    if (!isValidPhone(phone)) {
        inp.classList.add('err');
        err.style.display = 'block';
        return;
    }
    inp.classList.remove('err');
    err.style.display = 'none';

    try {
        // qrcode-generator: typeNumber 0 = auto, 'H' = high error correction (30%)
        const qr = qrcode(0, 'H');
        qr.addData('tel:' + phone);
        qr.make();

        const SIZE   = 500;
        const QUIET  = 4;                          // quiet zone (modules)
        const mc     = qr.getModuleCount();
        const total  = mc + QUIET * 2;
        const cell   = SIZE / total;

        const canvas = document.getElementById('qrCanvas');
        canvas.width  = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, SIZE, SIZE);

        // QR modules
        ctx.fillStyle = '#1e1b4b';
        for (let r = 0; r < mc; r++) {
            for (let c = 0; c < mc; c++) {
                if (qr.isDark(r, c)) {
                    const x = (c + QUIET) * cell;
                    const y = (r + QUIET) * cell;
                    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(cell), Math.ceil(cell));
                }
            }
        }

        // Center icon — white rounded background + emoji
        const cx  = SIZE / 2;
        const cy  = SIZE / 2;
        const em  = SIZE * 0.22;
        const pad = em * 0.24;
        const box = em + pad * 2;

        ctx.save();
        roundedRect(ctx, cx - box / 2, cy - box / 2, box, box, 16);
        ctx.fillStyle   = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur  = 8;
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.font         = em + 'px serif';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedEmoji, cx, cy + em * 0.03);
        ctx.restore();

        const result = document.getElementById('result');
        result.classList.add('show');
        document.getElementById('telHint').textContent = '📲 QR okutulunca ' + phone + ' numarası aranacak';
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (e) {
        console.error(e);
    }
}

// ── Download PDF ─────────────────────────────────────────────────────────────
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const canvas   = document.getElementById('qrCanvas');
    const imgData  = canvas.toDataURL('image/png');
    const phone    = normalizePhone(document.getElementById('phoneInput').value.trim());
    const rawLabel = document.getElementById('labelInput').value.trim();
    const label    = rawLabel || 'IF FOUND, SCAN QR CODE TO REACH PARENT';

    // 2 cm wide × 4 cm tall portrait (narrow label / tattoo strip)
    const W = 2, H = 4;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'cm', format: [W, H] });

    // ── Header text (top ~1.6 cm) ────────────────────────────────────────────
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(20, 20, 20);

    const lines  = pdf.splitTextToSize(label.toUpperCase(), 1.8); // wrap in 1.8 cm
    const lineH  = 0.29;                     // cm per line at 7.5 pt
    const blockH = lines.length * lineH;
    const textAreaH = 1.6;                   // reserved for text block
    const startY = (textAreaH - blockH) / 2 + lineH; // vertically centred

    pdf.text(lines, W / 2, startY, { align: 'center' });

    // ── Separator line ───────────────────────────────────────────────────────
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.018);
    pdf.line(0.15, 1.65, 1.85, 1.65);

    // ── QR code (1.75 × 1.75 cm, horizontally centred) ──────────────────────
    const qrSize = 1.75;
    const qrX    = (W - qrSize) / 2;        // 0.125 cm margin on each side
    pdf.addImage(imgData, 'PNG', qrX, 1.75, qrSize, qrSize);

    pdf.save('qr-' + phone + '.pdf');
}

// Enter key shortcut
document.getElementById('phoneInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') generate();
});
</script>
</body>
</html>
`;
