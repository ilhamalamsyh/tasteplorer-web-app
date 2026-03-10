# Plan: Add Drag-to-Reorder to Instructions & Ingredients Lists

**TL;DR**: Install `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`, convert the `instructions` and `ingredients` state from `string[]` to `{ id: string; value: string }[]` (stable IDs survive reordering), wrap each list in a `DndContext`/`SortableContext`, render each row as a `SortableItem` with a drag-handle icon. On submit, map the state back to `string[]` as before — zero API changes.

---

## Steps

### 1. Install packages

Run in the workspace root:

```
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Change state shape

In `RecipeFoodForm.tsx`, replace `useState<string[]>` for both `ingredients` and `instructions` with:

```ts
useState<{ id: string; value: string }[]>([
  { id: crypto.randomUUID(), value: '' },
]);
```

### 3. Update `useEffect` (edit mode data load)

When populating from `recipeData`, map each string to `{ id: crypto.randomUUID(), value: string }` for both lists.

### 4. Update `handleClose` reset

Reset both lists to `[{ id: crypto.randomUUID(), value: '' }]`.

### 5. Update all existing handlers

Adjust `handleAddIngredient/Instruction`, `handleRemoveIngredient/Instruction`, `handleIngredientChange/InstructionChange` to operate on the new `{ id, value }` shape (`.value` field instead of bare string).

### 6. Add reorder handlers

```ts
const handleReorderIngredients = (activeId: string, overId: string) => {
  setIngredients((items) => {
    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);
    return arrayMove(items, oldIndex, newIndex);
  });
};

const handleReorderInstructions = (activeId: string, overId: string) => {
  setInstructions((items) => {
    const oldIndex = items.findIndex((i) => i.id === activeId);
    const newIndex = items.findIndex((i) => i.id === overId);
    return arrayMove(items, oldIndex, newIndex);
  });
};
```

### 7. Update `canSubmit` and `handleSubmit`

Change filter/map at submission time:

```ts
const validIngredients = ingredients
  .filter((i) => i.value.trim() !== '')
  .map((i) => i.value.trim());
const validInstructions = instructions
  .filter((i) => i.value.trim() !== '')
  .map((i) => i.value.trim());
```

And for `canSubmit`:

```ts
ingredients.some((i) => i.value.trim()) &&
instructions.some((i) => i.value.trim()) &&
```

### 8. Create an inline `SortableItem` component

Place above `RecipeFoodForm`, within the same file. Uses `useSortable` from `@dnd-kit/sortable`. Exposes the drag-handle via `HiOutlineBars3` (already available in `react-icons/hi2`). Apply `transform` + `transition` via `CSS.Transform.toString` from `@dnd-kit/utilities`.

```tsx
interface SortableItemProps {
  id: string;
  children: (dragHandleProps: {
    listeners: SyntheticListenerMap | undefined;
    attributes: DraggableAttributes;
    isDragging: boolean;
  }) => React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes, isDragging })}
    </div>
  );
};
```

### 9. Wrap ingredients list with DnD context

```tsx
const ingredientSensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
);

<DndContext
  sensors={ingredientSensors}
  collisionDetection={closestCenter}
  onDragEnd={({ active, over }) => {
    if (over && active.id !== over.id) {
      handleReorderIngredients(String(active.id), String(over.id));
    }
  }}
>
  <SortableContext
    items={ingredients.map((i) => i.id)}
    strategy={verticalListSortingStrategy}
  >
    {ingredients.map((ingredient, index) => (
      <SortableItem key={ingredient.id} id={ingredient.id}>
        {({ listeners, attributes }) => (
          <div className="flex gap-1.5 sm:gap-2">
            <button
              type="button"
              {...listeners}
              {...attributes}
              className="flex-shrink-0 p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Drag to reorder"
            >
              <HiOutlineBars3 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* number label, input, remove button — unchanged */}
          </div>
        )}
      </SortableItem>
    ))}
  </SortableContext>
</DndContext>;
```

`activationConstraint: { distance: 8 }` prevents accidental drag-trigger during modal scroll on touch devices.

### 10. Wrap instructions list identically

Same pattern as step 9, calling `handleReorderInstructions` in `onDragEnd`. Keep a separate `instructionSensors` (same config) or reuse one shared `sensors` constant.

### 11. Drag handle in each row

A `<button type="button">` element (accessible, keyboard-focusable) with `{...listeners}` + `{...attributes}` from `useSortable`, showing `HiOutlineBars3`, with `touch-none` to prevent scroll-hijack conflicts and `cursor-grab active:cursor-grabbing`. Placed to the left of the row number / step circle.

---

## Verification

- Open "Create Recipe" modal, add ≥ 3 instructions, drag to reorder, submit — confirm the API receives the reordered array.
- Same test in "Edit Recipe" modal — confirm prefilled items are reorderable before saving.
- Test on mobile touch (DevTools touch simulation) — activation constraint should allow scrolling the modal without accidentally triggering drag.
- Verify `canSubmit` and validation still reject empty-value items correctly.

---

## Design Decisions

| Decision                             | Rationale                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `@dnd-kit` over HTML5 drag API       | Works reliably inside `overflow-y-auto` modal via pointer events; `activationConstraint.distance` prevents scroll interference |
| Stable IDs via `crypto.randomUUID()` | Required by @dnd-kit so items retain identity through reorders; index-based keys would break                                   |
| Same pattern on ingredients          | Consistent UX; minimal extra code since `SortableItem` is shared                                                               |
| No `DragOverlay`                     | Keeps implementation lean; `opacity: 0.5` + `transform` on the dragged item is sufficient feedback in a constrained list       |
| Separate sensors per list            | Avoids cross-list drag confusion; both use identical config                                                                    |
