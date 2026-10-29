'use strict';
/* ============================================================
 * 数据完整性测试：ARTICLES / GLOSSARY / PATTERNS / PARAGRAPHS
 * 保证内容更新不破坏前端渲染与练习流水线。
 * ============================================================ */
const test = require('node:test');
const assert = require('node:assert/strict');
const { splitWords } = require('../techspeak/core.js');
const { ARTICLES, GLOSSARY, GLOSSARY_MAP, PATTERNS, PARAGRAPHS } = require('../techspeak/data.js');

const URL_RE = /^https:\/\/[\w.-]+/;
const ID_RE = /^[a-z0-9-]+$/;

/* ---------- ARTICLES ---------- */
test('ARTICLES 非空且 id 唯一、格式安全', () => {
  assert.ok(ARTICLES.length >= 3, '文章库至少 3 篇');
  const ids = ARTICLES.map(a => a.id);
  assert.equal(new Set(ids).size, ids.length, '文章 id 重复');
  ids.forEach(id => assert.match(id, ID_RE, `文章 id 含非法字符（会被拼进 onclick 路由）: ${id}`));
});
test('每篇文章字段完整', () => {
  ARTICLES.forEach(a => {
    assert.equal(typeof a.title, 'string'); assert.ok(a.title.length > 0);
    assert.equal(typeof a.source, 'string'); assert.ok(a.source.length > 0);
    assert.match(a.url, URL_RE, `文章 url 非安全 https: ${a.url}`);
    assert.ok(Array.isArray(a.tags) && a.tags.length > 0);
    assert.ok(Array.isArray(a.paragraphs) && a.paragraphs.length >= 3, `${a.id} 段落过少`);
    a.paragraphs.forEach((p, i) => {
      assert.ok(p.title && p.title.length > 0, `${a.id}#${i} 缺标题`);
      const wc = splitWords(p.text).length;
      assert.ok(wc >= 20 && wc <= 160, `${a.id}#${i} 词数 ${wc} 超出练习合理区间`);
    });
  });
});
test('文章 sourceClass 属于已知徽章集合', () => {
  const ok = new Set(['anthropic', 'deepmind', 'google']);
  ARTICLES.forEach(a => assert.ok(ok.has(a.sourceClass), `未知 sourceClass: ${a.sourceClass}`));
});

/* ---------- GLOSSARY ---------- */
test('GLOSSARY 术语唯一且全部入 GLOSSARY_MAP', () => {
  const terms = GLOSSARY.map(g => g.term.toLowerCase());
  assert.equal(new Set(terms).size, terms.length, '术语重复');
  GLOSSARY.forEach(g => {
    assert.ok(g.term && g.term.length > 0);
    assert.ok(g.ipa && g.ipa.length > 0, `${g.term} 缺 IPA`);
    assert.ok(g.zh && g.zh.length > 0, `${g.term} 缺中文释义`);
    assert.ok(g.example && splitWords(g.example).length >= 3, `${g.term} 例句过短`);
    assert.equal(GLOSSARY_MAP[g.term.toLowerCase()], g, `${g.term} 未进入快速索引`);
  });
});
test('GLOSSARY 分类合法', () => {
  const cats = new Set(['AI/ML', 'Infra/Systems', 'Business']);
  GLOSSARY.forEach(g => assert.ok(cats.has(g.cat), `未知分类: ${g.cat}`));
});

/* ---------- PATTERNS ---------- */
test('PATTERNS 句型结构完整', () => {
  assert.ok(PATTERNS.length >= 5);
  PATTERNS.forEach(cat => {
    assert.ok(cat.category && cat.category.length > 0);
    assert.ok(Array.isArray(cat.items) && cat.items.length > 0);
    cat.items.forEach(p => {
      assert.ok(p.name && p.name.length > 0);
      /* 模板含 {slot} 可替换练；或为完整固定句（如"接住问题"的整句应对语），
       * 前端渲染对两者均合法（app.js 仅把 {slot} 高亮为可点击位） */
      assert.ok(
        p.template && (/\{[^}]+\}/.test(p.template) || /[.!?]$/.test(p.template.trim())),
        `${p.name} 模板既无 {slot} 也不是完整句`
      );
      assert.ok(Array.isArray(p.examples) && p.examples.length > 0, `${p.name} 缺例句`);
      p.examples.forEach(ex => {
        assert.ok(ex.en && splitWords(ex.en).length >= 4, `${p.name} 例句过短`);
        assert.ok(ex.zh && ex.zh.length > 0, `${p.name} 例句缺中文`);
      });
      assert.ok(p.note && p.note.length > 0, `${p.name} 缺讲解`);
    });
  });
});

/* ---------- PARAGRAPHS ---------- */
test('PARAGRAPHS id 唯一且字段完整', () => {
  const ids = PARAGRAPHS.map(p => p.id);
  assert.equal(new Set(ids).size, ids.length, '句段 id 重复');
  ids.forEach(id => assert.match(id, ID_RE, `句段 id 非法: ${id}`));
  PARAGRAPHS.forEach(p => {
    assert.ok(p.theme && p.theme.length > 0);
    assert.ok(['Basic', 'Intermediate', 'Advanced'].includes(p.difficulty), `未知难度: ${p.difficulty}`);
    assert.equal(typeof p.wpmTarget, 'number');
    assert.ok(p.wpmTarget >= 80 && p.wpmTarget <= 200, `${p.id} 目标语速 ${p.wpmTarget} 异常`);
    assert.ok(p.focus && p.focus.length > 0, `${p.id} 缺练习要点`);
    assert.ok(p.sourceNote && p.sourceNote.length > 0, `${p.id} 缺来源`);
    const wc = splitWords(p.text).length;
    assert.ok(wc >= 30 && wc <= 120, `${p.id} 词数 ${wc} 超出 50-90 词设计区间（30-120 容差）`);
  });
});

/* ---------- 跨层一致性 ---------- */
test('文章 url 与来源一一对应可追溯', () => {
  ARTICLES.forEach(a => {
    const expectHost = a.source === 'Anthropic' ? 'anthropic.com'
      : a.source === 'Google DeepMind' ? 'deepmind.google'
        : a.source === 'Google Cloud' ? 'blog.google' : null;
    assert.ok(expectHost && a.url.includes(expectHost), `${a.title} url 域名与 source 不符`);
  });
});
