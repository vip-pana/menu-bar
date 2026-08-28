import { useState } from 'react'
import { DEFAULT_EMOJI, EMOJI_CHOICES } from '../menu'

const NEW_CAT = '__new__'

export default function MenuManager({
  allDrinks,
  categories,
  addDrink,
  toggleSoldout,
  softDelete,
  restore,
  hardDelete,
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(DEFAULT_EMOJI)
  const [category, setCategory] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [soldout, setSoldout] = useState(false)
  const [busy, setBusy] = useState(false)

  const live = allDrinks.filter((d) => !d.deleted)
  const trashed = allDrinks.filter((d) => d.deleted)
  const liveCategories = [...new Set(live.map((d) => d.category))]

  const effectiveCategory =
    category === NEW_CAT ? newCategory.trim() : category.trim()
  const canAdd = name.trim() && effectiveCategory && !busy

  async function submit(e) {
    e.preventDefault()
    if (!canAdd) return
    setBusy(true)
    try {
      await addDrink({ name, emoji, category: effectiveCategory, ingredients, soldout })
      setName('')
      setIngredients('')
      setEmoji(DEFAULT_EMOJI)
      setNewCategory('')
      setSoldout(false)
    } catch (err) {
      console.error('[menu] aggiunta fallita', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mt-8 border-t border-ink-edge pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-1 py-2 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-frost-dim">
          Menu
          <span className="ml-2 text-frost-mute normal-case tracking-normal">
            {live.length} bevande
            {live.some((d) => d.soldout) &&
              ` · ${live.filter((d) => d.soldout).length} esaurite`}
          </span>
        </span>
        <span className="text-frost-mute text-lg leading-none">
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-6">
          {liveCategories.map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-volt/70 mb-2 px-1">
                {cat}
              </h3>
              <ul className="space-y-1.5">
                {live
                  .filter((d) => d.category === cat)
                  .map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-3 rounded-xl bg-ink-raised border border-ink-edge px-3 py-2"
                    >
                      <span className={`text-xl ${d.soldout ? 'grayscale opacity-40' : ''}`}>
                        {d.emoji}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block truncate ${
                            d.soldout ? 'text-frost-mute line-through' : ''
                          }`}
                        >
                          {d.name}
                        </span>
                        {d.ingredients && (
                          <span className="block text-xs text-frost-mute truncate">
                            {d.ingredients}
                          </span>
                        )}
                      </span>

                      <button
                        onClick={() => toggleSoldout(d.id, !d.soldout)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap
                          ${d.soldout
                            ? 'bg-emerald-400/20 text-emerald-300 active:bg-emerald-400/30'
                            : 'bg-ink-edge text-frost-dim active:bg-ink-edge/70'}`}
                      >
                        {d.soldout ? 'Disponibile' : 'Esaurito'}
                      </button>

                      <button
                        onClick={() => softDelete(d.id)}
                        aria-label={`Elimina ${d.name}`}
                        className="rounded-lg bg-ink-edge px-3 py-2 text-frost-mute active:bg-red-500/20 active:text-red-300"
                      >
                        🗑
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {trashed.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-frost-mute mb-2 px-1">
                Eliminati
              </h3>
              <ul className="space-y-1.5">
                {trashed.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-3 rounded-xl bg-ink-raised/40 px-3 py-2"
                  >
                    <span className="text-xl grayscale opacity-40">{d.emoji}</span>
                    <span className="flex-1 truncate text-frost-mute line-through">
                      {d.name}
                    </span>
                    <button
                      onClick={() => restore(d.id)}
                      className="rounded-lg bg-ink-edge px-3 py-2 text-sm text-frost-dim active:bg-ink-edge/70"
                    >
                      Ripristina
                    </button>
                    <button
                      onClick={() => hardDelete(d.id)}
                      aria-label={`Elimina per sempre ${d.name}`}
                      className="rounded-lg bg-ink-edge/60 px-3 py-2 text-frost-mute active:bg-red-500/20 active:text-red-300"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={submit} className="rounded-xl bg-ink-raised border border-ink-edge p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-frost-dim">
              Aggiungi bevanda
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (es. Amaro)"
              maxLength={40}
              className="w-full rounded-lg bg-ink-base border border-ink-edge px-3 py-2.5
                         outline-none focus:border-volt/60 placeholder:text-frost-mute"
            />

            <input
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Ingredienti (es. Gin, Campari, Vermouth rosso)"
              maxLength={120}
              className="w-full rounded-lg bg-ink-base border border-ink-edge px-3 py-2.5
                         outline-none focus:border-volt/60 placeholder:text-frost-mute"
            />

            <div className="flex flex-wrap gap-1.5">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`size-11 rounded-lg text-xl leading-none
                    ${emoji === e ? 'bg-volt/20 ring-2 ring-volt' : 'bg-ink-base'}`}
                >
                  {e}
                </button>
              ))}
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg bg-ink-base border border-ink-edge px-3 py-2.5
                         outline-none focus:border-volt/60"
            >
              <option value="">Categoria…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={NEW_CAT}>+ Nuova categoria</option>
            </select>

            {category === NEW_CAT && (
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome nuova categoria"
                maxLength={30}
                className="w-full rounded-lg bg-ink-base border border-ink-edge px-3 py-2.5
                           outline-none focus:border-volt/60 placeholder:text-frost-mute"
              />
            )}

            <label className="flex items-center gap-2.5 text-sm text-frost-dim">
              <input
                type="checkbox"
                checked={soldout}
                onChange={(e) => setSoldout(e.target.checked)}
                className="size-5 rounded accent-volt"
              />
              Aggiungi come già esaurita
            </label>

            <button
              type="submit"
              disabled={!canAdd}
              className="w-full rounded-lg bg-volt text-ink-base font-bold py-2.5
                         disabled:bg-ink-edge disabled:text-frost-mute active:bg-volt-deep"
            >
              {busy ? 'Aggiungo…' : 'Aggiungi'}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
