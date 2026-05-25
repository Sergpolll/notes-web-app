import React, { useEffect, useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import LikeButton from './LikeButton'
import { ReactCusdis } from 'react-cusdis'
import './index.css'

// Custom lightweight parser for Obsidian YAML frontmatter
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };
  
  const yamlString = match[1];
  const content = match[2];
  const data = {};
  
  yamlString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });
  
  return { data, content };
}

function App() {
  const [index, setIndex] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [expandedMonths, setExpandedMonths] = useState({})
  
  const [content, setContent] = useState('')
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load the index first
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}notes_index.json`)
      .then(res => res.json())
      .then(data => {
        setIndex(data);
        const months = Object.keys(data);
        if (months.length > 0 && data[months[0]].length > 0) {
          setSelectedNote(data[months[0]][0].filename);
          setExpandedMonths({ [months[0]]: true });
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load index", err);
        setLoading(false);
      });
  }, []);

  // Load the specific note when selected
  useEffect(() => {
    if (!selectedNote) return;
    
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}notes/${selectedNote}`)
      .then((res) => res.text())
      .then((text) => {
        const { data, content } = parseFrontmatter(text)
        setMetadata(data)
        setContent(content)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error loading markdown:", err)
        setLoading(false)
      })
  }, [selectedNote])

  if (!index) {
    return <div className="loading-screen">Loading archive...</div>
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <h2>Archive 2026</h2>
        </div>
        <nav className="month-list">
          {Object.keys(index).map(month => (
            <div key={month} className="month-group">
              <h3 
                className="month-title" 
                onClick={() => setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }))}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {month}
                <span style={{ fontSize: '0.8em', transition: 'transform 0.3s', transform: expandedMonths[month] ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </h3>
              
              {expandedMonths[month] && (
                <ul className="note-list">
                {index[month].map(note => (
                  <li 
                    key={note.filename} 
                    className={`note-item ${selectedNote === note.filename ? 'active' : ''}`}
                    onClick={() => setSelectedNote(note.filename)}
                  >
                    <span className="note-date">{note.date.replace(/['"]/g, '').split('-').length === 3 ? `${note.date.replace(/['"]/g, '').split('-')[2]}.${note.date.replace(/['"]/g, '').split('-')[1]}.${note.date.replace(/['"]/g, '').split('-')[0].substring(2)}` : note.date}</span>
                    <span className="note-topic">{note.topic}</span>
                  </li>
                ))}
              </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {loading ? (
          <div className="loading-screen">Loading note...</div>
        ) : (
          <article className="container">
            {metadata && (
              <header className="article-header glass-panel">
                <h1 className="main-title">{metadata.web_title || metadata.topic || metadata.title}</h1>
                <div className="meta-info">
                  <span className="date-badge">{metadata.date}</span>
                </div>
              </header>
            )}
            
            <div className="content-area glass-panel">
              <MarkdownRenderer content={content} />
            </div>

            <div className="interaction-section">
              <LikeButton noteId={selectedNote} />
              
              <div className="comments-wrapper glass-panel">
                <ReactCusdis
                  attrs={{
                    host: 'https://cusdis.com',
                    appId: '817ad13b-6dbe-4923-9196-076c65a72263',
                    pageId: selectedNote,
                    pageTitle: metadata?.web_title || metadata?.topic || metadata?.title,
                    pageUrl: `https://notes.vercel.app/${selectedNote}`,
                    theme: 'dark'
                  }}
                />
              </div>
            </div>
          </article>
        )}
      </main>
    </div>
  )
}

export default App
