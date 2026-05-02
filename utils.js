import { sb } from './supabase'

// =============================================
// CORES
// =============================================
export const C = {
  paper:     '#FAF7F2',
  olive:     '#2F3E34',
  terracotta:'#C46A3A',
  terra2:    '#A0522D',
  ocean:     '#4A7C8E',
  sandPale:  '#EDE8DF',
  text:      '#2C2418',
  textMid:   '#7A6A58',
  textLight: '#B0A090',
  divider:   '#E8E2D8',
}

// =============================================
// CATEGORIAS
// =============================================
export const CATEGORIES = [
  { name: 'Alimentação', color: '#C46A3A', icon: 'utensils' },
  { name: 'Hospedagem',  color: '#4A7C8E', icon: 'home'     },
  { name: 'Transporte',  color: '#7B9E6B', icon: 'car'      },
  { name: 'Lazer',       color: '#C4953A', icon: 'music'    },
  { name: 'Compras',     color: '#9E6B9E', icon: 'bag'      },
  { name: 'Saúde',       color: '#6B9EA8', icon: 'heart'    },
  { name: 'Outros',      color: '#B0A090', icon: 'dots'     },
]

export const catColor = (name) =>
  CATEGORIES.find(c => c.name === name)?.color || '#B0A090'

export const PAYMENTS = ['Cartão', 'Dinheiro', 'Pix', 'Outro']

// =============================================
// FORMATAÇÃO
// =============================================
export const fmtBRL = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const dateToISO = (str) => {
  // converte dd/mm/aaaa → yyyy-mm-dd
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`
}

export const isoToDisplay = (iso) => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// =============================================
// FETCH
// =============================================
export async function fetchAllTrips() {
  const [{ data: trips }, { data: expenses }, { data: mapPoints }, { data: memories }] =
    await Promise.all([
      sb.from('trips').select('*').order('created_at', { ascending: false }),
      sb.from('expenses').select('*').order('created_at'),
      sb.from('map_points').select('*').order('sort_order'),
      sb.from('memories').select('*').order('sort_order'),
    ])

  return (trips || []).map(t => ({
    id:          t.id,
    name:        t.name,
    location:    t.location,
    dates:       t.dates,
    dateStart:   t.date_start,
    dateEnd:     t.date_end,
    cover:       t.cover,
    coverCustom: t.cover_custom,
    mapImg:      t.map_img,
    budget:      t.budget,
    participants: t.participants || ['Você'],
    expenses: (expenses || []).filter(e => e.trip_id === t.id).map(e => ({
      id:       e.id,
      desc:     e.description,
      amount:   e.amount,
      cat:      e.category,
      payment:  e.payment,
      paidBy:   e.paid_by,
      withWhom: e.with_whom || ['Você'],
      date:     e.date,
      note:     e.note,
    })),
    mapPoints: (mapPoints || []).filter(p => p.trip_id === t.id).map(p => ({
      id:        p.id,
      label:     p.label,
      x:         p.x,
      y:         p.y,
      date:      p.date,
      sort_order: p.sort_order,
    })),
    memories: (memories || []).filter(m => m.trip_id === t.id).map(m => ({
      id:         m.id,
      src:        m.src,
      sort_order: m.sort_order,
    })),
  }))
}

// =============================================
// CRUD — TRIPS
// =============================================
export async function createTrip(data) {
  const { data: trip, error } = await sb.from('trips').insert([{
    name:         data.name,
    location:     data.location,
    dates:        data.dates,
    date_start:   dateToISO(data.dateStart),
    date_end:     dateToISO(data.dateEnd),
    cover:        data.cover || 'cliffs',
    cover_custom: data.coverCustom || null,
    budget:       data.budget || 0,
    participants: data.participants || ['Você'],
  }]).select().single()

  if (error) throw error
  return trip
}

export async function deleteTrip(id) {
  const { error } = await sb.from('trips').delete().eq('id', id)
  if (error) throw error
}

export async function updateTripCover(id, cover, coverCustom) {
  const { error } = await sb.from('trips').update({ cover, cover_custom: coverCustom }).eq('id', id)
  if (error) throw error
}

export async function updateTripMapImg(id, mapImg) {
  const { error } = await sb.from('trips').update({ map_img: mapImg }).eq('id', id)
  if (error) throw error
}

// =============================================
// CRUD — EXPENSES
// =============================================
export async function addExpense(tripId, data) {
  const { data: exp, error } = await sb.from('expenses').insert([{
    trip_id:     tripId,
    description: data.desc,
    amount:      data.amount,
    category:    data.cat,
    payment:     data.payment,
    paid_by:     data.paidBy,
    with_whom:   data.withWhom,
    date:        data.date,
    note:        data.note,
  }]).select().single()
  if (error) throw error
  return exp
}

export async function updateExpense(id, data) {
  const { error } = await sb.from('expenses').update({
    description: data.desc,
    amount:      data.amount,
    category:    data.cat,
    payment:     data.payment,
    paid_by:     data.paidBy,
    with_whom:   data.withWhom,
    date:        data.date,
    note:        data.note,
  }).eq('id', id)
  if (error) throw error
}

export async function deleteExpense(id) {
  const { error } = await sb.from('expenses').delete().eq('id', id)
  if (error) throw error
}

// =============================================
// CRUD — MAP POINTS
// =============================================
export async function saveMapPoints(tripId, points) {
  await sb.from('map_points').delete().eq('trip_id', tripId)
  if (!points.length) return
  const { error } = await sb.from('map_points').insert(
    points.map((p, i) => ({
      trip_id:    tripId,
      label:      p.label,
      x:          p.x,
      y:          p.y,
      date:       p.date,
      sort_order: i,
    }))
  )
  if (error) throw error
}

// =============================================
// CRUD — MEMORIES
// =============================================
export async function saveMemories(tripId, memories) {
  await sb.from('memories').delete().eq('trip_id', tripId)
  if (!memories.length) return
  const { error } = await sb.from('memories').insert(
    memories.map((m, i) => ({
      trip_id:    tripId,
      src:        m.src,
      sort_order: i,
    }))
  )
  if (error) throw error
}

// =============================================
// ALGORITMO DE ACERTO (SETTLEMENTS)
// =============================================
export function calcSettlements(expenses, participants) {
  const balance = {}
  participants.forEach(p => balance[p] = 0)

  expenses.forEach(e => {
    const amount = Number(e.amount) || 0
    const who    = e.withWhom?.length ? e.withWhom : [e.paidBy]
    const share  = amount / who.length
    balance[e.paidBy] = (balance[e.paidBy] || 0) + amount
    who.forEach(p => { balance[p] = (balance[p] || 0) - share })
  })

  const creditors = Object.entries(balance).filter(([,v]) => v > 0.01).map(([n,v]) => ({ n, v }))
  const debtors   = Object.entries(balance).filter(([,v]) => v < -0.01).map(([n,v]) => ({ n, v: -v }))

  const settlements = []
  let i = 0, j = 0
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].v, creditors[j].v)
    if (amount > 0.01) {
      settlements.push({ from: debtors[i].n, to: creditors[j].n, amount })
    }
    debtors[i].v   -= amount
    creditors[j].v -= amount
    if (debtors[i].v   < 0.01) i++
    if (creditors[j].v < 0.01) j++
  }
  return settlements
}

// Gasto por pessoa
export function calcPerPerson(expenses, participants) {
  const totals = {}
  participants.forEach(p => totals[p] = 0)
  expenses.forEach(e => {
    const amount = Number(e.amount) || 0
    const who    = e.withWhom?.length ? e.withWhom : participants
    const share  = amount / who.length
    who.forEach(p => { totals[p] = (totals[p] || 0) + share })
  })
  return totals
}

// Agrupamento por categoria
export function groupByCategory(expenses) {
  const map = {}
  expenses.forEach(e => {
    map[e.cat] = (map[e.cat] || 0) + Number(e.amount)
  })
  return Object.entries(map).sort((a, b) => b[1] - a[1])
}

// =============================================
// TOAST SINGLETON via evento
// =============================================
export function showToast(msg) {
  window.dispatchEvent(new CustomEvent('rastro-toast', { detail: msg }))
}
