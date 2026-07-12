import { useState } from 'react'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { categorize, formatTimeRange, formatDate } from '../lib/announcements'
import { KIDS, THEME, todayString } from '../lib/constants'
import Icon from '../components/Icon'

const BLANK = { kid_id: '', title: '', body: '', date: '', start_time: '', end_time: '' }

export default function AnnouncementsEditor() {
  const { items, loading, error, addItem, updateItem, removeItem } = useAnnouncements()
  const [editingId, setEditingId] = useState(null) // null = closed, 'new' = adding, or a row id
  const [form, setForm] = useState(BLANK)
  const [isEvent, setIsEvent] = useState(true)
  const [allDay, setAllDay] = useState(false)

  const openNew = () => {
    setForm({ ...BLANK, date: todayString() })
    setIsEvent(true)
    setAllDay(false)
    setEditingId('new')
  }

  const openEdit = (it) => {
    setForm({
      kid_id:     it.kid_id ?? '',
      title:      it.title ?? '',
      body:       it.body ?? '',
      date:       it.date ?? '',
      start_time: it.start_time?.slice(0, 5) ?? '',
      end_time:   it.end_time?.slice(0, 5) ?? '',
    })
    setIsEvent(!!it.date)
    setAllDay(!!it.date && !it.start_time)
    setEditingId(it.id)
  }

  const close = () => { setEditingId(null); setForm(BLANK) }

  const save = async () => {
    if (!form.title.trim()) return
    const payload = {
      kid_id: form.kid_id,
      title:  form.title,
      body:   form.body,
      date:       isEvent ? form.date : '',
      start_time: isEvent && !allDay ? form.start_time : '',
      end_time:   isEvent && !allDay ? form.end_time : '',
    }
    if (editingId === 'new') await addItem(payload)
    else await updateItem(editingId, payload)
    close()
  }

  const { standing, todayEvents, upcoming } = categorize(items)

  return (
    <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: THEME.gold, fontFamily: 'Barlow Condensed, sans-serif', fontSize: 15, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="calendar" size={16} color={THEME.gold} />
          Announcements & Events
        </div>
        {editingId == null && (
          <button onClick={openNew} style={addBtnStyle}>
            <Icon name="plus" size={14} color={THEME.dark} /> Add
          </button>
        )}
      </div>

      {error && <p style={{ color: '#FF8080', fontSize: 13 }}>{error}</p>}

      {editingId != null && (
        <Form
          form={form} setForm={setForm}
          isEvent={isEvent} setIsEvent={setIsEvent}
          allDay={allDay} setAllDay={setAllDay}
          onSave={save} onCancel={close}
          isNew={editingId === 'new'}
        />
      )}

      {loading ? (
        <p style={{ color: THEME.muted, fontSize: 13 }}>Loading…</p>
      ) : items.length === 0 && editingId == null ? (
        <p style={{ color: THEME.muted, fontSize: 13 }}>Nothing scheduled. Tap <strong>Add</strong> to post an announcement or event.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Group label="Announcements" rows={standing} onEdit={openEdit} onDelete={removeItem} />
          <Group label="Today" rows={todayEvents} onEdit={openEdit} onDelete={removeItem} showTime />
          <Group label="Coming Up" rows={upcoming} onEdit={openEdit} onDelete={removeItem} showTime showDate />
        </div>
      )}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function Form({ form, setForm, isEvent, setIsEvent, allDay, setAllDay, onSave, onCancel, isNew }) {
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div style={{ background: THEME.surface2, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Type toggle */}
      <Segmented
        options={[{ v: true, label: 'Event' }, { v: false, label: 'Announcement' }]}
        value={isEvent}
        onChange={setIsEvent}
      />

      {/* Who */}
      <div>
        <Label>Who it's for</Label>
        <Segmented
          options={[{ v: '', label: 'Everyone' }, ...KIDS.map(k => ({ v: k.id, label: k.name }))]}
          value={form.kid_id}
          onChange={(v) => setForm(f => ({ ...f, kid_id: v }))}
        />
      </div>

      <div>
        <Label>Title</Label>
        <input value={form.title} onChange={set('title')} placeholder="e.g. Mom & Dad on a call" style={inputStyle} />
      </div>

      <div>
        <Label>Note (optional)</Label>
        <textarea value={form.body} onChange={set('body')} placeholder="Extra details…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>

      {isEvent && (
        <>
          <div>
            <Label>Date</Label>
            <input type="date" value={form.date} onChange={set('date')} style={inputStyle} />
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: THEME.text, fontSize: 14 }}>
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            All day
          </label>

          {!allDay && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Label>Start</Label>
                <input type="time" value={form.start_time} onChange={set('start_time')} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <Label>End</Label>
                <input type="time" value={form.end_time} onChange={set('end_time')} style={inputStyle} />
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
        <button onClick={onSave} disabled={!form.title.trim()} style={{ ...primaryBtnStyle, opacity: form.title.trim() ? 1 : 0.5 }}>
          {isNew ? 'Add' : 'Save'}
        </button>
        <button onClick={onCancel} style={ghostBtnStyle}>Cancel</button>
      </div>
    </div>
  )
}

// ─── List group ───────────────────────────────────────────────────────────────
function Group({ label, rows, onEdit, onDelete, showTime, showDate }) {
  if (!rows || rows.length === 0) return null
  return (
    <div>
      <div style={{ color: THEME.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6, fontWeight: 700 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map(it => {
          const kid = it.kid_id ? KIDS.find(k => k.id === it.kid_id) : null
          const bits = []
          if (showDate) bits.push(formatDate(it.date))
          if (showTime) bits.push(formatTimeRange(it.start_time, it.end_time))
          bits.push(kid ? kid.name : 'Everyone')
          return (
            <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: THEME.dark, border: `1px solid ${THEME.border}`, borderRadius: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: THEME.text, fontSize: 14, fontWeight: 600 }}>{it.title}</div>
                <div style={{ color: THEME.muted, fontSize: 11 }}>{bits.join(' · ')}</div>
              </div>
              <IconBtn icon="pencil" onClick={() => onEdit(it)} />
              <IconBtn icon="trash" onClick={() => onDelete(it.id)} danger />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Small pieces ─────────────────────────────────────────────────────────────
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {options.map(o => {
        const active = value === o.v
        return (
          <button
            key={String(o.v)}
            onClick={() => onChange(o.v)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: 8,
              border: `1px solid ${active ? THEME.gold : THEME.border}`,
              background: active ? `${THEME.gold}22` : 'transparent',
              color: active ? THEME.gold : THEME.muted,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: 0.5,
            }}
          >{o.label}</button>
        )
      })}
    </div>
  )
}

function Label({ children }) {
  return <div style={{ color: THEME.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{children}</div>
}

function IconBtn({ icon, onClick, danger }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent',
      border: `1px solid ${danger ? '#7D2020' : THEME.border}`,
      borderRadius: 8, cursor: 'pointer',
    }}>
      <Icon name={icon} size={15} color={danger ? '#FF8080' : THEME.muted} />
    </button>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  background: THEME.dark,
  border: `1px solid ${THEME.border}`,
  borderRadius: 8,
  color: THEME.text,
  fontSize: 14,
  fontFamily: 'inherit',
}

const addBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '7px 12px', background: THEME.gold, border: 'none', borderRadius: 8,
  color: THEME.dark, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5, textTransform: 'uppercase',
}

const primaryBtnStyle = {
  flex: 1, padding: '10px 0', background: THEME.gold, border: 'none', borderRadius: 8,
  color: THEME.dark, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5, textTransform: 'uppercase',
}

const ghostBtnStyle = {
  flex: 1, padding: '10px 0', background: 'transparent', border: `1px solid ${THEME.border}`,
  borderRadius: 8, color: THEME.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer',
  fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5, textTransform: 'uppercase',
}
