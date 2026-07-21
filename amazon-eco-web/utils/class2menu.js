// Cleaned and extended Class2Menu component and helper utilities
class Class2Menu {
  constructor({ items = [], container = document.body, onSelect = () => {} } = {}) {
    this.items = items;
    this.container = container;
    this.onSelect = onSelect;
    this.el = null;
    this.visible = false;
    this._outsideHandler = this._outsideHandler.bind(this);
    this.boxShadow = null;
    this.paddingServiceOption = false;
  }

  build() {
    if (this.el) return this.el;
    const el = document.createElement('div');
    el.className = 'class2menu';
    Object.assign(el.style, {
      position: 'absolute',
      minWidth: '160px',
      border: '1px solid #ccc',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'none',
      zIndex: 1000
    });

    const ul = document.createElement('ul');
    ul.style.cssText = 'list-style:none;margin:0;padding:8px 0;';

    this.items.forEach((it, i) => {
      const li = document.createElement('li');
      const serviceSidePrompt = it.serviceSidePrompt ? ` (${it.serviceSidePrompt})` : '';
      li.textContent = (it.label || String(it)) + serviceSidePrompt;
      Object.assign(li.style, { padding: '6px 12px', cursor: 'pointer' });
      li.dataset.index = i;
      li.addEventListener('click', (e) => this.select(i, e));
      li.addEventListener('mouseenter', () => (li.style.background = '#f5f5f5'));
      li.addEventListener('mouseleave', () => (li.style.background = ''));
      ul.appendChild(li);
    });

    el.appendChild(ul);

    // create an optional boxShadow helper element (hidden by default)
    const boxShadow = document.createElement('div');
    boxShadow.className = 'class2menu-boxshadow';
    Object.assign(boxShadow.style, {
      position: 'absolute',
      minWidth: '160px',
      display: 'none',
      zIndex: 999
    });
    this.boxShadow = boxShadow;

    this.el = el;
    this.container.appendChild(el);
    this.container.appendChild(boxShadow);
    return el;
  }

  show(x = 0, y = 0) {
    this.build();
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    this.el.style.display = 'block';
    this.visible = true;
    this.paddingServiceOption = true;
    document.addEventListener('click', this._outsideHandler);
  }

  hide() {
    if (!this.el) return;
    this.el.style.display = 'none';
    this.visible = false;
    this.paddingServiceOption = false;
    document.removeEventListener('click', this._outsideHandler);
  }

  select(i, e) {
    const item = this.items[i];
    this.onSelect(item, i, e);
    this.hide();
  }

  _outsideHandler(e) {
    if (!this.el) return;
    if (!this.el.contains(e.target)) this.hide();
  }

  // Toggle and control the padding/boxShadow helper
  setPaddingServiceOption(enabled) {
    this.paddingServiceOption = !!enabled;
    if (!this.boxShadow) return;
    this.boxShadow.style.display = this.paddingServiceOption ? 'block' : 'none';
  }

  showBoxShadow(x = 0, y = 0, content = '') {
    this.build();
    if (!this.boxShadow) return;
    // allow string or Node
    this.boxShadow.innerHTML = '';
    if (typeof content === 'string') {
      this.boxShadow.textContent = content;
    } else if (content instanceof Node) {
      this.boxShadow.appendChild(content);
    }
    this.boxShadow.style.left = `${x}px`;
    this.boxShadow.style.top = `${y}px`;
    this.boxShadow.style.display = 'block';
  }

  hideBoxShadow() {
    if (!this.boxShadow) return;
    this.boxShadow.style.display = 'none';
  }
}

// --- Helper utilities ---
async function serviceParams(url = '/protocol/service/nextPageInfo') {
  // wrapper for fetch so callers can stub or replace in tests
  return fetch(url, { method: 'GET' });
}

async function menuInfoRepair(url) {
  const response = await serviceParams(url);
  if (!response.ok) {
    console.error('menuInfoRepair: failed to fetch params', response.status);
    return { ok: false, items: [] };
  }
  const data = await response.json();
  const items = data.items || [];
  return { ok: true, items };
}

function paddingOffside(enabled) {
  if (enabled) {
    console.log('paddingOffside: enabled');
    return true;
  } else {
    console.error('paddingOffside: disabled');
    return false;
  }
}

function checkWholeIpv4(key, serviceArray = []) {
  if (!Array.isArray(serviceArray)) return false;
  const boxRangeService = serviceArray.map((item) => item[key]);
  if (boxRangeService.length > 0) {
    console.log('checkWholeIpv4: found items');
    return boxRangeService;
  } else {
    console.error('checkWholeIpv4: no items found');
    return [];
  }
}

function hideService(name, exe) {
  // original code had an invalid `let hideService('checkRollback', 'service.exe');`
  // provide a simple, deterministic implementation that can be extended
  if (!name) return false;
  console.log(`hideService: called for ${name} (${exe || 'unknown'})`);
  // pretend to perform an action and return success
  return true;
}

export default Class2Menu;
export { serviceParams, menuInfoRepair, paddingOffside, checkWholeIpv4, hideService };
