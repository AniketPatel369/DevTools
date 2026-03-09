import type { CategoryName } from '@/data/types'
import { CATEGORY_META } from '@/data/categoryMeta'

interface BadgeProps {
    category: CategoryName
}

export function Badge({ category }: BadgeProps) {
    const meta = CATEGORY_META[category]
    return (
        <span
            className="dt-badge"
            style={{
                color: meta.color,
                backgroundColor: meta.bgColor,
                borderColor: meta.borderColor,
            }}
        >
            {category}
        </span>
    )
}
