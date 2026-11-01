'use strict';
/* ============================================================
 * 安全测试：XSS 转义、危险 sink 基线、链接安全、存储健壮性
 * 静态分析 techspeak/{app,data,core}.js 与 index.html +
 * esc() 运行时对抗测试。新增代码触发基线变化即失败，
 * 强制安全评审。
 * ============================================================ */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { esc } = require('../techspeak/core.js');

const read = f => fs.readFileSync(path.join(__dirname, '..', 'techspeak', f), 'utf8');
const appSrc = read('app.js');
const dataSrc = read('data.js');
const coreSrc = read('core.js');
const htmlSrc = read('index.html');

/* ---------- 1. esc() 运行时对抗测试 ---------- */
test('esc 中和典型 XSS payload', () => {
  const payloads = [
    '<script>alert(1)</script>',
    '"><svg onload=alert(1)>',
    "'-alert(1)-'",
    '<img src=x onerror="alert(document.cookie)">',
    'javascript:alert(1)',
    '</textarea><iframe src=javascript:alert(1)>'
  ];
  payloads.forEach(p => {
    const out = esc(p);
    assert.ok(!out.includes('<'), `payload 未中和: ${p}`);
    assert.ok(!out.includes('>'), `payload 未中和: ${p}`);
    assert.ok(!out.includes('"') || out.includes('&quot;'), `引号未中和: ${p}`);
  });
});
test('esc 输出再次转义不会还原出原始标签', () => {
  /* esc 会转义 &，因此严格意义上不幂等（&lt; → &amp;lt;）；
   * 安全不变量是：任意次转义后输出都不含裸露的 < > " ' */
  let out = esc('<b>"\'');
  for (let n = 1; n <= 3; n++) {
    ['<', '>', '"', "'"].forEach(c => assert.ok(!out.includes(c), `${n} 次转义后仍含裸露的 ${c}: ${out}`));
    out = esc(out);
  }
});

/* ---------- 2. 危险 sink 零容忍 ---------- */
test('不使用 eval / new Function / document.write', () => {
  [appSrc, dataSrc, coreSrc].forEach((src, i) => {
    assert.ok(!/\beval\s*\(/.test(src), `文件 ${i} 含 eval(`);
    assert.ok(!/\bnew\s+Function\s*\(/.test(src), `文件 ${i} 含 new Function(`);
    assert.ok(!/\bdocument\.write\s*\(/.test(src), `文件 ${i} 含 document.write(`);
  });
});
test('不使用字符串参数的 setTimeout / setInterval', () => {
  [appSrc, dataSrc, coreSrc].forEach((src, i) => {
    assert.ok(!/setTimeout\s*\(\s*['"`]/.test(src), `文件 ${i} 含字符串 setTimeout`);
    assert.ok(!/setInterval\s*\(\s*['"`]/.test(src), `文件 ${i} 含字符串 setInterval`);
  });
});

/* ---------- 3. innerHTML sink 基线（回归绊网） ----------
 * 每新增一个 innerHTML/outerHTML 写入点都会改变计数并使本测试失败，
 * 提示开发者确认新写入点全部经过 esc()。 */
test('innerHTML/outerHTML 写入点数量锁定基线', () => {
  const n1 = (appSrc.match(/\.innerHTML\s*=/g) || []).length;
  const n2 = (appSrc.match(/\.outerHTML\s*=/g) || []).length;
  assert.equal(n1, 39, `innerHTML 写入点 ${n1} != 基线 39。若为有意新增，请确认所有插值均经 esc() 后更新基线（39 = 原 37 + 视频精练页 2）`);
  assert.equal(n2, 1, `outerHTML 写入点 ${n2} != 基线 1`);
});

/* ---------- 4. 属性注入必须经 esc() ---------- */
test('data-* 属性插值全部经 esc() 转义', () => {
  /* 匹配形如 data-say="${expr}" 的插值，要求 expr 以 esc( 开头。
   * 白名单放行可证明为数字的表达式：forEach 下标（i/wi/si）与
   * buildRefWords 产出的对齐索引（word.s / word.w，selector 查询用）；
   * 任何其他裸变量插值一律视为未转义。 */
  const re = /data-[a-z]+="\$\{([^}]*)\}"/g;
  const SAFE_NUM = /^\s*(i|wi|si|word\.s|word\.w)\s*$/;
  let total = 0;
  [appSrc, dataSrc].forEach((src, fi) => {
    let m, count = 0;
    while ((m = re.exec(src)) !== null) {
      count++;
      assert.ok(
        /^\s*esc\(/.test(m[1]) || SAFE_NUM.test(m[1]),
        `第 ${fi} 个文件存在未转义的属性插值: data-xxx="\${${m[1]}}"`
      );
    }
    total += count;
  });
  assert.ok(total > 0, 'app.js 应至少存在一个 data-* 插值点（用于验证扫描器有效）');
});
test('onclick 内的路由插值仅来自受控 route 字符串', () => {
  const re = /onclick="location\.hash='\$\{([^}]+)\}'"/g;
  let m, found = 0;
  while ((m = re.exec(appSrc)) !== null) {
    found++;
    assert.ok(/^\s*(pick\.route|esc)/.test(m[1]), `可疑 onclick 插值: ${m[1]}`);
  }
  assert.ok(found >= 1, '应至少存在一个 onclick 路由插值（验证扫描器有效）');
});

/* ---------- 5. 外链安全 ---------- */
test('target=_blank 必须伴随 rel="noopener"', () => {
  [appSrc, dataSrc, htmlSrc].forEach((src, i) => {
    assert.ok(!/target="_blank"(?!\s+rel="noopener")/.test(src), `文件 ${i} 存在缺 rel=noopener 的 _blank 链接`);
  });
});
test('不加载任何远程脚本 / 不安全协议资源', () => {
  const scripts = [...htmlSrc.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
  assert.ok(scripts.length >= 3, 'index.html 应加载 core/data/app 三个脚本');
  scripts.forEach(s => assert.ok(/^[\w.-]+\.js$/.test(s), `脚本应为本站相对路径: ${s}`));
  /* localhost / 127.0.0.1 的 http 引用属于本地开发说明文案（如 About 页
   * 的 python3 -m http.server 示例），放行；其余任何明文 http:// 均拒绝 */
  const stripLocal = s => s.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, 'LOCALHOST_REF');
  [appSrc, dataSrc, coreSrc, htmlSrc].forEach((src, i) => {
    assert.ok(!/src=["']?http:\/\//.test(src), `文件 ${i} 引用 http:// 资源`);
    assert.ok(!/http:\/\//.test(stripLocal(src)), `文件 ${i} 出现明文 http 链接（仅允许 localhost 本地开发引用）`);
  });
});
test('data 层不出现 javascript: 伪协议', () => {
  assert.ok(!/javascript:/i.test(dataSrc), 'data.js 存在 javascript: 协议字符串');
});

/* ---------- 6. localStorage / JSON 解析健壮性 ---------- */
test('所有 JSON.parse 都被 try/catch 包裹（同行 try 守卫）', () => {
  const lines = appSrc.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('JSON.parse')) {
      assert.ok(
        /try\s*\{/.test(line),
        `第 ${i + 1} 行 JSON.parse 未被 try 守卫（含损坏 localStorage 数据会抛异常）`
      );
    }
  });
});
test('localStorage 写键固定为 techspeak_ 前缀（无键注入）', () => {
  const KEY_RE = /^techspeak_[a-z]+_v1$/;
  /* key 常量定义必须符合白名单 */
  const defs = [...appSrc.matchAll(/key:\s*'([^']+)'/g)].map(m => m[1]);
  assert.equal(defs.length, 3, `key 常量定义应为 3 个（Vocab/History/Prefs），实际 ${defs.length}`);
  defs.forEach(k => assert.ok(KEY_RE.test(k), `异常存储键: ${k}`));
  /* 所有 setItem 调用的键必须是 this.key（指向已校验常量）或白名单字面量 */
  const calls = [...appSrc.matchAll(/localStorage\.setItem\(\s*([^,]+?),/g)].map(m => m[1].trim());
  assert.equal(calls.length, 3, `setItem 调用数应为 3，实际 ${calls.length}`);
  calls.forEach(k => assert.ok(k === 'this.key' || KEY_RE.test(k), `可疑 setItem 键: ${k}`));
});

/* ---------- 7. 数据层 HTML 惰性（纵深防御） ---------- */
test('data.js 所有字符串值不含 HTML 标签字符', () => {
  const data = require('../techspeak/data.js');
  const walk = (node, trail) => {
    if (typeof node === 'string') {
      assert.ok(!/[<>]/.test(node), `数据包含 <> 字符: ${trail} = ${node.slice(0, 60)}`);
    } else if (Array.isArray(node)) {
      node.forEach((x, i) => walk(x, `${trail}[${i}]`));
    } else if (node && typeof node === 'object') {
      Object.entries(node).forEach(([k, v]) => walk(v, `${trail}.${k}`));
    }
  };
  walk(data, 'data');
});

/* ---------- 8. CSP 基础头 ---------- */
test('index.html 声明 charset 与 viewport（基础安全头）', () => {
  assert.ok(/<meta charset="UTF-8">/.test(htmlSrc));
  assert.ok(/name="viewport"/.test(htmlSrc));
});
