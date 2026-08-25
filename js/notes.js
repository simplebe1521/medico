export class NotesManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.notes = [];
    this.activeNoteId = null;
  }

  async init() {
    if (!this.container) return;
    await this.fetchNotes();
    this.render();
  }

  async fetchNotes() {
    try {
      const res = await fetch('/api/notes');
      this.notes = await res.json();
    } catch (e) {
      console.warn('Backend not running, using local storage for notes.');
      const local = localStorage.getItem('medsim_notes');
      this.notes = local ? JSON.parse(local) : [];
    }
  }

  async saveNote(note) {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      const saved = await res.json();
      this.notes.push(saved);
    } catch (e) {
      note.id = Date.now().toString();
      note.createdAt = new Date().toISOString();
      this.notes.push(note);
      localStorage.setItem('medsim_notes', JSON.stringify(this.notes));
    }
    this.render();
  }

  async deleteNote(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      this.notes = this.notes.filter(n => n.id !== id);
    } catch (e) {
      this.notes = this.notes.filter(n => n.id !== id);
      localStorage.setItem('medsim_notes', JSON.stringify(this.notes));
    }
    if (this.activeNoteId === id) this.activeNoteId = null;
    this.render();
  }

  render() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="notes-sidebar">
        <div class="notes-actions">
          <button id="btnNewNote" class="btn btn-primary btn-sm" style="width:100%">+ New Note</button>
        </div>
        <div class="notes-search">
          <input type="text" id="noteSearch" placeholder="Search notes..." class="form-control">
        </div>
        <div class="notes-list" id="notesList"></div>
      </div>
      <div class="note-editor" id="noteEditor">
        ${this.activeNoteId ? this._renderEditor() : '<div class="empty-state">Select or create a note</div>'}
      </div>
    `;

    this._renderList();
    this._attachListeners();
  }

  _renderList(query = '') {
    const list = document.getElementById('notesList');
    if (!list) return;

    list.innerHTML = '';
    const filtered = this.notes.filter(n => 
      n.title.toLowerCase().includes(query.toLowerCase()) || 
      n.content.toLowerCase().includes(query.toLowerCase())
    );

    filtered.forEach(note => {
      const el = document.createElement('div');
      el.className = `note-item ${this.activeNoteId === note.id ? 'active' : ''}`;
      el.innerHTML = `
        <div class="note-title">${note.title || 'Untitled Note'}</div>
        <div class="note-meta">${new Date(note.createdAt).toLocaleDateString()} ${note.tag ? '• ' + note.tag : ''}</div>
      `;
      el.addEventListener('click', () => {
        this.activeNoteId = note.id;
        this.render();
      });
      list.appendChild(el);
    });
  }

  _renderEditor() {
    const note = this.notes.find(n => n.id === this.activeNoteId) || { title: '', content: '', tag: '' };
    return `
      <div class="editor-header">
        <input type="text" id="editTitle" class="editor-title" placeholder="Note Title..." value="${note.title}">
        <input type="text" id="editTag" class="editor-tag" placeholder="Tag (e.g., Anatomy)" value="${note.tag || ''}">
      </div>
      <textarea id="editContent" class="editor-textarea" placeholder="Start typing your clinical notes...">${note.content}</textarea>
      <div class="editor-footer">
        <button id="btnDeleteNote" class="btn btn-danger btn-sm">Delete</button>
        <button id="btnSaveNote" class="btn btn-primary btn-sm">Save Note</button>
      </div>
    `;
  }

  _attachListeners() {
    const btnNew = document.getElementById('btnNewNote');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        this.activeNoteId = 'new';
        this.render();
      });
    }

    const search = document.getElementById('noteSearch');
    if (search) {
      search.addEventListener('input', (e) => this._renderList(e.target.value));
    }

    const btnSave = document.getElementById('btnSaveNote');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const title = document.getElementById('editTitle').value;
        const tag = document.getElementById('editTag').value;
        const content = document.getElementById('editContent').value;
        
        if (this.activeNoteId === 'new') {
          this.saveNote({ title, tag, content });
          this.activeNoteId = null;
        } else {
          // Update existing (mock update via delete + save)
          const oldNote = this.notes.find(n => n.id === this.activeNoteId);
          if (oldNote) {
            oldNote.title = title;
            oldNote.tag = tag;
            oldNote.content = content;
            this.saveNote(oldNote); // In a real app, use PUT
          }
        }
      });
    }

    const btnDel = document.getElementById('btnDeleteNote');
    if (btnDel && this.activeNoteId !== 'new') {
      btnDel.addEventListener('click', () => {
        this.deleteNote(this.activeNoteId);
      });
    }
  }
}
